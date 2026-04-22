import { z } from "zod";

/**
 * NUMERIQ.AI - Zod Validation Schemas
 * Strictly enforces the "Output Contract" for Phase 3 narratives.
 */

export const MasterReadingSchema = z.object({
  openingInsight: z.string().min(10, "Opening insight must be meaningful"),
  executiveSummary: z.string().min(10, "Executive summary must be compelling"),
  destinyAnalysis: z.string().min(50, "Destiny analysis must be deep"),
  lifePathAnalysis: z.string().min(50, "Life path analysis must be deep"),
  soulUrgeReading: z.string().min(30, "Soul urge reading must be deep"),
  personalityReading: z.string().min(30, "Personality reading must be deep"),
  behavioralDynamics: z.string().min(50, "Inter-number dynamics must be analyzed"),
  strengthsNarrative: z.string(),
  challengesNarrative: z.string(),
  missingNumbersInsight: z.string(),
  missingNumberRemedies: z.string(),
  careerGuidance: z.array(z.string()).min(3, "Provide at least 3 career directives"),
  relationshipInsight: z.array(z.string()).min(2, "Provide at least 2 relationship directives"),
  strategicGuidance: z.string().min(50, "Strategic guidance must be professional and predictive"),
  yearForecast: z.array(z.string()).min(3, "Provide at least 3 year-specific milestones"),
  remediesNarrative: z.string(),
  closingWisdom: z.string().min(10, "Provide a powerful closing aphorism"),
  disclaimer: z.string()
});

export const CompatibilityReadingSchema = z.object({
  harmonySummary: z.string(),
  synergyAnalysis: z.string(),
  frictionAnalysis: z.string(),
  longTermForecast: z.string(),
  strategicAdvice: z.array(z.string())
});

export const BusinessReadingSchema = z.object({
  brandResonance: z.string(),
  marketTiming: z.string(),
  operationalStrategy: z.string(),
  launchForecast: z.string()
});
