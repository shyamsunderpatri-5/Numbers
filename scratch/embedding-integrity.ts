
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  
  console.log("🧐 Checking Embedding Integrity...");

  const { data, error } = await supabase.from('vedic_library_embeddings')
    .select('chunk_text, embedding')
    .ilike('chunk_text', '%2nd House Master%')
    .single();

  if (!data) {
    console.error("❌ Could not find Master Chunk.");
    return;
  }

  const storedVec = typeof data.embedding === 'string' ? JSON.parse(data.embedding) : data.embedding;
  
  const out = await embedder(data.chunk_text, { pooling: 'mean', normalize: true });
  const freshVec = Array.from(out.data);

  const similarity = cosineSimilarity(storedVec, freshVec);

  console.log(`\nStored Vector Length: ${storedVec.length}`);
  console.log(`Fresh Vector Length: ${freshVec.length}`);
  console.log(`Similarity (Self-to-Self): ${(similarity * 100).toFixed(4)}%`);

  if (similarity < 0.99) {
    console.log("\n🚨 CRITICAL MISMATCH! The stored vector is NOT what this model generates.");
    console.log("Stored first 5:", storedVec.slice(0, 5));
    console.log("Fresh first 5:", freshVec.slice(0, 5));
  } else {
    console.log("\n✅ Integrity confirmed. The vector is correct.");
  }
}

run();
