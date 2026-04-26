"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Heart, Users, Briefcase, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { computeNameNumber } from '@/lib/numerology/engine';
import { getCompatibilityEntry } from '@/lib/numerology/knowledge/compatibility-matrix';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

export const InteractiveCompatibility = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // INSTRUMENTATION: Track when the result (and thus the invite trigger) is seen
  useEffect(() => {
    if (result) {
      trackEvent('invite_trigger_seen', { score: result.score });
    }
  }, [result]);

  const handleCheck = async () => {
    if (!name1 || !name2) return;
    setIsLoading(true);
    
    // Simulate deep analysis
    await new Promise(r => setTimeout(r, 1500));
    
    const num1 = computeNameNumber(name1).reduced;
    const num2 = computeNameNumber(name2).reduced;
    const entry = getCompatibilityEntry(num1, num2);
    
    setResult({
      ...entry,
      num1,
      num2,
      name1,
      name2
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-12">
      {/* Input Section */}
      <div className="glass-card p-10 rounded-[3rem] border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Users className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-black tracking-tight uppercase">Vibrational Synergy Check.</h2>
            <p className="text-zinc-500 text-sm font-medium">Identify the resonance between any two sovereign signatures.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-2">Entity Alpha</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
              />
            </div>
            
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-2">Entity Beta</label>
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleCheck}
              disabled={isLoading || !name1 || !name2}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-2xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Analyze Resonance
            </button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 120}
                    initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 120) * (1 - result.score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn(
                      result.score >= 85 ? "text-emerald-500" : result.score >= 65 ? "text-primary" : "text-rose-500",
                      "drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black font-serif tracking-tighter text-white">{result.score}%</span>
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500">{result.label} Harmony</span>
                </div>
              </div>

              <div className="text-center max-w-2xl px-6 space-y-4">
                 <h3 className="text-3xl font-serif font-black italic">
                   {result.score >= 85 
                     ? `"This connection is rare… but unstable if misunderstood."` 
                     : result.score >= 65 
                       ? `"A balanced resonance that requires constant vibrational upkeep."`
                       : `"A high-friction alignment that creates either diamonds or dust."`}
                 </h3>
                 <p className="text-zinc-500 leading-relaxed text-lg">
                   The interaction between the solar {result.num1} and lunar {result.num2} vibrations creates 
                   a {result.label} resonance. {result.score >= 85 
                     ? 'This bond feels natural—almost destined—but carries a silent risk of collapse if one of you pulls away under external pressure.' 
                     : 'The frequency gap here generates significant heat. This alignment creates either a powerhouse partnership or a slow erosion of trust, depending on who takes the lead during conflict.'}
                 </p>
                 
                 {/* INVITE TRIGGER ENGINE */}
                 <div className="pt-8 border-t border-white/5 mt-8 space-y-6">
                    <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 relative overflow-hidden group">
                       <div className="relative z-10 space-y-4">
                          <h4 className="text-xl font-serif font-black italic text-white">"This pattern is incomplete."</h4>
                          <p className="text-zinc-500 text-sm max-w-md italic">
                             "This pattern becomes fully visible only when both perspectives are present. You have seen the resonance—now reveal the shared protocol."
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 pt-2">
                             <button 
                                onClick={() => trackEvent('invite_clicked', { type: 'full_protocol' })}
                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                             >
                                Reveal Shared Protocol <ArrowRight className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => trackEvent('invite_clicked', { type: 'lightweight_preview' })}
                                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                             >
                                Share Low-Pressure Preview
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Romantic Synergy", score: result.score + 5, icon: Heart, desc: "High emotional resonance with occasional friction." },
                { title: "Intellectual Bond", score: result.score - 10, icon: Users, desc: "Strong alignment on core truths and strategic vision." },
                { title: "Professional Trust", score: result.score, icon: Briefcase, desc: "Reliable structural cooperation for long-term goals." },
              ].map((dim, i) => (
                <div key={i} className="glass-card p-8 rounded-3xl space-y-6 border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      <dim.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-white">{dim.score}%</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase tracking-widest">{dim.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{dim.desc}</p>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dim.score}%` }}
                      className="h-full bg-primary/40"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell CTA */}
            <div className="glass-card p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border-primary/10 text-center space-y-6">
              <h4 className="text-2xl font-black uppercase tracking-tighter">Unlock the Full Compatibility Matrix.</h4>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto">
                Get a 15-page deep dive into your relationship's karmic triggers, structural strengths, 
                and vibrational remedies for long-term stability.
              </p>
              <button className="px-10 py-4 bg-primary text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all shadow-2xl">
                Unlock Full Relationship Protocol
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
