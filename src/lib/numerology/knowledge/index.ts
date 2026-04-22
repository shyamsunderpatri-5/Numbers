/**
 * NUMERIQ.AI - Knowledge Base Entry Point (RAG Layer)
 * Implements fetchKnowledgeForReading() with Database-First override.
 */

import { FullReadingResult, ReadingKnowledgeContext } from "../types";
import { supabase } from "../../supabase/client";

// Static Fallbacks
import { NUMBER_KNOWLEDGE } from "./numbers-1-9";
import { COMPOUND_MEANINGS } from "./compounds-10-52";
import { MISSING_NUMBERS } from "./missing-numbers";
import { PATTERN_NUMBERS } from "./pattern-numbers";
import { PERSONAL_YEAR_KNOWLEDGE } from "./personal-cycles";
import { COMBINATIONS } from "./combinations";
import { LUCKY_ELEMENTS } from "./lucky-elements";

import { retrieveLibraryWisdom } from "../library/retriever";

/**
 * Fetches knowledge from Supabase (DB-Driven RAG)
 * This allows "Training" to take effect without redeployment.
 */
async function fetchFromDB(type: string, key: string) {
  try {
    const { data } = await supabase
      .from('knowledge_base')
      .select('content')
      .eq('knowledge_type', type)
      .eq('key', key)
      .single();
    return data?.content || null;
  } catch (err) {
    return null;
  }
}

/**
 * Orchestrates the retrieval of expert context.
 */
export async function fetchKnowledgeForReading(
  computed: FullReadingResult
): Promise<ReadingKnowledgeContext> {
  
  // 1. Fetch Combinations (Existing logic)
  const combinationKeys = [
    `${computed.destinyNumber}-${computed.lifePathNumber}`,
    `${computed.destinyNumber}-${computed.soulUrgeNumber}`,
  ];

  const combinationKnowledge = await Promise.all(combinationKeys.map(async key => {
    const [a, b] = key.split("-").map(Number);
    const dbData = await fetchFromDB('combination', key) || await fetchFromDB('combination', `${b}-${a}`);
    if (dbData) return dbData;
    return COMBINATIONS[`${a}-${b}`] || COMBINATIONS[`${b}-${a}`];
  }));

  // 2. Compounds
  const destinyCompound = await fetchFromDB('compound', String(computed.destinyCompound)) || COMPOUND_MEANINGS[computed.destinyCompound];
  const lifePathCompound = await fetchFromDB('compound', String(computed.lifePathCompound)) || COMPOUND_MEANINGS[computed.lifePathCompound];

  // 3. Simple Mappings
  const missingKnowledge = await Promise.all(computed.missingNumbers.map(async n => {
    const db = await fetchFromDB('missing_number', String(n));
    const stat = MISSING_NUMBERS[n];
    return {
      number: n,
      missingMeaning: db?.meaning || stat?.meaning || "",
      missingImpact: db?.impact || stat?.impact || { relationships: "", career: "", finances: "", dailyLife: "" },
      missingRemedy: db?.remedy || stat?.remedy || { color: "", habit: "", name: "", element: "", timing: "" }
    };
  }));

  // 4. Pattern Knowledge
  const patternKnowledge = await Promise.all(computed.karmicPatterns.map(async p => {
    const db = await fetchFromDB('pattern_number', String(p.patternNumber));
    const stat = PATTERN_NUMBERS[p.patternNumber];
    return {
      patternNumber: p.patternNumber,
      title: db?.title || stat?.title || "",
      meaning: db?.meaning || stat?.meaning || "",
      impact: db?.impact || stat?.impact || "",
      practicalAdvice: db?.practicalAdvice || stat?.practicalAdvice || ""
    };
  }));

  // 5. Deep Library Retrieval (RAG)
  // We search for the core destiny and life path vibrations to get master-level context
  const searchQuery = `Numerology meaning and vibration of Destiny ${computed.destinyNumber} and Life Path ${computed.lifePathNumber}`;
  const bookSnippets = await retrieveLibraryWisdom(searchQuery, 6);

  const lucky = LUCKY_ELEMENTS[computed.destinyNumber] || LUCKY_ELEMENTS[1];

  const res: ReadingKnowledgeContext = {
    destinyKnowledge: await fetchFromDB('number_1_9', String(computed.destinyNumber)) || NUMBER_KNOWLEDGE[computed.destinyNumber],
    lifePathKnowledge: await fetchFromDB('number_1_9', String(computed.lifePathNumber)) || NUMBER_KNOWLEDGE[computed.lifePathNumber],
    soulUrgeKnowledge: await fetchFromDB('number_1_9', String(computed.soulUrgeNumber)) || NUMBER_KNOWLEDGE[computed.soulUrgeNumber],
    personalityKnowledge: await fetchFromDB('number_1_9', String(computed.personalityNumber)) || NUMBER_KNOWLEDGE[computed.personalityNumber],
    birthDayKnowledge: await fetchFromDB('number_1_9', String(computed.birthDayNumber)) || NUMBER_KNOWLEDGE[computed.birthDayNumber],
    destinyCompound: destinyCompound || { compound: computed.destinyCompound, meaning: "..." },
    lifePathCompound: lifePathCompound || { compound: computed.lifePathCompound, meaning: "..." },
    missingKnowledge,
    patternKnowledge,
    personalYearKnowledge: PERSONAL_YEAR_KNOWLEDGE[computed.personalYear],
    combinationKnowledge: combinationKnowledge.filter(Boolean),
    luckyElementsForProfile: {
      colors: lucky.colors,
      gems: lucky.gems,
      days: lucky.days,
      numbers: lucky.numbers
    },
    bookSnippets
  };

  return res;
}

export * from "./numbers-1-9";
export * from "./compounds-10-52";
export * from "./missing-numbers";
export * from "./combinations";
export * from "./pattern-numbers";
export * from "./personal-cycles";
export * from "./lucky-elements";
export * from "./remedies";
export * from "./master-numbers";
export * from "./compatibility-matrix";
