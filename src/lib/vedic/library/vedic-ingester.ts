import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import { pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { smartChunk, autoTag, detectKnowledgeType } from "../../../../scripts/rechunk-vedic-pdfs";

// Load env for standalone script usage
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    console.log("🚀 Loading local embedding engine for Vedic Library (all-MiniLM-L6-v2)...");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

// Chunking is now handled by rechunk-vedic-pdfs.ts for high-density retrieval

/**
 * Main Entry Point: Ingest a Vedic book (PDF or TXT).
 */
export async function ingestVedicBook(
  filePath: string, 
  metadata: { title: string; author?: string; year?: string }
) {
  console.log(`\n🕉️  Starting Vedic Ingestion: ${metadata.title}`);
  
  let fullText = "";
  const ext = path.extname(filePath).toLowerCase();

  // 1. Load and parse content
  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    fullText = pdfData.text.replace(/\s+/g, " ").trim();
  } else if (ext === ".txt") {
    fullText = fs.readFileSync(filePath, "utf-8").replace(/\s+/g, " ").trim();
  } else {
    throw new Error(`Unsupported file type: ${ext}`);
  }
  
  console.log(`   📄 Extracted ${fullText.length} characters.`);

  // 2. High-Density Chunking
  console.log(`   🧩 Generating High-Density chunks...`);
  const chunks = smartChunk(fullText);
  console.log(`   🧩 Created ${chunks.length} Vedic chunks. Generating vectors...`);

  const embedder = await getEmbedder();
  
  // 3. Register/Update Source in VEDIC table
  const { data: source, error: sError } = await supabase
    .from("vedic_library_sources")
    .upsert({
      title: metadata.title,
      author: metadata.author || "Vedic Tradition",
      year: metadata.year,
      file_name: path.basename(filePath),
      total_chunks: chunks.length,
      is_active: true,
      status: 'active'
    }, { onConflict: 'title' })
    .select()
    .single();

  if (sError) throw sError;

  // 4. Clear existing chunks to prevent duplicates on retry
  console.log(`   🧹 Cleaning old chunks for: ${metadata.title}`);
  await supabase
    .from("vedic_library_embeddings")
    .delete()
    .eq("source_id", source.id);

  // 5. Embed and Store
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    
    // Generate local embedding
    const output = await embedder(chunkText, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    // Smart Tagging and Classification
    const tags = autoTag(chunkText);
    const kType = detectKnowledgeType(chunkText);

    // Store in VEDIC embeddings table
    const { error: eError } = await supabase
      .from("vedic_library_embeddings")
      .insert({
        source_id: source.id,
        chunk_text: chunkText,
        chunk_index: i,
        embedding: embedding,
        metadata: { 
          tags,
          knowledge_type: kType,
          source_authority: metadata.title,
          source_type: 'vedic' 
        }
      });

    if (eError) {
      console.error(`   ❌ Error on Vedic chunk ${i}:`, eError.message);
    }

    if (i % 10 === 0) {
      process.stdout.write(`   ⚡ Vedic Progress: ${i}/${chunks.length} chunks...\r`);
    }
  }

  console.log(`\n\n🙏 NAMASTE: ${metadata.title} has been integrated into the Vedic Knowledge Base.`);
}
