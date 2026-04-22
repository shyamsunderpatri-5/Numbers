const path = require('path');
// Correct the path relative to the scratch directory
const enginePath = path.join(__dirname, '../src/lib/numerology/engine');
const mappingPath = path.join(__dirname, '../src/lib/numerology/mapping');

// Since the project is likely using ES modules, we might need a workaround for CJS if the files use export/import
// But common training scripts I saw earlier use require and simple commonjs patterns
// However, the files I viewed use 'export const' which is ESM syntax.

// I'll create a small standalone function to check RAHUL manually just to be 100% sure without module loader issues
const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

function manualCalc(name) {
    console.log(`\n🧪 Manual Chaldean Check: "${name}"`);
    const letters = name.toUpperCase().split("");
    let sum = 0;
    letters.forEach(char => {
        const val = CHALDEAN_MAP[char];
        if (val) {
            console.log(`${char} -> ${val}`);
            sum += val;
        }
    });
    console.log(`Total Compound: ${sum}`);
    const reduced = (sum % 9 === 0 && sum > 0) ? 9 : sum % 9;
    // Note: Chaldean standard reduction
    const sumDigits = (n) => n.toString().split("").reduce((acc, d) => acc + parseInt(d), 0);
    let r = sum;
    while (r > 9 && r !== 11 && r !== 22 && r !== 33) {
        r = sumDigits(r);
    }
    console.log(`Reduced: ${r}`);
}

manualCalc("RAHUL");
