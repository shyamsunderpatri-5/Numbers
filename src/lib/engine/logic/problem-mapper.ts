/**
 * NUMERIQ.AI — Problem Mapper
 * Maps user-selected friction points to behavioral patterns and root vibrations.
 */

export type ProblemType = "money" | "career" | "relationships" | "confusion";

export interface ProblemDefinition {
  label: string;
  behavioralTraits: string[];
  impactDescription: string;
  primaryVibrations: number[]; // Favorable vibrations for this problem
}

export const PROBLEM_MAP: Record<ProblemType, ProblemDefinition> = {
  money: {
    label: "Financial Flow",
    behavioralTraits: ["inconsistency", "delay patterns", "undervaluation"],
    impactDescription: "Stabilizes financial decisions and reduces hesitation in wealth-building.",
    primaryVibrations: [6, 1, 3] // Venus (Money), Sun (Authority), Jupiter (Expansion)
  },
  career: {
    label: "Career Growth",
    behavioralTraits: ["hesitation", "lack of direction", "authority conflict"],
    impactDescription: "Improves decision clarity and strengthens professional authority.",
    primaryVibrations: [1, 8, 3] // Sun (Leadership), Saturn (Discipline), Jupiter (Growth)
  },
  relationships: {
    label: "Relationship Harmony",
    behavioralTraits: ["miscommunication", "imbalance", "emotional reactivity"],
    impactDescription: "Improves expression clarity and emotional stability in connections.",
    primaryVibrations: [2, 6, 9] // Moon (Empathy), Venus (Love), Mars (Protection/Passion)
  },
  confusion: {
    label: "Mental Clarity",
    behavioralTraits: ["analysis paralysis", "scattered focus", "indecision"],
    impactDescription: "Reduces mental noise and improves focus on high-impact tasks.",
    primaryVibrations: [7, 5, 1] // Neptune (Insight), Mercury (Intellect), Sun (Focus)
  }
};

/**
 * Returns the behavioral traits associated with a problem.
 */
export function getProblemTraits(problem: ProblemType): string[] {
  return PROBLEM_MAP[problem]?.behavioralTraits || [];
}

/**
 * Returns the impact description for a problem.
 */
export function getProblemImpact(problem: ProblemType): string {
  return PROBLEM_MAP[problem]?.impactDescription || "";
}
