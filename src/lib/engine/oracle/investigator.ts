// src/lib/engine/oracle/investigator.ts
// Oracle Step 2-5: Deep Investigation & Synthesis

import { parseOracleIntent, ParsedIntent } from './intent-parser';
import { SovereignRetrieval } from '../retrieval/sovereign-retrieval';
import { calculateBirthNumber, calculateDestinyNumber } from '../logic/calculator-utils';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface OracleResult {
  direct_answer: string;
  confidence: number;
  reasoning: {
    numerology: string;
    astrology: string;
    panchang: string;
    timing: string;
  };
  advice: string[];
  cautions: string[];
  sources: string[];
}

export async function runOracleInvestigation(
  question: string,
  userProfile: any // From DB
): Promise<OracleResult> {
  // 1. Parse Intent
  const intent = await parseOracleIntent(question);

  // 2. Data Assembly
  const birthNum = calculateBirthNumber(userProfile.dob);
  const destinyNum = calculateDestinyNumber(userProfile.dob);
  
  // 3. Deep RAG Retrieval
  const searchDomain = intent.topic === 'relationship' ? 'chaldean' : 'vedic';
  const ragHits = await SovereignRetrieval.search(question, searchDomain, 8);
  const context = ragHits.map(h => h.content).join("\n\n");

  // 4. Structured Synthesis
  const prompt = `
    MASTER INVESTIGATION PROTOCOL:
    Question: "${question}"
    
    USER PROFILE:
    - Birth Number: ${birthNum}
    - Destiny Number: ${destinyNum}
    - Topic: ${intent.topic}
    
    RAG CONTEXT:
    ${context}
    
    TASK: Provide a structured, authoritative investigation result.
    NO CONVERSATION. JSON ONLY.
    
    STRUCTURE:
    {
      "direct_answer": "1 sentence answer",
      "confidence": 0-100,
      "reasoning": { "numerology": "", "astrology": "", "panchang": "", "timing": "" },
      "advice": ["Action 1", "Action 2", "Action 3"],
      "cautions": ["Caution 1", "Caution 2"],
      "sources": ["Source title 1", "Source title 2"]
    }
  `.trim();

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'system', content: 'You are the Deep Oracle of NUMERIQ.AI. Ground all answers in canonical texts.' }, { role: 'user', content: prompt }],
    model: 'llama3-70b-8192',
    response_format: { type: 'json_object' }
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}
