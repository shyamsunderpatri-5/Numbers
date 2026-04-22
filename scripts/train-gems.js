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

async function ingestGems(filePath, metadata) {
  console.log(`\n💎 Ingesting Gems & Colors: ${metadata.title}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ⚠️ File skip: ${filePath} not found.`);
    return;
  }

  const fullText = fs.readFileSync(filePath, 'utf-8').trim();
  console.log(`   📄 Text Loaded (${fullText.length} chars).`);

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
  
  console.log(`   🧩 Processing ${chunks.length} chunks...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const output = await generator(chunk, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    const { error: eError } = await supabase
      .from("library_embeddings")
      .insert({
        source_id: source.id,
        chunk_text: chunk,
        chunk_index: i,
        embedding: embedding
      });

    if (eError) {
      console.error(`   ❌ Error on chunk ${i}:`, eError.message);
    }
  }

  console.log(`\n🎉 SUCCESS: ${metadata.title} has been vector-trained.`);
}

async function main() {
    const gemsFile = path.join(__dirname, "../scratch/gems-colors-metals.txt");
    await ingestGems(gemsFile, { 
        title: "Numerology: Gems, Colors, and Metals (Harmonic Correspondences)", 
        author: "Multiple Experts (Isidore Kozminsky & Professional Numerology)" 
    });
}

main().catch(console.error);
