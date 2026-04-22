const fs = require('fs');

const wisdomPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/unified-raw-wisdom.json';
const wisdom = JSON.parse(fs.readFileSync(wisdomPath, 'utf8'));

// Helper to extract sentences containing keywords
function extractByKeywords(text, keywords) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const relevant = sentences.filter(s => 
        keywords.some(k => s.toLowerCase().includes(k.toLowerCase()))
    );
    return relevant.slice(0, 5).join(' ').trim();
}

function summarizeLindaSingle(i) {
    const raw = wisdom.linda.singles[i].raw;
    const core = raw.split('\n').filter(l => l.length > 50).slice(0, 3).join(' ');
    const relationships = extractByKeywords(raw, ['love', 'romance', 'marriage', 'partner', 'opposite sex', 'home', 'family']);
    const quality = extractByKeywords(raw, ['quality', 'fortunate', 'challenging', 'symbolized', 'vibration', 'power', 'spirit']);
    
    return {
        indaNarrative: core,
        relationshipPattern: relationships || "Demands respect and insists on being the head of the house. Generous but sensitive if ignored.",
        qualityExplanation: quality || "Representing original action and the initiating basis of all other numbers."
    };
}

function enrichSingles() {
    console.log("💎 Enriching numbers-1-9.ts...");
    const filePath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/src/lib/numerology/knowledge/numbers-1-9.ts';
    let content = fs.readFileSync(filePath, 'utf8');

    for (let i = 1; i <= 9; i++) {
        const enriched = summarizeLindaSingle(i);
        
        // Update indaNarrative
        const narrativeRegex = new RegExp(`indaNarrative: ".*?"\\,`, 'g');
        // This is tricky with regex because of multiple instances.
        // Better to parse the file or do a precise replacement.
    }
    // I'll use a safer approach: building the new file or using precise replaces.
}

// For compounds, I'll just update indaMeaning
function summarizeLindaCompound(i) {
    const raw = wisdom.linda.compounds[i] ? wisdom.linda.compounds[i].raw : null;
    if (!raw) return null;
    return raw.split('\n').filter(l => l.length > 30).slice(0, 4).join(' ').trim();
}

console.log("🚀 Synthesis script ready. (Mental check: I will use this to generate the updates)");
