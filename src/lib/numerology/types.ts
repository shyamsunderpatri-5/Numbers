/**
 * NUMERIQ.AI - Domain Types & Interfaces
 * Following Three-Layer Architecture: Math -> Knowledge -> AI
 */

// --- LAYER 1: MATH ENGINE TYPES ---

export type NumberQuality = 'favorable' | 'challenging' | 'neutral' | 'powerful' | 'master';

export interface CoreNumbers {
  destinyNumber: number;
  destinyCompound: number;
  lifePathNumber: number;
  lifePathCompound: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  
  // Traditional Additions
  hiddenPassion: number;      // Most frequent digit in full name
  cornerstone: string;       // First letter of first name
  capstone: string;          // Last letter of first name
  bridgeNumber: number;      // Abs difference between Destiny and Life Path (or SU and Pers)
}

export interface NameNumberResult {
  full: number;
  compound: number;
  reduced: number;
  parts: { name: string; compound: number; reduced: number }[];
}

export interface LifePathResult {
  compound: number;
  reduced: number;
}

export interface BirthDayResult {
  reduced: number;
}

export interface SoulUrgeResult {
  reduced: number;
}

export interface PersonalityResult {
  reduced: number;
}

export interface PersonalYearResult {
  reduced: number;
}

export interface PersonalMonthResult {
  reduced: number;
}

export interface PersonalDayResult {
  reduced: number;
}

export interface MissingNumbersResult {
  missing: number[];
  present: number[];
  intensity: Record<number, number>;
}

export interface PatternMeaning {
  patternNumber: 13 | 14 | 16 | 19;
  meaning: string;
  practicalAdvice: string;
}

export interface KarmicPatternResult {
  patterns: PatternMeaning[];
}

export interface CompatibilityResult {
  score: number;
  harmony: 'very high' | 'high' | 'moderate' | 'low' | 'very low';
}

export interface LuckyNumbersResult {
  numbers: number[];
}

export interface LuckyDateResult {
  date: number;
  reason: string;
}

export interface FullReadingResult extends CoreNumbers {
  missingNumbers: number[];
  karmicPatterns: PatternMeaning[];
  harmonyScore: number;
  luckyNumbers: number[];
  luckyDates: number[];
  intensityMap: Record<number, number>;
}

// --- LAYER 2: KNOWLEDGE BASE TYPES ---

export interface LuckyColor {
  name: string;
  hex: string;
  reason: string;
}

export interface NumberKnowledge {
  number: number;
  name: string;
  vibration: string;
  quality: NumberQuality;
  qualityExplanation: string;
  coreMeaning: string;
  asDestinyNumber: string;
  asLifePath: string;
  asSoulUrge: string;
  asPersonality: string;
  asBirthDay: string;
  strengths: string[];
  challenges: string[];
  hiddenStrengths: string[];
  careerPaths: string[];
  careerNarrative: string;
  relationshipPattern: string;
  financialPattern: string;
  healthPattern: string;
  compatibleWith: number[];
  challengingWith: number[];
  neutralWith: number[];
  luckyColors: LuckyColor[];
  luckyDays: string[];
  luckyGems: string[];
  luckyNumbers: number[];
  missingMeaning: string;
  missingImpact: {
    relationships: string;
    career: string;
    finances: string;
    dailyLife: string;
  };
  missingRemedy: {
    color: string;
    habit: string;
    name: string;
    element: string;
    timing: string;
  };
  isGoodNumber: boolean;
  remedyIfChallenging?: string;
  specialNote?: string;
  indaNarrative?: string;
  sunSignInteractions?: Record<string, string>;
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether';
  planet: string;
  historicalNote: string;
}

export interface CompoundMeaning {
  compound: number;
  chaldeanName: string;
  reducedTo: number;
  meaning: string;
  isFavorable: boolean;
  isPattern: boolean;
  patternType?: number;
  specialMeaning?: string;
  sepharialNote?: string;
  laganNote?: string;
  indaName?: string;
  indaMeaning?: string;
  indaKarmicNote?: string;
  sourceConflict?: boolean;
  positionContext: {
    asDestiny: string;
    asLifePath: string;
  };
}

export interface CombinationMeaning {
  numberA: number;
  numberB: number;
  harmonyScore: number;
  harmonyLabel: 'very high' | 'high' | 'moderate' | 'low' | 'very low';
  combinationName: string;
  narrative: string;
  romantically: string;
  professionally: string;
  friendship: string;
  keySynergies: string[];
  keyFrictions: string[];
  adviceForPair: string;
}

export interface PersonalYearKnowledge {
  year: number;
  theme: string;
  narrative: string;
  opportunities: string[];
  cautions: string[];
  bestMonths: number[];
  careerFocus: string;
  relationshipFocus: string;
  financialFocus: string;
}

export interface ReadingKnowledgeContext {
  destinyKnowledge: NumberKnowledge;
  lifePathKnowledge: NumberKnowledge;
  soulUrgeKnowledge: NumberKnowledge;
  personalityKnowledge: NumberKnowledge;
  birthDayKnowledge: NumberKnowledge;
  destinyCompound: CompoundMeaning;
  lifePathCompound: CompoundMeaning;
  missingKnowledge: Array<{ number: number } & Pick<NumberKnowledge, 'missingMeaning' | 'missingImpact' | 'missingRemedy'>>;
  patternKnowledge: PatternMeaning[];
  personalYearKnowledge: PersonalYearKnowledge;
  combinationKnowledge: CombinationMeaning[];
  luckyElementsForProfile: {
    colors: LuckyColor[];
    gems: string[];
    days: string[];
    numbers: number[];
  };
  bookSnippets: LibrarySnippet[];
}

// --- RAG / LIBRARY TYPES ---

export interface LibrarySnippet {
  id: string;
  chunk_text: string;
  source_title: string;
  source_author: string;
  similarity: number;
}

// --- LAYER 3: AI / INSIGHT TYPES ---

export interface MasterReading {
  openingInsight: string;
  destinyReading: string;
  soulUrgeReading: string;
  personalityReading: string;
  lifePathReading: string;
  strengthsNarrative: string;
  challengesNarrative: string;
  missingNumbersInsight: string;
  careerGuidance: string[];
  relationshipInsight: string[];
  yearForecast: string[];
  remediesNarrative: string;
  closingWisdom: string;
  disclaimer: string;
}

export interface AIParsedReading extends MasterReading {
  mathData: FullReadingResult;
  knowledgeContext: ReadingKnowledgeContext;
  executiveSummary: string;
  destinyAnalysis: string;
  lifePathAnalysis: string;
  behavioralDynamics: string;
  missingNumberRemedies: string;
  strategicGuidance: string;
}
