const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { BLACKLIST, CHALDEAN_LETTER_MAP, VERSION } = require("./chaldean-core-v1");

async function runAudit() {
    console.log(`🛡️ STARTING CHALDEAN SOVEREIGNTY AUDIT v${VERSION}...`);
    let overallPass = true;

    // 1. Check Letter Mapping
    console.log("   📡 Rule 1: Letter Mapping Logic...");
    if (CHALDEAN_LETTER_MAP['I'] === 1 && CHALDEAN_LETTER_MAP['R'] === 2) {
        console.log("   ✅ PASS: Letter mappings are Chaldean.");
    } else {
        console.error("   ❌ FAIL: Letter mapping is incorrect.");
        overallPass = false;
    }

    // 2. Blacklist Purity
    console.log("   📡 Rule 2: Blacklist Purity Scan...");
    for (const t of BLACKLIST) {
        const { count } = await supabase.from('library_embeddings').select('id', { count: 'exact', head: true }).ilike('chunk_text', '%' + t + '%');
        if (count > 0) {
            console.error(`   ❌ FAIL: Found ${count} instances of blacklisted term '${t}'`);
            overallPass = false;
        }
    }
    if (overallPass) console.log("   ✅ PASS: No blacklisted terminology found.");

    // 3. Poison Pill
    console.log("   📡 Rule 3: Poison Pill Test ('What is Life Path 9?')...");
    const { pipeline } = await import("@xenova/transformers");
    const generator = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const output = await generator("What is Life Path 9?", { pooling: "mean", normalize: true });
    const { data: poisonResults } = await supabase.rpc('match_library_documents', { 
        query_embedding: Array.from(output.data), 
        match_threshold: 0.5, 
        match_count: 5 
    });

    const isPoisoned = poisonResults?.some(r => r.chunk_text.toLowerCase().includes("life path"));
    if (isPoisoned) {
        console.error("   ❌ FAIL: Poison Pill triggered! System returned contaminated 'Life Path' content.");
        overallPass = false;
    } else {
        console.log("   ✅ PASS: Poison Pill rejected. System is immune to Pythagorean queries.");
    }

    // 4. Compound Presence
    console.log("   📡 Rule 4: Compound Number Presence (10-32)...");
    const { count: compoundCount } = await supabase.from('library_embeddings').select('id', { count: 'exact', head: true }).ilike('chunk_text', '%Sovereign Compound Number%');
    if (compoundCount >= 23) {
        console.log(`   ✅ PASS: Found ${compoundCount} sovereign compound entries.`);
    } else {
        console.error(`   ❌ FAIL: Missing compound number entries.`);
        overallPass = false;
    }

    // 5. Planetary Alignment
    console.log("   📡 Rule 5: Planetary Alignment Accuracy...");
    const { data: root1 } = await supabase.from('library_embeddings').select('chunk_text').ilike('chunk_text', '%Root Number 1%').single();
    const { data: root8 } = await supabase.from('library_embeddings').select('chunk_text').ilike('chunk_text', '%Root Number 8%').single();

    if (root1?.chunk_text.includes('Sun') && root8?.chunk_text.includes('Saturn')) {
        console.log("   ✅ PASS: Root 1 aligned with Sun; Root 8 aligned with Saturn.");
    } else {
        console.error("   ❌ FAIL: Planetary alignment mismatch.");
        overallPass = false;
    }

    // 5. Polarity Presence (Negative Traits)
    console.log("   📡 Rule 5: Polarity Presence (Constructive + Destructive)...");
    const { count: polarityCount } = await supabase.from('library_embeddings').select('id', { count: 'exact', head: true }).ilike('chunk_text', '%DESTRUCTIVE%');
    if (polarityCount > 0) {
        console.log(`   ✅ PASS: Found ${polarityCount} polarized entries with negative traits.`);
    } else {
        console.error("   ❌ FAIL: No destructive/negative traits found (Toxic Positivity detected).");
        overallPass = false;
    }

    console.log("\n--- AUDIT FINAL RESULT ---");
    if (overallPass) {
        console.log("🏆 SYSTEM STATUS: FULLY SOVEREIGN (100% PURIFIED)");
    } else {
        console.log("⚠️ SYSTEM STATUS: CONTAMINATED (ACTION REQUIRED)");
        process.exit(1);
    }
}

runAudit().catch(console.error);
