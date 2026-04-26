// scratch/inspect-db.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('--- VEDIC SOURCES ---')
  const { data: sources } = await supabase.from('vedic_library_sources').select('*').order('ingested_at', { ascending: false }).limit(5)
  console.table(sources)

  console.log('\n--- LATEST VEDIC CHUNKS ---')
  const { data: chunks } = await supabase.from('vedic_library_embeddings').select('id, source_id, chunk_text, created_at').order('created_at', { ascending: false }).limit(5)
  chunks?.forEach(c => {
    console.log(`\nID: ${c.id}`)
    console.log(`SourceID: ${c.source_id}`)
    console.log(`Text: ${c.chunk_text.substring(0, 100)}...`)
  })
}

run()
