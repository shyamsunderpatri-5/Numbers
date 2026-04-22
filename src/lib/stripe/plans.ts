/**
 * NUMERIQ.AI - Stripe Plans & Tiers
 * Definition of the standard monetization offerings.
 */

export interface PlanTier {
  id: string;
  name: string;
  tier: number;
  priceId?: string; // Stripe Price ID
  price: number;
  features: string[];
  isPopular?: boolean;
}

export const PLAN_TIERS: Record<string, PlanTier> = {
  FREE: {
    id: 'free',
    name: 'Seeker',
    tier: 1,
    price: 0,
    features: [
      'Layer 1 Deterministic Math',
      'Basic AI Narrative',
      '3 Saved Readings',
      'Community Access'
    ]
  },
  INSIGHT: {
    id: 'insight',
    name: 'Insight',
    tier: 2,
    priceId: process.env.NEXT_PUBLIC_STRIPE_INSIGHT_PRICE_ID,
    price: 29,
    features: [
      'Full Layer 2 Knowledge Access',
      'Advanced RAG Synthesis',
      'Numerical Fingerprint (9-Grid)',
      'Unlimited Reading History',
      'Executive PDF Export'
    ],
    isPopular: true
  },
  INTELLIGENCE: {
    id: 'intelligence',
    name: 'Intelligence',
    tier: 3,
    priceId: process.env.NEXT_PUBLIC_STRIPE_INTELLIGENCE_PRICE_ID,
    price: 99,
    features: [
      'Everything in Insight',
      'Real-time AI Consultation',
      'Compatibility Matrix Access',
      'Multi-Person Matrix Comparisons',
      'Direct WhatsApp Expert Hotline'
    ]
  }
};

/**
 * Returns the plan object based on the tier number
 */
export const getPlanByTier = (tier: number): PlanTier => {
  if (tier === 3) return PLAN_TIERS.INTELLIGENCE;
  if (tier === 2) return PLAN_TIERS.INSIGHT;
  return PLAN_TIERS.FREE;
};
