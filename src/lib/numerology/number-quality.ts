/**
 * NUMERIQ.AI - Number Quality Deterministic Logic
 * Categorizes numbers based on their mathematical vibration.
 */

import { NumberQuality } from "./types";
import { NUMBERS_1_9 } from "./knowledge/numbers-1-9";
import { COMPOUNDS_10_52 } from "./knowledge/compounds-10-52";

export function getNumberQuality(num: number): NumberQuality {
  // Check Compounds 10-52
  if (COMPOUNDS_10_52[num]) {
    return COMPOUNDS_10_52[num].quality;
  }

  // Check Singles 1-9
  if (num >= 1 && num <= 9) {
    // Cheiro treats 4 and 8 as 'challenging' or 'unfortunate' in worldly matters
    if (num === 4 || num === 8) return 'challenging';
    return 'favorable';
  }

  // For others, reduce and check core vibration
  const reduced = reduceNumber(num);
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
  if (COMPOUNDS_10_52[num]) {
    return COMPOUNDS_10_52[num].meaning;
  }

  // If it's a root number, return advice from knowledge base
  if (NUMBERS_1_9[num]) {
    return NUMBERS_1_9[num].character.join(". ");
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
