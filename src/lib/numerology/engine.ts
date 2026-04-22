/**
 * NUMERIQ.AI - Calculation Engine (Core Math Layer)
 * 18 Deterministic Functions for Chaldean Numerology.
 * Following Ancient Mathematical Science. Zero AI involvement.
 */

import { CHALDEAN_MAP, QUALITY_MAP } from "./mapping";
import { normalizeName, splitIntoParts, isVowel } from "./normalize";
import { reduceNumber, getNumberQuality } from "./number-quality";
import {
  NameNumberResult,
  LifePathResult,
  BirthDayResult,
  SoulUrgeResult,
  PersonalityResult,
  PersonalYearResult,
  PersonalMonthResult,
  PersonalDayResult,
  MissingNumbersResult,
  KarmicPatternResult,
  CompatibilityResult,
  LuckyNumbersResult,
  LuckyDateResult,
  CoreNumbers,
  FullReadingResult,
  PatternMeaning,
  NumberQuality
} from "./types";

export { normalizeName } from "./normalize";

/**
 * B) letterToChaldeanValue(letter: string): number | null
 * Maps a single character to its Chaldean numerical vibration.
 */
export function letterToChaldeanValue(letter: string): number | null {
  const char = letter.toUpperCase();
  return CHALDEAN_MAP[char] || null;
}

/**
 * C) computeNameNumber(name: string): NameNumberResult
 * Calculates the Compound and Reduced numbers for a full name.
 * Every letter light-up proof is derived from the 'parts' array here.
 */
export function computeNameNumber(name: string): NameNumberResult {
  const normalized = normalizeName(name);
  const nameParts = splitIntoParts(normalized);

  const partResults = nameParts.map(part => {
    const letters = part.split("");
    const compound = letters.reduce((sum, char) => sum + (letterToChaldeanValue(char) || 0), 0);
    return {
      name: part,
      compound,
      reduced: reduceNumber(compound)
    };
  });

  const totalCompound = partResults.reduce((sum, p) => sum + p.compound, 0);

  return {
    full: totalCompound,
    compound: totalCompound,
    reduced: reduceNumber(totalCompound),
    parts: partResults
  };
}

/**
 * D) computeLifePath(dob: Date, mode: 'standard' | 'lagan' = 'standard'): LifePathResult
 * Calculates the Life Path. 
 * 'standard': Day + Month + Year
 * 'lagan': Day + Month (Used in Heather Lagan's celebrity examples)
 */
export function computeLifePath(dob: Date, mode: 'standard' | 'lagan' = 'standard'): LifePathResult {
  const day = dob.getUTCDate();
  const month = dob.getUTCMonth() + 1;
  const year = dob.getUTCFullYear();

  const sumDigits = (n: number): number =>
    n.toString().split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  let total: number;
  if (mode === 'lagan') {
    total = day + month;
  } else {
    total = sumDigits(day) + sumDigits(month) + sumDigits(year);
  }

  return {
    compound: total,
    reduced: reduceNumber(total)
  };
}

/**
 * E) computeBirthDayNumber(dob: Date): BirthDayResult
 * The day of birth reduced to a single digit or master number.
 */
export function computeBirthDayNumber(dob: Date): BirthDayResult {
  return {
    reduced: reduceNumber(dob.getUTCDate())
  };
}

/**
 * F) computeSoulUrgeNumber(name: string): SoulUrgeResult
 * Sum of vowel values in the name.
 */
export function computeSoulUrgeNumber(name: string): SoulUrgeResult {
  const normalized = normalizeName(name);
  const nameParts = splitIntoParts(normalized);
  
  let total = 0;
  nameParts.forEach(part => {
    part.split("").forEach(char => {
      if (isVowel(char, part)) {
        total += (letterToChaldeanValue(char) || 0);
      }
    });
  });
  
  return {
    reduced: reduceNumber(total)
  };
}

/**
 * G) computePersonalityNumber(name: string): PersonalityResult
 * Sum of consonant values in the name.
 */
export function computePersonalityNumber(name: string): PersonalityResult {
  const normalized = normalizeName(name);
  const nameParts = splitIntoParts(normalized);
  
  let total = 0;
  nameParts.forEach(part => {
    part.split("").forEach(char => {
      if (!isVowel(char, part)) {
        total += (letterToChaldeanValue(char) || 0);
      }
    });
  });
  
  return {
    reduced: reduceNumber(total)
  };
}

/**
 * H) computePersonalYear(dob: Date, targetYear: number): PersonalYearResult
 */
export function computePersonalYear(dob: Date, targetYear: number): PersonalYearResult {
  const day = dob.getUTCDate();
  const month = dob.getUTCMonth() + 1;

  const sumDigits = (n: number): number =>
    n.toString().split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);

  const total = sumDigits(day) + sumDigits(month) + sumDigits(targetYear);

  return {
    reduced: reduceNumber(total)
  };
}

