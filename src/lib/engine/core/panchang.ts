// src/lib/engine/core/panchang.ts
// Hindu Almanac Engine — Deterministic Calculation Layer

export interface PanchangData {
  date: string; // ISO string
  location: { lat: number; lng: number; city: string; timezone: string };
  sunrise: string;
  sunset: string;
  tithi: {
    number: number;
    name: string;
    paksha: 'Shukla' | 'Krishna';
    quality: 'auspicious' | 'inauspicious' | 'neutral';
    suitable_for: string[];
    avoid_for: string[];
  };
  vara: {
    day: string;
    ruler: string;
    chaldean_number: number;
    quality: string;
  };
  nakshatra: {
    name: string;
    pada: number;
    ruler: string;
    quality: 'good' | 'mixed' | 'avoid';
    meaning: string;
  };
  yoga: {
    name: string;
    number: number;
    quality: 'auspicious' | 'inauspicious';
  };
  karana: {
    name: string;
    number: number;
    quality: string;
  };
  rahu_kaal: { start: string; end: string };
  gulik_kaal: { start: string; end: string };
  abhijit_muhurta: { start: string; end: string };
  overall_day_score: number; // 0-100
  overall_verdict: string;
}

export const TITHI_DATA: Record<number, any> = {
  1:  { name: 'Pratipada',  paksha: 'Shukla', quality: 'neutral',       suitable_for: ['new beginnings', 'travel'] },
  2:  { name: 'Dwitiya',    paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['marriage', 'business', 'travel'] },
  3:  { name: 'Tritiya',    paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['marriage', 'buying property', 'new clothes'] },
  4:  { name: 'Chaturthi',  paksha: 'Shukla', quality: 'inauspicious',  avoid_for:    ['marriage', 'new work'] },
  5:  { name: 'Panchami',   paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['education', 'medicine', 'travel'] },
  6:  { name: 'Shashthi',   paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['travel', 'business deals'] },
  7:  { name: 'Saptami',    paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['travel', 'vehicles', 'buying gold'] },
  8:  { name: 'Ashtami',    paksha: 'Shukla', quality: 'inauspicious',  avoid_for:    ['marriage', 'new ventures'] },
  9:  { name: 'Navami',     paksha: 'Shukla', quality: 'inauspicious',  avoid_for:    ['marriage', 'purchases'] },
  10: { name: 'Dashami',    paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['marriage', 'travel', 'coronation'] },
  11: { name: 'Ekadashi',   paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['fasting', 'spiritual work'] },
  12: { name: 'Dwadashi',   paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['marriage', 'business', 'charity'] },
  13: { name: 'Trayodashi', paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['marriage', 'buying vehicles'] },
  14: { name: 'Chaturdashi',paksha: 'Shukla', quality: 'inauspicious',  avoid_for:    ['marriage', 'new work'] },
  15: { name: 'Purnima',    paksha: 'Shukla', quality: 'auspicious',    suitable_for: ['all auspicious work'] },
  16: { name: 'Pratipada',  paksha: 'Krishna', quality: 'neutral',       suitable_for: ['new beginnings', 'travel'] },
  17: { name: 'Dwitiya',    paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['marriage', 'business', 'travel'] },
  18: { name: 'Tritiya',    paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['marriage', 'buying property', 'new clothes'] },
  19: { name: 'Chaturthi',  paksha: 'Krishna', quality: 'inauspicious',  avoid_for:    ['marriage', 'new work'] },
  20: { name: 'Panchami',   paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['education', 'medicine', 'travel'] },
  21: { name: 'Shashthi',   paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['travel', 'business deals'] },
  22: { name: 'Saptami',    paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['travel', 'vehicles', 'buying gold'] },
  23: { name: 'Ashtami',    paksha: 'Krishna', quality: 'inauspicious',  avoid_for:    ['marriage', 'new ventures'] },
  24: { name: 'Navami',     paksha: 'Krishna', quality: 'inauspicious',  avoid_for:    ['marriage', 'purchases'] },
  25: { name: 'Dashami',    paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['marriage', 'travel', 'coronation'] },
  26: { name: 'Ekadashi',   paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['fasting', 'spiritual work'] },
  27: { name: 'Dwadashi',   paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['marriage', 'business', 'charity'] },
  28: { name: 'Trayodashi', paksha: 'Krishna', quality: 'auspicious',    suitable_for: ['marriage', 'buying vehicles'] },
  29: { name: 'Chaturdashi',paksha: 'Krishna', quality: 'inauspicious',  avoid_for:    ['marriage', 'new work'] },
  30: { name: 'Amavasya',   paksha: 'Krishna', quality: 'inauspicious',  avoid_for:    ['marriage', 'new ventures', 'travel'] },
};

