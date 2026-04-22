const fs = require('fs');

/**
 * NUMERIQ.AI — Robust Wisdom Extractor v2 (Pure Text)
 * handles OCR quirks like '4(1.' and variations in lucky element formatting.
 */

const sourcePath = "c:/Users/shyam/Drive D/Selvo World/Numbers/Cheiro-Book.txt";
const content = fs.readFileSync(sourcePath, 'utf8');

function extractCompounds() {
    const compounds = {};
    const startIdx = content.indexOf("CHAPTER XIII");
    const endIdx = content.indexOf("CHAPTER XIV");
    const subContent = content.substring(startIdx, endIdx);

    // Split by number patterns like "10.", "11.", or "4(1." (OCR quirk for 46)
    const lines = subContent.split('\n');
    let currentNum = null;
    let currentText = "";

    for (let line of lines) {
        // Match numbers 10-52 at start of line, allowing for common OCR errors
        let match = line.match(/^(\d{2})[\.\s(]+|^4\(1\./);
        if (match) {
            if (currentNum) {
                compounds[currentNum] = finalizeEntry(currentNum, currentText);
            }
            currentNum = match[0].includes('4(') ? "46" : match[1];
            currentText = line.replace(/^\d{2}[\.\s\(]+|^4\(1\./, '').trim();
        } else if (currentNum) {
            currentText += " " + line.trim();
        }
    }
    if (currentNum) compounds[currentNum] = finalizeEntry(currentNum, currentText);

    return compounds;
}

function finalizeEntry(num, text) {
    text = text.replace(/\s+/g, ' ').trim();
    let quality = "favorable";
    if (text.toLowerCase().includes("unfortunate") || text.toLowerCase().includes("warning") || text.toLowerCase().includes("treachery") || text.toLowerCase().includes("disaster")) {
        quality = "unfortunate";
    }

    let traditionalName = "";
    const nameMatch = text.match(/Symbolised as "(.*?)"/i) || text.match(/represented as "(.*?)"/i) || text.match(/called "(.*?)"/i) || text.match(/known as "(.*?)"/i);
    if (nameMatch) traditionalName = nameMatch[1];
    
    return { meaning: text, quality, traditionalName };
}

function extractSingleNumbers() {
    const numbers = {};
    const planets = { "1":"Sun", "2":"Moon", "3":"Jupiter", "4":"Uranus", "5":"Mercury", "6":"Venus", "7":"Neptune", "8":"Saturn", "9":"Mars" };

    for (let i = 1; i <= 9; i++) {
        const startMarker = `THE NUMBER ${i}`;
        const startIdx = content.indexOf(startMarker);
        if (startIdx === -1) {
            // Try with words instead of digits
            const words = ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
            const wordIdx = content.indexOf(`THE NUMBER ${words[i-1]}`);
            if (wordIdx === -1) continue;
        }

        const actualIdx = content.indexOf(`THE NUMBER ${i}`) !== -1 ? content.indexOf(`THE NUMBER ${i}`) : content.indexOf(`THE NUMBER ${["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"][i-1]}`);
        const sub = content.substring(actualIdx, actualIdx + 5000);
        
        const colors = sub.match(/colours (?:.*?)are (.*?)(?:\.|\n|Their)/i);
        const stones = sub.match(/stone(?:s)? (?:.*?)are (.*?)(?:\.|\n|They)/i);
        const days = sub.match(/days (?:.*?)fortunate (?:.*?)are (.*?)(?:\.|\n|These)/i);

        numbers[i] = {
            planet: planets[i],
            luckyDays: days ? days[1].trim() : "See book description",
            luckyColors: colors ? colors[1].trim() : "See book description",
            luckyStones: stones ? stones[1].trim() : "See book description"
        };
    }
    return numbers;
}

async function run() {
    console.log("🧩 Extracting Robust Pure Wisdom...");
    const compounds = extractCompounds();
    const singles = extractSingleNumbers();
    
    console.log(`✅ Extracted ${Object.keys(compounds).length} Compounds.`);
    console.log(`✅ Extracted ${Object.keys(singles).length} Core Numbers.`);

    fs.writeFileSync('scratch/wisdom-map.json', JSON.stringify({ compounds, singles }, null, 2));
}

run().catch(console.error);