/**
 * I) computePersonalMonth(dob: Date, targetDate?: Date): PersonalMonthResult
 */
export function computePersonalMonth(dob: Date, targetDate = new Date()): PersonalMonthResult {
  const py = computePersonalYear(dob, targetDate.getUTCFullYear()).reduced;
  const month = targetDate.getUTCMonth() + 1;
  return {
    reduced: reduceNumber(py + month)
  };
}

/**
 * J) computePersonalDay(dob: Date, targetDate?: Date): PersonalDayResult
 */
export function computePersonalDay(dob: Date, targetDate = new Date()): PersonalDayResult {
  const pm = computePersonalMonth(dob, targetDate).reduced;
  const day = targetDate.getUTCDate();
  return {
    reduced: reduceNumber(pm + day)
  };
}

/**
 * NEW: Traditional Chaldean Metadata
 */
export function computeTraditionalAnalysis(name: string): { 
  passion: number; 
  cornerstone: string; 
  capstone: string; 
  intensity: Record<number, number> 
} {
  const normalized = normalizeName(name);
  const parts = splitIntoParts(normalized);
  const firstPart = parts[0] || "";
  
  const intensities: Record<number, number> = {};
  normalized.split("").forEach(c => {
    const v = letterToChaldeanValue(c);
    if (v) intensities[v] = (intensities[v] || 0) + 1;
  });
  
  let passion = 1;
  let maxCount = 0;
  Object.entries(intensities).forEach(([num, count]) => {
    if (count > maxCount) {
      maxCount = count;
      passion = Number(num);
    }
  });

  return {
    passion,
    cornerstone: firstPart[0] || "",
    capstone: firstPart[firstPart.length - 1] || "",
    intensity: intensities
  };
}

/**
 * K) computeKarmicPatterns(allNumbers: CoreNumbers): KarmicPatternResult
 * Identifies 13, 14, 16, 19 in major positions.
 */
export function computeKarmicPatterns(allNumbers: CoreNumbers): KarmicPatternResult {
  const patterns: PatternMeaning[] = [];
  const check = (n: number) => {
    if (n === 13) patterns.push({ patternNumber: 13, meaning: "Regeneration or Change. It is a number of upheaval and destruction, but it also carries the symbol of Power which, if wrongly used, wreaks destruction upon itself. It is a warning of the unknown and the unexpected.", practicalAdvice: "Focus on the divine discipline of your work to avoid the destructive potential of this frequency." });
    if (n === 14) patterns.push({ patternNumber: 14, meaning: "Movement and Challenge. It is generally lucky for money and business changes, but it involves significant risk and danger—often from the actions of others. It requires extreme caution.", practicalAdvice: "Act with prudence; avoid speculative risks unless you have absolute control over the movement." });
    if (n === 16) patterns.push({ patternNumber: 16, meaning: "The Shattered Citadel. Symbolized by a Tower struck by Lightning. It warns of strange fatalities, danger of accidents, and the sudden defeat of one's plans. It is a powerful warning against ego and pride.", practicalAdvice: "Build your plans on selfless, spiritual foundations to prevent the 'shattered tower' archetype." });
    if (n === 19) patterns.push({ patternNumber: 19, meaning: "The Prince of Heaven. Regarded as extremely fortunate and favorable. It promises happiness, success, esteem, and honor in the person's future.", practicalAdvice: "Embrace the success and honors coming your way with gratitude—this is a vibration of ultimate promise." });
  };

  [allNumbers.destinyCompound, allNumbers.lifePathCompound].forEach(check);
  return { patterns };
}

/**
 * L) computeMissingNumbers(name: string): MissingNumbersResult
 * Finds which frequencies (1-8) are absent from the name.
 */
export function computeMissingNumbers(name: string): MissingNumbersResult {
  const normalized = normalizeName(name);
  const intensity: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

  normalized.split("").forEach(char => {
    const val = letterToChaldeanValue(char);
    if (val && val >= 1 && val <= 8) {
      intensity[val]++;
    }
  });

  const missing = Object.keys(intensity).map(Number).filter(n => intensity[n] === 0);
  const present = Object.keys(intensity).map(Number).filter(n => intensity[n] > 0);

  return { missing, present, intensity };
}

/**
 * M) computeCompatibility(numA: number, numB: number): CompatibilityResult
 */
