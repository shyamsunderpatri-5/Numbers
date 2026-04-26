// scratch/manual-similarity.ts
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function dotProduct(a: number[], b: number[]) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0)
}

async function run() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  const query = '1st house Lagna ascendant self body personality vitality'
  const out = await embedder(query, { pooling: 'mean', normalize: true })
  const queryEmb = Array.from(out.data) as number[]

  console.log('🔍 Querying latest chunks in vedic_library_embeddings...')
  
  const { data: chunks, error } = await supabase
    .from('vedic_library_embeddings')
    .select('chunk_text, embedding')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error || !chunks || chunks.length === 0) {
    console.error('❌ Error fetching chunks:', error)
    return
  }

  chunks.forEach((chunk, idx) => {
    const dbEmbRaw = chunk.embedding as any;
    const dbEmb = (typeof dbEmbRaw === 'string')
      ? JSON.parse(dbEmbRaw.replace('{', '[').replace('}', ']'))
      : dbEmbRaw;

    console.log(`\n[Chunk ${idx+1}] Text: ${chunk.chunk_text.substring(0, 100)}...`)
    const sim = dotProduct(queryEmb, dbEmb)
    console.log(`Manual Cosine Similarity: ${(sim * 100).toFixed(2)}%`)
  })

  // Run RPC
  console.log('\nRunning RPC for comparison...')
  const { data: rpcResults } = await supabase.rpc('match_vedic_documents', {
    query_embedding: queryEmb,
    match_threshold: 0.1,
    match_count: 5
  })
  
  rpcResults?.forEach((r: any) => {
    console.log(`- ${(r.similarity * 100).toFixed(2)}% | ${r.source_title} | ${r.chunk_text.substring(0, 50)}...`)
  })
}

run()
