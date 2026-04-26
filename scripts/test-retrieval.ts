// scripts/test-retrieval.ts
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const query = 'Mercury Mahadasha 17 years intelligence business communication trade';
  
  console.log("🔍 QUERY:", query);

  const out = await model(query, { pooling: 'mean', normalize: true });
  const emb = Array.from(out.data);

  // 1. Find the synthetic chunk in the DB
  const { data: chunks } = await supabase
    .from('vedic_library_embeddings')
    .select('id, chunk_text, source_id')
    .ilike('chunk_text', '%Mercury%Mahadasha%17%years%')
    .limit(1);

  if (!chunks || chunks.length === 0) {
    console.error("❌ Synthetic chunk NOT FOUND in database!");
    return;
  }

  const chunk = chunks[0];
  console.log("✅ FOUND CHUNK ID:", chunk.id);
  console.log("📂 SOURCE ID:", chunk.source_id);

  // 2. Check if source is active
  const { data: source } = await supabase
    .from('vedic_library_sources')
    .select('title, is_active')
    .eq('id', chunk.source_id)
    .single();

  console.log("📖 SOURCE TITLE:", source?.title);
  console.log("🟢 IS ACTIVE:", source?.is_active);

  // 3. Run the RPC and see if this ID is returned
  const { data: hits, error } = await supabase.rpc('match_vedic_documents', {
    query_embedding: emb,
    match_threshold: 0.01, // Very low
    match_count: 50
  });

  if (error) {
    console.error("❌ RPC ERROR:", error.message);
    return;
  }

  const hit = hits?.find((h: any) => h.id === chunk.id);
  if (hit) {
    console.log("🎯 MATCH FOUND in RPC! Similarity:", hit.similarity);
  } else {
    console.log("😱 MATCH NOT FOUND in RPC top 50 hits.");
    console.log("Top Hit Similarity:", hits?.[0]?.similarity);
    console.log("Top Hit Text:", hits?.[0]?.chunk_text?.substring(0, 50));
  }
}

test();
