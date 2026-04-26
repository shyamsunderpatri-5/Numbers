/**
 * NUMERIQ.AI - Sovereign Math Utility
 * Deeply Integrated Chaldean & Lo Shu Mathematical Matrix
 */

import { CHALDEAN_LETTER_MAP } from "./chaldean-core-v1";

/**
 * Basic Chaldean Reduction
 */
export function reduce(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n === 0 ? 9 : n;
}

/**
 * Calculate Name Compound and Root
 */
export function calculateNameData(name: string) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  const compound = clean.split('').reduce((sum, ch) => sum + (CHALDEAN_LETTER_MAP[ch as keyof typeof CHALDEAN_LETTER_MAP] || 0), 0);
  const root = reduce(compound);
  return { compound, root, clean };
}

/**
 * Build Chaldean Grid (Frequency of 1-9 in Name)
 */
export function buildChaldeanGrid(name: string) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  clean.split('').forEach(ch => {
    const v = CHALDEAN_LETTER_MAP[ch as keyof typeof CHALDEAN_LETTER_MAP];
    if (v) grid[v]++;
  });
  return grid;
}

/**
 * Build Lo Shu Grid (3x3)
 * Standard layout: [4, 9, 2, 3, 5, 7, 8, 1, 6]
 */
export function buildLoShuGrid(day: number, month: number, year: number, nameRoot: number) {
  const dobDigits = `${day}${month}${year}`.split('').map(Number);
  const grid: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  
  // DOB Digits
  dobDigits.forEach(d => { if (d > 0) grid[d]++; });
  
  // Birth Number (Day root)
  grid[reduce(day)]++;
  
  // Life Path (Total root) - Using "Life Path" internally for math but avoiding in UI
  const total = day + month + String(year).split('').reduce((a,d)=>a+parseInt(d),0);
  grid[reduce(total)]++;
  
  // Name Root
  grid[nameRoot]++;

  return grid;
}

/**
 * Digital Identity Audit
 */
export function auditDigitalId(text: string) {
  const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let sum = 0;
  clean.split('').forEach(ch => {
    if (/[0-9]/.test(ch)) {
      sum += parseInt(ch);
    } else {
      sum += (CHALDEAN_LETTER_MAP[ch as keyof typeof CHALDEAN_LETTER_MAP] || 0);
    }
  });
  const compound = sum;
  const root = reduce(sum);
  return { compound, root };
}

/**
 * Synergy Check
 */
export function calculateSynergy(nameCompound1: number, nameCompound2: number, root1: number, root2: number) {
  // Compatibility Matrix (Chaldean Rules)
  const friendly: Record<number, number[]> = {
    1: [1, 3, 5, 9], 2: [2, 4, 6, 7], 3: [1, 3, 5, 6, 9],
    4: [2, 4, 8], 5: [1, 3, 5, 9], 6: [2, 3, 6, 9],
    7: [2, 7], 8: [4, 8], 9: [1, 3, 5, 6, 9]
  };

  const isFriendly = (friendly[root1] || []).includes(root2);
  let score = isFriendly ? 70 : 40;
  
  // Compound Harmony
  if (Math.abs(nameCompound1 - nameCompound2) % 9 === 0) score += 20;
  
  return Math.min(score, 99);
}

/**
 * Personal Year/Month/Day
 */
export function calculateTimeline(birthDay: number, birthMonth: number, targetDate: Date = new Date()) {
  const dayRoot = reduce(birthDay);
  const monthRoot = reduce(birthMonth);
  const yearRoot = reduce(targetDate.getFullYear());
  
  const personalYear = reduce(dayRoot + monthRoot + yearRoot);
  const personalMonth = reduce(personalYear + (targetDate.getMonth() + 1));
  const personalDay = reduce(personalMonth + targetDate.getDate());
  
  return { 
    personalYear,
    personalMonth,
    personalDay,
    targetDate: targetDate.toISOString()
  };
}

/**
 * Unified Analysis Engine
 */
export function analyze(name: string, dobString: string) {
  const dob = new Date(dobString);
  const day = dob.getUTCDate();
  const month = dob.getUTCMonth() + 1;
  const year = dob.getUTCFullYear();
  
  const nameData = calculateNameData(name);
  const grid = buildLoShuGrid(day, month, year, nameData.root);
  const chaldeanGrid = buildChaldeanGrid(name);
  
  const psychic = reduce(day);
  const destiny = reduce(day + month + String(year).split('').reduce((a,d)=>a+parseInt(d),0));
  const timeline = calculateTimeline(day, month);
  
  return {
    psychic,
    destiny,
    nameData,
    grid,
    chaldeanGrid,
    timeline
  };
}

/**
 * High-level Synergy Check
 */
export function checkSynergy(name1: string, name2: string) {
  const d1 = calculateNameData(name1);
  const d2 = calculateNameData(name2);
  const score = calculateSynergy(d1.compound, d2.compound, d1.root, d2.root);
  
  return {
    score,
    label: score > 80 ? "Sovereign Alignment" : score > 60 ? "Functional Synergy" : "Matrix Friction"
  };
}

/**
 * Name Reduction Helper
 */
export function reduceName(name: string): number {
  return calculateNameData(name).root;
}
