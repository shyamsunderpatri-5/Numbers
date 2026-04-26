"use client";

import React, { useState } from 'react';
import { ArrowRight, Loader2, Zap } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { computeNameNumber } from '@/lib/numerology/engine';
import { getCompatibilityEntry } from '@/lib/numerology/knowledge/compatibility-matrix';
import { cn } from '@/lib/utils';

export const QuickSynergy = () => {
  const [partnerName, setPartnerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!partnerName) return;
    setIsLoading(true);
    
    // Track intent
    trackEvent('quick_synergy_clicked', { partner: partnerName });
    
    // Artificial latency for "processing" feel
    await new Promise(r => setTimeout(r, 1200));
    
    const num1 = 1; // Fallback for demo if no user data, usually would pass from props
    const num2 = computeNameNumber(partnerName).reduced;
    const entry = getCompatibilityEntry(num1, num2);
    
    setResult(entry);
    setIsLoading(false);
  };

  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-primary/10 space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Partner Name" 
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white placeholder:text-zinc-600" 
          />
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={isLoading || !partnerName}
          className="w-full py-4 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <>
              Analyze Pair <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase font-black tracking-widest text-zinc-500">Resonance</span>
            <span className={cn(
              "text-sm font-black",
              result.score > 80 ? "text-emerald-500" : "text-primary"
            )}>{result.score}%</span>
          </div>
          <p className="text-[10px] text-zinc-400 italic line-clamp-2 leading-relaxed">
            "{result.label}: {result.score > 80 ? 'A high-resonance alignment with structural potential.' : 'A high-friction alignment requiring vibrational adjustment.'}"
          </p>
        </div>
      )}

      {!result && (
        <p className="text-[10px] text-zinc-600 text-center italic">
          "Is your vibration compatible with your co-founder or spouse?"
        </p>
      )}
    </div>
  );
};
