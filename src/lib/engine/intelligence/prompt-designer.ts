/**
 * PROMPT DESIGNER
 * Guides users to ask high-quality questions and provides category-specific
 * context for the AI engine.
 */

export type QueryCategory = 'CAREER' | 'MARRIAGE' | 'MONEY' | 'GENERAL';

export interface CategoryDefinition {
  id: QueryCategory;
  label: string;
  suggested_questions: string[];
  system_instructions: string;
}

export const CATEGORY_DEFINITIONS: Record<QueryCategory, CategoryDefinition> = {
  CAREER: {
    id: 'CAREER',
    label: 'Career & Success',
    suggested_questions: [
      "What is the best career path for my birth details?",
      "Will I succeed in business or a corporate job?",
      "When is the best time for a job change?"
    ],
    system_instructions: "Focus on 10th House (Karma Bhava), Jupiter/Mercury/Saturn influences, and Destiny Number career alignment."
  },
  MARRIAGE: {
    id: 'MARRIAGE',
    label: 'Marriage & Relationships',
    suggested_questions: [
      "What is my marriage timing according to my chart?",
      "Love vs Arranged marriage - what do my numbers show?",
      "Partner compatibility based on my birth details."
    ],
    system_instructions: "Focus on 7th House (Jaya Bhava), Venus/Mars/Moon influences, and Birth Number relationship traits."
  },
  MONEY: {
    id: 'MONEY',
    label: 'Finance & Wealth',
    suggested_questions: [
      "What is my financial growth potential?",
      "Will I have multiple sources of income?",
      "When will my financial situation improve?"
    ],
    system_instructions: "Focus on 2nd House (Dhana Bhava), 11th House (Labha Bhava), and Jupiter/Venus wealth signals."
  },
  GENERAL: {
    id: 'GENERAL',
    label: 'General Reading',
    suggested_questions: [
      "Give me a general reading of my life path.",
      "What are the major themes for my current year?"
    ],
    system_instructions: "Provide a comprehensive overview of traits (Numerology) and current Dasha (Astrology)."
  }
};

export class PromptDesigner {
  /**
   * Scrubs forbidden terms from the user query to maintain sovereignty
   */
  private static sanitizeQuery(query: string): string {
    const forbidden = [
      /life path number/gi,
      /expression number/gi,
      /personality number/gi,
      /soul urge/gi, // If used in pythagorean context
      /master number/gi
    ];
    
    let sanitized = query;
    forbidden.forEach(regex => {
      sanitized = sanitized.replace(regex, "[REDACTED_NON_SOVEREIGN_TERM]");
    });
    return sanitized;
  }

  /**
   * Generates a category-aware prompt for the AI
   */
  public static designPrompt(userQuery: string, category: QueryCategory, userData: any): string {
    const catDef = CATEGORY_DEFINITIONS[category];
    const cleanQuery = this.sanitizeQuery(userQuery);
    
    return `
User Data:
DOB: ${userData.dob}
Name: ${userData.name || 'Seeker'}

Category: ${catDef.label}
User Question: "${cleanQuery}"

Expert Instructions:
- ${catDef.system_instructions}
- Use both Vedic Astrology and Chaldean Numerology.
- Follow the Golden Response Structure (Numerology -> Astrology -> Combined -> Guidance -> Timing).
- Be concise, practical, and avoid generic statements.
    `.trim();
  }
}
