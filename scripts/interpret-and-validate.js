const { validateInterpretation } = require("./chaldean-synthesis-engine");

console.log("🧪 STARTING GOLDEN AUTHORITY AUDIT...");

/**
 * CASE 1: RAHUL (17/8) - PASS
 */
const rahulPass = `
RAHUL (Name Number 17 — Star of the Magi)
This carries a strong Saturnine influence. It is a highly fortunate vibration, known as the Star of the Magi. 
It grants immense spiritual strength and the capacity to rise superior in spirit to trials and difficulties. 
One must embrace responsibility and discipline to master the karma of this path.
`;

/**
 * CASE 2: RAHUL (17/8) - FAIL (Missing Compound Name/Meaning)
 */
const rahulFail = `
RAHUL (Name Number 17)
This carries Saturnine influence. You are disciplined and serious. 
You deal with delay and karma through endurance.
`;

/**
 * CASE 3: RAHUL (17/8) - FAIL (Forbidden Terminology)
 */
const rahulForbidden = `
RAHUL (Name Number 17)
This carries Saturnine influence. Your life path is 8.
It reduces to a vibration of responsibility.
`;

function runTest(name, output, number, planet, isCompound) {
    console.log(`\n--- Test: ${name} ---`);
    const v = validateInterpretation(output, number, planet, isCompound);
    console.log(`- Overall Pass: ${v.pass ? "✅" : "❌"}`);
    console.log(`- Golden Pass: ${v.goldenResults.pass ? "✅" : "❌"}`);
    if (v.goldenResults.missing.length > 0) console.log(`  - Missing: ${v.goldenResults.missing.join(", ")}`);
    if (v.goldenResults.forbiddenFound.length > 0) console.log(`  - Forbidden: ${v.goldenResults.forbiddenFound.join(", ")}`);
    console.log(`- Weight Audit (Compound Dominance): ${v.weightAuditPass ? "✅" : "❌"}`);
}

runTest("RAHUL (Valid)", rahulPass, 17, "Saturnine", true);
runTest("RAHUL (Missing Compound Detail)", rahulFail, 17, "Saturnine", true);
runTest("RAHUL (Contains Blacklist)", rahulForbidden, 17, "Saturnine", true);

console.log("\n🏁 GOLDEN AUDIT COMPLETE.");
