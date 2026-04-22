import { calculateNumerology } from "../src/lib/numerology/engine";

/**
 * NUMERIQ.AI — Aligned Logic Verification
 * Runs a full reading for "John Smith" (Born Jan 8) targeted for "April 26".
 * This is Cheiro's exact example from Chapter XIII.
 */

async function test() {
    console.log("🕯️  NUMERIQ.AI — Practical Reading Test");
    console.log("------------------------------------------");

    // "John Smith" born 8th Jan. 
    // Target Date: April 26.
    const result = calculateNumerology("John", "Smith", "1980-01-08", "2026-04-26");

    console.log(`👤 Name: John Smith`);
    console.log(`📅 Target: 2026-04-26`);
    console.log(`🌀 Calculated Transposed Number: ${result.transposedNumber}`);
    
    // In Cheiro's book, he calculates 15 for John Smith on April 26.
    // Our engine should match his logic.
    
    console.log("\n📖 VIBRATIONAL INTERPRETATION:");
    console.log(`[${result.quality.toUpperCase()}] ${result.qualityExplanation}`);

    if (result.qualityExplanation.includes("obtaining money, gifts, and favours")) {
        console.log("\n✅ SUCCESS: The interpretation matches Cheiro's specific example!");
    } else {
        console.log("\n⚠️  NOTICE: Check extraction alignment for Compound 15.");
    }
}

test().catch(console.error);
