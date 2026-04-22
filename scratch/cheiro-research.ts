import fs from "fs";
import pdf from "pdf-parse";

/**
 * NUMERIQ.AI — Cheiro Research Script
 * Extracts text from specific page ranges to verify format.
 */

async function research() {
  const filePath = "C:/Users/shyam/Drive D/Selvo World/Numbers/Cheiros-Book-Of-Numbers.pdf";
  const dataBuffer = fs.readFileSync(filePath);
  
  // Custom pager: we'll just extract the whole thing and then split by form-feed or similar 
  // though pdf-parse doesn't always provide clean page numbers.
  const data = await pdf(dataBuffer);
  
  console.log("PDF Title:", data.info.Title);
  console.log("Total Pages (Metadata):", data.numpages);
  
  // Let's dump the first 5000 characters to see the start
  console.log("\n--- START OF DOCUMENT ---\n");
  console.log(data.text.slice(0, 5000));
  
  // Let's look for "10" (Start of compounds)
  const compoundIndex = data.text.indexOf("Number 10");
  if (compoundIndex !== -1) {
    console.log("\n--- COMPOUND SECTION PREVIEW ---\n");
    console.log(data.text.slice(compoundIndex, compoundIndex + 5000));
  } else {
    // Try other keywords
    console.log("\n'Number 10' not found. Searching for 'Number 1'...");
    const n1Index = data.text.indexOf("Number 1");
    if (n1Index !== -1) {
      console.log(data.text.slice(n1Index, n1Index + 2000));
    }
  }
}

research().catch(console.error);
