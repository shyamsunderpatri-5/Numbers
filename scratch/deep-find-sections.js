const fs = require('fs');
const content = fs.readFileSync('c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/inda-raw.txt', 'utf8');
const lines = content.split('\n');

const findings = [];

lines.forEach((line, i) => {
    // Check for "NUMBER X" with flexible spacing/tabs
    if (line.match(/N\s*U\s*M\s*B\s*E\s*R\s+\d+/i) || line.match(/T\s*H\s*E\s+N\s*U\s*M\s*B\s*E\s*R\s+\d+/i)) {
        findings.push({ line: i + 1, content: line.trim() });
    }
    if (line.match(/Definitions\s+of\s+Single\s+Numbers/i) || line.match(/Definitions\s+of\s+Compound\s+Numbers/i)) {
        findings.push({ line: i + 1, content: line.trim() });
    }
    if (line.match(/Linda\s+Goodman/i)) {
        // findings.push({ line: i + 1, content: line.trim() });
    }
});

console.log(JSON.stringify(findings, null, 2));
