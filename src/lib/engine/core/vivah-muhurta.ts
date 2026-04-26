// src/lib/engine/core/vivah-muhurta.ts
// Vivah Muhurta — Marriage Date Discovery Engine

import { calculatePanchang, PanchangData } from './panchang';

export interface VivahMuhurtaInput {
  searchStart: Date;
  searchEnd: Date;
  lat: number;
  lng: number;
  timezone: string;
}

export interface MarriageDateResult {
  date: string;
  score: number;
  panchang: PanchangData;
  reasons: string[];
}

export async function findMarriageDates(input: VivahMuhurtaInput): Promise<MarriageDateResult[]> {
  const results: MarriageDateResult[] = [];
  const current = new Date(input.searchStart);
  
  // Limit search to 366 days for performance
  const limit = Math.min(366, (input.searchEnd.getTime() - input.searchStart.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i < limit; i++) {
    const checkDate = new Date(current.getTime() + i * 24 * 60 * 60 * 1000);
    const p = await calculatePanchang(checkDate, input.lat, input.lng, input.timezone, "Search City");
    
    const { isAuspicious, reasons, score } = checkVivahRules(p);
    
    if (isAuspicious) {
      results.push({
        date: checkDate.toISOString(),
        score,
        panchang: p,
        reasons
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

function checkVivahRules(p: PanchangData): { isAuspicious: boolean; reasons: string[]; score: number } {
  const reasons: string[] = [];
  let score = 0;
  let isAuspicious = true;

  // 1. Mandatory Tithis
  const validTithis = [2, 3, 5, 7, 10, 11, 12, 13, 15];
  if (!validTithis.includes(p.tithi.number)) {
    isAuspicious = false;
  } else {
    reasons.push(`Auspicious Tithi: ${p.tithi.name}`);
    score += 30;
  }

  // 2. Mandatory Nakshatras
  const validNaks = ['Rohini', 'Mrigashira', 'Magha', 'Uttara Phalguni', 'Hasta', 'Swati', 'Anuradha', 'Mula', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'];
  if (!validNaks.includes(p.nakshatra.name)) {
    isAuspicious = false;
  } else {
    reasons.push(`Strong Nakshatra: ${p.nakshatra.name}`);
    score += 40;
  }

  // 3. Prohibited Days
  if (p.vara.day === 'Tuesday' || p.vara.day === 'Sunday') {
    isAuspicious = false;
  } else {
    score += 20;
  }

  // 4. Yoga Quality
  if (p.yoga.quality === 'auspicious') {
    score += 10;
  } else {
    isAuspicious = false; // Vivah usually requires auspicious yoga
  }

  return { isAuspicious, reasons, score };
}
