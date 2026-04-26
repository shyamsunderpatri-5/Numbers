/**
 * NUMERIQ.AI - Compatibility Page
 * Advanced number pair analysis.
 */

import React from 'react';
import { InteractiveCompatibility } from "@/components/dashboard/InteractiveCompatibility";
import { getCompatibilityEntry } from "@/lib/numerology/knowledge/compatibility-matrix";
import { Zap, Info } from 'lucide-react';

export default function CompatibilityPage() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-24 pb-20 pt-6">
      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter leading-none">
          Structural <span className="text-primary italic">Harmony.</span>
        </h1>
        <p className="text-zinc-500 max-w-2xl text-lg font-medium leading-relaxed">
          The complex interaction between vibrations is the foundation of structural resonance. 
          Analyze the synergy between two sovereign entities or browse the global matrix.
        </p>
      </div>

      {/* Interactive Checker */}
      <InteractiveCompatibility />

      {/* Global Matrix Section */}
      <div className="space-y-12">
        <div className="flex items-center gap-4 px-2">
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Reference Layer</div>
          <div className="h-[1px] flex-1 bg-white/5" />
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Compatibility Matrix</h3>
        </div>

        <div className="glass-card rounded-[3rem] p-8 lg:p-12 overflow-x-auto custom-scrollbar border-white/5">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/5 text-primary font-serif italic text-xl tracking-widest text-left">MATRX</th>
                {numbers.map(n => (
                  <th key={n} className="p-4 border-b border-white/5 text-zinc-500 font-serif text-2xl font-black">
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {numbers.map(n1 => (
                <tr key={n1} className="hover:bg-primary/5 transition-colors group">
                  <td className="p-4 border-r border-white/5 text-zinc-500 font-serif text-2xl font-black bg-white/5 group-hover:text-primary transition-colors">
                    {n1}
                  </td>
                  {numbers.map(n2 => {
                    const entry = getCompatibilityEntry(n1, n2);
                    const isHigh = entry.score >= 85;
                    const isLow = entry.score <= 55;
                    
                    return (
                      <td 
                        key={n2} 
                        className="p-4 border border-white/5 text-center min-w-[80px]"
                        title={`${entry.pair}: ${entry.oneSentence}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xl font-black ${isHigh ? 'text-emerald-400' : isLow ? 'text-rose-400' : 'text-zinc-300'}`}>
                            {entry.score}
                          </span>
                          <div className={`w-1 h-1 rounded-full ${isHigh ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : isLow ? 'bg-rose-500 shadow-[0_0_5px_#f43f5e]' : 'bg-zinc-700'}`} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend / Key */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[2.5rem] space-y-4 border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Ideal Resonance (85-100)</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            These pairs share complementary frequencies that facilitate rapid growth and 
            emotional stability. Ideal for marriage, co-founding, and long-term mentorship.
          </p>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] space-y-4 border-white/5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
            <Info className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Challenging Dynamic (0-55)</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            These interactions generate significant friction. While they can lead to 
            intense mutual growth, they require constant conscious effort and maturity.
          </p>
        </div>
      </div>
    </div>
  );
}
