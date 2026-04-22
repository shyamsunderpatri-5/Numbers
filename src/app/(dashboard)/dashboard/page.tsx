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
  CalendarDays
} from 'lucide-react';
import { Metadata } from 'next';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AIParsedReading } from '@/lib/numerology/types';

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

  const { data: latestReadingData } = await supabase
    .from('readings')
    .select('ai_reading_json, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const latestReading = latestReadingData?.ai_reading_json as unknown as AIParsedReading | undefined;

  return (
    <div className="space-y-12 pb-20 pt-6">
      
      {/* 1. STATE-OF-THE-ART HERO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500">Live Matrix Connection</span>
          </div>
          <h1 className="text-6xl font-['Playfair_Display'] font-black text-white tracking-tighter leading-tight">
            The <span className="text-amber-500">Master</span> Dashboard.
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg font-medium">
            {latestReading 
              ? `System Online. Currently synchronizing with your ${latestReading.mathData.destinyCompound} Destiny vibration.`
              : "Awaiting your numerical initiation. Begin the analysis to unlock the command center."}
          </p>
        </div>
        
        <Link 
          href="/dashboard/new" 
          className="group relative px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-4 hover:bg-amber-500 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="uppercase tracking-tighter">New Initiation</span>
          <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* 2. REAL-TIME VIBRATION STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Intelligence Logs", value: readingCount || 0, icon: History, sub: "Total Protocols" },
          { label: "Matrix Harmony", value: latestReading ? `${latestReading.mathData.harmonyScore}%` : "Awaiting", icon: Sparkles, sub: "Vibrational Alignment" },
          { label: "Security Status", value: "Enterprise", icon: ShieldCheck, sub: "MFA Active" },
          { label: "Current Phase", value: latestReading ? `Year ${latestReading.mathData.personalYear}` : "Awaiting", icon: CalendarDays, sub: "Personal Cycle" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] relative group border-zinc-900 overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700">
               <stat.icon className="w-32 h-32" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-black">{stat.label}</div>
                 <stat.icon className="w-4 h-4 text-amber-500/40" />
              </div>
              <div className="text-3xl font-['Orbitron'] font-black text-white">{stat.value}</div>
              <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. PRIMARY INTELLIGENCE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                 <Star className="w-5 h-5 text-amber-500" />
                 Active Protocol
              </h3>
              <Link href="/dashboard/history" className="text-[10px] uppercase font-black tracking-widest text-zinc-600 hover:text-amber-500 transition-colors">Complete Archive</Link>
           </div>

           {latestReading ? (
             <div className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                   <Zap className="w-48 h-48 text-amber-500" />
                </div>
                
                <div className="space-y-10 relative z-10">
                   <div className="flex flex-col md:flex-row gap-10 items-start">
                      <div className="relative shrink-0">
                         <div className="w-28 h-28 rounded-[2rem] bg-zinc-950 border-2 border-zinc-900 group-hover:border-amber-500/50 transition-colors flex items-center justify-center relative shadow-inner">
                            <span className="text-5xl font-['Orbitron'] font-black text-white group-hover:text-amber-500 transition-colors">{latestReading.mathData.destinyNumber}</span>
                            <div className="absolute -bottom-3 bg-amber-500 text-black text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">Destiny</div>
                         </div>
                         <div className="absolute inset-0 bg-amber-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4 text-zinc-600">
                           <span className="text-xs font-bold uppercase tracking-widest">Type: Chaldean {latestReading.mathData.destinyCompound}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                           <span className="text-xs font-bold uppercase tracking-widest">Date: {new Date(latestReadingData.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-3xl font-['Playfair_Display'] font-bold text-white tracking-tight">The {latestReading.mathData.destinyCompound} Protocol Synthesis.</h4>
                        <p className="text-zinc-500 leading-relaxed max-w-2xl line-clamp-3 italic">
                           "{latestReading.executiveSummary}"
                        </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-8 bg-zinc-950/50 border border-zinc-900 rounded-[2rem]">
                      {[
                        { label: "Life Path", val: latestReading.mathData.lifePathNumber, sub: latestReading.mathData.lifePathCompound },
                        { label: "Soul Urge", val: latestReading.mathData.soulUrgeNumber, sub: "Inner" },
                        { label: "Self Harmony", val: `${latestReading.mathData.harmonyScore}%`, sub: "Matrix" },
                        { label: "Cycle Phase", val: `Year ${latestReading.mathData.personalYear}`, sub: "Growth" },
                      ].map((item, i) => (
                        <div key={i} className="text-center">
                          <div className="text-[9px] uppercase tracking-tighter text-zinc-600 font-black mb-1">{item.label}</div>
                          <div className="text-2xl font-['Orbitron'] font-black text-white/90">{item.val}</div>
                          <div className="text-[8px] uppercase font-bold text-zinc-700">{item.sub}</div>
                        </div>
                      ))}
                   </div>

                   <Link 
                     href="/dashboard/latest" 
                     className="w-full py-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-amber-500/20 transition-all flex items-center justify-center gap-3 group/btn"
                   >
                     <span className="text-sm font-black text-white uppercase tracking-tighter">Access Theoretical Narrative Protocol</span>
                     <ChevronRight className="w-4 h-4 text-amber-500 group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </div>
           ) : (
             <div className="glass-card rounded-[2.5rem] p-20 text-center space-y-6 border-dashed border-zinc-800">
                <div className="w-24 h-24 rounded-full bg-zinc-900/50 border-2 border-zinc-800 flex items-center justify-center mx-auto mb-4 group hover:border-amber-500/20 transition-all">
                  <ShieldCheck className="w-10 h-10 text-zinc-700 group-hover:text-amber-500/40 transition-colors" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-3xl font-['Playfair_Display'] font-bold text-white tracking-tight">System Initialization Awaiting.</h4>
                   <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">Your vibrational data has not been synchronized. Execute your first reading to activate the intelligence engine.</p>
                </div>
                <Link 
                  href="/dashboard/new" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-amber-500 text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-colors"
                >
                  Initiate Now <ChevronRight className="w-4 h-4" />
                </Link>
             </div>
           )}
        </div>

        {/* SIDEBAR: VIBRATIONAL REMEDIES */}
        <div className="space-y-8">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 px-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Remedy Status
           </h3>

           <div className="space-y-4">
              {[
                { title: "Lucky Color", val: latestReading?.knowledgeContext.luckyElementsForProfile.colors[0].name ?? "N/A", icon: "🎨" },
                { title: "Primary Element", val: latestReading?.knowledgeContext.destinyKnowledge.element ?? "N/A", icon: "☀️" },
                { title: "Strategic Timing", icon: "📅", val: latestReading?.knowledgeContext.luckyElementsForProfile.days[0] ?? "N/A" },
                { title: "Dominant Planet", val: latestReading?.knowledgeContext.destinyKnowledge.planet ?? "N/A", icon: "🪐" },
              ].map((item, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl flex items-center gap-5 hover:border-amber-500/10 transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-[1rem] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase text-zinc-600 font-black tracking-widest">{item.title}</div>
                    <div className="text-sm font-black text-white tracking-tight uppercase">{item.val}</div>
                  </div>
                </div>
              ))}
           </div>

           <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 blur-lg group-hover:scale-125 transition-transform duration-700">
                 <ShieldCheck className="w-48 h-48 text-amber-500" />
              </div>
              <div className="flex items-center gap-2 text-amber-500">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-[10px] uppercase font-black tracking-[0.2em]">Matrix Premium</span>
              </div>
              <div className="space-y-2 relative z-10">
                 <h4 className="text-lg font-bold text-white tracking-tight uppercase">Unlock Full Protocol v5.0</h4>
                 <p className="text-xs text-zinc-500 leading-relaxed">
                   Gain access to the complete 35-page theoretical PDF, the Compatibility Matrix, and real-time AI consultation.
                 </p>
              </div>
              <button className="w-full py-4 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-2xl active:scale-95">
                 Optimize My Path
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
