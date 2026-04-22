const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: '../.env.local' });

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
      const output = await generator(chunk, { pooling: "mean", normalize: true });
      const embedding = Array.from(output.data);

      records.push({
        source_id: source.id,
        chunk_text: chunk,
        chunk_index: i + j,
        embedding: embedding
      });
    }

    const { error: eError } = await supabase
      .from("library_embeddings")
      .insert(records);

    if (eError) {
      console.error(`   ❌ Error on batch ${i}:`, eError.message);
    }

    const progress = Math.min(100, Math.round(((i + batch.length)/chunks.length)*100));
    console.log(`   ⚡ [${progress}%] Vectorizing & Storing...`);
  }

  console.log(`\n🎉 SUCCESS: ${metadata.title} has been vector-trained.`);
}

async function main() {
    const outPath = path.join(__dirname, "../Numerology The Complete Guide Vol 2.txt");
    await ingestBook(outPath, { title: "Numerology The Complete Guide Vol 2", author: "Matthew Oliver Goodwin" });
}

main().catch(console.error);
