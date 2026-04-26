/**
 * NUMERIQ.AI - Business Name Analyzer
 * Specialized engine for corporate vibrational resonance.
 */

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Target,
  BarChart3,
  Globe
} from 'lucide-react';
import { computeNameNumber } from '@/lib/numerology/engine';
import { cn } from '@/lib/utils';

export default function BusinessAnalyzerPage() {
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) return;
    
    setIsLoading(true);
    // Simulate high-performance corporate analysis
    await new Promise(r => setTimeout(r, 2000));
    
    const math = computeNameNumber(businessName);
    
    // Custom business-logic scoring
    const powerNumbers = [1, 3, 5, 8, 9];
    const luckScore = powerNumbers.includes(math.reduced) ? 95 : 75;
    
    setResult({
      name: businessName,
      compound: math.compound,
      root: math.reduced,
      luckScore,
      viability: math.reduced === 8 || math.reduced === 1 ? 'High Growth' : 'Stable Utility'
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-12 pb-20 pt-6">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter leading-none">
          Business <span className="text-primary italic">Analyzer.</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl text-lg font-medium leading-relaxed">
          The name of your entity is its primary market vibration. 
          Analyze potential brand names for structural success and material resonance.
        </p>
      </div>

      <div className="glass-card p-12 rounded-[3.5rem] border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Briefcase className="w-64 h-64 text-primary" />
        </div>
        
        <form onSubmit={handleAnalyze} className="relative z-10 space-y-10">
          <div className="max-w-2xl space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-zinc-500 px-2">Proposed Entity Name</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="e.g. SELVO WORLD" 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl font-bold text-white focus:outline-none focus:border-primary transition-all"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !businessName}
                className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Audit Brand
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Result Card */}
            <div className="lg:col-span-2 glass-card rounded-[3rem] p-12 space-y-10 border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-[2rem] bg-black flex flex-col items-center justify-center border border-primary/20 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                   <span className="text-5xl font-black text-primary font-serif italic">{result.root}</span>
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1">Vibration</span>
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Structural Audit Passed</div>
                  <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tight">{result.name}</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-black uppercase tracking-tighter text-white">Market Resonance</h4>
                  <p className="text-zinc-500 leading-relaxed italic">
                    "This name carries a vibration of {result.root === 8 ? 'massive material expansion' : result.root === 1 ? 'sovereign leadership' : 'balanced utility'}. 
                    It is highly suitable for industries requiring {result.root === 8 ? 'financial trust' : 'creative innovation'}."
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <span>Brand Potency</span>
                      <span className="text-primary">{result.luckScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.luckScore}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <span>Viability Index</span>
                      <span className="text-white">{result.viability}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        className="h-full bg-emerald-500/40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Insights */}
            <div className="space-y-6">
              {[
                { title: "Public Reception", score: "Optimum", icon: Globe },
                { title: "Financial Luck", score: result.root === 8 || result.root === 6 ? "Extreme" : "Stable", icon: TrendingUp },
                { title: "Legal Stability", score: "High", icon: ShieldCheck },
              ].map((insight, i) => (
                <div key={i} className="glass-card p-8 rounded-[2rem] border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <insight.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-tight text-zinc-400">{insight.title}</span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-white">{insight.score}</span>
                </div>
              ))}

              <div className="glass-card p-10 rounded-[2.5rem] bg-primary/10 border-primary/20 text-center space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Unlock B2B Protocol</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest">
                  Get a full competitive analysis vs 3 rival names.
                </p>
                <button className="w-full py-4 bg-primary text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-amber-400 transition-all shadow-xl">
                  Upgrade to Enterprise
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Reference Table (Preview) */}
      <div className="pt-20 space-y-10 opacity-40 grayscale pointer-events-none">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Reference Library</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="p-8 border border-white/5 rounded-3xl space-y-2">
              <div className="text-2xl font-serif font-black text-white/50">{n}</div>
              <div className="text-[9px] uppercase font-black tracking-widest text-zinc-700">Structural Baseline {n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
