const pdfParse = require('pdf-parse/node');
console.log("Exports:", Object.keys(pdfParse));
console.log("Default export type:", typeof pdfParse);
if (pdfParse.PDFParse) console.log("PDFParse type:", typeof pdfParse.PDFParse);
