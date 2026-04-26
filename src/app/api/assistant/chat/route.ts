import { NextRequest, NextResponse } from "next/server";
import { processChatbotQuery } from "@/lib/ai/chatbot-logic";

export async function POST(request: NextRequest) {
  try {
    const { query, context, userId } = await request.json();

    if (!query || !context) {
      return NextResponse.json({ error: "Missing query or context." }, { status: 400 });
    }

    const result = await processChatbotQuery(query, context, userId);

    // Logging
    console.log("[CHATBOT LOG]", JSON.stringify({
      query,
      confidence: context.confidence || 1.0,
      is_ambiguous: context.is_ambiguous || false,
      status: result.status,
      blocked_pattern: (result as any).blocked_pattern
    }));

    return NextResponse.json({ reply: result.reply });

  } catch (error: any) {
    console.error("Chatbot API Error:", error.message);
    return NextResponse.json(
      { error: "I'm currently unable to access the mathematical framework. Please try again." },
      { status: 500 }
    );
  }
}
