// scripts/debug-rag.ts
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debug() {
  console.log("🔍 STARTING RAG DEBUG...");

  // 1. Check Table Counts
  const { count: cCount } = await supabase.from('library_embeddings').select('*', { count: 'exact', head: true });
  const { count: vCount } = await supabase.from('vedic_library_embeddings').select('*', { count: 'exact', head: true });
  console.log(`📊 DB Status: Chaldean Chunks: ${cCount}, Vedic Chunks: ${vCount}`);

  if (cCount === 0 || vCount === 0) {
    console.error("❌ ERROR: Tables are empty! Hydration might have failed or been wiped.");
    return;
  }

  // 2. Test simple RPC call
  console.log("🧪 Testing Raw RPC (Chaldean)...");
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const out = await embedder('number 1', { pooling: 'mean', normalize: true });
  const embedding = Array.from(out.data);

  const { data, error } = await supabase.rpc('match_library_documents', {
    query_embedding: embedding,
    match_threshold: 0.0,
    match_count: 1
  });

  if (error) {
    console.error("❌ RPC ERROR (Chaldean):", error.message);
    console.error("   Details:", error.details);
    console.error("   Hint:", error.hint);
  } else {
    console.log("✅ RPC SUCCESS (Chaldean): Found", data?.length, "results.");
    if (data?.length > 0) console.log("   Top hit:", data[0].chunk_text.substring(0, 50));
  }

  // 3. Test simple RPC call (Vedic)
  console.log("🧪 Testing Raw RPC (Vedic)...");
  const { data: vData, error: vError } = await supabase.rpc('match_vedic_documents', {
    query_embedding: embedding,
    match_threshold: 0.0,
    match_count: 1
  });

  if (vError) {
    console.error("❌ RPC ERROR (Vedic):", vError.message);
  } else {
    console.log("✅ RPC SUCCESS (Vedic): Found", vData?.length, "results.");
  }
}

debug();
