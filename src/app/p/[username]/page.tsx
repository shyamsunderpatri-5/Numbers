"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export default function PublicIdentityPortal({ params }: { params: { username: string } }) {
  const [visitorName, setVisitorName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsChecking(false);
    setShowTeaser(true);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      
      {/* 1. PUBLIC PROFILE HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        <div className="space-y-4">
           <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-[0_0_50px_rgba(212,175,55,0.1)]">
              <Zap className="w-10 h-10" />
           </div>
           <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tighter">
             Sovereign Portal: <span className="text-primary italic">@{params.username}</span>
           </h1>
           <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px]">
              Vibrational Pattern: Secured • Status: Active
           </p>
        </div>

        {!showTeaser ? (
          <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
             <div className="space-y-2">
                <h3 className="text-2xl font-serif font-black italic">Check Your Resonance.</h3>
                <p className="text-zinc-500 text-sm">Enter your name to see how your pattern interacts with @{params.username}.</p>
             </div>
             
             <form onSubmit={handleCheck} className="space-y-4">
                <input 
                  type="text" 
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-serif focus:border-primary/50 outline-none transition-all"
                  required
                />
                <button 
                  disabled={isChecking}
                  className="w-full py-5 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Test Resonance"}
                </button>
             </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 rounded-[3rem] border-primary/30 bg-primary/5 space-y-8"
          >
             <div className="space-y-4">
                <div className="text-5xl font-serif font-black italic text-primary">94% Resonance.</div>
                <p className="text-white text-2xl font-serif italic leading-tight">
                   "This connection feels rare—but it exposes something you usually hide."
                </p>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                   Your vibrational pattern creates a high-resonance alignment with @{params.username}. However, the interaction reveals a **structural friction point** in your material sequence that neither of you is currently addressing.
                </p>
             </div>
             
             <div className="pt-6 border-t border-white/10 space-y-6">
                <p className="text-zinc-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                   Reveal the "Conflict Resolution Protocol" and the hidden dynamics of this interplay.
                </p>
                <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all shadow-2xl">
                   Join the Sequence <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
             </div>
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-4 pt-10">
           <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Powered by NUMERIQ.AI Sovereign Core
           </div>
        </div>
      </motion.div>
    </div>
  );
}
