import { AstroNumerologyService, UserInput } from '../src/lib/engine/service/astro-numerology-service';

async function demoApiCall() {
  console.log("🚀 SIMULATING PRODUCTION API CALL (Jyotish-Numeriq v1.0)\n");

  const service = new AstroNumerologyService();

  // 1. Mock User Input from Frontend
  const userInput: UserInput = {
    name: "Shyam Sunder",
    dob: "1998-07-23",
    question: "Should I start a new business this year?",
    category: "CAREER"
  };

  // 2. Mock RAG Context (Usually comes from your Vector Search)
  const mockRagContext = `
    Compound 23 Royal Star of the Lion: Unexpected help and protection in business.
    Mercury (5): Governs trade and communication. Favorable for digital ventures.
    Jupiter Mahadasha: A 16-year period of wisdom and financial expansion.
  `;

  // 3. GET EXPERT CONSULTATION CONTRACT
  const { finalPrompt, formatResponse } = await service.getExpertConsultation(userInput, mockRagContext);

  console.log("--- FINAL PROMPT SENT TO LLM ---");
  console.log(finalPrompt);
  console.log("\n--------------------------------\n");

  // 4. MOCK LLM OUTPUT (Simulating the AI following our instructions)
  const mockAiOutput = `
Numerology: Your Birth Number is 5 (Mercury), aligning perfectly with business. 
Astrology: You are in Jupiter Mahadasha, supporting expansion in the 10th house.
Combined: Mercury and Jupiter synergy creates a powerful alignment for trade.
Advice: Yes, start the business. Focus on communication-heavy models.
Timing: The second half of the year is superior.
  `;

  // 5. FORMATTING THE RESULT FOR THE UI
  console.log("--- FINAL FORMATTED RESPONSE FOR USER ---");
  const finalOutput = formatResponse(mockAiOutput);
  console.log(finalOutput);

  console.log("\n✅ SUCCESS: End-to-end flow verified.");
}

demoApiCall();
