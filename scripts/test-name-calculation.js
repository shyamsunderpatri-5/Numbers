/**
 * Name Calculation Test: RAHUL
 * Comparing Chaldean vs Pythagorean logic to verify "Chaldean Sovereignty"
 */

const CHALDEAN_MAP = {
    'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
    'B': 2, 'K': 2, 'R': 2,
    'C': 3, 'G': 3, 'L': 3, 'S': 3,
    'D': 4, 'M': 4, 'T': 4,
    'E': 5, 'H': 5, 'N': 5, 'X': 5,
    'U': 6, 'V': 6, 'W': 6,
    'O': 7, 'Z': 7,
    'F': 8, 'P': 8
};

const PYTHAGOREAN_MAP = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
};

function calculate(name, map) {
    let sum = 0;
    let breakdown = [];
    for (let char of name.toUpperCase()) {
        if (map[char]) {
            sum += map[char];
            breakdown.push(`${char}(${map[char]})`);
        }
    }
    return { sum, breakdown: breakdown.join(" + ") };
}

function reduce(num) {
    if (num <= 9 && num !== 0) return num;
    const reduced = String(num).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return reduce(reduced);
}

const name = "RAHUL";

const chaldean = calculate(name, CHALDEAN_MAP);
const pythagorean = calculate(name, PYTHAGOREAN_MAP);

console.log(`\n💎 NAME CALCULATION TEST: "${name}"`);
console.log("========================================");

console.log("\n🪐 CHALDEAN (Sovereign Logic):");
console.log(`   Calculation: ${chaldean.breakdown} = ${chaldean.sum}`);
console.log(`   Compound   : ${chaldean.sum}`);
console.log(`   Single     : ${reduce(chaldean.sum)}`);

console.log("\n📐 PYTHAGOREAN (Contaminated Logic):");
console.log(`   Calculation: ${pythagorean.breakdown} = ${pythagorean.sum}`);
console.log(`   Compound   : ${pythagorean.sum}`);
console.log(`   Single     : ${reduce(pythagorean.sum)}`);

console.log("\n========================================");
if (reduce(chaldean.sum) !== reduce(pythagorean.sum)) {
    console.log("✅ VERIFIED: Chaldean and Pythagorean results differ.");
    console.log(`   RAHUL vibrates to 8 in Chaldean Sovereignty.`);
} else {
    console.log("⚠️ WARNING: Results identical (Neutral name).");
}
