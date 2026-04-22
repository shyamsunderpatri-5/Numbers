const fs = require('fs');
const pdf = require('pdf-parse');

async function dumpPdf() {
    const dataBuffer = fs.readFileSync('Sepharial-the-Kabala-of-Numbers.pdf');
    
    let parseFunc = pdf;
    if (typeof pdf !== 'function' && pdf.default) parseFunc = pdf.default;
    
    if (typeof parseFunc !== 'function') {
        console.error("❌ pdf-parse is not a function. Exports:", Object.keys(pdf));
        process.exit(1);
    }

    const data = await parseFunc(dataBuffer);
    
    console.log("PDF Pages:", data.numpages);
    console.log("\n--- START OF PDF CONTENT ---");
    console.log(data.text.substring(0, 10000)); // Increase preview to 10k
    console.log("\n--- END OF PREVIEW ---");
}

dumpPdf().catch(console.error);
