/**
 * NUMERIQ.AI - Knowledge Base: Personal Cycles
 * Interpretations for Personal Year, Month, and Day.
 */

import { PersonalYearKnowledge } from "../types";

export const PERSONAL_YEAR_KNOWLEDGE: Record<number, PersonalYearKnowledge> = {
  1: {
    year: 1,
    theme: "Beginning & Innovation",
    narrative: "The 1st year is the start of a new 9-year cycle. This is a time of immense movement and new beginnings. Whatever you plant now will grow for the next nine years. It is a period for bravery, self-reliance, and breaking away from the past. You will feel a surge of energy and a desire to initiate new projects.",
    opportunities: ["Starting a business", "New career paths", "Relocation", "Developing total independence"],
    cautions: ["Impulses without planning", "Ego clashes with colleagues", "Ignoring past lessons"],
    bestMonths: [1, 10, 19, 28],
    careerFocus: "The 1 year is best for launching a new professional identity or taking the lead in a major innovation.",
    relationshipFocus: "A time for setting boundaries and establishing your independent needs within a partnership.",
    financialFocus: "Investment in self and new ventures is favored; take calculated risks."
  },
  2: {
    year: 2,
    theme: "Partnership & Patience",
    narrative: "After the burst of energy in year 1, year 2 is a period of consolidation and waiting. It is the time for cooperation, harmony, and developing relationships. You must learn the art of patience—growth is happening, but it is taking place beneath the surface. Success comes through others, not through force.",
    opportunities: ["Strategic partnerships", "Counseling and diplomacy", "Consolidating gains", "Deepening intimacy"],
    cautions: ["Indecision", "Being overly sensitive to delays", "Allowing others to be too dominant"],
    bestMonths: [2, 11, 20, 29],
    careerFocus: "Focus on teamwork, networking, and refining the projects started in year 1. A time for the 'counselor' rather than the 'commander'.",
    relationshipFocus: "The most important year for love and cooperation. Developing empathy and resolving long-standing conflicts.",
    financialFocus: "Joint ventures and safe, steady investments are best; avoid solo gambling."
  },
  3: {
    year: 3,
    theme: "Expression & Joy",
    narrative: "A year of expansion and social activity. This is the 'fruit' of your work in years 1 and 2. It is a time for creativity, self-expression, and enjoyment. You will find yourself in the public eye more, and your ideas will gain traction through your charisma and wit.",
    opportunities: ["Public speaking", "Creative arts", "Travel and social networking", "Expanding your influence"],
    cautions: ["Scattered energy", "Over-spending on entertainment", "Lack of follow-through"],
    bestMonths: [3, 12, 21, 30],
    careerFocus: "Marketing, communications, and any role that requires a professional stage are highly favored.",
    relationshipFocus: "Fun, lighthearted, and social. A great time to meet new people and expand your social circle.",
    financialFocus: "Opportunities come through social connections; be careful with impulsive luxury purchases."
  },
  4: {
    year: 4,
    theme: "Discipline & Foundations",
    narrative: "The 4th year brings the energy of work and structure. It is the 'labor' year. After the fun of year 3, you must buckle down and build the structures necessary for permanence. It may feel restrictive, but this discipline is the only thing that will sustain your growth in the coming years.",
    opportunities: ["Building a home", "Meticulous project management", "Finalizing legal/tax matters", "Skill development"],
    cautions: ["Rigidity", "Health issues from overwork", "Frustratioin with slow progress"],
    bestMonths: [4, 13, 22, 31],
    careerFocus: "Focus on organization, administration, and the physical realization of your projects. Efficiency is your mantra.",
    relationshipFocus: "A time to address the practicalities of a relationship—finances, home building, and shared responsibilities.",
    financialFocus: "Conservative, long-term investments; focus on debt reduction and solid assets like real estate."
  },
  5: {
    year: 5,
    theme: "Freedom & Pivot",
    narrative: "The midpoint of the cycle! Year 5 brings sudden change, variety, and a desire for freedom. Whatever was built in year 4 will now be tested by the wind of change. This is the year of the traveler, the adventurer, and the salesperson. Be ready for the unexpected.",
    opportunities: ["Global travel", "Major career shifts", "Learning new technologies", "Sudden breakthroughs"],
    cautions: ["Sensory excess", "Lack of commitment", "Unnecessary risk-taking"],
    bestMonths: [5, 14, 23],
    careerFocus: "Excellent for sales, innovation, and roles that allow for physical or mental movement. Embrace the pivot.",
    relationshipFocus: "Exciting but potentially unstable. New people will enter your life who challenge your perspectives.",
    financialFocus: "Be adaptable; new ways of generating income may appear suddenly. Avoid heavy, long-term lock-ins right now."
  },
  6: {
    year: 6,
    theme: "Responsibility & Service",
    narrative: "After the changes of year 5, year 6 brings you home. This is the year of family, responsibility, and service to others. You will find yourself playing the role of the caretaker, the healer, or the teacher. Harmony in your immediate environment is the key to your success this year.",
    opportunities: ["Family milestones", "Community leadership", "Domestic improvements", "Healing work"],
    cautions: ["Over-responsibility", "Domestic conflict", "Ignoring personal needs"],
    bestMonths: [6, 15, 24],
    careerFocus: "Roles involving mentoring, education, or community service are favored. Your professional integrity will be noticed.",
    relationshipFocus: "Commitment and home life are the priorities. A beautiful year for marriage or deepening domestic bonds.",
    financialFocus: "Spending on home and family is at the center; steady, communal growth is favored."
  },
  7: {
    year: 7,
    theme: "Observation & Wisdom",
    narrative: "A sabbath year. Year 7 is for introspection, study, and spiritual seeking. This is not a year for external expansion, but for internal depth. You will need solitude to process the lessons of the past six years. Silence is your greatest ally. Truth will be revealed if you look inward.",
    opportunities: ["Deep research", "Solitary retreat", "Spiritual practice", "Specialized study"],
    cautions: ["Cynicism", "Social withdrawal leading to depression", "Ignoring material reality"],
    bestMonths: [7, 16, 25],
    careerFocus: "Focus on the technical or research aspects of your work. A time for strategy, not for battle.",
    relationshipFocus: "Intellectual and spiritual connection is paramount. Partners must respect your need for silence.",
    financialFocus: "Avoid speculative risks. Focus on long-term stability and protecting your existing assets."
  },
  8: {
    year: 8,
    theme: "Power & Achievement",
    narrative: "The year of harvest! Year 8 is the peak of material power. If you have worked hard and with integrity through years 1-7, you will now see major success, recognition, and financial gain. It is the vibration of the executive and the judge. Master the material world with honor.",
    opportunities: ["Promotion to leadership", "Significant financial gain", "Large-scale property/business deals", "Recognition"],
    cautions: ["Ego and ruthlessness", "Karmic lessons for past dishonesty", "Burnout"],
    bestMonths: [8, 17, 26],
    careerFocus: "Total executive command. Make big moves, take the lead, and demand the recognition you have earned.",
    relationshipFocus: "Status and partnership dynamics. A time for powerful, established relationships to thrive.",
    financialFocus: "The most important year for wealth creation. High-stakes moves are favored if grounded in logic."
  },
  9: {
    year: 9,
    theme: "Completion & Release",
    narrative: "The end of the cycle. Year 9 is a time for cleaning house. Whatever no longer serves your path should be released with forgiveness. It is a period for humanitarian service and finishing long-term projects. Do not start major new ventures—finish the old ones to make space for the next cycle.",
    opportunities: ["Philanthropy", "Closing business deals", "Travel for closure", "Graduation or completion"],
    cautions: ["Clinging to the past", "Emotional exhaustion", "Starting new long-term lock-ins"],
    bestMonths: [9, 18, 27],
    careerFocus: "Focus on finalizing projects and your legacy. A transition year to mentor those who will carry on your work.",
    relationshipFocus: "A time for deep forgiveness and potentially releasing relationships that have reached their completion.",
    financialFocus: "Resolve debts and finalize accounts. A year for generosity and non-attachment."
  }
};

// Simplified Month/Day energy patterns
export const PERSONAL_MONTH_ENERGY: Record<number, string> = {
  1: "New starts and independent action.",
  2: "Cooperation and waiting for results.",
  3: "Social activity and creative expression.",
  4: "Practical work and routine.",
  5: "Change, travel, and new experiences.",
  6: "Family harmony and domestic duty.",
  7: "Inner focus and specialized study.",
  8: "Material power and financial results.",
  9: "Completion and universal compassion."
};
