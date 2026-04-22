const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function testPdf(filePath) {
    console.log(`Testing PDF: ${filePath}`);
    try {
        const dataBuffer = fs.readFileSync(filePath);
        
        // Correct usage for Mehmet Kozan's pdf-parse v2.4.5
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        
        console.log(`Successfully parsed.`);
        console.log(`Extracted ${data.text.length} characters.`);
        console.log(`Preview: ${data.text.substring(0, 500).replace(/\n/g, ' ')}`);
        return data.text;
    } catch (error) {
        console.error(`Error parsing PDF ${filePath}: ${error.message}`);
        return null;
    }
}

async function main() {
    const file1 = 'c:/Users/shyam/Drive D/Selvo World/Numbers/sepharial-the-kabala-of-numbers-part2.pdf';
    const file2 = 'c:/Users/shyam/Drive D/Selvo World/Numbers/numerology-a-complete-guide-to-understanding.pdf';
    
    await testPdf(file1);
    await testPdf(file2);
}

main();
