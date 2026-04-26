// src/lib/engine/oracle/intent-parser.ts
// Oracle Step 1: Semantic Intent Analysis

import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ParsedIntent {
  topic: 'career' | 'relationship' | 'finance' | 'health' | 'name' | 'date' | 'location' | 'spiritual' | 'general';
  entities: {
    names: string[];
    dates: string[];
    numbers: number[];
  };
  complexity: 'simple' | 'medium' | 'deep';
  requires_panchang: boolean;
  requires_transit: boolean;
}

export async function parseOracleIntent(question: string): Promise<ParsedIntent> {
  const prompt = `
    Analyze this question for astro-numerological investigation.
    Extract the topic, entities, and complexity.
    
    Question: "${question}"
    
    Return JSON ONLY:
    {
      "topic": "career|relationship|finance|health|name|date|location|spiritual|general",
      "entities": { "names": [], "dates": [], "numbers": [] },
      "complexity": "simple|medium|deep",
      "requires_panchang": boolean,
      "requires_transit": boolean
    }
  `.trim();

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-70b-8192',
    response_format: { type: 'json_object' }
  });

  return JSON.parse(chatCompletion.choices[0].message.content || '{}');
}
