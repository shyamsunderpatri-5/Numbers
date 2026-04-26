import { pipeline } from '@xenova/transformers';

let embedder: any = null;

/**
 * Get the feature extraction pipeline (lazy load)
 */
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magA * magB);
}

/**
 * Compare two strings for semantic similarity
 */
export async function calculateSimilarity(text1: string, text2: string): Promise<number> {
  const extractor = await getEmbedder();
  
  const output1 = await extractor(text1, { pooling: 'mean', normalize: true });
  const output2 = await extractor(text2, { pooling: 'mean', normalize: true });
  
  const vector1 = Array.from(output1.data as Float32Array);
  const vector2 = Array.from(output2.data as Float32Array);
  
  return cosineSimilarity(vector1, vector2);
}

/**
 * Keyword Guard: Checks for flipped or removed critical terms
 */
export function checkKeywordDrift(text1: string, text2: string, criticalTerms: string[]): { drifted: boolean, missing: string[] } {
  const missing: string[] = [];
  const t1 = text1.toLowerCase();
  const t2 = text2.toLowerCase();
  
  for (const term of criticalTerms) {
    if (t1.includes(term.toLowerCase()) && !t2.includes(term.toLowerCase())) {
      missing.push(term);
    }
  }
  
  return {
    drifted: missing.length > 0,
    missing
  }
}
