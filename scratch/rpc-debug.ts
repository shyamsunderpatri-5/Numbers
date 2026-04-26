
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  const query = "2nd house wealth family speech food early education"
  const out = await embedder(query, { pooling: 'mean', normalize: true })
  const embedding = Array.from(out.data)

  console.log("📡 Calling match_vedic_documents RPC...");
  
  const { data, error } = await supabase.rpc('match_vedic_documents', {
    query_embedding: embedding,
    match_threshold: 0.1,
    match_count: 5
  })

  if (error) {
    console.error("❌ RPC Error:", error);
    return;
  }

  console.log(`\nReturned ${data.length} matches:`);
  data.forEach((h: any, i: number) => {
    console.log(`\n[${i+1}] Score: ${(h.similarity * 100).toFixed(1)}%`);
    console.log(`Text: ${h.chunk_text.substring(0, 150)}...`);
    console.log(`Source: ${h.source_title}`);
  });
}

run();
