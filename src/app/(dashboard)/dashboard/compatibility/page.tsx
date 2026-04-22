/**
 * NUMERIQ.AI - Compatibility Page
 * Advanced number pair analysis.
 */

import React from 'react';
import { COMPATIBILITY_MATRIX, getCompatibilityEntry } from "@/lib/numerology/knowledge/compatibility-matrix";
import { ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';

export default function CompatibilityPage() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
          Global <span className="text-amber-500">Compatibility Matrix.</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl leading-relaxed">
          The complex interaction between vibrations is the foundation of structural harmony. 
          Use the matrix below to identify the resonance between any two core frequencies.
        </p>
      </div>

      <div className="glass-card rounded-[40px] p-8 lg:p-12 overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-zinc-800 text-amber-500 font-['Orbitron'] text-sm tracking-widest text-left">MATRX</th>
              {numbers.map(n => (
                <th key={n} className="p-4 border-b border-zinc-800 text-zinc-400 font-['Orbitron'] text-lg font-bold">
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numbers.map(n1 => (
              <tr key={n1} className="hover:bg-amber-500/5 transition-colors group">
                <td className="p-4 border-r border-zinc-800 text-zinc-400 font-['Orbitron'] text-lg font-bold bg-zinc-950/20 group-hover:text-amber-500 transition-colors">
                  {n1}
                </td>
                {numbers.map(n2 => {
                  const entry = getCompatibilityEntry(n1, n2);
                  const isHigh = entry.score >= 85;
                  const isLow = entry.score <= 55;
                  
                  return (
                    <td 
                      key={n2} 
                      className="p-4 border border-zinc-800/50 text-center min-w-[80px]"
                      title={`${entry.pair}: ${entry.oneSentence}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-xl font-['Orbitron'] font-bold ${isHigh ? 'text-emerald-400' : isLow ? 'text-red-400' : 'text-zinc-300'}`}>
                          {entry.score}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${isHigh ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : isLow ? 'bg-red-500 shadow-[0_0_5px_#ef4444]' : 'bg-zinc-700'}`} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Ideal Resonance (85-100)</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            These pairs share complementary frequencies that facilitate rapid growth and 
            emotional stability. Ideal for marriage, co-founding, and long-term mentorship.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Info className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Challenging Dynamic (0-55)</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            These interactions generate significant friction. While they can lead to 
            intense mutual growth, they require constant conscious effort and maturity.
          </p>
        </div>
      </div>
    </div>
  );
}
