import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";

/**
 * NUMERIQ.AI — Sage Library Ingester
 * Logic for "Training" the AI on Ancient Numerology PDFs.
 * 
 * Uses Local Embeddings (@xenova/transformers + all-MiniLM-L6-v2) 
 * for 100% privacy and zero-cost ingestion.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("🚀 Loading local embedding engine (all-MiniLM-L6-v2)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

/**
 * Splits text into overlapping chunks to preserve esoteric context.
 */
function chunkText(text: string, size = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let index = 0;
  while (index < text.length) {
    chunks.push(text.slice(index, index + size));
    index += size - overlap;
  }
  return chunks;
}

/**
 * Main Entry Point: Ingest a single PDF book.
 */
export async function ingestBook(
  filePath: string, 
  metadata: { title: string; author?: string; year?: string }
) {
  console.log(`\n📚 Starting ingestion for: ${metadata.title}`);
  
  // 1. Load and parse PDF
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);
  const fullText = pdfData.text.replace(/\s+/g, " ").trim();
  
  console.log(`   📄 Extracted ${fullText.length} characters.`);

  // 2. Register source in DB
  const { data: source, error: sError } = await supabase
    .from("library_sources")
    .upsert({
      title: metadata.title,
      author: metadata.author,
      year: metadata.year,
      file_name: path.basename(filePath),
      is_active: true
    })
    .select()
    .single();

  if (sError) throw sError;

  // 3. Chunk and Embed
  const chunks = chunkText(fullText);
  const generator = await getEmbedder();
  
  console.log(`   🧩 Created ${chunks.length} thematic chunks. Generating vectors...`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    // Generate local embedding
    const output = await generator(chunk, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    // Store in Supabase
    const { error: eError } = await supabase
      .from("library_embeddings")
      .insert({
        source_id: source.id,
        chunk_text: chunk,
        chunk_index: i,
        embedding: embedding,
        metadata: { page: i } // Approx page
      });

    if (eError) {
      console.error(`   ❌ Error on chunk ${i}:`, eError.message);
    }

    if (i % 10 === 0) {
      process.stdout.write(`   ⚡ Processed ${i}/${chunks.length} chunks...\r`);
    }
  }

  // 4. Update total chunks
  await supabase
    .from("library_sources")
    .update({ total_chunks: chunks.length })
    .eq("id", source.id);

  console.log(`\n\n🎉 SUCCESS: ${metadata.title} has been ingested and trained.`);
}
