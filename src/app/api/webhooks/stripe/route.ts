/**
 * NUMERIQ.AI - Stripe Webhook
 * Automated subscription lifecycle management.
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServiceSupabase } from '@/lib/supabase/client';
import { PLAN_TIERS } from '@/lib/stripe/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27-ac',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Helper to get tier from price ID
  const getTierFromPriceId = (priceId: string): number => {
    if (priceId === PLAN_TIERS.INTELLIGENCE.priceId) return 3;
    if (priceId === PLAN_TIERS.INSIGHT.priceId) return 2;
    return 1;
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        
        // Get subscription to find price ID
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              stripe_customer_id: stripeCustomerId,
              subscription_status: 'active',
              plan_tier: getTierFromPriceId(priceId),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0].price.id;
        const status = subscription.status === 'active' ? 'active' : 'past_due';

        await supabase
          .from('profiles')
          .update({
            subscription_status: status,
            plan_tier: getTierFromPriceId(priceId),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            plan_tier: 1, // Back to Free
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (dbError) {
    console.error("Webhook DB Sync Error:", dbError);
    return NextResponse.json({ error: "DB Sync Failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
