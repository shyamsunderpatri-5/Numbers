const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, "trait-ontology.json"), "utf8"));

async function getEmbedder() {
    const { pipeline } = await import("@xenova/transformers");
    return await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}

async function main() {
    console.log("🧐 RUNNING ENHANCED PURIFICATION TEST...");

    // Layer 1: Keyword Scan
    console.log("\n📡 Layer 1: Keyword Scan...");
    const keywords = ontology.blacklist_keywords;
    const { data: keywordMatches } = await supabase
        .from("library_embeddings")
        .select("id, chunk_text")
        .or(keywords.map(k => `chunk_text.ilike.%${k}%`).join(","));
    
    if (keywordMatches && keywordMatches.length > 0) {
        console.error(`❌ FAILED: Found ${keywordMatches.length} rows with blacklisted keywords.`);
        keywordMatches.slice(0, 5).forEach(m => console.log(`   - [${m.id}] ${m.chunk_text}`));
    } else {
        console.log("✅ PASS: No blacklisted keywords found.");
    }

    // Layer 2: Structural Scan
    console.log("\n🏗️ Layer 2: Structural Scan...");
    const patterns = [
        /\bis\s*(a|an)?\s*\d+\b/i,
        /\bbelongs to\s*\d+\b/i,
        /\bassociated with\s*\d+\b/i,
        /\bnumber\w*\s*(is|vibrates|belongs|=)?\s*(a|an)?\s*\d+\b/i,
        /\bpeople with\s*\d+\b/i,
        /\battained\s*\d+\b/i,
        /\bvibrates to\s*\d+\b/i,
        /\b=\s*\d+\b/i
    ];
    
    const { data: allRows } = await supabase.from("library_embeddings").select("id, chunk_text");
    const structuralMatches = allRows.filter(row => patterns.some(p => p.test(row.chunk_text)));

    if (structuralMatches.length > 0) {
        console.error(`❌ FAILED: Found ${structuralMatches.length} rows with numeric structural patterns.`);
        structuralMatches.slice(0, 5).forEach(m => console.log(`   - [${m.id}] ${m.chunk_text}`));
    } else {
        console.log("✅ PASS: No numeric structural patterns found.");
    }

    // Layer 3: Semantic Trap Test
    console.log("\n🪤 Layer 3: Semantic Trap Test...");
    console.log("   Querying: 'What is Life Path 5?'");
    
    const generator = await getEmbedder();
    const query = "What is Life Path 5?";
    const output = await generator(query, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(output.data);

    const { data: searchResults, error: searchError } = await supabase.rpc('match_library_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5
    });

    if (searchError) {
        console.error("❌ ERROR running search:", searchError.message);
    } else if (searchResults && searchResults.length > 0) {
        console.error(`❌ FAILED: Semantic search for 'Life Path 5' returned ${searchResults.length} results.`);
        searchResults.forEach(r => console.log(`   - [Score: ${r.similarity.toFixed(4)}] ${r.chunk_text} (${r.source_title})`));
    } else {
        console.log("✅ PASS: Semantic trap test returned 0 results. System is immune to Pythagorean queries.");
    }

    console.log("\n🏁 TEST COMPLETE.");
}

main().catch(console.error);
