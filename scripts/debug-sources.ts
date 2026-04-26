// scripts/debug-sources.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debug() {
  console.log("🔍 LISTING ALL SOURCES...");
  
  const { data: c } = await supabase.from('library_sources').select('id, title, author, is_active');
  const { data: v } = await supabase.from('vedic_library_sources').select('id, title, author, is_active');

  console.log("\n📚 CHALDEAN SOURCES:");
  console.table(c);

  console.log("\n🕉️ VEDIC SOURCES:");
  console.table(v);
}

debug();
