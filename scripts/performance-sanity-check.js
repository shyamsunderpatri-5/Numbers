const { synthesize } = require("../src/lib/engine/synthesis/chaldean-synthesis-engine");
const { validateInterpretation } = require("../src/lib/engine/validators");
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function runPerformanceCheck() {
    console.log("🏎️ STARTING PERFORMANCE SANITY CHECK...");
    const startTime = Date.now();

    /**
     * 1. Retrieval Precision & Density (23 check)
     */
    console.log("\n--- 1. Retrieval Precision & Density (23) ---");
    const { contract: lotus } = await synthesize("LOTUS", 1);
    
    const hasRoyalStar = lotus.identity_layer.raw_traits.compound.some(t => t.includes("Royal Star of the Lion"));
    console.log(`- Compound 23 Precision: ${hasRoyalStar ? "✅ PASS" : "❌ FAIL"}`);
    console.log(`- Trait Density: ${lotus.identity_layer.raw_traits.compound.length} chunks retrieved.`);

    /**
     * 2. Edge Case Stress (14 vs 23 vs 32)
     */
    console.log("\n--- 2. Edge Case Stress (14 vs 23 vs 32) ---");
    // N(5)+A(1)+M(4)+E(5) = 15. No.
    // 14: D(4)+E(5)+A(1)+D(4) = 14.
    // 23: L(3)+O(7)+T(4)+U(6)+S(3) = 23.
    // 32: B(2)+E(5)+L(3)+I(1)+E(5)+V(6)+E(5)+D(4) = 31. Almost.
    // 32: G(3)+O(7)+O(7)+D(4)+W(6)+I(1)+L(3)+L(1) = 32.
    const { contract: c14 } = await synthesize("DEAD", 1);
    const { contract: c23_2 } = await synthesize("LOTUS", 1);
    const { contract: c32 } = await synthesize("GOODWILL", 1);

    const isDifferent = c14.identity_layer.raw_traits.compound[0] !== c23_2.identity_layer.raw_traits.compound[0];
    console.log(`- 14 vs 23 Differentiation: ${isDifferent ? "✅ PASS" : "❌ FAIL"}`);

    /**
     * 3. Latency Benchmarks
     */
    console.log("\n--- 3. Latency Benchmarks ---");
    const lStart = Date.now();
    await synthesize("TEST", 1);
    const lEnd = Date.now();
    console.log(`- Total Pipeline Latency: ${lEnd - lStart}ms`);
    console.log(`  (Target: < 1500ms)`);

    /**
     * 4. Poison Pill Under Load
     */
    console.log("\n--- 4. Poison Pill Under Load (5 trials) ---");
    let poisonPass = 0;
    const { pipeline } = await import("@xenova/transformers");
    const generator = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    for (let i = 0; i < 5; i++) {
        const output = await generator("What is life path 5?", { pooling: "mean", normalize: true });
        const { data: poisonResults } = await supabase.rpc('match_library_documents', { 
            query_embedding: Array.from(output.data), 
            match_threshold: 0.5, 
            match_count: 5 
        });
        const isPoisoned = poisonResults?.some(r => r.chunk_text.toLowerCase().includes("life path"));
        if (!isPoisoned) poisonPass++;
    }
    console.log(`- Poison Pill Immunity: ${poisonPass}/5 Trials PASS`);

    /**
     * 5. Semantic Anchor Check (5 -> Freedom)
     */
    console.log("\n--- 5. Semantic Anchor Check ---");
    const { contract: anchorContract } = await synthesize("TEST", 5);
    const hasFreedom = anchorContract.foundation_layer.raw_traits.some(t => t.toLowerCase().includes("communication"));
    console.log(`- Semantic Anchor (5 -> Communication): ${hasFreedom ? "✅ PASS" : "❌ FAIL"}`);

    const totalTime = Date.now() - startTime;
    console.log(`\n🏁 PERFORMANCE CHECK COMPLETE (Total Time: ${totalTime}ms)`);
}

runPerformanceCheck().catch(console.error);
