/**
 * NUMERIQ.AI - Number Quality Deterministic Logic
 * Categorizes numbers based on their mathematical vibration.
 */

import { NumberQuality } from "./types";
import { NUMBER_KNOWLEDGE } from "./knowledge/numbers-1-9";
import { COMPOUND_MEANINGS } from "./knowledge/compounds-10-52";

export function getNumberQuality(num: number): NumberQuality {
  // Check Compounds 10-52
  if (COMPOUND_MEANINGS[num]) {
    return COMPOUND_MEANINGS[num].isFavorable ? 'favorable' : 'challenging';
  }

  // Check Singles 1-9
  if (NUMBER_KNOWLEDGE[num]) {
    return NUMBER_KNOWLEDGE[num].quality;
  }

  // For others, reduce and check core vibration
  const reduced = reduceNumber(num);
  if (NUMBER_KNOWLEDGE[reduced]) {
    return NUMBER_KNOWLEDGE[reduced].quality;
  }
  
  if (reduced === 4 || reduced === 8) return 'challenging';
  return 'favorable';
}

export function reduceNumber(num: number): number {
  if (num === 0) return 0;
  // Master Numbers (11, 22, 33) are kept and not reduced further in Chaldean systems
  if (num <= 9 || num === 11 || num === 22 || num === 33) return num;

  const sum = num
    .toString()
    .split("")
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  
  return reduceNumber(sum);
}

export function getQualityExplanation(num: number): string {
  const quality = getNumberQuality(num);
  
  // If it's a compound, return the extracted meaning
  if (COMPOUND_MEANINGS[num]) {
    return COMPOUND_MEANINGS[num].meaning;
  }

  // If it's a root number, return advice from knowledge base
  if (NUMBER_KNOWLEDGE[num]) {
    return NUMBER_KNOWLEDGE[num].coreMeaning;
  }

  switch (quality) {
    case 'favorable':
      return "This is a harmonious and auspicious vibration according to Cheiro's Chaldean system.";
    case 'challenging':
      return "This frequency carries significant lessons and is often associated with the influence of Saturn or Uranus, demanding strength and resilience.";
    default:
      return "This vibration provides a steady foundation for development.";
  }
}
