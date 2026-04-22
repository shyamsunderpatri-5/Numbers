const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract() {
    console.log("📖 Extracting Pure Text from Root PDF...");
    const filePath = "./Cheiros-Book-Of-Numbers.pdf";
    
    const parser = new PDFParse();
    try {
        console.log("   🔄 Loading file...");
        // Assuming load handles the file path or we can use the buffer
        await parser.load(filePath); 
        
        console.log("   📑 Extracting text...");
        const result = await parser.getText();
        
        fs.writeFileSync('scratch/raw-pdf-text.txt', result.text);
        console.log(`✅ Extraction successful! (${result.text.length} chars)`);
        console.log("   Results saved to scratch/raw-pdf-text.txt");
    } catch (e) {
        console.error("❌ Extraction failed:", e.message);
    } finally {
        await parser.destroy();
    }
}

extract().catch(console.error);
