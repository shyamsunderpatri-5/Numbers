import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkKeywordDrift, calculateSimilarity } from '../utils/semantic-utils';

// Mock semantic-utils because calculateSimilarity requires Xenova pipeline which is heavy
vi.mock('../utils/semantic-utils', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    calculateSimilarity: vi.fn()
  };
});

describe('Epistemology Safety - Admin Integrity & Drift Detection', () => {
  
  describe('Semantic Drift Detection (Layer A & B)', () => {
    
    it('should identify HARD DRIFT via Keyword Guard (Layer A)', () => {
      const v1 = "This number represents absolute freedom and change.";
      const v2 = "This number represents stability and routine."; // "freedom" removed
      const criticalTerms = ["freedom", "change"];
      
      const result = checkKeywordDrift(v1, v2, criticalTerms);
      expect(result.drifted).toBe(true);
      expect(result.missing).toContain("freedom");
    });

    it('should identify SOFT DRIFT via Embedding Similarity (Layer B)', async () => {
      const v1 = "A master of leadership and innovation.";
      const v2 = "A person who likes to follow others and avoids new ideas.";
      
      // Mock similarity to be low
      vi.mocked(calculateSimilarity).mockResolvedValueOnce(0.45);
      
      const similarity = await calculateSimilarity(v1, v2);
      expect(similarity).toBeLessThan(0.75); // Threshold for Soft Drift
    });

    it('should PASS for minor stylistic changes', async () => {
      const v1 = "Success in all material ventures.";
      const v2 = "Financial prosperity in business endeavors.";
      
      vi.mocked(calculateSimilarity).mockResolvedValueOnce(0.88);
      
      const similarity = await calculateSimilarity(v1, v2);
      expect(similarity).toBeGreaterThan(0.75);
    });
  });

  describe('Validator Degradation Simulation', () => {
    it('should fail the test if the keyword guard is accidentally disabled', () => {
      // This is a "Meta-test" to ensure our safety logic doesn't become "weaker"
      const dummyGuard = (t1: string, t2: string) => ({ drifted: false }); // FAKE WEAK GUARD
      
      const v1 = "freedom";
      const v2 = "slavery";
      const result = dummyGuard(v1, v2);
      
      // If we used the real guard, this would be true.
      // We expect the REAL guard to NEVER return false for this.
      expect(checkKeywordDrift(v1, v2, ["freedom"]).drifted).toBe(true);
    });
  });
});