export function computeCompatibility(numA: number, numB: number): CompatibilityResult {
  const matrix: Record<string, number> = {
    "1-1": 80, "1-2": 90, "1-3": 95, "1-4": 60, "1-5": 85, "1-6": 70, "1-7": 80, "1-8": 50, "1-9": 100,
    "2-2": 70, "2-3": 85, "2-4": 90, "2-5": 60, "2-6": 80, "2-7": 95, "2-8": 70, "2-9": 75,
    "3-3": 90, "3-4": 50, "3-5": 95, "3-6": 70, "3-7": 85, "3-8": 60, "3-9": 100,
    "4-4": 80, "4-5": 50, "4-6": 90, "4-7": 85, "4-8": 95, "4-9": 60,
    "5-5": 90, "5-6": 60, "5-7": 80, "5-8": 70, "5-9": 85,
    "6-6": 85, "6-7": 60, "6-8": 80, "6-9": 95,
    "7-7": 90, "7-8": 50, "7-9": 85,
    "8-8": 70, "8-9": 60,
    "9-9": 95
  };

  const key1 = `${Math.min(numA, numB)}-${Math.max(numA, numB)}`;
  const score = matrix[key1] || 70;

  let harmony: CompatibilityResult["harmony"] = "moderate";
  if (score >= 95) harmony = "very high";
  else if (score >= 85) harmony = "high";
  else if (score >= 65) harmony = "moderate";
  else if (score >= 50) harmony = "low";
  else harmony = "very low";

  return { score, harmony };
}

/**
 * N) computeLuckyNumbers(core: CoreNumbers): LuckyNumbersResult
 */
export function computeLuckyNumbers(core: CoreNumbers): LuckyNumbersResult {
  const numbers = [core.destinyNumber, core.lifePathNumber, core.birthDayNumber].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  return { numbers };
}

/**
 * O) computeLuckyDates(dob: Date): LuckyDateResult[]
 * Focuses on dates that vibrate with the person's core profile.
 */
export function computeLuckyDates(dob: Date, mode: 'standard' | 'lagan' = 'standard'): LuckyDateResult[] {
  const lp = computeLifePath(dob, mode).reduced;
  const bd = computeBirthDayNumber(dob).reduced;
  
  const dates = [1, 10, 19, 28, lp, bd].filter((v, i, a) => v <= 31 && a.indexOf(v) === i);
  
  return dates.map(d => ({
    date: d,
    reason: d === lp ? "Aligns with your Life Path" : d === bd ? "Aligns with your Birth Day" : "Aligns with your internal solar frequency"
  }));
}

/**
 * P) computeNumberQuality(num: number): NumberQuality
 */
export function computeNumberQuality(num: number): NumberQuality {
  return getNumberQuality(num);
}

/**
 * Q) computeHarmonyScore(all: CoreNumbers): number
 */
export function computeHarmonyScore(all: CoreNumbers): number {
  if (all.destinyNumber === all.lifePathNumber) return 100;
  return computeCompatibility(all.destinyNumber, all.lifePathNumber).score;
}

/**
 * R) computeFullReading(name: string, dob: Date, options?: { mode?: 'standard' | 'lagan' }): FullReadingResult
 * MASTER FUNCTION - Orchestrates the entire calculation layer.
 */
export function computeFullReading(name: string, dob: Date, options: { mode?: 'standard' | 'lagan' } = {}): FullReadingResult {
  const mode = options.mode || 'standard';
  const nameResult = computeNameNumber(name);
  const lpResult = computeLifePath(dob, mode);
  const bd = computeBirthDayNumber(dob);
  const su = computeSoulUrgeNumber(name);
  const pers = computePersonalityNumber(name);

  const currentYear = new Date().getUTCFullYear();
  const py = computePersonalYear(dob, currentYear);
  const pm = computePersonalMonth(dob);
  const pd = computePersonalDay(dob);

  const core: CoreNumbers = {
    destinyNumber: nameResult.reduced,
    destinyCompound: nameResult.compound,
    lifePathNumber: lpResult.reduced,
    lifePathCompound: lpResult.compound,
    soulUrgeNumber: su.reduced,
    personalityNumber: pers.reduced,
    birthDayNumber: bd.reduced,
    personalYear: py.reduced,
    personalMonth: pm.reduced,
    personalDay: pd.reduced
  };

  const missing = computeMissingNumbers(name);
  const traditional = computeTraditionalAnalysis(name);
  const karmic = computeKarmicPatterns(core);
  const harmony = computeHarmonyScore(core);
  const luckyN = computeLuckyNumbers(core);
  const luckyD = computeLuckyDates(dob, mode);

  return {
    ...core,
    hiddenPassion: traditional.passion,
    cornerstone: traditional.cornerstone,
    capstone: traditional.capstone,
    bridgeNumber: Math.abs(core.soulUrgeNumber - core.personalityNumber),
    missingNumbers: missing.missing,
    karmicPatterns: karmic.patterns,
    intensityMap: traditional.intensity,
    harmonyScore: harmony,
    luckyNumbers: luckyN.numbers,
    luckyDates: luckyD.map(ld => ld.date)
  };
}
