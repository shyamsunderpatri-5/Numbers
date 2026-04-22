/**
 * NUMERIQ.AI - Engine Unit Tests
 */

import { describe, it, expect } from 'vitest';
import { 
  computeNameNumber, 
  computeLifePath, 
  computeMissingNumbers,
  normalizeName
} from './engine';

describe('Numerology Engine - Layer 1', () => {
  
  describe('Name Normalization', () => {
    it('should normalize names correctly', () => {
      expect(normalizeName("José Müller")).toBe("JOSE MULLER");
      expect(normalizeName("Marie-Antoinette")).toBe("MARIE-ANTOINETTE");
      expect(normalizeName("Shyam 123!")).toBe("SHYAM");
    });
  });

  describe('Chaldean Calculations', () => {
    it('should calculate Name Number correctly (Chaldean)', () => {
      // SHYAM = S(3)+H(5)+Y(1)+A(1)+M(4) = 14 -> 5
      const result = computeNameNumber("SHYAM");
      expect(result.compound).toBe(14);
      expect(result.reduced).toBe(5);
    });

    it('should handle multiple name parts', () => {
      // JOHN = J(1)+O(7)+H(5)+N(5) = 18 -> 9
      // DOE = D(4)+O(7)+E(5) = 16 -> 7
      // TOTAL = 18 + 16 = 34 -> 7
      const result = computeNameNumber("JOHN DOE");
      expect(result.compound).toBe(34);
      expect(result.reduced).toBe(7);
      expect(result.parts[0].compound).toBe(18);
      expect(result.parts[1].compound).toBe(16);
    });

    it('should calculate Life Path correctly', () => {
      // DOB: 1990-01-01 -> 1+1+1+9+9+0 = 21 -> 3
      const dob = new Date(Date.UTC(1990, 0, 1));
      const lp = computeLifePath(dob);
      expect(lp.reduced).toBe(3);
    });

    it('should identify Master Numbers and not reduce them', () => {
      // 1991-01-01 -> 1+1+1+9+9+1 = 22
      const dob = new Date(Date.UTC(1991, 0, 1));
      const lp = computeLifePath(dob);
      expect(lp.reduced).toBe(22);
    });
  });

  describe('Missing Numbers', () => {
    it('should identify missing numbers 1-8 correctly', () => {
      // ABE = A(1), B(2), E(5)
      // Missing: 3, 4, 6, 7, 8
      const result = computeMissingNumbers("ABE");
      expect(result.missing).toContain(3);
      expect(result.missing).toContain(4);
      expect(result.missing).toContain(6);
      expect(result.missing).toContain(7);
      expect(result.missing).toContain(8);
      expect(result.missing).not.toContain(1);
      expect(result.missing).not.toContain(2);
      expect(result.missing).not.toContain(5);
    });
  });

  describe('Heather Lagan Celebrity Cases (Validation)', () => {
    it('should calculate Apolo Anton Ohno correctly', () => {
      // APOLO (26/8), ANTON (22), OHNO (24/6) -> 72/9
      const result = computeNameNumber("APOLO ANTON OHNO");
      expect(result.parts[0].compound).toBe(26);
      expect(result.parts[1].compound).toBe(22);
      expect(result.parts[2].compound).toBe(24);
      expect(result.compound).toBe(72);
      expect(result.reduced).toBe(9);
    });

    it('should calculate Leonardo DiCaprio correctly', () => {
      // LEONARDO (34/7), DICAPRIO (27/9) -> 61/7
      const result = computeNameNumber("LEONARDO DICAPRIO");
      expect(result.parts[0].compound).toBe(34);
      expect(result.parts[1].compound).toBe(27);
      expect(result.compound).toBe(61);
      expect(result.reduced).toBe(7);
    });

    it('should calculate Drew Barrymore correctly', () => {
      // DREW (17/8), BARRYMORE (26/8) -> 43/7
      const result = computeNameNumber("DREW BARRYMORE");
      expect(result.parts[0].compound).toBe(17);
      expect(result.parts[1].compound).toBe(26);
      expect(result.compound).toBe(43);
      expect(result.reduced).toBe(7);
    });

    it('should calculate John Adam Smith correctly (Heather Lagan example)', () => {
      // JOHN (18/9), ADAM (10/1), SMITH (17/8) -> 45/9
      const result = computeNameNumber("JOHN ADAM SMITH");
      expect(result.parts[0].compound).toBe(18);
      expect(result.parts[1].compound).toBe(10);
      expect(result.parts[2].compound).toBe(17);
      expect(result.compound).toBe(45);
      expect(result.reduced).toBe(9);
    });

    it('should calculate Lagan Mode Life Path for celebrities', () => {
      // Leonardo DiCaprio: Nov 11 -> 11 + 11 = 22
      const dicaprioDob = new Date(Date.UTC(1974, 10, 11));
      expect(computeLifePath(dicaprioDob, 'lagan').reduced).toBe(22);

      // Drew Barrymore: Feb 22 -> 2 + 22 = 24 -> 6
      const barrymoreDob = new Date(Date.UTC(1975, 1, 22));
      expect(computeLifePath(barrymoreDob, 'lagan').reduced).toBe(6);

      // Apolo Anton Ohno: May 22 -> 5 + 22 = 27 -> 9
      const ohnoDob = new Date(Date.UTC(1982, 4, 22));
      expect(computeLifePath(ohnoDob, 'lagan').reduced).toBe(9);

      // Leonardo da Vinci: Apr 15 -> 4 + (1+5) = 10 -> 1
      const davinciDob = new Date(Date.UTC(1452, 3, 15));
      expect(computeLifePath(davinciDob, 'lagan').reduced).toBe(1);
    });
  });
});