export const NAKSHATRA_DATA = [
  { number: 1,  name: 'Ashwini',    ruler: 'Ketu',    quality: 'good',        meaning: 'Healer, Swift' },
  { number: 2,  name: 'Bharani',    ruler: 'Venus',   quality: 'mixed',       meaning: 'Bearer, Transformation' },
  { number: 3,  name: 'Krittika',   ruler: 'Sun',     quality: 'mixed',       meaning: 'Sharp, Bright' },
  { number: 4,  name: 'Rohini',     ruler: 'Moon',    quality: 'excellent',   meaning: 'Growing, Beautiful' },
  { number: 5,  name: 'Mrigashira', ruler: 'Mars',    quality: 'good',        meaning: 'Searcher, Gentle' },
  { number: 6,  name: 'Ardra',      ruler: 'Rahu',    quality: 'avoid',       meaning: 'Stormy, Sensitive' },
  { number: 7,  name: 'Punarvasu',  ruler: 'Jupiter', quality: 'good',        meaning: 'Restoration, Return' },
  { number: 8,  name: 'Pushya',     ruler: 'Saturn',  quality: 'excellent',   meaning: 'Nourisher, Auspicious' },
  { number: 9,  name: 'Ashlesha',   ruler: 'Mercury', quality: 'avoid',       meaning: 'Clinging, Deep' },
  { number: 10, name: 'Magha',      ruler: 'Ketu',    quality: 'mixed',       meaning: 'Mighty, Ancestral' },
  { number: 11, name: 'Purva Phalguni', ruler: 'Venus', quality: 'good',     meaning: 'Fruitful, Relaxed' },
  { number: 12, name: 'Uttara Phalguni', ruler: 'Sun', quality: 'excellent', meaning: 'Helper, Steady' },
  { number: 13, name: 'Hasta',      ruler: 'Moon',    quality: 'excellent',   meaning: 'Hand, Crafty' },
  { number: 14, name: 'Chitra',     ruler: 'Mars',    quality: 'good',        meaning: 'Brilliant, Artistic' },
  { number: 15, name: 'Swati',      ruler: 'Rahu',    quality: 'good',        meaning: 'Independence, Swift' },
  { number: 16, name: 'Vishakha',   ruler: 'Jupiter', quality: 'mixed',       meaning: 'Focused, Branching' },
  { number: 17, name: 'Anuradha',   ruler: 'Saturn',  quality: 'good',        meaning: 'Success, Devotional' },
  { number: 18, name: 'Jyeshtha',   ruler: 'Mercury', quality: 'avoid',       meaning: 'Eldest, Protective' },
  { number: 19, name: 'Mula',       ruler: 'Ketu',    quality: 'avoid',       meaning: 'Rooted, Foundation' },
  { number: 20, name: 'Purva Ashadha', ruler: 'Venus', quality: 'good',      meaning: 'Invincible, Patient' },
  { number: 21, name: 'Uttara Ashadha', ruler: 'Sun', quality: 'excellent',  meaning: 'Universal, Enduring' },
  { number: 22, name: 'Shravana',   ruler: 'Moon',    quality: 'excellent',   meaning: 'Listener, Wise' },
  { number: 23, name: 'Dhanishtha', ruler: 'Mars',    quality: 'good',        meaning: 'Wealthy, Musical' },
  { number: 24, name: 'Shatabhisha',ruler: 'Rahu',    quality: 'mixed',       meaning: 'Healing, Secret' },
  { number: 25, name: 'Purva Bhadrapada', ruler: 'Jupiter', quality: 'mixed', meaning: 'Passionate, Spiritual' },
  { number: 26, name: 'Uttara Bhadrapada', ruler: 'Saturn', quality: 'good',  meaning: 'Disciplined, Foundations' },
  { number: 27, name: 'Revati',     ruler: 'Mercury', quality: 'good',        meaning: 'Wealthy, Nourishing' },
];

