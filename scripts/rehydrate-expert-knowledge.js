const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const path = require('path');

/**
 * NUMERIQ.AI — Knowledge Hydration Protocol (JS Version)
 * Robustly pushes the Cheiro-aligned knowledge base to Supabase.
 */

// Load .env manually for node script
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function hydrate() {
  console.log("🚀 Initializing Cheiro Protocol: Database Hydration...");

  // Helper to extract the object from a TS file using regex (brute force but robust for node)
  const extractFromTs = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Find the export const ... = { ... }
    const match = content.match(/export const \w+: Record<number, \w+> = ({[\s\S]+});/);
    if (match) {
        // Very dirty: convert TS pseudo-object to JS object
        // For our simple knowledge files this usually works or we can use eval safely-ish here
        try {
           return eval(`(${match[1]})`);
        } catch (e) {
           console.error(`Failed to eval ${filePath}`, e);
           return {};
        }
    }
    return {};
  };

  const numbersBase = path.join(__dirname, '../src/lib/numerology/knowledge/numbers-1-9.ts');
  const compoundsBase = path.join(__dirname, '../src/lib/numerology/knowledge/compounds-10-52.ts');
  const higherBase = path.join(__dirname, '../src/lib/numerology/knowledge/higher-compounds-53-84.ts');
  const luckyBase = path.join(__dirname, '../src/lib/numerology/knowledge/lucky-elements.ts');

  // 1. Hydrate Numbers 1-9
  const NUMBER_KNOWLEDGE = extractFromTs(numbersBase);
  console.log("   🔢 Hydrating Core Numbers (1-9)...");
  for (const [num, data] of Object.entries(NUMBER_KNOWLEDGE)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "number_1_9",
        key: num,
        content: data,
        is_active: true
      }, { onConflict: 'knowledge_type,key' });
    if (error) console.error(`   ❌ Error on Number ${num}:`, error.message);
  }

  // 2. Hydrate Compounds 10-52
  const COMPOUND_MEANINGS = extractFromTs(compoundsBase);
  console.log("   🧩 Hydrating Compound Meanings (10-52)...");
  for (const [num, data] of Object.entries(COMPOUND_MEANINGS)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "compound",
        key: num,
        content: data,
        is_active: true
      }, { onConflict: 'knowledge_type,key' });
    if (error) console.error(`   ❌ Error on Compound ${num}:`, error.message);
  }

  // 3. Hydrate Higher Compounds 53-84
  const HIGHER_MEANINGS = extractFromTs(higherBase);
  console.log("   🔭 Hydrating Higher Compounds (53-84)...");
  for (const [num, data] of Object.entries(HIGHER_MEANINGS)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "compound",
        key: num,
        content: data,
        is_active: true
      }, { onConflict: 'knowledge_type,key' });
    if (error) console.error(`   ❌ Error on Higher Compound ${num}:`, error.message);
  }

  // 4. Hydrate Lucky Elements
  const LUCKY_DATA = extractFromTs(luckyBase);
  console.log("   🍀 Hydrating Lucky Elements (1-9)...");
  for (const [num, data] of Object.entries(LUCKY_DATA)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "lucky_elements",
        key: num,
        content: data,
        is_active: true
      }, { onConflict: 'knowledge_type,key' });
    if (error) console.error(`   ❌ Error on Lucky ${num}:`, error.message);
  }

  console.log("\n✨ HYDRATION COMPLETE. Sepharial's Wisdom is now integrated.");
}

hydrate().catch(console.error);
