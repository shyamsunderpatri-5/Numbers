const fs = require('fs');

const wisdomPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/unified-raw-wisdom.json';
const wisdom = JSON.parse(fs.readFileSync(wisdomPath, 'utf8'));

function extractByKeywords(text, keywords) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const relevant = sentences.filter(s => 
        keywords.some(k => s.toLowerCase().includes(k.toLowerCase()))
    );
    // Remove excessive spacing and weird OCR chars
    return relevant.slice(0, 5).join(' ').replace(/\s+/g, ' ').trim();
}

function summarizeLindaSingle(i) {
    const raw = wisdom.linda.singles[i].raw;
    const lines = raw.split('\n').filter(l => l.length > 50);
    const core = lines.slice(0, 4).join(' ').replace(/\s+/g, ' ').trim();
    const relationships = extractByKeywords(raw, ['love', 'romance', 'marriage', 'partner', 'opposite sex', 'home', 'family', 'intimacy']);
    const quality = extractByKeywords(raw, ['quality', 'fortunate', 'challenging', 'symbolized', 'vibration', 'power', 'spirit', 'lessons', 'karma']);
    
    return {
        indaNarrative: core,
        relationshipPattern: relationships,
        qualityExplanation: quality
    };
}

console.log("🛠️ Starting Single Numbers Enrichment...");

const singlesPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/src/lib/numerology/knowledge/numbers-1-9.ts';
let singlesContent = fs.readFileSync(singlesPath, 'utf8');

for (let i = 1; i <= 9; i++) {
    const data = summarizeLindaSingle(i);
    
    // Replace indaNarrative
    const narrativeRegex = new RegExp(`indaNarrative: ".*?"`, 'm');
    // For single numbers, we need to find the specific block for the number
    const blockStart = singlesContent.indexOf(`  ${i}: {`);
    const blockEnd = singlesContent.indexOf(`  }${i < 9 ? ',' : ''}\n`, blockStart);
    let block = singlesContent.substring(blockStart, blockEnd);

    if (data.indaNarrative) {
        block = block.replace(/indaNarrative: ".*?"/, `indaNarrative: "${data.indaNarrative.replace(/"/g, "'")}"`);
    }
    if (data.relationshipPattern) {
        block = block.replace(/relationshipPattern: ".*?"/, `relationshipPattern: "${data.relationshipPattern.replace(/"/g, "'")}"`);
    }
    // qualityExplanation is often the common one, I'll keep it as is or append if needed.
    
    singlesContent = singlesContent.substring(0, blockStart) + block + singlesContent.substring(blockEnd);
}

fs.writeFileSync(singlesPath, singlesContent);
console.log("✅ numbers-1-9.ts updated.");

console.log("🛠️ Starting Compound Numbers Enrichment...");
const compoundsPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/src/lib/numerology/knowledge/compounds-10-52.ts';
let compoundsContent = fs.readFileSync(compoundsPath, 'utf8');

for (let i = 10; i <= 52; i++) {
    const raw = wisdom.linda.compounds[i] ? wisdom.linda.compounds[i].raw : null;
    if (!raw) continue;
    
    const summary = raw.split('\n').filter(l => l.length > 30).slice(0, 4).join(' ').replace(/\s+/g, ' ').replace(/"/g, "'").trim();
    
    const blockStart = compoundsContent.indexOf(`  ${i}: {`);
    const blockEnd = compoundsContent.indexOf(`  }${i < 52 ? ',' : ''}\n`, blockStart);
    if (blockStart === -1) continue;

    let block = compoundsContent.substring(blockStart, blockEnd);
    block = block.replace(/indaMeaning: ".*?"/, `indaMeaning: "${summary}"`);
    
    compoundsContent = compoundsContent.substring(0, blockStart) + block + compoundsContent.substring(blockEnd);
}

fs.writeFileSync(compoundsPath, compoundsContent);
console.log("✅ compounds-10-52.ts updated.");
