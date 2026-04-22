import fs from 'fs';
import { PDFParse } from 'pdf-parse/node';

async function extractText() {
    console.log("📖 Extracting text from inda.pdf using pdf-parse/node (ESM)...");
    const filePath = "./inda.pdf";
    
    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        return;
    }

    const parser = new PDFParse();
    try {
        await parser.load(filePath);
        const result = await parser.getText();
        
        fs.writeFileSync('scratch/inda-raw.txt', result.text);
        console.log(`\n✅ Success! Text saved to scratch/inda-raw.txt (${result.text.length} chars)`);
    } catch (e) {
        console.error("❌ PDF Extraction failed:", e.message);
    } finally {
        if (parser.destroy) await parser.destroy();
    }
}

extractText().catch(console.error);
