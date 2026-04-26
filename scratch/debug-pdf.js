const pdf = require("pdf-parse");
console.log("PDF type:", typeof pdf);
console.log("PDF keys:", Object.keys(pdf));
if (typeof pdf !== "function") {
    console.log("Default property:", typeof pdf.default);
}
