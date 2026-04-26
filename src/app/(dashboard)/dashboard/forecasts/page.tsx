/**
 * NUMERIQ.AI - Personal Forecasts
 * Temporal vibrational path analysis.
 */

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  TrendingUp, 
  ArrowRight, 
  Lock,
  ChevronRight,
  Zap,
  Activity,
  Sparkles,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useSearchParams } from 'next/navigation';

export default function ForecastsPage() {
  const searchParams = useSearchParams();
  const focus = searchParams.get('focus');
  const [selectedCycle, setSelectedCycle] = useState<'day' | 'week' | 'month'>(focus === 'tomorrow' ? 'day' : 'day');

  return (
    <div className="space-y-12 pb-20 pt-6">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter leading-none">
          Temporal <span className="text-primary italic">Path.</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl text-lg font-medium leading-relaxed">
          Your vibration interacts with the universal cycle in discrete temporal patterns. 
          Identify your personal windows of high-resonance opportunity.
        </p>
      </div>

      {/* Cycle Selector */}
      <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {['day', 'week', 'month'].map((cycle) => (
          <button
            key={cycle}
            onClick={() => setSelectedCycle(cycle as any)}
            className={cn(
              "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              selectedCycle === cycle ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-white"
            )}
          >
            Personal {cycle}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Forecast Display */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-12 rounded-[3.5rem] border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Sparkles className="w-64 h-64 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-12">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] uppercase font-black tracking-widest text-primary">Peak Vibration</div>
                      <div className="text-2xl font-black text-white uppercase tracking-tight">Expansion Window</div>
                    </div>
                  </div>
                  <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                    High Resonance
                  </div>
               </div>

               <div className="space-y-6">
                 <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight">
                   The math favors <br />
                   <span className="text-primary italic">audacious initiatives.</span>
                 </h2>
                 <p className="text-zinc-400 text-xl leading-relaxed max-w-2xl italic">
                   "Your personal year vibration (8) converges with today's lunar cycle, creating a massive pocket of material momentum. This is a day for closing contracts, high-stakes negotiations, and public authority."
                 </p>
               </div>

               <div className="grid md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
                 {[
                   { label: "Love Resonance", val: "High", color: "text-emerald-500" },
                   { label: "Material Luck", val: "Extreme", color: "text-primary" },
                   { label: "Conflict Risk", val: "Minimal", color: "text-zinc-500" },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-1">
                      <div className="text-[9px] uppercase font-black tracking-widest text-zinc-600">{stat.label}</div>
                      <div className={cn("text-xl font-black uppercase tracking-tight", stat.color)}>{stat.val}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Tomorrow's Preview (Return Loop) */}
          <div className={cn(
            "glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.02] relative overflow-hidden group transition-all duration-500",
            focus === 'tomorrow' && "border-primary/50 shadow-[0_0_50px_rgba(212,175,55,0.1)] ring-1 ring-primary/20"
          )}>
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <CalendarDays className="w-48 h-48 text-primary" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                   Next Sequence: Tomorrow
                </div>
                <div className="space-y-3">
                   <h3 className="text-3xl font-serif font-black italic">"How the world responds to you."</h3>
                   <p className="text-zinc-500 max-w-xl text-lg font-medium leading-relaxed">
                      Your internal pattern is set. Tomorrow, the universal frequency shifts to test your external resonance. Most people will see you differently—some as a leader, others as a threat.
                   </p>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
                   Set Alert for Tomorrow's Reveal <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Time Block Breakdown (Premium Placeholder) */}
          <div className="space-y-6">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 px-2">
                <Activity className="w-5 h-5 text-primary" />
                Intraday Precision
             </h3>
             <div className="space-y-4">
                {[
                  { time: "06:00 - 10:00", label: "Foundational Quiet", power: 45 },
                  { time: "10:00 - 14:00", label: "Executive Action", power: 95 },
                  { time: "14:00 - 18:00", label: "Social Magnetism", power: 75 },
                  { time: "18:00 - 22:00", label: "Spiritual Integration", power: 60 },
                ].map((block, i) => (
                  <div key={i} className="glass-card p-6 rounded-2xl border-white/5 flex items-center justify-between group hover:border-primary/10 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="text-sm font-black text-zinc-500 w-32 uppercase tracking-tighter">{block.time}</div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-primary transition-colors">{block.label}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden hidden md:block">
                        <div className="h-full bg-primary/40" style={{ width: `${block.power}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{block.power}%</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar / Upsell */}
        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Temporal Markers</h3>
            <div className="space-y-6">
              {[
                { date: "Oct 24", event: "Peak Resonance Day", icon: Zap },
                { date: "Oct 29", event: "Critical Conflict Node", icon: Activity },
                { date: "Nov 02", event: "New Expansion Cycle", icon: TrendingUp },
              ].map((marker, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                    <marker.icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">{marker.date}</div>
                    <div className="text-sm font-bold text-white uppercase tracking-tight">{marker.event}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Export to Google Calendar
            </button>
          </div>

          <div className="glass-card p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border-primary/20 text-center space-y-6">
             <div className="w-16 h-16 rounded-3xl bg-black border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
                <Lock className="w-6 h-6 text-primary" />
             </div>
             <h4 className="text-xl font-black uppercase tracking-tighter">Pro Temporal Engine.</h4>
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
               Unlock hourly precision, stock market resonance, and custom cycle alerts.
             </p>
             <button className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-2xl">
               Unlock Full Forecast
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
