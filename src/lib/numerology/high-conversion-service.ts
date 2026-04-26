import { groq, MODELS } from "../ai/groq";
import { synthesize } from "../engine/synthesis/chaldean-synthesis-engine";

export interface HighConversionReading {
  identityHook: string;
  problems: string[];
  rootCause: string;
  remedies: {
    text: string;
    difficulty: "easy" | "medium";
    isQuickWin: boolean;
  }[];
  topRemedy: string;
  nameUpgrade: {
    current: string;
    suggested: string;
    impact: string;
  };
  confidenceScore: string;
}

/**
 * Generates a high-conversion, action-oriented numerology reading.
 */
export async function generateHighConversionReading(
  name: string,
  birthDate: Date,
  problemType: string
): Promise<HighConversionReading> {
  
  // 1. Core Logic Layer (Deterministic + Behavioral Mapping)
  const { prompt } = await synthesize(
    name,
    birthDate.getDate(),
    birthDate.getMonth() + 1,
    birthDate.getFullYear(),
    problemType
  );

  // 2. AI Synthesis (Groq Llama 3 70B)
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are the Pilgrim. Return valid JSON only. Never explain outside the JSON block."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: MODELS.PREMIUM,
    temperature: 0.1,
    response_format: { type: "json_object" }
  });

  const content = chatCompletion.choices[0].message.content || "{}";
  const result = JSON.parse(content) as HighConversionReading;

  return result;
}
