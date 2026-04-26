"use client";

import React, { useState } from "react";
import { GlassPanel, GoldShimmer } from "./SovereignUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Lock, Zap, Calculator } from "lucide-react";

interface InitiationGateProps {
  onInitiate: (data: { name: string, dob: string, callingName?: string }) => void;
  isLoading?: boolean;
}

export function InitiationGate({ onInitiate, isLoading }: InitiationGateProps) {
  const [formData, setFormData] = useState({
    name: "",
    day: "",
    month: "",
    year: "",
    callingName: ""
  });

  const handleStart = () => {
    if (!formData.name || !formData.day || !formData.month || !formData.year) return;
    onInitiate({
      name: formData.name,
      dob: `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`,
      callingName: formData.callingName
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#05020f] overflow-hidden relative">
      {/* Background ambient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-yellow-400 flex items-center justify-center text-black font-black text-lg shadow-[0_0_30px_rgba(234,179,8,0.3)]">N</div>
            <span className="text-2xl font-bold text-zinc-300 tracking-widest">
              NUMERIQ<span className="text-amber-500">.AI</span>
            </span>
          </div>
          <p className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-black">
            Sovereign Chaldean Intelligence
          </p>
        </div>

        {/* Input Card */}
        <GlassPanel className="p-8" glow>
          <h2 className="text-xl font-bold text-white mb-2">Begin Your Reading</h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            Enter your details. The system will map your complete 
            Chaldean grid and core vibrations.
          </p>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black block">
                Full Legal Name
              </label>
              <input 
                type="text" 
                placeholder="As it appears on documents"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all" 
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black block">
                Date of Birth
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input 
                  type="number" 
                  placeholder="DD" 
                  value={formData.day}
                  onChange={e => setFormData({...formData, day: e.target.value})}
                  className="bg-white/3 border border-white/8 rounded-xl px-4 py-3.5 text-white text-center placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500/40 transition-all" 
                />
                <input 
                  type="number" 
                  placeholder="MM" 
                  value={formData.month}
                  onChange={e => setFormData({...formData, month: e.target.value})}
                  className="bg-white/3 border border-white/8 rounded-xl px-4 py-3.5 text-white text-center placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500/40 transition-all" 
                />
                <input 
                  type="number" 
                  placeholder="YYYY"
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: e.target.value})}
                  className="bg-white/3 border border-white/8 rounded-xl px-4 py-3.5 text-white text-center placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500/40 transition-all" 
                />
              </div>
            </div>

            {/* Optional calling name */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black block">
                Calling Name 
                <span className="text-zinc-700 normal-case lowercase ml-1">(optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="Name people call you daily"
                value={formData.callingName}
                onChange={e => setFormData({...formData, callingName: e.target.value})}
                className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-amber-500/40 transition-all" 
              />
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleStart}
              disabled={isLoading || !formData.name || !formData.year}
              className={cn(
                "w-full mt-2 bg-amber-500 text-black font-black py-4 rounded-xl transition-all duration-200 shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2 text-xs tracking-widest disabled:opacity-50",
                !isLoading && "hover:-translate-y-0.5 active:scale-95"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <Calculator className="w-4 h-4 animate-spin" />
                  MAPPING YOUR MATRIX...
                </div>
              ) : (
                <>
                  <span className="text-base">✦</span>
                  REVEAL MY PATTERN
                  <span className="text-base">✦</span>
                </>
              )}
            </button>
          </div>
        </GlassPanel>

        {/* Full screen loading overlay for high-fidelity transition */}
        {isLoading && (
          <div className="fixed inset-0 bg-[#05020f] z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-20 h-20 relative mb-8">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-amber-700 to-yellow-400 flex items-center justify-center text-black font-black text-3xl shadow-glow">N</div>
            </div>
            <div className="space-y-2 text-center">
              <GoldShimmer className="text-sm font-black tracking-[0.3em] uppercase">DECODING CHALDEAN MATRIX</GoldShimmer>
              <div className="flex gap-1 justify-center">
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3 h-3" /> Private
          </span>
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" /> Instant
          </span>
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Calculator className="w-3 h-3" /> Chaldean
          </span>
        </div>
      </div>
    </div>
  );
}
