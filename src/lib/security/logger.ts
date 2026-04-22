import { getServiceSupabase } from "@/lib/supabase/client";

/**
 * NUMERIQ.AI - Security: Audit Logger
 * Specialized logging for authentication and security events.
 */

type SecurityEvent = {
  user_id?: string;
  event_type: string;
  severity: "info" | "warning" | "error" | "critical";
  details?: Record<string, any>;
  ip_address?: string;
};

type LoginAttempt = {
  email: string;
  status: "success" | "failed";
  ip_address?: string;
  user_agent?: string;
  country_code?: string;
};

export const securityLogger = {
  /**
   * Log a security event to the security_events table.
   */
  async logEvent(event: SecurityEvent) {
    const supabase = getServiceSupabase();
    
    try {
      const { error } = await supabase
        .from("security_events")
        .insert({
          user_id: event.user_id,
          event_type: event.event_type,
          severity: event.severity,
          details: event.details,
          ip_address: event.ip_address
        });
        
      if (error) console.error("Logger Error (Event):", error);
    } catch (err) {
      console.error("Critical Logger Failure:", err);
    }
  },

  /**
   * Log a login attempt to the login_attempts table.
   */
  async logLoginAttempt(attempt: LoginAttempt) {
    const supabase = getServiceSupabase();
    
    try {
      const { error } = await supabase
        .from("login_attempts")
        .insert({
          email: attempt.email,
          status: attempt.status,
          ip_address: attempt.ip_address,
          user_agent: attempt.user_agent,
          country_code: attempt.country_code
        });
        
      if (error) console.error("Logger Error (Login):", error);
    } catch (err) {
      console.error("Critical Logger Failure:", err);
    }
  }
};
