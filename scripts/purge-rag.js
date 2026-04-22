const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

/**
 * NUMERIQ.AI — Data Purge Protocol
 * Deletes all RAG and Knowledge data to ensure a clean slate.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function purge() {
  console.log("💣 Initiating Total Purge of RAG Tables...");

  // 1. Purge Knowledge Base
  console.log("   🧹 Clearing 'knowledge_base'...");
  const { error: kError } = await supabase
    .from("knowledge_base")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Standard delete all trick

  if (kError) console.error("   ❌ Error purging knowledge_base:", kError.message);

  // 2. Purge Library Embeddings
  console.log("   🧹 Clearing 'library_embeddings'...");
  const { error: eError } = await supabase
    .from("library_embeddings")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (eError) console.error("   ❌ Error purging library_embeddings:", eError.message);

  // 3. Purge Library Sources
  console.log("   🧹 Clearing 'library_sources'...");
  const { error: sError } = await supabase
    .from("library_sources")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (sError) console.error("   ❌ Error purging library_sources:", sError.message);

  console.log("\n✅ ALL TABLES PURGED. The system is now 100% clean.");
}

purge().catch(console.error);
