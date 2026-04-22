const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    const dataBuffer = fs.readFileSync('Sepharial-the-Kabala-of-Numbers.pdf');
    try {
        const data = await pdf(dataBuffer);
        fs.writeFileSync('scratch/sepharial-p1-dump.txt', data.text);
        console.log(`✅ SUCCESS: Part 1 extracted (${data.text.length} chars).`);
        console.log("Preview:", data.text.substring(0, 1000));
    } catch (e) {
        console.log("❌ Standard pdf-parse failed, trying property access:", e.message);
        // Sometimes it's exported as a property
        if (pdf.PDFParse) {
            console.log("Found PDFParse class...");
        }
    }
}

extract().catch(console.error);
