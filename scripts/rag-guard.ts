// scripts/rag-guard.ts
// Runs before every build
// Compares current RAG state against locked baseline
// FAILS build if RAG has degraded
// Run: npx tsx scripts/rag-guard.ts
// Add to package.json: "prebuild": "npx tsx scripts/rag-guard.ts"

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { SovereignRetrieval } from '../src/lib/engine/retrieval/sovereign-retrieval'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// ─────────────────────────────────────────────────────
// LOAD BASELINE
// ─────────────────────────────────────────────────────
const baselinePath = path.join(process.cwd(), 'rag-baseline.json')
if (!fs.existsSync(baselinePath)) {
  console.error('\n🚨 BASELINE FILE MISSING')
  console.error('   Run: npx tsx scripts/lock-rag-baseline.ts first')
  process.exit(1)
}

const BASELINE = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'))

// ─────────────────────────────────────────────────────
// SPOT CHECK — Tests critical areas only (fast)
// Full audit = 132 tests (slow)
// Guard = 10 critical tests (fast, < 30 seconds)
// ─────────────────────────────────────────────────────

const GUARD_TESTS = [
  // Most critical — these MUST pass
  { 
    id: 'chaldean.traits.5',
    query: 'number 5 Mercury intelligence communication business Chaldean',
    domain: 'chaldean' as const
  },
  { 
    id: 'chaldean.traits.8',
    query: 'number 8 Saturn karma discipline delay justice Chaldean',
    domain: 'chaldean' as const
  },
  { 
    id: 'chaldean.compound.23',
    query: 'compound number 23 royal star lion unexpected help Chaldean',
    domain: 'chaldean' as const
  },
  { 
    id: 'vedic.navagraha.rahu',
    query: 'Rahu north node obsession technology foreign sudden Hessonite Saturday',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.dasha.rahu',
    query: 'Rahu Mahadasha 18 years obsession foreign ambition sudden rise fall',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.antardasha.3',
    query: 'Ketu antardasha Rahu Mahadasha spiritual confusion transformation',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.house.10',
    query: '10th house career status government authority public life profession',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.house.7',
    query: '7th house marriage partnership business deal spouse karma',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.remedy.kaal_sarp',
    query: 'Kaal Sarp puja Tryambakeshwar remedy serpent worship Nagpanchami',
    domain: 'vedic' as const
  },
  { 
    id: 'vedic.yoga.gaja_kesari',
    query: 'Gaja Kesari yoga Jupiter kendra Moon wisdom fame prosperity',
    domain: 'vedic' as const
  },
]

// ─────────────────────────────────────────────────────
// RUN GUARD
// ─────────────────────────────────────────────────────

async function runGuard() {
  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log('║    NUMERIQ.AI — RAG SOVEREIGNTY GUARD                   ║')
  console.log('║    Checking RAG integrity before build...               ║')
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  let passed = 0
  let failed = 0
  let regressions: string[] = []

  for (const test of GUARD_TESTS) {
    // Get baseline minimum for this test
    const baselineTest = BASELINE.tests.find((t: any) => t.id === test.id)
    const minRequired = baselineTest?.minRequired || 55.0

    process.stdout.write(`  Checking: ${test.id.padEnd(35)}`)

    try {
      const results = await SovereignRetrieval.search(test.query, test.domain, 1)

      if (!results || results.length === 0) {
        console.log(`FAIL — No results`)
        failed++
        regressions.push(`${test.id}: No results returned`)
        continue
      }

      const score = results[0].similarity * 100

      if (score >= minRequired) {
        console.log(`✅ ${score.toFixed(1)}% (min: ${minRequired}%)`)
        passed++
      } else {
        console.log(`🔴 ${score.toFixed(1)}% (min: ${minRequired}%) — REGRESSION`)
        failed++
        regressions.push(
          `${test.id}: ${score.toFixed(1)}% < ${minRequired}% minimum`
        )
      }
    } catch (err: any) {
      console.log(`ERROR — ${err.message}`)
      failed++
      regressions.push(`${test.id}: ${err.message}`)
    }
  }

  // ─── VERDICT ───────────────────────────────────────

  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log(`║  Guard Tests Passed: ${String(passed).padEnd(38)}║`)
  console.log(`║  Guard Tests Failed: ${String(failed).padEnd(38)}║`)
  console.log('╚══════════════════════════════════════════════════════════╝\n')

  if (regressions.length > 0) {
    console.log('🚨 REGRESSIONS DETECTED:')
    regressions.forEach(r => console.log(`   ❌ ${r}`))
    console.log('\n🚨 BUILD ABORTED — RAG sovereignty compromised')
    console.log('   Fix the regression then re-run build\n')
    process.exit(1) // ← KILLS THE BUILD
  }

  console.log('✅ RAG GUARD PASSED — Build allowed to proceed\n')
  process.exit(0)
}

runGuard()
