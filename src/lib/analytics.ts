"use client";

/**
 * NUMERIQ.AI Behavioral Instrumentation Layer
 * Focuses on tracking behavioral sequences and decision thresholds.
 */

export type BehavioralEvent = 
  | 'identity_hook_activated'
  | 'reading_session_complete'
  | 'invite_trigger_seen'
  | 'invite_clicked'
  | 'invite_completed'
  | 'invite_viewed_by_recipient'
  | 'collision_viewed_partial'
  | 'collision_unlocked_full'
  | 'fallback_activated'
  | 'light_mode_session'
  | 'drop_off_after_friction';

export type UserCohort = 'solo' | 'initiator' | 'synchronized';

interface EventContext {
  sessionNumber?: number;
  daysSinceSignup?: number;
  cohortType?: UserCohort;
  partnerStatus?: 'pending' | 'linked' | 'none';
  [key: string]: any;
}

export const trackEvent = (eventName: BehavioralEvent, context?: EventContext) => {
  // In production, this would send to Supabase 'telemetry' table or Segment/PostHog
  const payload = {
    eventName,
    timestamp: new Date().toISOString(),
    metadata: {
      sessionNumber: context?.sessionNumber || 1,
      daysSinceSignup: context?.daysSinceSignup || 0,
      cohortType: context?.cohortType || 'solo',
      ...context
    },
    url: typeof window !== 'undefined' ? window.location.href : '',
  };

  console.log(`[BEHAVIORAL_LOG] ${eventName}:`, payload);
};

export const useAnalytics = () => {
  return { trackEvent };
};
