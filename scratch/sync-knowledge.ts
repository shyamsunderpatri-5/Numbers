/**
 * NUMERIQ.AI - Knowledge Sync Script (Training)
 * Hydrates the Supabase knowledge_base table with expert data.
 */

import { getServiceSupabase } from "../src/lib/supabase/client";
import { COMPOUND_MEANINGS } from "../src/lib/numerology/knowledge/compounds-10-52";
import { COMPATIBILITY_MATRIX } from "../src/lib/numerology/knowledge/compatibility-matrix";
import { MISSING_NUMBER_REMEDIES } from "../src/lib/numerology/knowledge/missing-numbers";
import { VIBRATION_1_9 } from "../src/lib/numerology/knowledge/lucky-elements";
import { NUMBER_KNOWLEDGE } from "../src/lib/numerology/knowledge/numbers-1-9";

const supabase = getServiceSupabase();

async function syncCompounds() {
  console.log("Syncing Compound Meanings...");
  const entries = Object.entries(COMPOUND_MEANINGS).map(([key, content]) => ({
    knowledge_type: "compound",
    key,
    content
  }));

  const { error } = await supabase.from("knowledge_base").upsert(entries);
  if (error) console.error("Error syncing compounds:", error);
}

async function syncCompatibility() {
  console.log("Syncing Compatibility Matrix...");
  const entries = COMPATIBILITY_MATRIX.map(entry => ({
    knowledge_type: "compatibility",
    key: entry.pair,
    content: entry
  }));

  const { error } = await supabase.from("knowledge_base").upsert(entries);
  if (error) console.error("Error syncing compatibility:", error);
}

async function syncMissingNumbers() {
  console.log("Syncing Missing Number Remedies...");
  const entries = Object.entries(MISSING_NUMBER_REMEDIES).map(([key, content]) => ({
    knowledge_type: "missing_number",
    key,
    content
  }));

  const { error } = await supabase.from("knowledge_base").upsert(entries);
  if (error) console.error("Error syncing missing numbers:", error);
}

async function syncNumberKnowledge() {
  console.log("Syncing Detailed Number Knowledge 1-9...");
  const entries = Object.entries(NUMBER_KNOWLEDGE).map(([key, content]) => ({
    knowledge_type: "number_detail",
    key,
    content
  }));

  const { error } = await supabase.from("knowledge_base").upsert(entries);
  if (error) console.error("Error syncing number detail:", error);
}

async function syncBaseVibrations() {
  console.log("Syncing Base Vibrations 1-9...");
  const entries = Object.entries(VIBRATION_1_9).map(([key, content]) => ({
    knowledge_type: "number_1_9",
    key,
    content
  }));

  const { error } = await supabase.from("knowledge_base").upsert(entries);
  if (error) console.error("Error syncing base vibrations:", error);
}

export async function runSync() {
  await syncCompounds();
  await syncCompatibility();
  await syncMissingNumbers();
  await syncBaseVibrations();
  await syncNumberKnowledge();
  console.log("RAG 'Training' Sync Complete.");
}

runSync();
