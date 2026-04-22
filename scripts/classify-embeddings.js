const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, "trait-ontology.json"), "utf8"));

const CALCULATION_VERBS = ["add", "sum", "total", "reduce", "derive"];
const STRUCTURAL_PHRASES = [
    "your number is calculated", 
    "based on your birth date",
    "calculated by",
    "digit sum",
    "reduces to"
];

/**
 * Layer 1 & 2 Patterns for classification logic
 */
const SYSTEM_CONSTRUCT_REGEX = /(Life Path|Expression Number|Destiny Number|Soul Urge|Personality Number|Birth Number|Name Number|Personal (Day|Month|Year)|Karmic (Debt|Lesson)|Pinnacle|Challenge)\w*\s*\d*\s*(means|is|vibrates|=)/i;
const ARITHMETIC_REGEX = /\d+\s*[\+\-\=]\s*\d+/; // Detects "1 + 1" or "1 = 1"
const SYSTEM_KEYWORDS = [...ontology.blacklist_keywords, "Birth Number", "Name Number", "Personal Day", "Personal Month", "Personal Year", "Karmic Debt", "Karmic Lesson"];

function classify(text) {
    const lowerText = text.toLowerCase();

    // 1. Check for A_DELETE (Hard Determinism)
    // Matches verbs and their variations (e.g., add, adding, derived, reduction)
    const hasCalcVerb = CALCULATION_VERBS.some(verb => new RegExp(`\\b${verb}\\w*\\b`, "i").test(lowerText));
    const hasStructuralPhrase = STRUCTURAL_PHRASES.some(phrase => lowerText.includes(phrase.toLowerCase()));
    const hasConstruct = SYSTEM_CONSTRUCT_REGEX.test(text);
    const hasArithmetic = ARITHMETIC_REGEX.test(text);
    const isJunk = /([a-z0-9]{10,}|http|blogID|pageID)/i.test(text) && /\d{5,}/.test(text);
    const hasSpecificSystemPattern = /\b\d+\s*Personal\s*(Day|Month|Year)\b/i.test(text) || /\bPersonal\s*(Day|Month|Year)\s*\d+\b/i.test(text);

    if (hasCalcVerb || hasStructuralPhrase || hasConstruct || hasArithmetic || isJunk || hasSpecificSystemPattern) {
        return 'A_DELETE';
    }

    // 2. Check for B_CLEAN vs C_SAFE
    // Catch plurals and variations of system keywords (e.g. Life Paths)
    const hasSystemKeyword = SYSTEM_KEYWORDS.some(word => 
        new RegExp(`\\b${word}\\w*\\b`, "i").test(text)
    );
    
    // Catch numeric assignment patterns (e.g. "is 8", "vibrates to 5", "the 5 is")
    const hasNumericPattern = /\b(number\w*\s*(is|vibrates|belongs|=)?\s*(a|an)?\s*\d+|\d+\s*people|people with\s*\d+|is\s*(a|an)?\s*\d+|vibrates\s*to\s*\d+|(the|a|an)?\s*\d+\s*is)\b/i.test(text);

    if (hasSystemKeyword || hasNumericPattern) {
        // Potential B_CLEAN - we'll refine this in the execution script 
        // but for now we mark as B_CLEAN if it's not A_DELETE but has keywords
        return 'B_CLEAN';
    }

    // 3. Otherwise C_SAFE
    return 'C_SAFE';
}

async function main() {
    console.log("🔍 Starting Classification Phase...");

    let allEmbeddings = [];
    let page = 0;
    const PAGE_SIZE = 1000;

    while (true) {
        let { data: embeddings, error } = await supabase
            .from("library_embeddings")
            .select("id, chunk_text")
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) {
            console.error("Error fetching embeddings:", error);
            return;
        }

        if (!embeddings || embeddings.length === 0) break;
        allEmbeddings.push(...embeddings);
        page++;
    }

    console.log(`📊 Processing ${allEmbeddings.length} total rows...`);

    let stats = { A: 0, B: 0, C: 0 };
    const BATCH_SIZE = 50;

    for (let i = 0; i < allEmbeddings.length; i += BATCH_SIZE) {
        const batch = allEmbeddings.slice(i, i + BATCH_SIZE);
        
        // We can't do a bulk update with different values easily in a single query 
        // without complex SQL, so we'll use Promise.all for the batch
        await Promise.all(batch.map(async (row) => {
            const level = classify(row.chunk_text);
            
            const { error: updateError } = await supabase
                .from("library_embeddings")
                .update({ contamination_level: level })
                .eq("id", row.id);

            if (updateError) {
                console.error(`❌ Failed to update row ${row.id}:`, updateError.message);
            } else {
                stats[level.split('_')[0]]++;
            }
        }));

        const progress = Math.min(100, Math.round(((i + batch.length) / allEmbeddings.length) * 100));
        console.log(`   ⚡ [${progress}%] Classified ${i + batch.length} rows...`);
    }

    console.log("\n✅ Classification Complete!");
    console.log(`   - A_DELETE: ${stats.A}`);
    console.log(`   - B_CLEAN : ${stats.B}`);
    console.log(`   - C_SAFE  : ${stats.C}`);
}

main().catch(console.error);
