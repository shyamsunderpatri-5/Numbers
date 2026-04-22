const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { checkFirewall } = require("./ingestion-firewall");

/**
 * Guard 2: Pre-Embedding Sanitizer
 */
function sanitizeForSovereignty(text) {
    let cleaned = text;
    // Strip numeric bindings (the X is, is X, etc)
    const patterns = [
        /\bnumber\w*\s*(is|vibrates|belongs|=)?\s*(a|an)?\s*\d+\b/gi,
        /\b\d+\s*people\b/gi,
        /\bpeople with\s*\d+\b/gi,
        /\b(the|a|an)?\s*\d+\s+is\b/gi,
        /\bvibrates\s*to\s*\d+\b/gi
    ];
    patterns.forEach(p => cleaned = cleaned.replace(p, ""));
    return cleaned.trim();
}

/**
 * NUMERIQ.AI — Sage Library Ingester (TEXT PURE v3)
 * Ingests Cheiro-Book.txt into library_embeddings.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("🚀 Loading local embedding engine (all-MiniLM-L6-v2)...");
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

function chunkText(text, size = 1000, overlap = 200) {
  const chunks = [];
  let index = 0;
  while (index < text.length) {
    chunks.push(text.slice(index, index + size));
    index += size - overlap;
  }
  return chunks;
}

async function ingestBook(filePath, metadata) {
  console.log(`\n📚 Syncing Pure Text: ${metadata.title}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ⚠️ File skip: ${filePath} not found.`);
    return;
  }

  const fullText = fs.readFileSync(filePath, 'utf-8').replace(/\s+/g, " ").trim();
  console.log(`   📄 Text Loaded (${fullText.length} chars).`);

  const { data: existing } = await supabase
    .from("library_sources")
    .select("id")
    .eq("title", metadata.title)
    .single();

  if (existing) {
    console.log(`   🗑️ Purging existing records for: ${metadata.title}`);
    await supabase.from("library_sources").delete().eq("id", existing.id);
  }

  const { data: source, error: sError } = await supabase
    .from("library_sources")
    .insert({
      title: metadata.title,
      author: metadata.author,
      file_name: path.basename(filePath),
      is_active: true
    })
    .select()
    .single();

  if (sError) throw sError;

  const chunks = chunkText(fullText);
  const generator = await getEmbedder();
  
  console.log(`   🧩 Processing ${chunks.length} thematic chunks...`);

  const BATCH_SIZE = 10;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const records = [];

    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      
      const firewall = checkFirewall(chunk);
      if (!firewall.pass) {
        console.log(`   🛡️  Firewall Reject [Chunk ${i+j}]: ${firewall.reason}`);
        continue;
      }

      const cleanedChunk = sanitizeForSovereignty(chunk);
      if (cleanedChunk.length < 50) {
        console.log(`   🛡️  Sanitizer Reject [Chunk ${i+j}]: Too short after cleaning.`);
        continue;
      }

      const output = await generator(cleanedChunk, { pooling: "mean", normalize: true });
      const embedding = Array.from(output.data);

      records.push({
        source_id: source.id,
        chunk_text: cleanedChunk,
        chunk_index: i + j,
        embedding: embedding
      });
    }

    if (records.length === 0) continue;

    // Bulk insert batch
    const { error: eError } = await supabase
      .from("library_embeddings")
      .insert(records);

    if (eError) {
      console.error(`   ❌ Error on batch ${i}:`, eError.message);
      // Optional: retry logic could go here
    }

    const progress = Math.min(100, Math.round(((i + batch.length)/chunks.length)*100));
    console.log(`   ⚡ [${progress}%] Vectorizing & Storing...`);
  }

  console.log(`\n🎉 SUCCESS: ${metadata.title} has been vector-trained.`);
}

async function main() {
    // 1. Cheiro
    const cheiroFile = "c:/Users/shyam/Drive D/Selvo World/Numbers/Cheiro-Book.txt";
    await ingestBook(cheiroFile, { title: "Cheiro's Book of Numbers", author: "Cheiro" });

    // 2. Sepharial P1
    const sepharialP1 = "c:/Users/shyam/Drive D/Selvo World/Numbers/part1.txt";
    await ingestBook(sepharialP1, { title: "The Kabala of Numbers (Part 1)", author: "Sepharial" });

    // 3. Sepharial P2
    const sepharialP2 = "c:/Users/shyam/Drive D/Selvo World/Numbers/SepharialTheKabalaOfNumbers1920P2.txt";
    await ingestBook(sepharialP2, { title: "The Kabala of Numbers (Part 2)", author: "Sepharial" });

    // 4. Linda Goodman
    const lindaFile = "c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/inda-clean.txt";
    await ingestBook(lindaFile, { title: "Linda Goodman's Star Signs", author: "Linda Goodman" });

    // 5. Heather Lagan
    const heatherFile = "c:/Users/shyam/Drive D/Selvo World/Numbers/HEATHER.txt";
    await ingestBook(heatherFile, { title: "Chaldean Numerology Knowledge", author: "Heather Alicia Lagan" });
}

main().catch(console.error);
