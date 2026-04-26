/**
 * NUMERIQ.AI - Main Dashboard
 * High-fidelity command center for numerical intelligence.
 */

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  UserPlus, 
  History, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Star,
  ChevronRight,
  CalendarDays,
  Activity,
  ArrowRight,
  Users
} from 'lucide-react';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AIParsedReading } from '@/lib/numerology/types';
import { QuickSynergy } from '@/components/dashboard/QuickSynergy';

export const metadata: Metadata = {
  title: "Vibrational Command | NUMERIQ.AI",
};

export default async function DashboardPage() {
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

  // Fetch Stats & Latest Reading
  const { count: readingCount } = await supabase
    .from('readings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id);

  const latestReadingData = await supabase
    .from('readings')
    .select('insights, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
    .then(({ data }) => data);

  const latestReading = latestReadingData?.insights as unknown as AIParsedReading | undefined;
  const destinyNum = latestReading?.mathData.destinyNumber;

  // PROGRESSION FRICTION: Context-aware status with recovery arcs
  const getPatternStatus = () => {
    const statuses = [
      { id: 'reinforcing', label: 'Reinforcing', color: 'emerald', recovery: null },
      { id: 'holding', label: 'Holding', color: 'blue', recovery: null },
      { id: 'straining', label: 'Straining', color: 'amber', recovery: "You resisted your natural resonance yesterday. Today is for structural realignment." },
      { id: 'misaligned', label: 'Misaligned', color: 'rose', recovery: "The pattern shifted while you were away. Return to the sequence to stabilize." }
    ];
    const day = new Date().getDate();
    const index = (day % 10) < 7 ? (day % 2) : 2 + (day % 2);
    return statuses[index];
  };

  const status = getPatternStatus();

  // EMOTIONAL PACING: Intensity rhythm (70% Deep, 30% Light)
  const isLightMode = new Date().getDate() % 3 === 0;

  // VARIABILITY ENGINE: Context-driven narrative
  const getIdentityHit = (num: number) => {
    if (isLightMode) return "Today is not about pressure. Just observe your pattern—don't force the sequence.";
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    if (status.recovery) return status.recovery;

    const templates = [
      (n: number) => `Your vibration was ${n === 1 ? 'intense' : 'fluid'} in the last cycle. Today, the sequence stabilizes.`,
      (n: number) => `The resonance you built yesterday deepens. Today reveals how others respond to it.`,
      (n: number) => `You felt the vibrational friction of ${n} yesterday. Today, it shifts into a structural opening.`
    ];
    return templates[dayOfYear % templates.length](num);
  };

  return (
    <div className="relative z-10 space-y-12 pb-20 pt-6">
      
      {/* 1. HERO SECTION (HUMANIZED & PACED) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-muted-foreground/60">Identity Signature v5.5</span>
            </div>
            {/* PROGRESSION SIGNAL */}
            <div className={`px-3 py-1 rounded-full bg-${isLightMode ? 'blue' : status.color}-500/10 border border-${isLightMode ? 'blue' : status.color}-500/20 flex items-center gap-2`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-${isLightMode ? 'blue' : status.color}-500`} />
              <span className={`text-[9px] font-black uppercase tracking-widest text-${isLightMode ? 'blue' : status.color}-500`}>
                {isLightMode ? 'Pattern Status: Resting' : `Pattern Status: ${status.label}`}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-serif font-black text-foreground tracking-tighter leading-tight text-glow">
              Good Evening, <span className="text-primary italic">{session.user.user_metadata?.full_name?.split(' ')[0] || 'Seeker'}</span>.
            </h1>
            <p className="text-white max-w-2xl text-2xl font-serif italic leading-relaxed">
              {destinyNum 
                ? `"${getIdentityHit(destinyNum)}"`
                : "Awaiting your numerical initiation. Begin the analysis to unlock the command center."}
            </p>
            {!isLightMode && (
              <div className="flex items-center gap-4 pt-2">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Next Sequence:</span>
                    <span className="text-sm font-black text-primary uppercase font-mono tracking-tighter italic">Already Forming...</span>
                 </div>
                 <button className="text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors border-l border-white/10 pl-4">
                    Stabilize Vibration
                 </button>
              </div>
            )}
          </div>
        </div>
        
        <Link 
          href="/dashboard/new" 
          className="group relative px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-4 hover:bg-primary hover:text-black transition-all shadow-2xl active:scale-95"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="uppercase tracking-tighter">New Initiation</span>
        </Link>
      </div>

      {/* 2. MAIN HUB PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Today's Personal Forecast (Large) */}
        <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 relative overflow-hidden group border-primary/10">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Activity className="w-64 h-64 text-primary" />
          </div>
          
          <div className="space-y-10 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-black tracking-widest text-primary">Daily Forecast</div>
                  <div className="text-sm font-black text-foreground uppercase tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Cycle Year {latestReading?.mathData.personalYear || '?'}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-tight">
                A day for <span className="text-primary italic">strategic withdrawal.</span>
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl italic">
                "Today your internal solar frequency (1) is modified by the lunar influence of the current cycle. Avoid aggressive initiations; instead, focus on consolidating the foundations of your recent expansions."
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                <div className="text-[8px] uppercase font-black tracking-widest text-zinc-600">Vibration Harmony</div>
                <div className="text-lg font-black text-emerald-500">88%</div>
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
                <div className="text-[8px] uppercase font-black tracking-widest text-zinc-600">Best Hours</div>
                <div className="text-lg font-black text-white">14:00 - 17:00</div>
              </div>
              <Link href="/dashboard/forecasts" className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">
                View Weekly Path <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Numbers Summary */}
        <div className="glass-card rounded-[3rem] p-10 border-white/5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
              <Star className="w-5 h-5 text-primary" />
              Core Matrix
            </h3>
            
            <div className="space-y-4">
              {[
                { label: "Destiny", val: latestReading?.mathData.destinyNumber || '?', compound: latestReading?.mathData.destinyCompound || '??' },
                { label: "Life Path", val: latestReading?.mathData.lifePathNumber || '?', compound: latestReading?.mathData.lifePathCompound || '??' },
                { label: "Soul Urge", val: latestReading?.mathData.soulUrgeNumber || '?', compound: 'Inner' },
              ].map((num, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="space-y-0.5">
                    <div className="text-[9px] uppercase font-black tracking-widest text-zinc-500">{num.label}</div>
                    <div className="text-xs font-bold text-zinc-400">{num.compound}</div>
                  </div>
                  <div className="text-3xl font-black text-primary font-serif italic">{num.val}</div>
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/latest" className="w-full py-5 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-widest text-center hover:bg-amber-400 transition-colors">
            Access Full Protocol
          </Link>
        </div>
      </div>

      {/* 3. RECENT READINGS & QUICK CHECK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Readings List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              Intelligence Logs
            </h3>
            <Link href="/dashboard/history" className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-primary transition-colors">View All</Link>
          </div>

          <div className="space-y-4">
            {latestReading ? (
              <div className="glass-card p-6 rounded-3xl border-white/5 flex items-center gap-6 hover:border-primary/10 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-3xl font-black text-primary border border-white/5 group-hover:scale-105 transition-transform">
                  {latestReading.mathData.destinyNumber}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground uppercase tracking-tight">The {latestReading.mathData.destinyCompound} Protocol</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">Latest</span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1 italic">"{latestReading.executiveSummary}"</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:text-primary transition-colors" />
              </div>
            ) : (
              <div className="p-12 glass-card rounded-3xl border-dashed border-white/10 text-center text-zinc-600 text-sm italic">
                No archived readings found.
              </div>
            )}
          </div>
        </div>

        {/* Compatibility Quick Check */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3 px-2">
            <Users className="w-5 h-5 text-primary" />
            Quick Synergy
          </h3>
          
          <QuickSynergy />
        </div>
      </div>

      {/* 4. VIBRATIONAL SUCCESS STORIES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
            <Star className="w-5 h-5 text-primary" />
            Success Stories
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "A.R. Rahman", change: "A.S. Dileep Kumar → Rahman", impact: "2x Academy Awards", icon: "🎬" },
            { name: "Amitabh Bachchan", change: "Inquilaab → Amitabh", impact: "Star of the Millennium", icon: "🌟" },
            { name: "Lady Gaga", change: "Stefani → Gaga", impact: "13x Grammy Winner", icon: "🎤" },
          ].map((story, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-5 hover:border-primary/20 transition-all group border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:border-primary/20">
                {story.icon}
              </div>
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-primary/60 font-black tracking-widest">{story.name}</div>
                <div className="text-sm font-black text-foreground tracking-tight">{story.impact}</div>
                <div className="text-[9px] text-muted-foreground/40 font-bold italic">{story.change}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 2. RELATIONAL COLLISION (SHARED DAILY LOOP) */}
      <div className="pt-10">
         <div className="glass-card p-10 rounded-[3rem] border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
               <Zap className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary">
                     Active Dynamic: Arjun
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                     Status: Awaiting Partner
                  </div>
               </div>
               
               <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <h3 className="text-4xl font-serif font-black italic">"Today, your patterns collide."</h3>
                     <p className="text-white text-xl font-medium leading-relaxed">
                        One will withdraw. One will push. The sequence indicates a friction point in your evening communication cycle.
                     </p>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/10 italic text-zinc-400 text-sm">
                        "Your partner hasn't aligned yet. The **Resolution Protocol** is pending, but your side of the pattern reveals a required pivot."
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Your Position</span>
                           <span className="text-xs font-black text-emerald-500 uppercase">Pivot</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Arjun's Position</span>
                           <span className="text-xs font-black text-zinc-700 uppercase">Awaiting Alignment</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="py-4 bg-primary text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
                           Ping Partner
                        </button>
                        <button className="py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                           Reveal My Side
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div className="pt-10">
         <div className="glass-card p-10 rounded-[3rem] border-white/5 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
               <Activity className="w-64 h-64 text-zinc-500" />
            </div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                     Global Sequence: 5 (Change)
                  </div>
                  <div className="space-y-3">
                     <h3 className="text-3xl font-serif font-black italic">The World Pushes Change.</h3>
                     <p className="text-zinc-500 text-lg leading-relaxed font-medium">
                        Today the collective vibration (5) forces structural pivots. For your pattern ({destinyNum}), this creates a friction point. **If you resist this, friction increases. If you align with it, momentum builds.**
                     </p>
                  </div>
                  <div className="pt-4">
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                        View Global Resonance Map <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Collective Focus", val: "Innovation" },
                    { label: "Market Resonance", val: "Volatile" },
                    { label: "Relational Heat", val: "High" },
                    { label: "Sovereign Leverage", val: "Pivot" },
                  ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                       <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</div>
                       <div className="text-sm font-black text-white uppercase tracking-tight">{item.val}</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
