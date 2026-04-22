const fs = require('fs');
const path = require('path');

const inputPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/inda-raw.txt';
const outputPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/inda-clean.txt';

console.log("🧹 Normalizing inda-raw.txt...");

if (!fs.existsSync(inputPath)) {
    console.error("❌ Source file not found:", inputPath);
    process.exit(1);
}

const content = fs.readFileSync(inputPath, 'utf8');

// Replace tabs with spaces
// Compress multiple spaces into one
// Trim each line
const cleanContent = content
    .replace(/\t/g, ' ')
    .split('\n')
    .map(line => line.replace(/\s+/g, ' ').trim())
    .join('\n');

fs.writeFileSync(outputPath, cleanContent);

console.log(`✅ Success! Cleaned text saved to ${outputPath}`);
console.log(`📊 Chars reduced from ${content.length} to ${cleanContent.length}`);
