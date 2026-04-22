const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText() {
    console.log("📖 Extracting text with pdfjs-dist...");
    const filePath = "./Cheiros-Book-Of-Numbers.pdf";
    const data = new Uint8Array(fs.readFileSync(filePath));

    try {
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        console.log(`   📄 Document loaded. Total pages: ${numPages}`);

        let fullText = "";
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
            
            if (i % 20 === 0) process.stdout.write(`   ⚡ Processed ${i} pages...\r`);
        }

        fs.writeFileSync('scratch/raw-pdf-text.txt', fullText);
        console.log("\n✅ Success! Text saved to scratch/raw-pdf-text.txt");
    } catch (e) {
        console.error("❌ PDFJS Extraction failed:", e.message);
    }
}

extractText().catch(console.error);
