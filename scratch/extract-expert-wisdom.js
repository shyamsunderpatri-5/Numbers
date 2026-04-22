const fs = require('fs');

const indaPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/inda-clean.txt';
const heatherPath = 'c:/Users/shyam/Drive D/Selvo World/Numbers/HEATHER.txt';

function extractLinda() {
    const content = fs.readFileSync(indaPath, 'utf8');
    const data = { singles: {}, compounds: {} };

    // Linda Singles (1-9)
    // She uses "The Number 1", "The Number 2" etc.
    // Confirmed start at 540,600
    for (let i = 1; i <= 9; i++) {
        const marker = `The Number ${i}`;
        const startIdx = content.indexOf(marker, 480000); 
        if (startIdx === -1) continue;
        
        const sub = content.slice(startIdx);
        const nextMarker = i < 9 ? `The Number ${i + 1}` : `Definitions of Compound Numbers`;
        const endIdx = sub.indexOf(nextMarker, marker.length);
        const block = endIdx !== -1 ? sub.slice(0, endIdx) : sub.slice(0, 15000);

        data.singles[i] = {
            raw: block.trim()
        };
        console.log(`- Extracted Linda Single ${i} (${data.singles[i].raw.length} chars)`);
    }

    // Linda Compounds (10-52)
    // Confirmed start at 525,306
    const compoundStart = 525000;
    const compContent = content.slice(compoundStart);

    for (let i = 10; i <= 52; i++) {
        // Markers are often "10 ", "\n10\n", or similar
        const markerLine = `\n${i} `;
        const alternativeMarker = `\n${i}\n`;
        
        let startIdx = compContent.indexOf(markerLine);
        if (startIdx === -1) startIdx = compContent.indexOf(alternativeMarker);
        
        // If still not found, try without newline for the first one
        if (i === 10 && startIdx === -1) {
             const fallback = compContent.indexOf("The Wheel of Fortune");
             if (fallback !== -1) startIdx = fallback;
        }

        if (startIdx === -1) continue;

        const sub = compContent.slice(startIdx);
        const nextMarker = `\n${i + 1} `;
        const nextMarkerAlt = `\n${i + 1}\n`;
        
        let endIdx = sub.indexOf(nextMarker, 5);
        if (endIdx === -1) endIdx = sub.indexOf(nextMarkerAlt, 5);
        
        const block = endIdx !== -1 ? sub.slice(0, endIdx) : sub.slice(0, 5000);

        data.compounds[i] = {
            raw: block.trim()
        };
    }
    console.log(`- Extracted ${Object.keys(data.compounds).length} Linda Compounds`);

    return data;
}

function extractHeather() {
    const content = fs.readFileSync(heatherPath, 'utf8');
    const data = { singles: {} };

    // Heather Singles (1-9)
    // Uses "Number One (1)", "Number Two (2)"
    const words = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    
    for (let i = 1; i <= 9; i++) {
        const marker = `Number ${words[i-1]} (${i})`;
        const startIdx = content.indexOf(marker);
        if (startIdx === -1) continue;

        const sub = content.slice(startIdx, startIdx + 20000);
        const nextMarker = i < 9 ? `Number ${words[i]} (${i + 1})` : `one: Chaldean Numerology Chart`;
        const endIdx = sub.indexOf(nextMarker);
        const block = endIdx !== -1 ? sub.slice(0, endIdx) : sub;

        data.singles[i] = {
            raw: block.trim()
        };
    }

    return data;
}

async function run() {
    console.log("🧐 Extracting Linda's Wisdom...");
    const linda = extractLinda();
    console.log("🧐 Extracting Heather's Wisdom...");
    const heather = extractHeather();

    const unified = {
        linda,
        heather
    };

    fs.writeFileSync('c:/Users/shyam/Drive D/Selvo World/Numbers/scratch/unified-raw-wisdom.json', JSON.stringify(unified, null, 2));
    console.log("✅ Extraction Complete! Saved to scratch/unified-raw-wisdom.json");
}

run();
