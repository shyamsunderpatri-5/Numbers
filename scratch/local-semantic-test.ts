
import { pipeline } from '@xenova/transformers'

function cosineSimilarity(v1: number[], v2: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    mA += v1[i] * v1[i];
    mB += v2[i] * v2[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}

async function run() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  
  const query = "2nd house wealth family speech food early education"
  const chunkText = "TITLE: 2nd House Master Significations (Dhana Bhava)\nDEFINITION: The house of assets and expression.\nSIGNIFICATIONS: wealth, family, speech, food, early education, right eye, face, accumulated money, bank balance.\nKEYWORDS: 2nd house wealth family speech food early education, Dhana Bhava wealth, money house astrology."

  const qOut = await embedder(query, { pooling: 'mean', normalize: true });
  const cOut = await embedder(chunkText, { pooling: 'mean', normalize: true });

  const qVec = Array.from(qOut.data);
  const cVec = Array.from(cOut.data);

  const similarity = cosineSimilarity(qVec, cVec);

  console.log(`Query: ${query}`);
  console.log(`Chunk: ${chunkText.substring(0, 100)}...`);
  console.log(`\nLOCAL SIMILARITY: ${(similarity * 100).toFixed(2)}%`);
}

run();
