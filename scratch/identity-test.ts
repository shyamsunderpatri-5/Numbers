// scratch/identity-test.ts
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
  
  // 1. Get a chunk we just injected
  const { data: chunk, error } = await supabase
    .from('vedic_library_embeddings')
    .select('chunk_text, embedding')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !chunk) {
    console.error('❌ Error:', error)
    return
  }

  const text = chunk.chunk_text
  const dbEmbRaw = chunk.embedding as any;
  const dbEmb = (typeof dbEmbRaw === 'string')
    ? JSON.parse(dbEmbRaw.replace('{', '[').replace('}', ']'))
    : dbEmbRaw;

  // 2. Re-embed the same text
  console.log('📝 Re-embedding text: ' + text.substring(0, 100) + '...')
  const out = await embedder(text, { pooling: 'mean', normalize: true })
  const freshEmb = Array.from(out.data) as number[]

  // 3. Compare
  const sim = dotProduct(freshEmb, dbEmb)
  console.log(`\n🆔 Identity Similarity (Stored vs Fresh): ${(sim * 100).toFixed(4)}%`)
  
  if (sim < 0.99) {
    console.log('🚨 DISCREPANCY DETECTED! The stored embedding does not match the fresh one.')
    console.log('DB Emb first 5:', dbEmb.slice(0, 5))
    console.log('Fresh Emb first 5:', freshEmb.slice(0, 5))
  } else {
    console.log('✅ Vectors match perfectly.')
  }
}

run()
