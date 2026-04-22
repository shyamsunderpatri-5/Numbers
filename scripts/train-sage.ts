import { ingestBook } from "../src/lib/numerology/library/ingester";
import fs from "fs";
import path from "path";

/**
 * NUMERIQ.AI — Sage Training Command
 * Usage: npx ts-node scripts/train-sage.ts "C:/Path/To/Your/PDFs"
 */

async function main() {
  const dirPath = process.argv[2];

  if (!dirPath || !fs.existsSync(dirPath)) {
    console.error("❌ Error: Please provide a valid directory path containing your PDFs.");
    console.log("   Usage: npx ts-node scripts/train-sage.ts \"C:/Users/shyam/Downloads/MyBooks\"");
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.warn("⚠️  No PDF files found in the specified directory.");
    process.exit(0);
  }

  console.log(`\n📚 Found ${files.length} books. Awakening the Sage...\n`);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    try {
      await ingestBook(fullPath, {
        title: file.replace(".pdf", "").replace(/_/g, " "),
        author: "Traditional Ancient Source"
      });
    } catch (err) {
      console.error(`   ❌ Failed to ingest ${file}:`, err);
    }
  }

  console.log("\n✅ ALL BOOKS INGESTED. NUMERIQ.AI is now esoterically aligned.");
}

main().catch(console.error);
