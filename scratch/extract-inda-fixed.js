const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractText() {
    console.log("📖 Extracting text from inda.pdf using PDFParse...");
    const filePath = "./inda.pdf";
    
    if (!fs.existsSync(filePath)) {
        console.error("❌ File not found:", filePath);
        return;
    }

    const parser = new PDFParse({ data: fs.readFileSync(filePath) });
    try {
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
