
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log("📊 Checking Database Inventory...");

  // Check Vedic Sources
  const { data: vSources } = await supabase.from('vedic_library_sources').select('*');
  console.log(`\nVedic Sources (${vSources?.length || 0}):`);
  vSources?.forEach(s => console.log(`- [${s.id}] ${s.title} (Active: ${s.is_active})`));

  // Check Chaldean Sources
  const { data: cSources } = await supabase.from('library_sources').select('*');
  console.log(`\nChaldean Sources (${cSources?.length || 0}):`);
  cSources?.forEach(s => console.log(`- [${s.id}] ${s.title} (Active: ${s.is_active})`));

  // Check Count of Sovereign Packets
  const sovSourceV = vSources?.find(s => s.title === 'Sovereign Knowledge Packets');
  if (sovSourceV) {
    const { count } = await supabase.from('vedic_library_embeddings').select('*', { count: 'exact', head: true }).eq('source_id', sovSourceV.id);
    console.log(`\nVedic Sovereign Chunks: ${count}`);
  }

  const sovSourceC = cSources?.find(s => s.title === 'Sovereign Knowledge Packets');
  if (sovSourceC) {
    const { count } = await supabase.from('library_embeddings').select('*', { count: 'exact', head: true }).eq('source_id', sovSourceC.id);
    console.log(`Chaldean Sovereign Chunks: ${count}`);
  }
  
  // Peek at one Vedic House 2 chunk
  if (sovSourceV) {
     const { data: peek } = await supabase.from('vedic_library_embeddings')
        .select('chunk_text, metadata')
        .eq('source_id', sovSourceV.id)
        .limit(1);
     console.log("\nPeek at a Vedic Sovereign Chunk:");
     console.log(JSON.stringify(peek, null, 2));
  }
}

run();
