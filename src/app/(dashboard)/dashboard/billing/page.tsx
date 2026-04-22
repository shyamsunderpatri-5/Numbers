/**
 * NUMERIQ.AI - Billing & Subscriptions
 * Self-service portal for plan management.
 */

import React from 'react';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { 
  CreditCard, 
  Check, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Gem,
  History,
  Lock,
  ExternalLink
} from 'lucide-react';
import { PLAN_TIERS, getPlanByTier } from '@/lib/stripe/plans';

export const metadata = {
  title: "Membership | NUMERIQ.AI",
};

export default async function BillingPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const currentPlan = getPlanByTier(profile?.plan_tier || 1);

  return (
    <div className="space-y-12">
      
      {/* 1. Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
          Numerical <span className="text-amber-500">Access.</span>
        </h1>
        <p className="text-zinc-500 max-w-lg">
          Manage your intelligence tier and unlock deeper layers of Chaldean mathematical synthesis.
        </p>
      </div>

      {/* 2. Current Status Banner */}
      <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden group border-amber-500/10">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
           <ShieldCheck className="w-48 h-48 text-amber-500" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Current Standing</span>
                 <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full uppercase tracking-tighter">
                   Level {profile?.plan_tier || 1}
                 </div>
              </div>
              <h2 className="text-4xl font-['Orbitron'] font-black text-white">{currentPlan.name} Tier</h2>
              <p className="text-zinc-500 text-sm italic">
                {profile?.subscription_status === 'active' 
                   ? "Your connection to the numerical matrix is fully established and active."
                   : "You are currently operating on the foundational frequency."}
              </p>
           </div>

           <div className="flex gap-4">
              <button className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold flex items-center gap-3 hover:text-white transition-all shadow-xl group/btn">
                 <History className="w-5 h-5" />
                 <span>Invoices</span>
                 <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {profile?.stripe_customer_id && (
                 <button className="px-8 py-4 rounded-2xl bg-white text-black font-bold flex items-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl">
                    <CreditCard className="w-5 h-5" />
                    <span>Manage Payment</span>
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* 3. Pricing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
        {Object.values(PLAN_TIERS).map((plan) => {
          const isCurrent = plan.tier === (profile?.plan_tier || 1);
          const isUpgrade = plan.tier > (profile?.plan_tier || 1);

          return (
            <div 
              key={plan.id}
              className={`glass-card p-10 rounded-[2.5rem] flex flex-col relative transition-all duration-500 ${plan.isPopular ? 'border-amber-500/30 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.1)]' : 'border-zinc-900'}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Most Harmonious
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">{plan.name}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-['Orbitron'] font-black text-white">${plan.price}</span>
                    <span className="text-zinc-600 font-bold uppercase text-[10px]">/ access</span>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-900" />

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                         <Check className={`w-2 h-2 ${isCurrent || !isUpgrade ? 'text-amber-500' : 'text-zinc-700'}`} />
                      </div>
                      <span className={`text-sm tracking-tight ${isCurrent || !isUpgrade ? 'text-zinc-300' : 'text-zinc-600 font-medium'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-12">
                {isCurrent ? (
                  <div className="w-full py-5 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-500 font-black text-xs uppercase tracking-widest text-center">
                    Current Vibration
                  </div>
                ) : isUpgrade ? (
                  <button className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${plan.isPopular ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-white text-black hover:bg-zinc-200 shadows-xl'}`}>
                    <span>Upgrade Matrix</span>
                    <Zap className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full py-5 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-700 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    Legacy Access
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Security Note */}
      <div className="flex items-center justify-center gap-10 pt-10 border-t border-zinc-900">
         <div className="flex items-center gap-3 grayscale opacity-30">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white">Bank-Grade Encryption</span>
         </div>
         <div className="flex items-center gap-3 grayscale opacity-30">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white">Stripe Verified</span>
         </div>
      </div>
    </div>
  );
}
