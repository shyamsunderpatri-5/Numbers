const fs = require('fs');

/**
 * NUMERIQ.AI — Elite Wisdom Integrator
 * The final "One Source" extraction from Cheiro-Book.txt.
 */

const sourcePath = "c:/Users/shyam/Drive D/Selvo World/Numbers/Cheiro-Book.txt";
const content = fs.readFileSync(sourcePath, 'utf8');

function extractCompounds() {
    const compounds = {};
    const startIdx = content.indexOf("CHAPTER XIII");
    const endIdx = content.indexOf("CHAPTER XIV");
    const subContent = content.substring(startIdx, endIdx);

    const lines = subContent.split('\n');
    let currentNum = null;
    let currentText = "";

    for (let line of lines) {
        // Handle standard "10. ", "11. " and OCR quirk "4(1." for 46
        let match = line.match(/^(\d{2})[\.\s(]+|^4\(1\./);
        if (match) {
            if (currentNum) finalize(currentNum, currentText);
            currentNum = match[0].includes('4(') ? "46" : match[1];
            currentText = line.replace(/^\d{2}[\.\s\(]+|^4\(1\./, '').trim();
        } else if (currentNum) {
            currentText += " " + line.trim();
        }
    }
    if (currentNum) finalize(currentNum, currentText);

    function finalize(num, text) {
        text = text.replace(/\s+/g, ' ').trim();
        let name = "";
        const nameMatch = text.match(/Symbolised as "(.*?)"/i) || text.match(/represented as "(.*?)"/i) || text.match(/called "(.*?)"/i) || text.match(/known as "(.*?)"/i);
        if (nameMatch) name = nameMatch[1];
        
        compounds[num] = {
            meaning: text,
            quality: (text.toLowerCase().includes("unfortunate") || text.toLowerCase().includes("warning") || text.toLowerCase().includes("treachery") || text.toLowerCase().includes("disaster")) ? "unfortunate" : "favorable",
            traditionalName: name
        };
    }
    return compounds;
}

function extractSingles() {
    const singles = {};
    const map = [
        { n: 1, planet: "Sun" },
        { n: 2, planet: "Moon" },
        { n: 3, planet: "Jupiter" },
        { n: 4, planet: "Uranus" },
        { n: 5, planet: "Mercury" },
        { n: 6, planet: "Venus" },
        { n: 7, planet: "Neptune" },
        { n: 8, planet: "Saturn" },
        { n: 9, planet: "Mars" }
    ];

    map.forEach(item => {
        const marker = `THE NUMBER ${item.n}`;
        let start = content.indexOf(marker);
        if (start === -1) {
            const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
            start = content.indexOf(`THE NUMBER ${romans[item.n-1]}`);
        }
        
        if (start !== -1) {
            const sub = content.substring(start, start + 4000);
            const color = sub.match(/fortunate" colours (?:.*?)are (.*?)(?:\.|\n|Their)/i) || sub.match(/lucky" colours (?:.*?)are (.*?)(?:\.|\n|Their)/i);
            const stone = sub.match(/stone(?:s)? (?:.*?)are (.*?)(?:\.|\n|They)/i);
            const day = sub.match(/days (?:.*?)fortunate (?:.*?)are (.*?)(?:\.|\n|These)/i);

            singles[item.n] = {
                planet: item.planet,
                luckyDays: day ? day[1].trim() : "See book context",
                luckyColors: color ? color[1].trim() : "See book context",
                luckyStones: stone ? stone[1].trim() : "See book context"
            };
        }
    });
    return singles;
}

const data = {
    compounds: extractCompounds(),
    singles: extractSingles()
};

fs.writeFileSync('scratch/elite-wisdom.json', JSON.stringify(data, null, 2));
console.log("💎 Elite wisdom synthesized into scratch/elite-wisdom.json");
