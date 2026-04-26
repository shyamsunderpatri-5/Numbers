
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
  const query = "2nd house wealth family speech food early education"
  const out = await embedder(query, { pooling: 'mean', normalize: true })
  const queryVec = Array.from(out.data)

  console.log("🛠️  Performing Raw JS Similarity Check...");

  // Get ALL sovereign packets from Vedic
  const { data: packets, error } = await supabase.from('vedic_library_embeddings')
    .select('chunk_text, embedding, metadata')
    .limit(100);

  if (error) {
    console.error("❌ DB Error:", error);
    return;
  }

  const results = packets.map(p => {
    // Parse embedding if it's a string (sometimes returned as "[...]")
    const vec = typeof p.embedding === 'string' 
      ? JSON.parse(p.embedding) 
      : p.embedding;
    
    return {
      text: p.chunk_text,
      similarity: cosineSimilarity(queryVec, vec),
      tags: p.metadata.tags
    };
  });

  results.sort((a, b) => b.similarity - a.similarity);

  console.log(`\nTop 5 Raw Results:`);
  results.slice(0, 5).forEach((r, i) => {
    console.log(`\n[${i+1}] Score: ${(r.similarity * 100).toFixed(1)}%`);
    console.log(`Text: ${r.text.substring(0, 150)}...`);
    console.log(`Tags: ${JSON.stringify(r.tags)}`);
  });
}

run();
