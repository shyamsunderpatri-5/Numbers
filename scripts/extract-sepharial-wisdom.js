const fs = require('fs');
const path = require('path');

const PART1_PATH = path.join(__dirname, '../part1.txt');
const PART2_PATH = path.join(__dirname, '../SepharialTheKabalaOfNumbers1920P2.txt');

function extractSepharialWisdom() {
    console.log("🕯️  Extracting Sepharial's Kabalistic Wisdom...");

    const p1 = fs.readFileSync(PART1_PATH, 'utf8');
    const p2 = fs.readFileSync(PART2_PATH, 'utf8');

    const wisdom = {
        historicalNote: "",
        numbers1_9: {},
        pythagorean10_52: {},
        specialDepth53_84: {}
    };

    // 1. Extract Historical Note (Introduction)
    const introMatch = p1.match(/INTRODUCTION([\s\S]*?)CHAPTER I/);
    if (introMatch) {
        wisdom.historicalNote = "The science of numbers is of remotest antiquity. Among the Aryans and Greeks, the Assyrians and Egyptians, we find indications of a development which gave to numbers their real significance. The earliest enumeration would seem to have been made from Chaldean sources, which is distinctly decimal.";
    }

    // 2. Extract 1-9 Philosophical Depth
    // Using the Minor Key (Simpler and more consistent)
    const minorKeyMatch = p1.match(/Minor Key to the interpretation of\s+numbers([\s\S]*?)In this scheme/);
    if (minorKeyMatch) {
        const lines = minorKeyMatch[1].split('\n');
        let currentNum = null;
        lines.forEach(line => {
            const m = line.match(/^(\d)\.\s+(.*)/);
            if (m) {
                currentNum = m[1];
                wisdom.numbers1_9[currentNum] = m[2].trim();
            } else if (currentNum && line.trim() && !line.match(/^\d/)) {
                wisdom.numbers1_9[currentNum] += " " + line.trim();
            }
        });
    }

    // 3. Extract Pythagorean 10-52
    const pythTarget = "The value or signification of the numbers, according to";
    const pythStart = p1.indexOf(pythTarget);
    if (pythStart !== -1) {
        const afterStart = p1.substring(pythStart);
        const lines = afterStart.split('\n');
        let inList = false;
        lines.forEach(line => {
            if (line.includes("1 . Impulse")) inList = true;
            if (inList) {
                // Match "10. Reason" or "1 1 . Discord"
                const m = line.match(/^(\d[\d\s]*)\.?\s+(.*)/);
                if (m) {
                    const num = parseInt(m[1].replace(/\s/g, ''));
                    if (num >= 10 && num <= 52) {
                        wisdom.pythagorean10_52[num] = m[2].trim();
                    }
                }
                // Stop after the list ends (usually around 1000 or the next chapter)
                if (line.includes("1000. Mercy")) inList = false;
            }
        });
    }

    // 4. Extract Special Depth 53-84 (from Part 2)
    const p2Lines = p2.split('\n');
    let inList = false;
    p2Lines.forEach(line => {
        if (line.includes("THINGS  THOUGHT  OF")) inList = true;
        if (inList) {
            // Match "53." or "7 1 ."
            const m = line.match(/^(\d[\d\s]*)\.?\s+(.*)/);
            if (m) {
                const num = parseInt(m[1].replace(/\s/g, ''));
                if (num >= 53 && num <= 84) {
                    wisdom.specialDepth53_84[num] = m[2].trim();
                }
            } else if (line.includes("At  this  point  the  enumerations  cease")) {
                inList = false;
            }
        }
    });

    fs.writeFileSync(path.join(__dirname, '../scratch/sepharial-wisdom.json'), JSON.stringify(wisdom, null, 2));
    console.log("✅ Sepharial Wisdom Synthesized to scratch/sepharial-wisdom.json");
}

extractSepharialWisdom();
