const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, "trait-ontology.json"), "utf8"));

let embedder = null;
async function getEmbedder() {
    if (!embedder) {
        const { pipeline } = await import("@xenova/transformers");
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    return embedder;
}

/**
 * 4-Layer Sanitizer
 */
function sanitize(text) {
    let cleaned = text;

    // Layer 1: Regex Removal (System keywords and plurals)
    const layer1 = [
        /(Life Path|Expression Number|Destiny Number|Soul Urge|Personality Number|Birth Number|Name Number)\w*\s*\d*/gi,
        /reduces to\s*\d+/gi,
        /digit sum/gi,
        /calculated by/gi
    ];
    layer1.forEach(regex => cleaned = cleaned.replace(regex, ""));

    // Layer 2: Numeric Detachment
    const layer2 = [
        /\bnumber\w*\s*(is|vibrates|belongs|=)?\s*(a|an)?\s*\d+\b/gi,
        /\b\d+\s*people\b/gi,
        /\bpeople with\s*\d+\b/gi,
        /\battained\s*\d+\b/gi,
        /\bvibrates to\s*\d+\b/gi,
        /\b=\s*\d+\b/gi,
        /\b(the|a|an)?\s*\d+\s+is\b/gi
    ];
    layer2.forEach(regex => cleaned = cleaned.replace(regex, ""));

    // Layer 3: Sentence Reconstruction (Trait-Only Format)
    // Extract meaningful traits from the ontology
    const allTraits = Object.values(ontology.planetary_influences)
        .flatMap(p => p.allowed_traits);
    
    const tokens = cleaned.toLowerCase().match(/\b\w+[\-\w+]*\b/g) || [];
    const extractedTraits = tokens.filter(t => allTraits.includes(t));
    
    const traitOnly = [...new Set(extractedTraits)].join(", ");

    // Layer 4: Final Validation
    const words = traitOnly.split(", ").filter(w => w.length > 0);
    if (words.length < 3) return null; // Too short/empty after cleaning
    if (/\d/.test(traitOnly)) return null; // Should not contain any digits

    return traitOnly;
}

async function main() {
    console.log("🔥 STARTING EXECUTION PURGE...");

    // 1. Delete A_DELETE
    console.log("🗑️ Deleting Category A (Pure Contamination)...");
    const { error: delError } = await supabase
        .from("library_embeddings")
        .delete()
        .eq("contamination_level", "A_DELETE");
    if (delError) console.error("Error deleting A_DELETE:", delError);

    // 2. Process B_CLEAN
    console.log("🧼 Cleaning Category B (Mixed Content)...");
    const { data: bRows, error: bError } = await supabase
        .from("library_embeddings")
        .select("id, chunk_text")
        .eq("contamination_level", "B_CLEAN");

    if (bError) {
        console.error("Error fetching B_CLEAN:", bError);
    } else {
        const generator = await getEmbedder();
        let cleanedCount = 0;
        let upgradedToDelete = 0;
        const BATCH_SIZE = 10; // Smaller batches for embeddings

        for (let i = 0; i < bRows.length; i += BATCH_SIZE) {
            const batch = bRows.slice(i, i + BATCH_SIZE);
            const batchPurified = [];
            const batchIds = [];

            for (const row of batch) {
                const purified = sanitize(row.chunk_text);
                if (purified) {
                    batchPurified.push(purified);
                    batchIds.push(row.id);
                } else {
                    await supabase.from("library_embeddings").delete().eq("id", row.id);
                    upgradedToDelete++;
                }
            }

            if (batchPurified.length > 0) {
                // Bulk generate embeddings
                for (let j = 0; j < batchPurified.length; j++) {
                    const purified = batchPurified[j];
                    const id = batchIds[j];

                    const output = await generator(purified, { pooling: "mean", normalize: true });
                    const embedding = Array.from(output.data);

                    const { error: upError } = await supabase
                        .from("library_embeddings")
                        .update({
                            chunk_text: purified,
                            embedding: embedding,
                            contamination_level: 'C_SAFE'
                        })
                        .eq("id", id);

                    if (upError) console.error(`Error updating B row ${id}:`, upError.message);
                    else cleanedCount++;
                }
            }
            
            const progress = Math.min(100, Math.round(((i + batch.length) / bRows.length) * 100));
            console.log(`   ⚡ [${progress}%] Purified ${i + batch.length} B rows...`);
        }
        console.log(`✅ B_CLEAN results: ${cleanedCount} cleaned, ${upgradedToDelete} upgraded to DELETE.`);
    }

    // 3. Source Handling
    console.log("📦 Updating Source Statuses...");
    const DECOZ_GOODWIN_TITLES = ["Decoz", "Goodwin"];
    const { data: sources } = await supabase.from("library_sources").select("id, title");
    
    for (const source of sources) {
        const isTarget = DECOZ_GOODWIN_TITLES.some(t => source.title.includes(t));
        if (isTarget) {
            await supabase.from("library_sources")
                .update({ status: 'filtered', is_active: true })
                .eq("id", source.id);
            console.log(`   - Marked source as filtered: ${source.title}`);
        }
    }

    console.log("\n🎉 PURIFICATION EXECUTION COMPLETE.");
}

main().catch(console.error);
