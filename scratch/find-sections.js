const fs = require('fs');

const content = fs.readFileSync('scratch/inda-raw.txt', 'utf8');

const keywords = [
    "CHALDEAN NUMEROLOGY",
    "THE MAGIC OF LEXIGRAMS",
    "NUMBER 1",
    "NUMBER 2",
    "NUMBER 3",
    "NUMBER 4",
    "NUMBER 5",
    "NUMBER 6",
    "NUMBER 7",
    "NUMBER 8",
    "NUMBER 9",
    "COMPOUND NUMBERS",
    "NUMBER 10",
    "NUMBER 11",
    "NUMBER 22"
];

const results = [];

keywords.forEach(kw => {
    let index = content.indexOf(kw);
    while (index !== -1) {
        // Get line number (estimate)
        const lineCount = content.substring(0, index).split('\n').length;
        results.push({ keyword: kw, index, line: lineCount });
        index = content.indexOf(kw, index + 1);
        if (results.filter(r => r.keyword === kw).length > 3) break; // limit results
    }
});

console.log(JSON.stringify(results, null, 2));