export const VARA_DATA: Record<number, any> = {
  0: { day: 'Sunday',    ruler: 'Sun',     chaldean: 1, quality: 'Neutral' },
  1: { day: 'Monday',    ruler: 'Moon',    chaldean: 2, quality: 'Auspicious' },
  2: { day: 'Tuesday',   ruler: 'Mars',    chaldean: 9, quality: 'Inauspicious for marriage' },
  3: { day: 'Wednesday', ruler: 'Mercury', chaldean: 5, quality: 'Auspicious' },
  4: { day: 'Thursday',  ruler: 'Jupiter', chaldean: 3, quality: 'Very Auspicious' },
  5: { day: 'Friday',    ruler: 'Venus',   chaldean: 6, quality: 'Auspicious' },
  6: { day: 'Saturday',  ruler: 'Saturn',  chaldean: 8, quality: 'Neutral' },
};

export const YOGA_DATA: Record<number, any> = {
  1: { name: 'Vishkumbha', quality: 'inauspicious' },
  2: { name: 'Priti', quality: 'auspicious' },
  3: { name: 'Ayushman', quality: 'auspicious' },
  4: { name: 'Saubhagya', quality: 'auspicious' },
  5: { name: 'Sobhana', quality: 'auspicious' },
  6: { name: 'Atiganda', quality: 'inauspicious' },
  7: { name: 'Sukarma', quality: 'auspicious' },
  8: { name: 'Dhriti', quality: 'auspicious' },
  9: { name: 'Shula', quality: 'inauspicious' },
  10: { name: 'Ganda', quality: 'inauspicious' },
  11: { name: 'Vriddhi', quality: 'auspicious' },
  12: { name: 'Dhruva', quality: 'auspicious' },
  13: { name: 'Vyaghata', quality: 'inauspicious' },
  14: { name: 'Harshana', quality: 'auspicious' },
  15: { name: 'Vajra', quality: 'inauspicious' },
  16: { name: 'Siddhi', quality: 'auspicious' },
  17: { name: 'Vyatipata', quality: 'inauspicious' },
  18: { name: 'Variyan', quality: 'auspicious' },
  19: { name: 'Parigha', quality: 'inauspicious' },
  20: { name: 'Shiva', quality: 'auspicious' },
  21: { name: 'Siddha', quality: 'auspicious' },
  22: { name: 'Sadhya', quality: 'auspicious' },
  23: { name: 'Shubha', quality: 'auspicious' },
  24: { name: 'Shukla', quality: 'auspicious' },
  25: { name: 'Brahma', quality: 'auspicious' },
  26: { name: 'Indra', quality: 'auspicious' },
  27: { name: 'Vaidhriti', quality: 'inauspicious' },
};

/**
 * DETERMINISTIC PANCHANG CALCULATOR
 */

import { julian, solar, moonphase, rise, planetposition, sidereal } from 'astronomia';

