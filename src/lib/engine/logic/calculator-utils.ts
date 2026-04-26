/**
 * CALCULATOR UTILS
 * Deterministic math for Chaldean Numerology and basic Vedic counters.
 */

export const CHALDEAN_LETTER_MAP: Record<string, number> = {
    'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':8, 'G':3, 'H':5, 'I':1,
    'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':7, 'P':8, 'Q':1, 'R':2,
    'S':3, 'T':4, 'U':6, 'V':6, 'W':6, 'X':5, 'Y':1, 'Z':7
};

/**
 * Reduces a number to its single-digit root (1-9)
 */
export function reduceToRoot(num: number): number {
  if (num === 0) return 0;
  return num % 9 || 9;
}

/**
 * Calculates Name Number (Expression) with word-by-word breakdown
 */
export function calculateNameNumber(name: string) {
  const words = name.toUpperCase().split(/\s+/).filter(w => w.length > 0);
  const wordDetails = words.map(word => {
    const values = [...word].map(c => CHALDEAN_LETTER_MAP[c] || 0);
    const compound = values.reduce((a, b) => a + b, 0);
    const root = reduceToRoot(compound);
    return { word, compound, root, breakdown: [...word].map(c => `${c}=${CHALDEAN_LETTER_MAP[c] || 0}`).join(', ') };
  });

  const totalCompound = wordDetails.reduce((sum, w) => sum + w.compound, 0);
  const totalRoot = reduceToRoot(totalCompound);

  return { 
    totalCompound, 
    totalRoot, 
    words: wordDetails 
  };
}

/**
 * Validates a DOB string and returns a Date object or throws error
 */
export function validateDOB(dob: string): Date {
  const date = new Date(dob);
  const [year, month, day] = dob.split('-').map(Number);
  
  // Check for JS auto-correction (e.g., Feb 30 -> March 2)
  if (date.getFullYear() !== year || (date.getMonth() + 1) !== month || date.getDate() !== day) {
    throw new Error(`INVALID_DATE: The date ${dob} does not exist in the calendar.`);
  }
  return date;
}

/**
 * Calculates Birth Number (Day of birth)
 */
export function calculateBirthNumber(dob: string): number {
  const date = validateDOB(dob);
  return reduceToRoot(date.getDate());
}

/**
 * Calculates Destiny Number (Full DOB)
 */
export function calculateDestinyNumber(dob: string): number {
  const clean = dob.replace(/[^0-9]/g, '');
  const sum = [...clean].reduce((a, b) => a + parseInt(b), 0);
  return reduceToRoot(sum);
}

/**
 * Calculates Personal Year
 */
export function calculatePersonalYear(dob: string, currentYear: number = new Date().getFullYear()): number {
  const date = validateDOB(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const sum = day + month + reduceToRoot(currentYear);
  return reduceToRoot(sum);
}

/**
 * Calculates Personal Month
 */
export function calculatePersonalMonth(dob: string, currentYear: number, currentMonth: number): number {
  const py = calculatePersonalYear(dob, currentYear);
  return reduceToRoot(py + reduceToRoot(currentMonth));
}

/**
 * Calculates Personal Day
 */
export function calculatePersonalDay(dob: string, currentYear: number, currentMonth: number, currentDay: number): number {
  const pm = calculatePersonalMonth(dob, currentYear, currentMonth);
  return reduceToRoot(pm + reduceToRoot(currentDay));
}

/**
 * Planetary Friendship Matrix
 * 1=Sun, 2=Moon, 3=Jupiter, 4=Rahu, 5=Mercury, 6=Venus, 7=Ketu, 8=Saturn, 9=Mars
 */
export const PLANET_RELATIONSHIPS: Record<number, { friends: number[], enemies: number[] }> = {
  1: { friends: [2, 3, 9], enemies: [7, 8] },
  2: { friends: [1, 5], enemies: [4, 7, 8] },
  3: { friends: [1, 2, 9], enemies: [6, 5] },
  4: { friends: [5, 6, 8], enemies: [1, 2, 9] },
  5: { friends: [1, 6], enemies: [2] },
  6: { friends: [5, 4, 8], enemies: [1, 2, 3] },
  7: { friends: [5, 6, 8], enemies: [1, 2, 9] },
  8: { friends: [5, 6, 4], enemies: [1, 2, 9] },
  9: { friends: [1, 2, 3], enemies: [5, 7, 8] }
};

export function getPlanetaryRelationship(p1: number, p2: number): 'Friendly' | 'Enemy' | 'Neutral' {
  if (PLANET_RELATIONSHIPS[p1]?.friends.includes(p2)) return 'Friendly';
  if (PLANET_RELATIONSHIPS[p1]?.enemies.includes(p2)) return 'Enemy';
  return 'Neutral';
}
