const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
    const filePath = "Sepharial-the-Kabala-of-Numbers.pdf";
    console.log(`📖 Loading Sepharial Part 1 PDF: ${filePath}...`);
    
    const parser = new PDFParse();
    try {
        await parser.load(filePath);
        const result = await parser.getText();
        
        fs.writeFileSync('scratch/sepharial-p1-text.txt', result.text);
        console.log(`✅ SUCCESS: Part 1 extracted (${result.text.length} chars).`);
        console.log("   Preview of first 2000 chars:");
        console.log(result.text.substring(0, 2000));
    } catch (e) {
        console.error("❌ Extraction failed:", e.message);
    } finally {
        await parser.destroy();
    }
}

extract().catch(console.error);
