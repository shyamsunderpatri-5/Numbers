import { NextRequest, NextResponse } from "next/server";
import { synthesize } from "@/lib/engine/synthesis/chaldean-synthesis-engine";
import { validateInterpretation } from "@/lib/engine/validators";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import Stripe from 'stripe';
import { checkRateLimit } from "@/lib/utils/rateLimiter";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export async function POST(request: NextRequest) {
  try {
    const rateLimitError = checkRateLimit(request, '/api/sovereign-narrative', 3, 60000);
    if (rateLimitError) return rateLimitError;

    const { name, birthDay, sessionId } = await request.json();

    if (!name || !birthDay || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify Payment & Idempotency Key
    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (e) {
        return NextResponse.json({ error: "Invalid payment session" }, { status: 402 });
    }
    
    if (session.payment_status !== "paid" || (session.amount_total && session.amount_total <= 0)) {
        return NextResponse.json({ error: "Payment required" }, { status: 402 });
    }

    const paymentIntentId = session.payment_intent as string;
    const idempotencyKey = paymentIntentId || sessionId;

    // Idempotency Check
    const { data: existingLog } = await supabase
        .from('sovereignty_logs')
        .select('narrative, audit_details')
        .eq('payment_intent_id', idempotencyKey)
        .single();

    if (existingLog && existingLog.narrative) {
        return NextResponse.json({ narrative: existingLog.narrative, audit: existingLog.audit_details, cached: true });
    }

    // 2. Regenerate Contract & Prompt (Deterministic & Fast, ensures no tampering)
    const { contract, prompt, latency: engineLatency } = await synthesize(name, parseInt(birthDay, 10));

    // 3. Call Groq LLM with 1-Retry Strategy and Timeout
    const groqStartTime = Date.now();
    let narrative = null;
    let attempts = 0;

    while (attempts < 2 && !narrative) {
        attempts++;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are the Pilgrim, an expert in Chaldean Numerology." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1
            }, {
                headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            narrative = response.data.choices[0].message.content;
        } catch (error: any) {
            if (error.name === 'CanceledError' || error.code === 'ECONNABORTED' || error.response?.status === 429) {
                console.warn(`Groq attempt ${attempts} failed:`, error.message);
                if (attempts === 2) {
                    return NextResponse.json(
                        { error: "Gateway Timeout", message: "The reasoning engine took too long to respond. Please retry your generated reading." },
                        { status: 504 }
                    );
                }
            } else {
                throw error; // Other errors should be caught by outer try/catch
            }
        }
    }

    if (!narrative) {
        return NextResponse.json({ error: "Generation Failed", message: "Failed to generate narrative after retries." }, { status: 500 });
    }
    const totalLatency = engineLatency + (Date.now() - groqStartTime);

    // 4. Validate Output
    const audit = validateInterpretation(narrative, contract.identity_layer.compound_number, contract.identity_layer.planet, true);

    // 5. Log Observability Event (with payment_status and versioning)
    await supabase.from('sovereignty_logs').insert({
        input_name: name,
        input_day: parseInt(birthDay, 10),
        narrative: narrative,
        latency_ms: totalLatency,
        confidence_score: contract.identity_layer.metadata.confidence,
        is_ambiguous: contract.identity_layer.metadata.isAmbiguous,
        golden_pass: audit.pass,
        weight_audit_pass: audit.weightAuditPass,
        dominant_vibration: contract.identity_layer.compound_number,
        canonical_traits_detected: contract.identity_layer.metadata.canonicalTraits,
        audit_details: audit,
        payment_status: "paid",
        payment_intent_id: idempotencyKey,
        session_id: sessionId,
        engine_version: "1.0-SOVEREIGN",
        llm_model: "llama-3.3-70b-versatile",
        prompt_version: "v1",
        ontology_version: "v1"
    });

    if (!audit.pass) {
        console.warn("⚠️ Golden Audit Failed for Paid Run:", audit);
        // We still return the narrative, but it's flagged in the dashboard.
    }

    return NextResponse.json({ narrative, audit });

  } catch (error: any) {
    console.error("Sovereign Narrative API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
