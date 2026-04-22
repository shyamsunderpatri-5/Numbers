const fs = require('fs');
const pdf = require('pdf-parse');

async function test() {
  const dataBuffer = fs.readFileSync("C:/Users/shyam/Drive D/Selvo World/Numbers/Cheiros-Book-Of-Numbers.pdf");
  
  // If it's a class
  if (typeof pdf === 'object' && pdf.PDFParse) {
     console.log("Detected PDFParse class.");
     // Some libraries require an instance
  }
  
  // Check exports directly
  console.log("Exports:", Object.keys(pdf));
}

test();
