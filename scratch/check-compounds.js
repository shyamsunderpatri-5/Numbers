
const { COMPOUND_MEANINGS } = require('./src/lib/numerology/knowledge/compounds-10-52');
for (let i = 10; i <= 52; i++) {
  if (!COMPOUND_MEANINGS[i]) {
    console.log(`Missing compound: ${i}`);
  }
}
