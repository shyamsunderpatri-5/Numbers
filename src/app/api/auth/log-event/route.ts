import { NextRequest, NextResponse } from "next/server";
import { securityLogger } from "@/lib/security/logger";

/**
 * NUMERIQ.AI - API: Security Event Sink
 * Securely receiving security events from the client-side.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const { type, data, email, status } = body;

    // 1. Handle Login Attempts
    if (type === "LOGIN_ATTEMPT") {
      await securityLogger.logLoginAttempt({
        email: email,
        status: status,
        ip_address: ip,
        user_agent: userAgent,
      });
      return NextResponse.json({ success: true });
    }

    // 2. Handle Generic Security Events
    if (type === "SECURITY_EVENT") {
      await securityLogger.logEvent({
        user_id: data.user_id,
        event_type: data.event_type,
        severity: data.severity || "info",
        details: data.details,
        ip_address: ip,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  } catch (err) {
    console.error("API Event Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
