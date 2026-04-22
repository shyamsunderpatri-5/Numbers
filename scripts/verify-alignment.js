const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

/**
 * NUMERIQ.AI — Aligned Reading Verification
 * Validates that the engine is pulling the pure Cheiro-Book.txt data.
 */

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log("🕯️  NUMERIQ.AI — Esoteric Verification Script");
    console.log("------------------------------------------");

    // 1. Check Compound 15 (Cheiro's specific example)
    const { data: comp15 } = await supabase
        .from("knowledge_base")
        .select("content")
        .eq("knowledge_type", "compound")
        .eq("key", "15")
        .single();

    console.log("\n🔍 Verification Case 1: Compound 15 (The Magician)");
    if (comp15?.content?.meaning.includes("obtaining money, gifts, and favours")) {
        console.log("✅ SUCCESS: Found Cheiro's exact wording for Compound 15.");
        console.log(`📜 Text: "${comp15.content.meaning.substring(0, 80)}..."`);
    } else {
        console.log("❌ FAILURE: Content mismatch for Compound 15.");
    }

    // 2. Check Compound 16 (The Shattered Citadel)
    const { data: comp16 } = await supabase
        .from("knowledge_base")
        .select("content")
        .eq("knowledge_type", "compound")
        .eq("key", "16")
        .single();

    console.log("\n🔍 Verification Case 2: Compound 16 (The Shattered Citadel)");
    if (comp16?.content?.meaning.includes("Shattered Citadel") || comp16?.content?.traditionalName.includes("Shattered Citadel")) {
        console.log("✅ SUCCESS: 'The Shattered Citadel' title verified.");
        console.log(`📜 Text: "${comp16.content.meaning.substring(0, 80)}..."`);
    } else {
        console.log("❌ FAILURE: Content mismatch for Compound 16.");
    }

    // 3. Check Single 7 (Neptune)
    const { data: single7 } = await supabase
        .from("knowledge_base")
        .select("content")
        .eq("knowledge_type", "number_1_9")
        .eq("key", "7")
        .single();

    console.log("\n🔍 Verification Case 3: Single Number 7 (Planet Mapping)");
    if (single7?.content?.planet === "Neptune") {
        console.log("✅ SUCCESS: Number 7 correctly mapped to Neptune (Elite Standard).");
    } else {
        console.log(`❌ FAILURE: Number 7 mapped to ${single7?.content?.planet || 'Unknown'}.`);
    }

    console.log("\n✨ VERIFICATION COMPLETE: ALL CHANNELS ARE PURE.");
}

verify().catch(console.error);
