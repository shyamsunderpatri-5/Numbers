import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";
import { sovereignRetrieve } from "../src/lib/engine/retrieval/sovereign-retrieval";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TESTS = {
  CHALDEAN: [
    "compound number 1 meaning",
    "compound number 16 meaning",
    "compound number 52 meaning",
    "name number 8 Saturn traits",
    "number 4 Rahu personality",
    "Chaldean name correction protocol",
    "soul urge vowel calculation",
    "personal year 9 meaning"
  ],
  VEDIC_PLANETS: [
    "Sun in 7th house results",
    "Saturn Mahadasha effects",
    "Rahu conjunct Moon personality",
    "Jupiter Kendra Yoga meaning",
    "Kaal Sarp Yoga effects",
    "Venus debilitated Virgo meaning",
    "Mars in Scorpio strength"
  ],
  NAKSHATRAS: NAKSHATRAS.map(n => `${n} Nakshatra personality traits and career`),
  DASHAS: [
    "Ketu Mahadasha effects on life",
    "Venus Mahadasha wealth results",
    "Rahu antardasha in Saturn Mahadasha",
    "Mercury Mahadasha career impact"
  ],
  YOGAS: [
    "Gaja Kesari Yoga effects",
    "Neecha Bhanga Raja Yoga meaning",
    "Viparita Raja Yoga results",
    "Panch Mahapurusha Yoga Hamsa"
  ],
  REMEDIES: [
    "Saturn remedy mantra fasting",
    "Rahu Ketu remedy ritual",
    "Jupiter gemstone yellow sapphire protocol",
    "Moon remedy pearl wearing rules",
    "Mars red coral gemstone day finger"
  ],
  HOUSES: [
    "8th house transformation significations",
    "12th house moksha expenses meaning",
    "5th house children past karma"
  ],
  COMPATIBILITY: [
    "Nadi Koota compatibility meaning",
    "Bhakoot dosha marriage effects",
    "Gana match Deva Rakshasa compatibility",
    "Nakshatra Tara compatibility score"
  ]
};

async function runAudit() {
  console.log("\n🚀 INITIALIZING SOVEREIGN ENGINE AUDIT (Hydrated + Optimized)...");

  const results: any[] = [];

  for (const [category, queries] of Object.entries(TESTS)) {
    console.log(`\n📂 Auditing Category: ${category}`);
    const isVedic = category !== "CHALDEAN";
    const table = isVedic ? "vedic_library_embeddings" : "library_embeddings";
    const matchFunction = isVedic ? "match_vedic_documents" : "match_library_documents";

    for (const query of queries) {
      // USE THE NEW SOVEREIGN RETRIEVAL ENGINE
      const data = await sovereignRetrieve(query, table, matchFunction, 1);

      const match = data?.[0];
      // Threshold for Sovereign is 0.4 similarity (which is 40%+ relevance)
      const status = match && match.similarity > 0.4 ? "✅ SOVEREIGN" : "⚠️  GAP";
      const score = match ? (match.similarity * 100).toFixed(1) + "%" : "0%";

      console.log(`   [${status}] ${score.padStart(6)} | ${query.slice(0, 40).padEnd(40)}`);
      
      results.push({ category, query, status, score, source: match?.source_title || "None" });
    }
  }

  // Final Summary
  console.log("\n" + "=".repeat(60));
  console.log("FINAL OPTIMIZED COVERAGE REPORT");
  console.log("=".repeat(60));
  const total = results.length;
  const sovereign = results.filter(r => r.status === "✅ SOVEREIGN").length;
  const gaps = total - sovereign;

  console.log(`Total Queries      : ${total}`);
  console.log(`Sovereign Areas    : ${sovereign}`);
  console.log(`Engine Performance : ${((sovereign/total)*100).toFixed(1)}% Coverage`);
  console.log("=".repeat(60));

  if (gaps > 0) {
    console.log("\n🔴 REMAINING EDGE GAPS:");
    results.filter(r => r.status === "⚠️  GAP").forEach(r => {
      console.log(`   - [${r.category}] ${r.query} (${r.score})`);
    });
  }
}

runAudit().catch(console.error);
