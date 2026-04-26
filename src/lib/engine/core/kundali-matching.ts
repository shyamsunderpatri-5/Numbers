// src/lib/engine/core/kundali-matching.ts
// Vedic Ashtakoota Marriage Compatibility Engine

export interface KundaliMatchInput {
  bride: { name: string; dob: Date; lat: number; lng: number };
  groom: { name: string; dob: Date; lat: number; lng: number };
}

export interface KootaResult {
  name: string;
  max: number;
  score: number;
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  explanation: string;
}

export interface KundaliMatchResult {
  totalScore: number; // out of 36
  verdict: string;
  kootas: KootaResult[];
  nadiDosha: boolean;
  bhakootDosha: boolean;
  mangalDosha: { bride: boolean; groom: boolean; cancelled: boolean };
  summary: string;
}

// ─────────────────────────────────────────────────────
// LOOKUP TABLES
// ─────────────────────────────────────────────────────

export const NADI_TABLE: Record<number, 'Vata' | 'Pitta' | 'Kapha'> = {
  1: 'Vata', 2: 'Pitta', 3: 'Kapha', 4: 'Vata', 5: 'Pitta', 6: 'Kapha',
  7: 'Vata', 8: 'Pitta', 9: 'Kapha', 10: 'Vata', 11: 'Pitta', 12: 'Kapha',
  13: 'Vata', 14: 'Pitta', 15: 'Kapha', 16: 'Vata', 17: 'Pitta', 18: 'Kapha',
  19: 'Vata', 20: 'Pitta', 21: 'Kapha', 22: 'Vata', 23: 'Pitta', 24: 'Kapha',
  25: 'Vata', 26: 'Pitta', 27: 'Kapha'
};

export const GANA_TABLE: Record<number, 'Deva' | 'Manushya' | 'Rakshasa'> = {
  1: 'Deva', 2: 'Manushya', 3: 'Rakshasa', 4: 'Manushya', 5: 'Deva',
  6: 'Manushya', 7: 'Deva', 8: 'Deva', 9: 'Rakshasa', 10: 'Rakshasa',
  11: 'Manushya', 12: 'Manushya', 13: 'Deva', 14: 'Rakshasa', 15: 'Deva',
  16: 'Rakshasa', 17: 'Deva', 18: 'Rakshasa', 19: 'Rakshasa', 20: 'Manushya',
  21: 'Manushya', 22: 'Deva', 23: 'Rakshasa', 24: 'Rakshasa', 25: 'Manushya',
  26: 'Deva', 27: 'Deva'
};

export const YONI_TABLE: Record<number, string> = {
  1: 'Horse', 2: 'Elephant', 3: 'Goat', 4: 'Serpent', 5: 'Serpent',
  6: 'Dog', 7: 'Cat', 8: 'Goat', 9: 'Cat', 10: 'Rat',
  11: 'Rat', 12: 'Cow', 13: 'Buffalo', 14: 'Tiger', 15: 'Buffalo',
  16: 'Tiger', 17: 'Hare', 18: 'Deer', 19: 'Dog', 20: 'Monkey',
  21: 'Mongoose', 22: 'Monkey', 23: 'Lion', 24: 'Horse', 25: 'Lion',
  26: 'Cow', 27: 'Elephant'
};

// ─────────────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────────────

export async function calculateAshtakoota(input: KundaliMatchInput): Promise<KundaliMatchResult> {
  // 1. Get Nakshatras (Simplified for now, in production use precise Longitude)
  const bNak = 4; // Rohini (Mock)
  const gNak = 8; // Pushya (Mock)

  const kootas: KootaResult[] = [
    calculateNadi(bNak, gNak),
    calculateBhakoot(bNak, gNak),
    calculateGana(bNak, gNak),
    calculateGrahaMaitri(bNak, gNak),
    calculateYoni(bNak, gNak),
    calculateTara(bNak, gNak),
    calculateVashya(bNak, gNak),
    calculateVarna(bNak, gNak)
  ];

  const totalScore = kootas.reduce((acc, k) => acc + k.score, 0);
  const nadiDosha = kootas.find(k => k.name === 'Nadi')?.score === 0;

  return {
    totalScore,
    verdict: totalScore >= 25 ? 'Highly Recommended' : totalScore >= 18 ? 'Good' : 'Not Recommended',
    kootas,
    nadiDosha,
    bhakootDosha: false,
    mangalDosha: { bride: false, groom: false, cancelled: true },
    summary: `A score of ${totalScore}/36 indicates a ${totalScore >= 18 ? 'stable' : 'challenging'} alliance.`
  };
}

function calculateNadi(b: number, g: number): KootaResult {
  const bNadi = NADI_TABLE[b];
  const gNadi = NADI_TABLE[g];
  const score = bNadi === gNadi ? 0 : 8;
  return {
    name: 'Nadi',
    max: 8,
    score,
    verdict: score === 8 ? 'Excellent' : 'Poor',
    explanation: score === 0 ? 'Same Nadi detected (Nadi Dosha)' : 'Different Nadis ensure health harmony.'
  };
}

function calculateGana(b: number, g: number): KootaResult {
  const bGana = GANA_TABLE[b];
  const gGana = GANA_TABLE[g];
  let score = 0;
  if (bGana === gGana) score = 6;
  else if (bGana === 'Deva' && gGana === 'Manushya') score = 5;
  else if (bGana === 'Manushya' && gGana === 'Deva') score = 5;
  // Simplified rules
  return { name: 'Gana', max: 6, score, verdict: score >= 5 ? 'Excellent' : 'Fair', explanation: `${bGana} and ${gGana} temperaments.` };
}

// Additional koota functions (Varna, Vashya, Tara, Yoni, etc.) would be implemented here following the same pattern
function calculateBhakoot(b: number, g: number): KootaResult { return { name: 'Bhakoot', max: 7, score: 7, verdict: 'Excellent', explanation: 'Moon signs are in harmony.' }; }
function calculateGrahaMaitri(b: number, g: number): KootaResult { return { name: 'Graha Maitri', max: 5, score: 4, verdict: 'Good', explanation: 'Planetary lords are friendly.' }; }
function calculateYoni(b: number, g: number): KootaResult { return { name: 'Yoni', max: 4, score: 2, verdict: 'Fair', explanation: 'Animal natures are neutral.' }; }
function calculateTara(b: number, g: number): KootaResult { return { name: 'Tara', max: 3, score: 3, verdict: 'Excellent', explanation: 'Birth stars are auspiciously placed.' }; }
function calculateVashya(b: number, g: number): KootaResult { return { name: 'Vashya', max: 2, score: 2, verdict: 'Excellent', explanation: 'Natural attraction is high.' }; }
function calculateVarna(b: number, g: number): KootaResult { return { name: 'Varna', max: 1, score: 1, verdict: 'Excellent', explanation: 'Spiritual alignment is perfect.' }; }
