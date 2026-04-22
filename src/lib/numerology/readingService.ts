/**
 * NUMERIQ.AI - Reading Service
 * Orchestrates the 3-Layer Architecture with High-Fidelity RAG Synthesis.
 */

import { groq, MODELS } from "../ai/groq";
import { computeFullReading } from "./engine";
import { fetchKnowledgeForReading } from "./knowledge";
import { AIParsedReading, ReadingKnowledgeContext } from "./types";
import { MasterReadingSchema } from "./types/schemas";
import { sanitizeForPrompt } from "./normalize";
import { z } from "zod";

/**
 * Token Budgeting: Intelligently selects RAG context to fit within LLM window.
 * Prioritizes core numbers and active patterns.
 */
function buildKnowledgeContext(k: ReadingKnowledgeContext): string {
  const parts: string[] = [];
  
  // 1. Core Expert Knowledge (Knowledge Base)
  parts.push(`### EXPERT INTERPRETATIONS (Layer 2):`);
  parts.push(`- Destiny Essence: ${k.destinyKnowledge.coreMeaning.slice(0, 1000)}`);
  parts.push(`- Life Path Essence: ${k.lifePathKnowledge.coreMeaning.slice(0, 1000)}`);
  
  if (k.patternKnowledge.length > 0) {
    parts.push(`- Karmic Vibrations: ${k.patternKnowledge.map(p => `[${p.patternNumber}]: ${p.meaning}`).join('; ')}`);
  }
  
  // 2. Pure Wisdom Archives (RAG Library)
  if (k.bookSnippets && k.bookSnippets.length > 0) {
    parts.push(`\n### ANCIENT ARCHIVES (RAG Snippets):`);
    k.bookSnippets.forEach((snippet, i) => {
      parts.push(`[Citation ${i+1}] ${snippet.source_title} by ${snippet.source_author}: "${snippet.chunk_text}"`);
    });
  }
  
  return parts.join("\n");
}

/**
 * Generates a full RAG-enhanced numerology reading.
 * Implements Phase 3: Advanced RAG Narratives with Iron Shield hardening.
 */
export async function generateReading(
  rawName: string, 
  dateOfBirth: Date,
  retryCount = 0
): Promise<AIParsedReading> {
  
  const fullName = sanitizeForPrompt(rawName);
  
  // LAYER 1: 100% Deterministic Math
  const mathData = computeFullReading(fullName, dateOfBirth);

  // LAYER 2: Knowledge Base Retrieval (Expert Moat + Library RAG)
  const knowledge = await fetchKnowledgeForReading(mathData);

  // LAYER 3: AI Language Layer (The "Pilgrim" Synthesis)
  const prompt = `
    SYSTEM: You are "The Pilgrim," a Mystical Numerology Sage and Mentor for NUMERIQ.AI.
    YOUR MISSION: Synthesize the mathematical matrix and ancient archives into a Deeply Compassionate Master Protocol.
    
    PILGRIM PERSONA GUIDELINES:
    1. ADDRESS: Always refer to the user as "Pilgrim," "Seeker," or "Soul."
    2. TONE: Mystical yet authoritative. Analytical yet poetic. You represent the bridge between ancient Chaldean secrets and modern strategic life.
    3. LANGUAGE: Use evocative imagery (e.g., "The Sacred Geometry of your Name," "The Karmic Debt of Ages").
    4. MISSION: Do not just list numbers. Tell a story of the Soul's journey based on the provided vibrations.

    RULES:
    1. MATHEMATICAL TRUTH: Pre-computed numbers are absolute fact.
    2. ARCHIVE FIDELITY: Use the provided ANCIENT ARCHIVES (RAG) to ground your interpretation. If a snippet from Linda Goodman or Cheiro is provided, reference its wisdom.
    3. REMEDY FIRST: Every challenge must be met with a practical spiritual remedy.

    USER DATA:
    - Seeker Name: "${fullName}"
    - Inception Date: ${dateOfBirth.toISOString().split('T')[0]}
    
    COMPUTED MATRIX (Layer 1):
    - Destiny/Compound: ${mathData.destinyNumber} (${mathData.destinyCompound})
    - Life Path: ${mathData.lifePathNumber} (${mathData.lifePathCompound})
    - Soul Urge: ${mathData.soulUrgeNumber}
    - Personality: ${mathData.personalityNumber}
    - Cornerstone/Capstone: ${mathData.cornerstone}/${mathData.capstone}
    - Hidden Passion/Passion: ${mathData.hiddenPassion}
    - Missing Frequencies: [${mathData.missingNumbers.join(', ')}]
    - Active Karmic Patterns: ${mathData.karmicPatterns.map(p => p.patternNumber).join(', ') || 'None'}

    KNOWLEDGE & ARCHIVES (Layer 2):
    ${buildKnowledgeContext(knowledge)}
    - Remedy Framework: ${JSON.stringify(knowledge.missingKnowledge.slice(0, 4).map(k => ({ num: k.number, remedy: k.missingRemedy.habit })))}

    OUTPUT CONTRACT (Strict JSON - Follow Zod MasterReadingSchema):
    You must return a valid JSON object. Do not include markdown backticks or any prose outside the object.
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODELS.PREMIUM,
      response_format: { type: "json_object" },
      temperature: retryCount > 0 ? 0.2 : 0.4, // Lower temp on retry for stability
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("AI failed to generate reading content");

    let parsedJson;
    try {
      parsedJson = JSON.parse(content);
    } catch (e) {
      // Strip potential markdown backticks if AI ignored instructions
      const stripped = content.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      parsedJson = JSON.parse(stripped);
    }

    // VERIFICATION: Zod Validation against the Master Schema
    const validated = MasterReadingSchema.parse(parsedJson);

    return {
      ...validated,
      mathData,
      knowledgeContext: knowledge
    };

  } catch (error) {
    if (retryCount < 1) {
      console.warn("Zod validation or JSON parse failed. Retrying with lower temperature...");
      return generateReading(rawName, dateOfBirth, retryCount + 1);
    }
    throw error;
  }
}
