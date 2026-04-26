import { NextRequest, NextResponse } from "next/server";
import { generateHighConversionReading } from "@/lib/numerology/high-conversion-service";

/**
 * Sovereign Intelligence Chat API
 * Handles real-time conversational analysis based on Chaldean/Lo Shu math.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dob, message, context } = body;

    if (!name || !dob || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In a real scenario, we would use RAG here.
    // For now, we use the high-conversion service to get some contextually relevant text.
    // We'll simulate a conversational response.
    
    const baseReading = await generateHighConversionReading(name, new Date(dob), "career");
    
    // Strict Behavioral Prompting for Question Engine
    const psychic = context?.psychic || 1;
    const destiny = context?.destiny || 1;
    const personalDay = context?.timeline?.personalDay || 1;

    // Simulate structured response following strict rules
    // In a real RAG scenario, this would be passed as a system instruction
    const prompt = `
      USER: ${message}
      MATRIX: Psychic ${psychic}, Destiny ${destiny}, Personal Day ${personalDay}
      
      RULES:
      - NO CONVERSATION
      - NO SPIRITUAL JARGON
      - 1 LINE PROBLEM
      - 1 LINE WHY (BASED ON NUMBERS)
      - 3 BULLET ACTIONS
    `;

    // Mocking the high-fidelity structured response following the new "Direct Action Protocol"
    const responseText = `Problem: 
Friction between current career speed and planetary structural timing.

Why: 
Your №${psychic} psychic frequency is in direct conflict with the №${personalDay} day's demand for data-led silence.

Do this:
• Audit your last 3 career decisions for ego-led bias
• Schedule 1 hour of structural research today
• Postpone any high-velocity communication until tomorrow

Avoid:
• Initiating new solo projects or aggressive pivots today`;

    return NextResponse.json({ 
      text: responseText,
      math: context,
      limitReached: false 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
