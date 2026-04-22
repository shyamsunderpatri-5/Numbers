const fs = require("fs");
const path = require("path");

// Import logic from classify-embeddings.js (or copy it here for a quick standalone test)
const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, "trait-ontology.json"), "utf8"));

const CALCULATION_VERBS = ["add", "sum", "total", "reduce", "derive"];
const STRUCTURAL_PHRASES = [
    "your number is calculated", 
    "based on your birth date",
    "calculated by",
    "digit sum",
    "reduces to"
];
const SYSTEM_CONSTRUCT_REGEX = /(Life Path|Expression Number|Destiny Number|Soul Urge|Personality Number)\s*\d*\s*means/i;
const SYSTEM_KEYWORDS = ontology.blacklist_keywords;

function classify(text) {
    const lowerText = text.toLowerCase();

    // 1. Check for A_DELETE (Hard Determinism)
    // Matches verbs and their variations (e.g., add, adding, derived, reduction)
    const hasCalcVerb = CALCULATION_VERBS.some(verb => new RegExp(`\\b${verb}\\w*\\b`, "i").test(lowerText));
    const hasStructuralPhrase = STRUCTURAL_PHRASES.some(phrase => lowerText.includes(phrase.toLowerCase()));
    const hasConstruct = SYSTEM_CONSTRUCT_REGEX.test(text);

    if (hasCalcVerb || hasStructuralPhrase || hasConstruct) {
        return 'A_DELETE';
    }

    // 2. Check for B_CLEAN vs C_SAFE
    const hasSystemKeyword = SYSTEM_KEYWORDS.some(word => 
        new RegExp(`\\b${word}\\b`, "i").test(text)
    );
    
    const hasNumericPattern = /\b(number\s*\d+|\d+\s*people|people with\s*\d+)\b/i.test(text);

    if (hasSystemKeyword || hasNumericPattern) {
        return 'B_CLEAN';
    }

    return 'C_SAFE';
}

const testCases = [
    {
        text: "Your Life Path number is calculated by adding your birth date digits.",
        expected: "A_DELETE"
    },
    {
        text: "Expression Number 3 is derived from your full name.",
        expected: "A_DELETE"
    },
    {
        text: "Reduce the total to a single digit to find your destiny.",
        expected: "A_DELETE"
    },
    {
        text: "Life Path 5 people are adventurous and freedom loving.",
        expected: "B_CLEAN"
    },
    {
        text: "A person with number 7 is often introspective.",
        expected: "B_CLEAN"
    },
    {
        text: "The sun brings vitality and leadership qualities.",
        expected: "C_SAFE"
    }
];

console.log("🧪 RUNNING CLASSIFICATION LOGIC TESTS...");
console.log("==========================================");

let passed = 0;
testCases.forEach((tc, i) => {
    const result = classify(tc.text);
    const status = result === tc.expected ? "✅ PASS" : "❌ FAIL";
    if (result === tc.expected) passed++;
    
    console.log(`Test ${i + 1}: ${status}`);
    console.log(`   Input   : "${tc.text}"`);
    console.log(`   Result  : ${result}`);
    console.log(`   Expected: ${tc.expected}`);
    console.log("------------------------------------------");
});

console.log(`\n📊 RESULTS: ${passed}/${testCases.length} tests passed.`);
