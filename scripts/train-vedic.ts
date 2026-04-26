import { ingestVedicBook } from "../src/lib/vedic/library/vedic-ingester";
import fs from "fs";
import path from "path";

/**
 * NUMERIQ.AI — Vedic Training Command
 * Usage: npx tsx scripts/train-vedic.ts
 */

async function main() {
  // Use the absolute path to ASTROTRAIN based on your workspace structure
  const dirPath = path.join(process.cwd(), "ASTROTRAIN");

  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Error: Directory not found at ${dirPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath).filter(f => 
    f.endsWith(".pdf") || f.endsWith(".txt")
  );

  if (files.length === 0) {
    console.warn("⚠️  No Vedic source files (.pdf, .txt) found in ASTROTRAIN.");
    process.exit(0);
  }

  console.log(`\n🕉️  Found ${files.length} Vedic authoritative sources. Starting ingestion...\n`);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      await ingestVedicBook(fullPath, {
        title: file.replace(/\.(pdf|txt)$/i, "").replace(/_/g, " "),
        author: "Vedic Tradition"
      });
    } catch (err) {
      console.error(`   ❌ Failed to ingest Vedic source ${file}:`, err);
    }
  }

  console.log("\n🕉️  VEDIC KNOWLEDGE BASE HYDRATED. The system is now dually aligned.");
}

main().catch(console.error);
