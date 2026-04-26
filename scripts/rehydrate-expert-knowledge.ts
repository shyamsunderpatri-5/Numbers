import { createClient } from "@supabase/supabase-js";
import { NUMBER_KNOWLEDGE } from "../src/lib/numerology/knowledge/numbers-1-9";
import { COMPOUND_MEANINGS } from "../src/lib/numerology/knowledge/compounds-10-52";
import { LUCKY_ELEMENTS } from "../src/lib/numerology/knowledge/lucky-elements";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

/**
 * NUMERIQ.AI — Knowledge Hydration Protocol
 * Pushes the Cheiro-aligned knowledge base to Supabase.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function hydrate() {
  console.log("🚀 Initializing Cheiro Protocol: Database Hydration...");

  // 1. Hydrate Numbers 1-9
  console.log("   🔢 Hydrating Core Numbers (1-9)...");
  for (const [num, data] of Object.entries(NUMBER_KNOWLEDGE)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "number_1_9",
        key: num.toString(),
        content: data,
        is_active: true
      }, {
        onConflict: 'knowledge_type,key'
      });
    if (error) console.error(`   ❌ Error on Number ${num}:`, error.message);
  }

  // 2. Hydrate Compounds 10-52
  console.log("   🧩 Hydrating Compound Meanings (10-52)...");
  for (const [num, data] of Object.entries(COMPOUND_MEANINGS)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "compound",
        key: num.toString(),
        content: data,
        is_active: true
      }, {
        onConflict: 'knowledge_type,key'
      });
    if (error) console.error(`   ❌ Error on Compound ${num}:`, error.message);
  }

  // 3. Hydrate Lucky Elements
  console.log("   🍀 Hydrating Lucky Elements...");
  for (const [num, data] of Object.entries(LUCKY_ELEMENTS)) {
    const { error } = await supabase
      .from("knowledge_base")
      .upsert({
        knowledge_type: "lucky_elements",
        key: num.toString(),
        content: data,
        is_active: true
      }, {
        onConflict: 'knowledge_type,key'
      });
    if (error) console.error(`   ❌ Error on Lucky ${num}:`, error.message);
  }

  console.log("\n✨ HYDRATION COMPLETE. The RAG Engine is now esoterically aligned.");
}

hydrate().catch(console.error);
