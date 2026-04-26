import { Groq } from "groq-sdk";
import { supabaseService } from "../supabase/service";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const FORBIDDEN_INPUT_PATTERNS = [
  /life path/i,
  /calculate/i,
  /what is my number/i,
  /reduce.*name/i,
  /reduce.*number/i,
  /destiny number/i,
  /soul urge/i,
  /figure out.*number/i,
  /work out.*number/i,
  /what.*my.*number/i,
  /numerology.*reading/i
];

export const FORBIDDEN_OUTPUT_PATTERNS = [
  /life path/i,
  /destiny number/i,
  /soul urge/i,
  /reduce to/i,
  /pythagorean/i
];

export const FALLBACK_MESSAGE = "I'm unable to provide a precise interpretation for this question based on your current reading.";

export async function processChatbotQuery(query: string, context: any, userId?: string, sessionId?: string) {
  const startTime = Date.now();
  let result: any = { status: "success", reply: "", outcome_type: "ANSWERED" };

  try {
    // 1. Input Filtering
    for (const pattern of FORBIDDEN_INPUT_PATTERNS) {
      if (pattern.test(query)) {
        result = { 
          reply: "I can only interpret your existing reading. I cannot perform new calculations or assign numbers.",
          status: "blocked_input",
          blocked_pattern: pattern.toString(),
          outcome_type: "BLOCKED"
        };
        break;
      }
    }

    if (result.status === "success") {
      // 2. System Prompt
      const systemPrompt = `You are the Pilgrim, a disciplined interpreter of Chaldean numerology.

You DO NOT:
- calculate numbers
- assign new meanings
- reference systems outside Chaldean numerology
- use terms like "life path", "destiny number", or "reduction"

You ONLY:
- interpret the provided structured reading
- explain traits, tendencies, and guidance
- answer the user's question using ONLY the given context

Provided Context:
${JSON.stringify(context, null, 2)}

If the question requires information not present in the provided data:
- respond: "This insight is not present in your current reading."

Maintain a tone that is:
- calm
- precise
- grounded
- non-mystical exaggeration`;

      // 3. Generate LLM Output
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 500,
      });

      result.reply = chatCompletion.choices[0]?.message?.content || "";

      // 4. Output Validator
      for (const pattern of FORBIDDEN_OUTPUT_PATTERNS) {
        if (pattern.test(result.reply)) {
          result = { 
            reply: FALLBACK_MESSAGE,
            status: "blocked_output",
            blocked_pattern: pattern.toString(),
            outcome_type: "FALLBACK"
          };
          break;
        }
      }

      // 5. Confidence Alignment
      if (context.is_ambiguous) {
        result.outcome_type = "AMBIGUOUS";
        if (!result.reply.toLowerCase().includes("uncertainty") && !result.reply.toLowerCase().includes("ambig")) {
          result.reply = "This interpretation carries some uncertainty. " + result.reply;
        }
      }
    }

    // 6. Active Instrumentation: Log to Sovereignty Logs
    const latency = Date.now() - startTime;
    await supabaseService.from('sovereignty_logs').insert({
      user_id: userId,
      session_id: sessionId,
      query_text: query,
      safety_status: result.status,
      blocked_pattern: result.blocked_pattern,
      outcome_type: result.outcome_type,
      confidence_score: context.confidence || 1.0,
      is_ambiguous: context.is_ambiguous || false,
      validator_intervention: result.status === 'blocked_output',
      latency_ms: latency
    });

    return result;

  } catch (error: any) {
    console.error("Chatbot Error:", error.message);
    // Log failure
    try {
      await supabaseService.from('sovereignty_logs').insert({
        user_id: userId,
        query_text: query,
        safety_status: 'blocked_output',
        latency_ms: Date.now() - startTime
      });
    } catch (logError) {
      console.error("Logging Error:", logError);
    }
    return { reply: FALLBACK_MESSAGE, status: "error" };
  }
}
