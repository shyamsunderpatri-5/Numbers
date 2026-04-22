/**
 * NUMERIQ.AI - Knowledge Base: Compatibility Matrix
 * Scores and high-level descriptions for all number pair interactions.
 */

export interface CompatibilityEntry {
  pair: string; // e.g., "1-1"
  score: number;
  label: 'very high' | 'high' | 'moderate' | 'low' | 'very low';
  oneSentence: string;
}

export const COMPATIBILITY_MATRIX: Record<string, CompatibilityEntry> = {
  "1-1": { pair: "1-1", score: 80, label: 'high', oneSentence: "A powerful but potentially competitive partnership of two leaders." },
  "1-2": { pair: "1-2", score: 95, label: 'very high', oneSentence: "A classic and harmonious balance of initiative and support." },
  "1-3": { pair: "1-3", score: 90, label: 'high', oneSentence: "An energetic and creative pairing full of social magnetism." },
  "1-4": { pair: "1-4", score: 60, label: 'moderate', oneSentence: "A hard-working pair that may clash over speed and structure." },
  "1-5": { pair: "1-5", score: 85, label: 'high', oneSentence: "An exciting and restless partnership built on variety and adventure." },
  "1-6": { pair: "1-6", score: 75, label: 'high', oneSentence: "A nurturing leadership dynamic that focuses on community and home." },
  "1-7": { pair: "1-7", score: 80, label: 'high', oneSentence: "An intellectually deep and private bond between two independent thinkers." },
  "1-8": { pair: "1-8", score: 50, label: 'low', oneSentence: "A powerhouse pairing at risk of intense power struggles and ego clashes." },
  "1-9": { pair: "1-9", score: 100, label: 'very high', oneSentence: "A visionary and compassionate duo that can accomplish global feats." },
  
  "2-2": { pair: "2-2", score: 70, label: 'moderate', oneSentence: "A very sensitive and supportive pair that may struggle with indecision." },
  "2-3": { pair: "2-3", score: 85, label: 'high', oneSentence: "A social and creative partnership that thrives on empathy and charm." },
  "2-4": { pair: "2-4", score: 95, label: 'very high', oneSentence: "An exceptionally stable and reliable anchor for any long-term goal." },
  "2-5": { pair: "2-5", score: 55, label: 'low', oneSentence: "A clash between the need for harmony (2) and the need for freedom (5)." },
  "2-6": { pair: "2-6", score: 100, label: 'very high', oneSentence: "One of the most loving and domestic partnerships possible." },
  "2-7": { pair: "2-7", score: 80, label: 'high', oneSentence: "A quiet, intuitive connection focused on soul-level understanding." },
  "2-8": { pair: "2-8", score: 70, label: 'moderate', oneSentence: "A traditional power dynamic that needs mutual role respect to thrive." },
  "2-9": { pair: "2-9", score: 90, label: 'high', oneSentence: "A compassionate and supportive pairing focused on service and love." },

  "3-3": { pair: "3-3", score: 75, label: 'high', oneSentence: "A fun-filled and creative pair that may struggle with grounding." },
  "3-4": { pair: "3-4", score: 50, label: 'low', oneSentence: "Friction between the desire for play (3) and the demand for work (4)." },
  "3-5": { pair: "3-5", score: 95, label: 'very high', oneSentence: "A magnetic and social powerhouse full of variety and excitement." },
  "3-6": { pair: "3-6", score: 85, label: 'high', oneSentence: "A harmonious and artistic domestic life full of social charm." },
  "3-7": { pair: "3-7", score: 55, label: 'low', oneSentence: "A clash between social energy (3) and the need for solitude (7)." },
  "3-8": { pair: "3-8", score: 70, label: 'moderate', oneSentence: "A combination of creativity and material ambition that needs focus." },
  "3-9": { pair: "3-9", score: 95, label: 'very high', oneSentence: "An inspiring and humanitarian pairing with massive social appeal." },

  "4-4": { pair: "4-4", score: 65, label: 'moderate', oneSentence: "Built to last but prone to extreme rigidity and lack of joy." },
  "4-5": { pair: "4-5", score: 45, label: 'very low', oneSentence: "Deep natural tension between discipline (4) and total freedom (5)." },
  "4-6": { pair: "4-6", score: 90, label: 'high', oneSentence: "A dependable and nurturing foundation for home and family." },
  "4-7": { pair: "4-7", score: 85, label: 'high', oneSentence: "A serious, focused pairing that values truth and stability." },
  "4-8": { pair: "4-8", score: 95, label: 'very high', oneSentence: "The ultimate business pairing, turning grand power into solid structures." },
  "4-9": { pair: "4-9", score: 60, label: 'moderate', oneSentence: "Clashes between the practical needs of the 4 and the ideals of the 9." },

  "5-5": { pair: "5-5", score: 70, label: 'moderate', oneSentence: "High-octane adventure that may lack any long-term stability." },
  "5-6": { pair: "5-6", score: 50, label: 'low', oneSentence: "Tension between the need to travel (5) and the need to come home (6)." },
  "5-7": { pair: "5-7", score: 75, label: 'high', oneSentence: "An intellectually curious and exploratory pair that values freedom." },
  "5-8": { pair: "5-8", score: 60, label: 'moderate', oneSentence: "A dynamic but stressful pairing of expansion and material power." },
  "5-9": { pair: "5-9", score: 90, label: 'high', oneSentence: "An expansive and global-minded duo built for travel and service." },

  "6-6": { pair: "6-6", score: 80, label: 'high', oneSentence: "A very domestic and caring pair, prone to over-responsibility." },
  "6-7": { pair: "6-7", score: 55, label: 'low', oneSentence: "Clashes between the need for family (6) and the need for solitude (7)." },
  "6-8": { pair: "6-8", score: 90, label: 'high', oneSentence: "A balanced power couple of material success and domestic harmony." },
  "6-9": { pair: "6-9", score: 95, label: 'very high', oneSentence: "The world-caretakers; a deeply loving and humanitarian pairing." },

  "7-7": { pair: "7-7", score: 60, label: 'moderate', oneSentence: "Profound wisdom but at the risk of total social and material isolation." },
  "7-8": { pair: "7-8", score: 50, label: 'low', oneSentence: "Tension between the seeker of truth (7) and the seeker of power (8)." },
  "7-9": { pair: "7-9", score: 90, label: 'high', oneSentence: "A spiritually deep and humanitarian bond focused on the big picture." },

  "8-8": { pair: "8-8", score: 40, label: 'very low', oneSentence: "Extremely intense dynamic prone to destructive power struggles." },
  "8-9": { pair: "8-9", score: 70, label: 'moderate', oneSentence: "A power-ideal dynamic that needs common values to stay balanced." },

  "9-9": { pair: "9-9", score: 85, label: 'high', oneSentence: "Massive charisma and humanitarian drive, but may neglect personal details." }
};

export function getCompatibilityEntry(n1: number, n2: number): CompatibilityEntry {
  const key1 = `${n1}-${n2}`;
  const key2 = `${n2}-${n1}`;
  return COMPATIBILITY_MATRIX[key1] || COMPATIBILITY_MATRIX[key2] || { 
    pair: key1, 
    score: 70, 
    label: 'moderate', 
    oneSentence: "A balanced interaction between two distinct numerical vibrations."
  };
}
