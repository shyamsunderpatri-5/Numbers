const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { PDFParse } = require('pdf-parse');

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

function chunkText(text, size = 1500, overlap = 200) {
  const chunks = [];
  let index = 0;
  while (index < text.length) {
    chunks.push(text.slice(index, index + size));
    index += size - overlap;
  }
  return chunks;
}

async function extractTextFromPdf(filePath) {
    console.log(`📄 Extracting text from PDF: ${path.basename(filePath)}`);
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
}

async function upgradeSource(filePath, metadata, oldSourceId) {
  console.log(`\n📚 Upgrading Source: ${metadata.title}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ⚠️ File skip: ${filePath} not found.`);
    return;
  }

  const rawText = await extractTextFromPdf(filePath);
  const normalizedText = rawText.replace(/\s+/g, " ").trim();
  console.log(`   📄 Text Loaded (${normalizedText.length} chars).`);

  // Deactivate old source first to ensure no duplicate hits while streaming new data
  if (oldSourceId) {
    console.log(`   🔕 Deactivating old source ID: ${oldSourceId}`);
    await supabase.from("library_sources").update({ is_active: false }).eq("id", oldSourceId);
  }

  // Create new source record
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

  const chunks = chunkText(normalizedText);
  const generator = await getEmbedder();
  
  console.log(`   🧩 Processing ${chunks.length} thematic chunks...`);

  const BATCH_SIZE = 5; // Smaller batch for larger chunks
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

  console.log(`\n🎉 SUCCESS: ${metadata.title} upgraded and indexed.`);
}

async function main() {
    // 1. Sepharial Part 2 Full Upgrade
    const sepharialPath = path.join(__dirname, "../sepharial-the-kabala-of-numbers-part2.pdf");
    await upgradeSource(sepharialPath, { 
        title: "The Kabala of Numbers (Part 2) - Full Depth", 
        author: "Sepharial" 
    }, "17611eeb-0ec2-4cf9-bed5-756f51eb94de");

    // 2. Hans Decoz Full Upgrade
    const decozPath = path.join(__dirname, "../numerology-a-complete-guide-to-understanding.pdf");
    await upgradeSource(decozPath, { 
        title: "Numerology: Key to Your Inner Self (Full Guide)", 
        author: "Hans Decoz" 
    }, "ce268c33-3a62-4149-95db-758d611c615a");
}

main().catch(console.error);
