import { AstroNumerologyService } from '../src/lib/engine/service/astro-numerology-service';

async function runCriticalTests() {
  const service = new AstroNumerologyService();
  console.log("🛠️ RUNNING CRITICAL BATTLE TESTS (2A, 4A, 4C)\n");

  // --- TEST 2A: SACHIN TENDULKAR Math ---
  console.log("--- TEST 2A: Math Accuracy (SACHIN TENDULKAR) ---");
  const res2A = await service.getExpertConsultation({
    name: "SACHIN TENDULKAR",
    dob: "1973-04-24",
    question: "Analyze my name",
    category: "GENERAL"
  }, "");
  
  if (res2A.finalPrompt) {
    console.log("Word Breakdown Injected:");
    console.log(res2A.finalPrompt.split('[DETERMINISTIC_MATH_CONTRACT]')[1].split('[RAG_CONTEXT]')[0].trim());
    
    const isCorrect = res2A.finalPrompt.includes('Total Compound: 50') && res2A.finalPrompt.includes('Total Root: 5');
    console.log(`\nResult 2A: ${isCorrect ? '✅ PASSED' : '❌ FAILED'}`);
  }

  // --- TEST 4A: Pythagorean Trap ---
  console.log("\n--- TEST 4A: Pythagorean Trap ---");
  const res4A = await service.getExpertConsultation({
    name: "Test User",
    dob: "1992-08-15",
    question: "What is my life path number?",
    category: "GENERAL"
  }, "");
  
  const hasForbidden = res4A.finalPrompt?.toLowerCase().includes("life path number");
  const redirecting = res4A.finalPrompt?.includes("NEVER use Pythagorean terms");
  console.log(`Sovereignty Instructions Present: ${redirecting ? '✅' : '❌'}`);
  console.log(`Result 4A: ${!hasForbidden ? '✅ PASSED (Prompt sanitized)' : '❌ FAILED (Leaked terminology)'}`);

  // --- TEST 4C: Hallucination Trap ---
  console.log("\n--- TEST 4C: Hallucination Trap (Feb 30) ---");
  const res4C = await service.getExpertConsultation({
    name: "Nonsense Name",
    dob: "1995-02-30",
    question: "Give me my complete numerology reading.",
    category: "GENERAL"
  }, "");

  const caughtError = res4C.error?.includes("INVALID_DATE");
  console.log(`Caught Invalid Date: ${caughtError ? '✅' : '❌'}`);
  console.log(`Result 4C: ${caughtError ? '✅ PASSED (Validation triggered)' : '❌ FAILED (Hallucinated date)'}`);

  console.log("\n--- CRITICAL TEST SUMMARY ---");
  const total = (res2A.finalPrompt.includes('Total Compound: 50') ? 1 : 0) + (!hasForbidden ? 1 : 0) + (caughtError ? 1 : 0);
  console.log(`Final Score: ${total}/3`);
  if (total === 3) console.log("🚀 CORE ENGINE IS SOUND. PROCEED TO FULL AUDIT.");
  else console.log("⚠️ FIX CORE ENGINE BEFORE PROCEEDING.");
}

runCriticalTests();
