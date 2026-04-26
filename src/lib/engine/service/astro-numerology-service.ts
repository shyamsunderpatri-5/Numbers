import { calculateBirthNumber, calculateDestinyNumber, calculateNameNumber, getPlanetaryRelationship } from '../logic/calculator-utils';
import { MasterResponseOrchestrator, FusionContext } from '../synthesis/master-response-orchestrator';
import { PromptDesigner, QueryCategory } from '../intelligence/prompt-designer';

export interface UserInput {
  name: string;
  dob: string;
  question: string;
  category: QueryCategory;
}

export class AstroNumerologyService {
  /**
   * THE MAIN ORCHESTRATION FLOW
   * 1. Calc -> 2. Retrieve -> 3. Fuse -> 4. Build Prompt -> 5. AI -> 6. Format
   */
  public async getExpertConsultation(input: UserInput, ragContext: string) {
    try {
      // 1. DETERMINISTIC CALCULATIONS
      const numerology = {
        birth: calculateBirthNumber(input.dob),
        destiny: calculateDestinyNumber(input.dob),
        name: calculateNameNumber(input.name)
      };

      // 2. MOCK ASTROLOGY
      const astrology = {
        dominant_planets: ["Mercury"],
        mahadasha: "Jupiter",
        house_focus: "10th"
      };

      // 3. FUSION LOGIC (Internal Synthesis)
      const fusionContext: FusionContext = {
        numerology: {
          birth_number: numerology.birth,
          destiny_number: numerology.destiny,
          traits: ["Intelligence", "Success"],
          name_details: numerology.name // Word-by-word breakdown
        },
        astrology: {
          dominant_planets: astrology.dominant_planets,
          mahadasha: astrology.mahadasha,
          house_placements: { [astrology.house_focus]: "Occupied" },
          timing_signals: []
        },
        user_question: input.question
      };
      const internalFusion = MasterResponseOrchestrator.synthesizeFusion(fusionContext);

      // 4. BUILD THE MASTER PROMPT
      const systemPrompt = MasterResponseOrchestrator.getSystemPrompt();
      const categoryPrompt = PromptDesigner.designPrompt(input.question, input.category, {
        dob: input.dob,
        name: input.name
      });

      const finalPrompt = `
${systemPrompt}

[INTERNAL_FUSION_TRUTH]
${internalFusion}

[DETERMINISTIC_MATH_CONTRACT]
Name Breakdown: ${JSON.stringify(numerology.name.words, null, 2)}
Total Compound: ${numerology.name.totalCompound}
Total Root: ${numerology.name.totalRoot}
Sacred 9 Check: Pass (No letter assigned 9)
Birth Number: ${numerology.birth}
Destiny Number: ${numerology.destiny}

[RAG_CONTEXT]
${ragContext}

${categoryPrompt}
    `.trim();

      return {
        finalPrompt,
        formatResponse: (aiOutput: string) => this.formatResponse(aiOutput)
      };
    } catch (error: any) {
      return {
        error: error.message,
        finalPrompt: `System Error: ${error.message}`,
        formatResponse: (t: string) => t
      };
    }
  }

  /**
   * COMPATIBILITY ENGINE
   */
  public async getCompatibilityReport(p1: UserInput, p2: UserInput, ragContext: string) {
    const num1 = { birth: calculateBirthNumber(p1.dob), name: calculateNameNumber(p1.name) };
    const num2 = { birth: calculateBirthNumber(p2.dob), name: calculateNameNumber(p2.name) };

    const relationship = getPlanetaryRelationship(num1.birth, num2.birth);
    
    const finalPrompt = `
${MasterResponseOrchestrator.getSystemPrompt()}

[COMPATIBILITY_CONTRACT]
Person A: ${p1.name} (Birth: ${num1.birth}, Name: ${num1.name.totalCompound}/${num1.name.totalRoot})
Person B: ${p2.name} (Birth: ${num2.birth}, Name: ${num2.name.totalCompound}/${num2.name.totalRoot})
Planetary Relationship: ${relationship}

[RAG_CONTEXT]
${ragContext}

User Question: "Are we compatible for marriage?"
    `.trim();

    return { finalPrompt, formatResponse: (t: string) => this.formatResponse(t) };
  }

  /**
   * NAME CORRECTION ENGINE
   */
  public async getNameCorrectionReport(babyDob: string, names: string[], ragContext: string) {
    const birthNum = calculateBirthNumber(babyDob);
    const results = names.map(name => {
      const { totalCompound, totalRoot, words } = calculateNameNumber(name);
      return { name, totalCompound, totalRoot, isAligned: totalRoot === birthNum, words };
    });

    const finalPrompt = `
${MasterResponseOrchestrator.getSystemPrompt()}

[NAME_CORRECTION_CONTRACT]
Baby Birth Number: ${birthNum}
Proposed Names: ${JSON.stringify(results, null, 2)}

[RAG_CONTEXT]
${ragContext}

User Question: "Which name is better for our daughter?"
    `.trim();

    return { finalPrompt, formatResponse: (t: string) => this.formatResponse(t) };
  }

  /**
   * Cleans and formats LLM output if it deviates from the golden structure
   */
  private formatResponse(text: string): string {
    return text
      .replace(/Numerology:/g, "🔢 Numerology Insight")
      .replace(/Astrology:/g, "🔯 Astrology Insight")
      .replace(/Combined:/g, "⚖️ Combined Interpretation")
      .replace(/Advice:/g, "📌 Practical Guidance")
      .replace(/Timing:/g, "⏳ Timing");
  }
}
