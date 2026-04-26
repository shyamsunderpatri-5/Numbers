// scratch/debug-injection.ts
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  const query = '1st house Lagna ascendant self body personality vitality'
  const out = await embedder(query, { pooling: 'mean', normalize: true })
  const embedding = Array.from(out.data)

  console.log('🔍 Querying for: ' + query)

  const { data, error } = await supabase.rpc('match_vedic_documents', {
    query_embedding: embedding,
    match_threshold: 0.1,
    match_count: 5
  })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log('\n🎯 Matches found:')
  data.forEach((hit: any, i: number) => {
    console.log(`\n[${i+1}] Similarity: ${(hit.similarity * 100).toFixed(1)}%`)
    console.log(`Source: ${hit.source_title}`)
    console.log(`Text: ${hit.chunk_text.substring(0, 200)}...`)
  })
}

run()