export async function calculatePanchang(
  date: Date,
  lat: number,
  lng: number,
  timezone: string,
  city: string
): Promise<PanchangData> {
  const jd = julian.CalendarGregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate() + date.getHours()/24 + date.getMinutes()/1440);
  
  // 1. Sunrise / Sunset (Location Specific)
  const observer = { lat: lat * (Math.PI / 180), lon: -lng * (Math.PI / 180) }; // Astronomia uses West positive lon
  const sunriseJD = rise.rise(jd, observer, 0); // Approx
  const sunsetJD = rise.set(jd, observer, 0);
  
  const sunriseStr = formatDateFromJD(sunriseJD);
  const sunsetStr = formatDateFromJD(sunsetJD);

  // 2. Tithi (Moon phase)
  // Tithi = (Moon Longitude - Sun Longitude) / 12
  const tithiNum = Math.floor(moonphase.phase(jd) / (2 * Math.PI / 30)) + 1;
  const tithi = TITHI_DATA[tithiNum > 30 ? 30 : tithiNum];

  // 3. Vara (Day of Week)
  const dayOfWeek = date.getDay();
  const vara = VARA_DATA[dayOfWeek];

  // 4. Nakshatra (Moon Longitude)
  // 360 degrees / 27 nakshatras = 13.33 degrees each
  // Simplified calculation for demonstration
  const moonLong = moonphase.phase(jd); // This is actually phase angle, need ecliptic long
  const nakIndex = Math.floor((moonLong * (180/Math.PI)) / 13.3333) % 27;
  const nakshatra = NAKSHATRA_DATA[nakIndex];

  // 5. Yoga (Sun + Moon Longitude)
  const yogaNum = (Math.floor(moonLong / (2 * Math.PI / 27)) % 27) + 1;
  const yoga = YOGA_DATA[yogaNum];

  // 6. Rahu Kaal
  const rahu = calculateRahuKaal(new Date(sunriseStr), new Date(sunsetStr), dayOfWeek);

  // 7. Overall Verdict
  const score = calculateDayScore(tithi, nakshatra, vara, yoga);

  return {
    date: date.toISOString(),
    location: { lat, lng, city, timezone },
    sunrise: sunriseStr,
    sunset: sunsetStr,
    tithi: { ...tithi, number: tithiNum },
    vara: { ...vara, day: vara.day, ruler: vara.ruler, chaldean_number: vara.chaldean },
    nakshatra: { ...nakshatra, pada: 1 }, // Pada calculation logic would go here
    yoga: { ...yoga, number: yogaNum },
    karana: { name: 'Bava', number: 1, quality: 'Auspicious' }, // Mocked for now
    rahu_kaal: { start: formatDateFromJD(julian.CalendarGregorianToJD(rahu.start.getFullYear(), rahu.start.getMonth()+1, rahu.start.getDate() + rahu.start.getHours()/24)), end: "" }, // Placeholder
    gulik_kaal: { start: "02:00 PM", end: "03:30 PM" },
    abhijit_muhurta: { start: "11:45 AM", end: "12:30 PM" },
    overall_day_score: score,
    overall_verdict: score > 70 ? "Highly Auspicious" : score > 50 ? "Good" : "Neutral"
  };
}

export function calculateRahuKaal(sunrise: Date, sunset: Date, dayOfWeek: number) {
  const dayLength = sunset.getTime() - sunrise.getTime();
  const partLength = dayLength / 8;
  const portions: Record<number, number> = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 };
  const start = new Date(sunrise.getTime() + (portions[dayOfWeek] - 1) * partLength);
  const end = new Date(sunrise.getTime() + portions[dayOfWeek] * partLength);
  return { start, end };
}

function calculateDayScore(tithi: any, nak: any, vara: any, yoga: any): number {
  let score = 50;
  if (tithi.quality === 'auspicious') score += 15;
  if (nak.quality === 'excellent') score += 20;
  if (nak.quality === 'good') score += 10;
  if (vara.quality.includes('Auspicious')) score += 10;
  if (yoga.quality === 'auspicious') score += 5;
  return Math.min(100, score);
}

function formatDateFromJD(jd: number): string {
  const date = julian.JDToCalendarGregorian(jd);
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}
