"use server";

/**
 * NUMERIQ.AI - Auth Security Actions
 * Server-side logic for rate limiting and device tracking.
 */

import { getServiceSupabase } from "@/lib/supabase/client";
import { headers as getHeaders } from "next/headers";

/**
 * Tracks a login attempt and enforces rate limiting.
 * 3 failed attempts in 15 mins = 15 min lock.
 */
export async function trackLoginAttempt(email: string, success: boolean) {
  const supabase = getServiceSupabase();
  const headers = await getHeaders();
  const ip = headers.get("x-forwarded-for") || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";

  // Log the attempt
  await supabase.from('login_attempts').insert({
    email,
    ip_address: ip,
    user_agent: userAgent,
    success
  });

  if (!success) {
    // Check recent failures
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    const { count } = await supabase
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('success', false)
      .gt('attempted_at', fifteenMinsAgo);

    if (count && count >= 3) {
      // Logic for locking could be handled here or reported to UI
      return { locked: true, remainingAttempts: 0 };
    }
    
    return { locked: false, remainingAttempts: 3 - (count || 0) };
  }

  return { locked: false, remainingAttempts: 3 };
}

/**
 * Records a security event (MFA change, Password change, etc.)
 */
export async function logSecurityEvent(userId: string, eventType: string, metadata: any = {}) {
  const supabase = getServiceSupabase();
  const headers = await getHeaders();
  
  await supabase.from('security_events').insert({
    user_id: userId,
    event_type: eventType,
    ip_address: headers.get("x-forwarded-for") || "unknown",
    user_agent: headers.get("user-agent") || "unknown",
    metadata
  });
}
