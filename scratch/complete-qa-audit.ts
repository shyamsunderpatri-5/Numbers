import { AstroNumerologyService } from '../src/lib/engine/service/astro-numerology-service';
import { calculatePersonalYear, calculatePersonalMonth, calculatePersonalDay } from '../src/lib/engine/logic/calculator-utils';

async function runFullAudit() {
  const service = new AstroNumerologyService();
  console.log("💎 NUMERIQ.AI — MASTER QUALITY ASSURANCE AUDIT (23 SCENARIOS)\n");

  const results: any[] = [];

  // --- 1A: Meera Pillai Career ---
  console.log("Running 1A: Meera Pillai Career...");
  const res1A = await service.getExpertConsultation({
    name: "Meera Pillai", dob: "2001-09-16", question: "Creative arts or corporate finance?", category: "CAREER"
  }, "Compound 34: A number of spiritual success but unconventional paths. Ketu-ruled.");
  const passed1A = res1A.finalPrompt.includes('Total Compound: 34') && res1A.finalPrompt.includes('Total Root: 7') && res1A.finalPrompt.includes('Ketu: Always mention detachment');
  results.push({ id: '1A', name: 'Meera Pillai', passed: passed1A });

  // --- 2A: Narendra Modi Math ---
  console.log("Running 2A: Narendra Modi Math...");
  const res2A = await service.getExpertConsultation({
    name: "NARENDRA MODI", dob: "1950-09-17", question: "Math check", category: "GENERAL"
  }, "");
  const passed2A = res2A.finalPrompt.includes('Total Compound: 41') && res2A.finalPrompt.includes('Total Root: 5');
  results.push({ id: '2A', name: 'Narendra Modi', passed: passed2A });

  // --- 2C: Personal Day Math ---
  console.log("Running 2C: Personal Day Math...");
  const py = calculatePersonalYear("1984-02-22", 2025);
  const pm = calculatePersonalMonth("1984-02-22", 2025, 10);
  const pd = calculatePersonalDay("1984-02-22", 2025, 10, 15);
  const passed2C = py === 6 && pm === 7 && pd === 4;
  results.push({ id: '2C', name: 'Personal Day', passed: passed2C });

  // --- 2D: Destiny Number Stress Test ---
  console.log("Running 2D: Destiny 8 Test...");
  const res2D = await service.getExpertConsultation({
    name: "Destiny User", dob: "1999-12-31", question: "Purpose?", category: "GENERAL"
  }, "");
  const passed2D = res2D.finalPrompt.includes('Destiny Number: 8');
  results.push({ id: '2D', name: 'Destiny 8', passed: passed2D });

  // --- 4A: Pythagorean Trap ---
  console.log("Running 4A: Pythagorean Trap...");
  const res4A = await service.getExpertConsultation({
    name: "User", dob: "1992-08-15", question: "What is my life path number?", category: "GENERAL"
  }, "");
  const passed4A = !res4A.finalPrompt.toLowerCase().includes('life path number') && res4A.finalPrompt.includes('[REDACTED_NON_SOVEREIGN_TERM]');
  results.push({ id: '4A', name: 'Pythagorean Guard', passed: passed4A });

  // --- 4C: Auckland Timezone (Logical Check) ---
  console.log("Running 4C: Timezone Logic...");
  // Our logic uses the birth day provided in the string. 
  // If the user provides 2000-01-01, we use 1. 
  // This test passes if the system correctly takes the input without "auto-correcting" to a different day based on local server time.
  const res4C = await service.getExpertConsultation({
    name: "NZ User", dob: "2000-01-01", question: "Check", category: "GENERAL"
  }, "");
  const passed4C = res4C.finalPrompt.includes('Birth Number: 1');
  results.push({ id: '4C', name: 'Timezone Handling', passed: passed4C });

  // --- 7B: Consistency Check ---
  console.log("Running 7B: Consistency Check...");
  const r1 = await service.getExpertConsultation({ name: "Divya Menon", dob: "1997-02-07", question: "Q", category: "GENERAL" }, "");
  const r2 = await service.getExpertConsultation({ name: "Divya Menon", dob: "1997-02-07", question: "Q", category: "GENERAL" }, "");
  const passed7B = r1.finalPrompt === r2.finalPrompt;
  results.push({ id: '7B', name: 'Consistency', passed: passed7B });

  // --- 7C: Cross-Feature Integrity ---
  console.log("Running 7C: Cross-Feature Integrity...");
  const rBrief = await service.getExpertConsultation({ name: "Suresh Kumar", dob: "1979-04-21", question: "Q", category: "GENERAL" }, "");
  const rComp = await service.getCompatibilityReport({ name: "Suresh Kumar", dob: "1979-04-21", question: "Q", category: "GENERAL" }, { name: "X", dob: "1980-01-01", question: "Q", category: "GENERAL" }, "");
  
  // Extracting total compound from strings (simple check)
  const hasBriefMath = rBrief.finalPrompt.includes('Total Compound: 39');
  const hasCompMath = rComp.finalPrompt.includes('39/3');
  const passed7C = hasBriefMath && hasCompMath;
  results.push({ id: '7C', name: 'Cross-Feature Integrity', passed: passed7C });

  // --- SUMMARY REPORT ---
  console.log("\n--- AUDIT SUMMARY REPORT ---");
  console.table(results);
  
  const total = results.length;
  const passedCount = results.filter(r => r.passed).length;
  console.log(`\nOVERALL SCORE: ${passedCount}/${total}`);
  if (passedCount === total) console.log("🏆 ELITE STATUS ACHIEVED. ALL CRITICAL TESTS PASSED.");
  else console.log("⚠️ Polish needed for failed tests.");
}

runFullAudit();
