const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

/**
 * NUMERIQ.AI — Aligned Vibrational Test
 * Follows Cheiro's exact example (John Smith, Jan 8th, Target April 26th).
 */

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CHALDEAN_MAP = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
};

function calculateCompound(text) {
    return text.toUpperCase().split('').reduce((sum, char) => sum + (CHALDEAN_MAP[char] || 0), 0);
}

function reduce(num) {
    if (num <= 9) return num;
    return reduce(num.toString().split('').reduce((a, b) => a + parseInt(b), 0));
}

async function startTest() {
    console.log("🕯️  NUMERIQ.AI — FINAL VIBRATIONAL TEST");
    console.log("------------------------------------------");

    // Case: John Smith
    const cJohn = calculateCompound("John"); // 18
    const rJohn = reduce(cJohn); // 9
    const cSmith = calculateCompound("Smith"); // 17
    const rSmith = reduce(cSmith); // 8
    
    const nameVibration = reduce(rJohn + rSmith); // 8
    console.log(`👤 Name: John Smith -> Vibration: ${nameVibration}`);

    // Case: Target Date April 26
    const dateVibration = reduce(26); // 8
    console.log(`📅 Target: April 26 -> Vibration: ${dateVibration}`);

    // Case: Birth Day Jan 8
    const birthVibration = 8;
    console.log(`🎂 Birth Day: 8th -> Vibration: ${birthVibration}`);

    // Combined Math (Cheiro style)
    const partial = reduce(nameVibration + dateVibration); // 8+8=16 -> 7
    const finalVibration = partial + birthVibration; // 7+8=15
    console.log(`🌀 Final Transposed Vibration: ${finalVibration}`);

    // FETCH FROM SOURCE
    console.log(`\n📖 Querying Sage Library for Compound ${finalVibration}...`);
    const { data } = await supabase
        .from("knowledge_base")
        .select("content")
        .eq("knowledge_type", "compound")
        .eq("key", finalVibration.toString())
        .single();

    if (data) {
        console.log(`📜 RESULT: "${data.content.meaning}"`);
        if (data.content.meaning.includes("obtaining money, gifts, and favours")) {
            console.log("\n✨ SUCCESS: VIBRATIONAL LOCK ACQUIRED.");
            console.log("The results are 100% esoterically aligned with Cheiro's Original Tradition.");
        }
    } else {
        console.log("❌ ERROR: Could not find compound in database.");
    }
}

startTest().catch(console.error);
