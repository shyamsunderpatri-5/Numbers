
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log("🔍 Searching for '2nd House Master' string...");

  const { data, error } = await supabase.from('vedic_library_embeddings')
    .select('chunk_text, metadata')
    .ilike('chunk_text', '%2nd House Master%');

  if (error) {
    console.error("❌ Error:", error);
    return;
  }

  console.log(`Found ${data.length} matches in vedic_library_embeddings.`);
  if (data.length > 0) {
    console.log("Match 1:", data[0].chunk_text.substring(0, 100));
  } else {
    // Check Chaldean just in case
    const { data: cData } = await supabase.from('library_embeddings')
      .select('chunk_text')
      .ilike('chunk_text', '%2nd House Master%');
    console.log(`Found ${cData?.length || 0} matches in library_embeddings.`);
  }
}

run();
