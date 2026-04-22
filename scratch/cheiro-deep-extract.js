const fs = require('fs');
const pdf = require('pdf-parse');

/**
 * NUMERIQ.AI — Deep Cheiro Extraction
 * Extracts specific compound number descriptions from the source PDF.
 */

async function extract() {
  const filePath = "C:/Users/shyam/Drive D/Selvo World/Numbers/Cheiros-Book-Of-Numbers.pdf";
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  const results = {};

  for (let i = 10; i <= 52; i++) {
    const startPattern = new RegExp(`Number ${i}[^0-9]`, 'i');
    const match = text.match(startPattern);
    
    if (match) {
      const startIndex = match.index;
      // Find the next number to delimit the description
      const nextPattern = new RegExp(`Number ${i + 1}[^0-9]`, 'i');
      const nextMatch = text.match(nextPattern);
      const endIndex = nextMatch ? nextMatch.index : startIndex + 1500;
      
      let description = text.slice(startIndex, endIndex).trim();
      // Clean up headers/page numbers that might be caught
      description = description.replace(/\s+/g, ' ');
      results[i] = description;
    }
  }

  // Extract 1-9 Planetary
  const p1_9 = {};
  for (let i = 1; i <= 9; i++) {
     const match = text.match(new RegExp(`Number ${i}[^0-9]`, 'i'));
     if (match) {
        p1_9[i] = text.slice(match.index, match.index + 500).replace(/\s+/g, ' ');
     }
  }

  fs.writeFileSync('scratch/cheiro-extracted.json', JSON.stringify({ compounds: results, singleDigits: p1_9 }, null, 2));
  console.log("✅ Extraction complete. Results saved to scratch/cheiro-extracted.json");
}

extract().catch(console.error);
