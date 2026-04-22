/**
 * NUMERIQ.AI - Chaldean Mapping & Quality Constants
 * Sacred values that must never be altered.
 */

import { NumberQuality } from "./types";

export const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

// 9 is a sacred number in Chaldean numerology and is not assigned to any letter.
export const SACRED_NUMBER = 9;

export const QUALITY_MAP: Record<number, NumberQuality> = {
  1: 'favorable',
  2: 'neutral',
  3: 'favorable',
  4: 'challenging',
  5: 'favorable',
  6: 'favorable',
  7: 'neutral',
  8: 'challenging', // Special purple/deep treatment as per spec
  9: 'powerful',
  11: 'master',
  22: 'master',
  33: 'master',
};

// Vowels mapping (Standard English for Soul Urge calculation)
export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y']);
