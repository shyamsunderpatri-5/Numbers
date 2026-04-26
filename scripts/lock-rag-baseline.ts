// scripts/lock-rag-baseline.ts
// Locks current RAG state as the official baseline
// Run ONCE after achieving production ready status
// Run: npx tsx scripts/lock-rag-baseline.ts

import * as fs from 'fs'
import * as path from 'path'

// ─────────────────────────────────────────────────────
// YOUR CURRENT PRODUCTION SCORES — LOCKED
// Date: Today
// Coverage: 98%  Quality: 99%
// ─────────────────────────────────────────────────────

const BASELINE = {
  lockedAt: new Date().toISOString(),
  lockedBy: 'NUMERIQ.AI Sovereign Protocol',
  version: '1.0.0',
  verdict: 'PRODUCTION_READY',

  scores: {
    coverage: 98,
    quality: 99,
    totalTests: 132,
    sovereign: 130,
    weak: 2,
    critical: 0,
    productBreaking: 0
  },

  // Minimum acceptable scores — if ANY drops below this = BUILD FAILS
  minimumThresholds: {
    coverage: 95,          // was 98% — allow 3% buffer
    quality: 95,           // was 99% — allow 4% buffer
    maxWeakAllowed: 8,     // was 2 — allow up to 8 weak
    maxCriticalAllowed: 0, // was 0 — ZERO tolerance
    maxProductBreaking: 0  // was 0 — ZERO tolerance
  },

  // Individual test baselines — each test locked
  tests: [
    // CHALDEAN — Letter Mapping
    { id: 'chaldean.letter_mapping.1', label: 'Letter Mapping: A I J Q Y equals 1', score: 62.6, minRequired: 55.0 },
    { id: 'chaldean.letter_mapping.2', label: 'Letter Mapping: number 9 not assigned', score: 80.3, minRequired: 70.0 },
    { id: 'chaldean.letter_mapping.3', label: 'Letter Mapping: F P equals 8', score: 67.6, minRequired: 60.0 },

    // CHALDEAN — Number Traits
    { id: 'chaldean.traits.1', label: 'Number 1 Sun leadership', score: 62.6, minRequired: 55.0 },
    { id: 'chaldean.traits.2', label: 'Number 2 Moon emotion', score: 61.3, minRequired: 55.0 },
    { id: 'chaldean.traits.3', label: 'Number 3 Jupiter wisdom', score: 63.0, minRequired: 55.0 },
    { id: 'chaldean.traits.4', label: 'Number 4 Rahu disruption', score: 79.1, minRequired: 65.0 },
    { id: 'chaldean.traits.5', label: 'Number 5 Mercury communication', score: 72.9, minRequired: 65.0 },
    { id: 'chaldean.traits.6', label: 'Number 6 Venus beauty', score: 66.3, minRequired: 55.0 },
    { id: 'chaldean.traits.7', label: 'Number 7 Ketu spirituality', score: 60.7, minRequired: 55.0 },
    { id: 'chaldean.traits.8', label: 'Number 8 Saturn karma', score: 76.1, minRequired: 65.0 },
    { id: 'chaldean.traits.9', label: 'Number 9 Mars courage', score: 63.5, minRequired: 55.0 },

    // CHALDEAN — Compounds
    { id: 'chaldean.compound.10', label: 'Compound 10 wheel fortune', score: 67.9, minRequired: 60.0 },
    { id: 'chaldean.compound.12', label: 'Compound 12 sacrifice', score: 64.2, minRequired: 55.0 },
    { id: 'chaldean.compound.16', label: 'Compound 16 shattered tower', score: 63.3, minRequired: 55.0 },
    { id: 'chaldean.compound.17', label: 'Compound 17 star magi', score: 67.8, minRequired: 60.0 },
    { id: 'chaldean.compound.19', label: 'Compound 19 prince heaven', score: 62.8, minRequired: 55.0 },
    { id: 'chaldean.compound.23', label: 'Compound 23 royal star', score: 73.8, minRequired: 65.0 },
    { id: 'chaldean.compound.27', label: 'Compound 27 sceptre', score: 61.7, minRequired: 55.0 },
    { id: 'chaldean.compound.33', label: 'Compound 33 master teacher', score: 65.7, minRequired: 58.0 },
    { id: 'chaldean.compound.43', label: 'Compound 43 pyramid', score: 76.9, minRequired: 65.0 },
    { id: 'chaldean.compound.52', label: 'Compound 52 same as 43', score: 72.4, minRequired: 65.0 },

    // CHALDEAN — Calculations
    { id: 'chaldean.calc.1', label: 'Name number calculation', score: 71.9, minRequired: 65.0 },
    { id: 'chaldean.calc.2', label: 'Birth number', score: 62.9, minRequired: 55.0 },
    { id: 'chaldean.calc.3', label: 'Destiny number', score: 64.9, minRequired: 55.0 },
    { id: 'chaldean.calc.4', label: 'Personal year number', score: 64.6, minRequired: 55.0 },
    { id: 'chaldean.calc.5', label: 'Soul urge vowels', score: 67.2, minRequired: 60.0 },
    { id: 'chaldean.calc.6', label: 'Name correction', score: 67.1, minRequired: 60.0 },

    // CHALDEAN — Planetary Friendship
    { id: 'chaldean.planets.1', label: 'Sun friends enemies', score: 71.4, minRequired: 65.0 },
    { id: 'chaldean.planets.2', label: 'Saturn friends enemies', score: 67.6, minRequired: 60.0 },
    { id: 'chaldean.planets.3', label: 'Rahu Ketu friendly', score: 67.9, minRequired: 60.0 },

    // VEDIC — Navagrahas
    { id: 'vedic.navagraha.sun', label: 'Sun Surya', score: 63.9, minRequired: 55.0 },
    { id: 'vedic.navagraha.moon', label: 'Moon Chandra', score: 61.3, minRequired: 55.0 },
    { id: 'vedic.navagraha.mars', label: 'Mars Mangal', score: 65.4, minRequired: 58.0 },
    { id: 'vedic.navagraha.mercury', label: 'Mercury Budha', score: 67.9, minRequired: 60.0 },
    { id: 'vedic.navagraha.jupiter', label: 'Jupiter Guru', score: 64.1, minRequired: 55.0 },
    { id: 'vedic.navagraha.venus', label: 'Venus Shukra', score: 62.5, minRequired: 55.0 },
    { id: 'vedic.navagraha.saturn', label: 'Saturn Shani', score: 63.3, minRequired: 55.0 },
    { id: 'vedic.navagraha.rahu', label: 'Rahu north node', score: 65.0, minRequired: 58.0 },
    { id: 'vedic.navagraha.ketu', label: 'Ketu south node', score: 65.6, minRequired: 58.0 },

    // VEDIC — Planet in House
    { id: 'vedic.planet_house.1', label: 'Jupiter 5th house', score: 61.8, minRequired: 55.0 },
    { id: 'vedic.planet_house.2', label: 'Saturn 7th house', score: 74.3, minRequired: 65.0 },
    { id: 'vedic.planet_house.3', label: 'Rahu 10th house', score: 78.8, minRequired: 70.0 },
    { id: 'vedic.planet_house.4', label: 'Mars 8th house', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.planet_house.5', label: 'Venus 12th house', score: 66.3, minRequired: 58.0 },

    // VEDIC — Sade Sati
    { id: 'vedic.sadesati.1', label: 'Sade Sati 7.5 years', score: 69.1, minRequired: 60.0 },
    { id: 'vedic.sadesati.2', label: 'Sade Sati three phases', score: 61.9, minRequired: 55.0 },

    // VEDIC — Exaltation
    { id: 'vedic.exalt.sun', label: 'Sun exalted Aries', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.exalt.jupiter', label: 'Jupiter exalted Cancer', score: 63.9, minRequired: 55.0 },
    { id: 'vedic.exalt.saturn', label: 'Saturn exalted Libra', score: 64.6, minRequired: 55.0 },

    // VEDIC — Mahadasha
    { id: 'vedic.dasha.ketu', label: 'Ketu Mahadasha 7 years', score: 68.0, minRequired: 60.0 },
    { id: 'vedic.dasha.venus', label: 'Venus Mahadasha 20 years', score: 65.6, minRequired: 58.0 },
    { id: 'vedic.dasha.sun', label: 'Sun Mahadasha 6 years', score: 60.2, minRequired: 55.0 },
    { id: 'vedic.dasha.moon', label: 'Moon Mahadasha 10 years', score: 61.0, minRequired: 55.0 },
    { id: 'vedic.dasha.mars', label: 'Mars Mahadasha 7 years', score: 62.1, minRequired: 55.0 },
    { id: 'vedic.dasha.rahu', label: 'Rahu Mahadasha 18 years', score: 75.0, minRequired: 65.0 },
    { id: 'vedic.dasha.jupiter', label: 'Jupiter Mahadasha 16 years', score: 62.0, minRequired: 55.0 },
    { id: 'vedic.dasha.saturn', label: 'Saturn Mahadasha 19 years', score: 61.0, minRequired: 55.0 },
    { id: 'vedic.dasha.mercury', label: 'Mercury Mahadasha 17 years', score: 60.8, minRequired: 55.0 },

    // VEDIC — Antardasha
    { id: 'vedic.antardasha.1', label: 'Rahu antardasha Saturn', score: 63.3, minRequired: 55.0 },
    { id: 'vedic.antardasha.2', label: 'Jupiter antardasha Venus', score: 78.0, minRequired: 68.0 },
    { id: 'vedic.antardasha.3', label: 'Ketu antardasha Rahu', score: 79.1, minRequired: 68.0 },

    // VEDIC — Dasha Calculation
    { id: 'vedic.dasha_calc.1', label: 'Vimshottari 120 year cycle', score: 61.8, minRequired: 55.0 },
    { id: 'vedic.dasha_calc.2', label: 'Dasha balance calculation', score: 63.6, minRequired: 55.0 },

    // VEDIC — Yogas
    { id: 'vedic.yoga.gaja_kesari', label: 'Gaja Kesari yoga', score: 75.6, minRequired: 60.0 },
    { id: 'vedic.yoga.raja', label: 'Raja Yoga', score: 66.7, minRequired: 58.0 },
    { id: 'vedic.yoga.kaal_sarp', label: 'Kaal Sarp yoga', score: 65.4, minRequired: 58.0 },
    { id: 'vedic.yoga.neecha', label: 'Neecha Bhanga Raja', score: 69.8, minRequired: 60.0 },
    { id: 'vedic.yoga.viparita', label: 'Viparita Raja Yoga', score: 61.3, minRequired: 55.0 },
    { id: 'vedic.yoga.budh_aditya', label: 'Budh Aditya yoga', score: 68.0, minRequired: 60.0 },
    { id: 'vedic.yoga.panch', label: 'Panch Mahapurusha', score: 64.7, minRequired: 55.0 },
    { id: 'vedic.yoga.dhana', label: 'Dhana yoga', score: 69.2, minRequired: 60.0 },
    { id: 'vedic.yoga.kemadruma', label: 'Kemadruma yoga', score: 64.3, minRequired: 55.0 },
    { id: 'vedic.yoga.grahan', label: 'Rahu Moon Grahan yoga', score: 68.5, minRequired: 60.0 },

    // VEDIC — Houses
    { id: 'vedic.house.1', label: '1st house Lagna', score: 50.5, minRequired: 45.0 },
    { id: 'vedic.house.2', label: '2nd house wealth', score: 68.4, minRequired: 60.0 },
    { id: 'vedic.house.5', label: '5th house children', score: 54.0, minRequired: 45.0 },
    { id: 'vedic.house.7', label: '7th house marriage', score: 74.3, minRequired: 65.0 },
    { id: 'vedic.house.8', label: '8th house longevity', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.house.9', label: '9th house dharma', score: 71.5, minRequired: 62.0 },
    { id: 'vedic.house.10', label: '10th house career', score: 68.7, minRequired: 60.0 },
    { id: 'vedic.house.11', label: '11th house income', score: 67.0, minRequired: 60.0 },
    { id: 'vedic.house.12', label: '12th house losses', score: 67.5, minRequired: 60.0 },

    // VEDIC — Koota Compatibility
    { id: 'vedic.koota.nadi', label: 'Nadi Koota 8 points', score: 71.1, minRequired: 63.0 },
    { id: 'vedic.koota.bhakoot', label: 'Bhakoot Koota 7 points', score: 73.7, minRequired: 65.0 },
    { id: 'vedic.koota.gana', label: 'Gana Koota 6 points', score: 71.0, minRequired: 63.0 },
    { id: 'vedic.koota.graha', label: 'Graha Maitri 5 points', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.koota.yoni', label: 'Yoni Koota 4 points', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.koota.tara', label: 'Tara Koota 3 points', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.koota.vashya', label: 'Vashya Koota 2 points', score: 62.9, minRequired: 55.0 },
    { id: 'vedic.koota.ashta', label: 'Ashta Koota 36 points', score: 65.9, minRequired: 58.0 },

    // VEDIC — Remedies
    { id: 'vedic.remedy.saturn', label: 'Saturn remedy Blue Sapphire', score: 72.6, minRequired: 65.0 },
    { id: 'vedic.remedy.jupiter', label: 'Jupiter remedy Yellow Sapphire', score: 70.5, minRequired: 63.0 },
    { id: 'vedic.remedy.rahu', label: 'Rahu remedy Hessonite', score: 69.2, minRequired: 62.0 },
    { id: 'vedic.remedy.ketu', label: 'Ketu remedy Cat Eye', score: 70.5, minRequired: 63.0 },
    { id: 'vedic.remedy.moon', label: 'Moon remedy Pearl', score: 69.4, minRequired: 62.0 },
    { id: 'vedic.remedy.mars', label: 'Mars remedy Red Coral', score: 73.3, minRequired: 65.0 },
    { id: 'vedic.remedy.venus', label: 'Venus remedy Diamond', score: 66.0, minRequired: 58.0 },
    { id: 'vedic.remedy.sun', label: 'Sun remedy Ruby', score: 70.9, minRequired: 63.0 },
    { id: 'vedic.remedy.kaal_sarp', label: 'Kaal Sarp Tryambakeshwar', score: 76.7, minRequired: 68.0 },

    // VEDIC — Panchanga
    { id: 'vedic.panchanga.1', label: 'Panchanga five limbs', score: 61.8, minRequired: 55.0 },
    { id: 'vedic.panchanga.2', label: 'Tithi lunar day', score: 61.1, minRequired: 55.0 },
    { id: 'vedic.panchanga.3', label: 'Brahma Muhurta', score: 72.6, minRequired: 65.0 },
    { id: 'vedic.panchanga.4', label: 'Amavasya new moon', score: 68.9, minRequired: 60.0 },
    { id: 'vedic.panchanga.5', label: 'Shukla Paksha waxing', score: 65.0, minRequired: 58.0 },
  ]
}

// ─────────────────────────────────────────────────────
// SAVE BASELINE FILE
// ─────────────────────────────────────────────────────

const outputPath = path.join(process.cwd(), 'rag-baseline.json')
fs.writeFileSync(outputPath, JSON.stringify(BASELINE, null, 2))

console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log('║    NUMERIQ.AI — RAG BASELINE LOCKED                     ║')
console.log('╚══════════════════════════════════════════════════════════╝')
console.log(`\n✅ Baseline saved to: rag-baseline.json`)
console.log(`📊 Coverage locked at: ${BASELINE.scores.coverage}%`)
console.log(`📊 Quality locked at:  ${BASELINE.scores.quality}%`)
console.log(`🔒 Min coverage allowed: ${BASELINE.minimumThresholds.coverage}%`)
console.log(`🔒 Max critical allowed: ${BASELINE.minimumThresholds.maxCriticalAllowed}`)
console.log(`\n  Commit this file to git:`)
console.log(`  git add rag-baseline.json`)
console.log(`  git commit -m "lock: RAG baseline v1.0 production ready"\n`)
