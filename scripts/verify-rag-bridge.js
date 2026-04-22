const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

/**
 * Verification Script: RAG Bridge Check
 * This proves the app can now retrieve semantic context from the ancient books.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function verifyRAG() {
  console.log("🔍 Verifying RAG Bridge...");
  
  // 1. Loading the model (mimicking the retriever singleton)
  console.log("🚀 Loading engine (all-MiniLM-L6-v2)...");
  const { pipeline } = await import("@xenova/transformers");
  const generator = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  // 2. Querying for a specific vibrational pattern
  const query = "What is the mystical meaning of Destiny Number 7 and the number of Neptune?";
  console.log(`📡 Searching Archives for: "${query}"`);
  
  const output = await generator(query, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data);

  // 3. RPC Call
  const { data, error } = await supabase.rpc("match_library_documents", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 3
  });

  if (error) {
    console.error("❌ RPC Error:", error.message);
    return;
  }

  console.log("\n📚 ARCHIVE RESULTS FOUND:");
  data.forEach((s, i) => {
    console.log(`\n[${i+1}] SOURCE: ${s.source_title} (${s.source_author})`);
    console.log(`    SIMILARITY: ${(s.similarity * 100).toFixed(2)}%`);
    console.log(`    TEXT: "${s.chunk_text.substring(0, 200)}..."`);
  });

  console.log("\n✨ BRIDGE VERIFIED: The Sage can now hear the ancient masters.");
}

verifyRAG().catch(console.error);
