/**
 * NUMERIQ.AI - Knowledge Base Schema Validation Tests
 */

import { describe, it, expect, vi } from 'vitest';

// Mock Supabase to avoid environment variable errors during static knowledge tests
vi.mock('../../supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        }))
      }))
    }))
  }
}));

import { NUMBER_KNOWLEDGE, COMPOUND_MEANINGS } from './knowledge';

describe('Knowledge Base Validation - Layer 2', () => {
  
  describe('Numbers 1-9', () => {
    it('should have all 9 core numbers populated', () => {
      for (let i = 1; i <= 9; i++) {
        expect(NUMBER_KNOWLEDGE[i]).toBeDefined();
        expect(NUMBER_KNOWLEDGE[i].number).toBe(i);
      }
    });

    it('should have required fields for RAG', () => {
      const entry = NUMBER_KNOWLEDGE[1];
      expect(entry.coreMeaning.length).toBeGreaterThan(100);
      expect(entry.asDestinyNumber).toBeDefined();
      expect(entry.strengths.length).toBeGreaterThan(0);
      expect(entry.luckyColors.length).toBeGreaterThan(0);
      expect(entry.missingRemedy).toBeDefined();
    });
  });

  describe('Compounds 10-52', () => {
    it('should have all 43 compounds populated', () => {
      for (let i = 10; i <= 52; i++) {
        expect(COMPOUND_MEANINGS[i]).toBeDefined();
        expect(COMPOUND_MEANINGS[i].compound).toBe(i);
        expect(COMPOUND_MEANINGS[i].meaning.length).toBeGreaterThan(10);
      }
    });
  });
});
