// scratch/inspect-embeddings.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('\n--- LATEST VEDIC EMBEDDINGS ---')
  const { data: chunks } = await supabase.from('vedic_library_embeddings').select('id, chunk_text, embedding').order('created_at', { ascending: false }).limit(2)
  
  chunks?.forEach(c => {
    // Note: embedding is returned as a string '[val1,val2,...]' or an array depending on client
    const emb = (typeof c.embedding === 'string') 
      ? JSON.parse(c.embedding.replace('{', '[').replace('}', ']'))
      : c.embedding;
    
    console.log(`\nID: ${c.id}`)
    console.log(`Text: ${c.chunk_text.substring(0, 50)}...`)
    console.log(`Embedding Type: ${typeof c.embedding}`)
    console.log(`Length: ${emb?.length}`)
  })
}

run()
