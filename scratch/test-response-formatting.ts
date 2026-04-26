import { MasterResponseOrchestrator, FusionContext } from '../src/lib/engine/synthesis/master-response-orchestrator';

async function testFormatting() {
  console.log("🔥 TESTING PRODUCTION-READY RESPONSE FORMATTING\n");

  // Mock User Scenario: Born 23-07-1998 (July 23, 1998)
  // Birth Number: 2+3 = 5 (Mercury)
  // Destiny Number: 2+3+0+7+1+9+9+8 = 39 = 12 = 3 (Jupiter)
  
  const context: FusionContext = {
    numerology: {
      birth_number: 5,
      destiny_number: 3,
      personal_year: 5,
      traits: ["Communication", "Intelligence", "Expansion"]
    },
    astrology: {
      dominant_planets: ["Mercury", "Jupiter"], // Synergy Case
      mahadasha: "Jupiter",
      house_placements: { "10th": "Jupiter" },
      timing_signals: ["Jupiter Mahadasha provides career expansion"]
    },
    user_question: "Career prospects for my profile?"
  };

  console.log("--- SYSTEM PROMPT (Enforcing Rules) ---");
  console.log(MasterResponseOrchestrator.getSystemPrompt());
  console.log("\n----------------------------------------\n");

  console.log("--- FUSION LOGIC (Internal Synthesis) ---");
  const fusion = MasterResponseOrchestrator.synthesizeFusion(context);
  console.log(fusion);
  console.log("\n----------------------------------------\n");

  console.log("✅ RESULT: Orchestrator is ready to feed the LLM.");
  console.log("Next Step: The LLM will now generate the 'Golden Response' using these constraints.");
}

testFormatting();
