const { BLACKLIST } = require("./chaldean-core-v1");

const CALCULATION_VERBS = ["sum", "total", "reduce", "derive"];
const BINDING_PATTERNS = [
    /\bnumber\s*\d+\b/i,
    /\bpeople with\s*\d+\b/i,
    /\b\d+\s*people\b/i,
    /\bis\s*(a|an)?\s*\d+\b/i,
    /\b(the|a|an)?\s*\d+\s+is\b/i,
    /\bvibrates\s*to\s*\d+\b/i
];

function checkFirewall(text) {
    const lowerText = text.toLowerCase();

    // 1. Blacklisted Keywords
    const keywordMatch = BLACKLIST.find(word => 
        new RegExp(`\\b${word}\\b`, "i").test(text)
    );
    if (keywordMatch) return { pass: false, reason: `Contains blacklisted keyword: ${keywordMatch}` };

    // 2. Calculation Language
    const calcMatch = CALCULATION_VERBS.find(verb => 
        new RegExp(`\\b${verb}\\b`, "i").test(lowerText)
    );
    if (calcMatch) return { pass: false, reason: `Contains calculation language: ${calcMatch}` };

    // 3. Number-Trait Binding
    const bindingMatch = BINDING_PATTERNS.find(pattern => pattern.test(text));
    if (bindingMatch) return { pass: false, reason: `Contains numeric personality binding: ${bindingMatch}` };

    return { pass: true };
}

module.exports = { checkFirewall };
