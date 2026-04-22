"use client";

/**
 * NUMERIQ.AI - Numerical Fingerprint (Chaldean 9-Grid)
 * Visualizes the vibrational composition of a user's matrix.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, AlertCircle, Info } from 'lucide-react';

interface NumericalFingerprintProps {
  presentNumbers: number[];
  intensity: Record<number, number>;
  missingNumbers: number[];
}

const NUMBER_METADATA: Record<number, { title: string; planet: string; element: string; color: string }> = {
  1: { title: "Leadership", planet: "Sun", element: "Fire", color: "from-amber-200 to-amber-500" },
  2: { title: "Intuition", planet: "Moon", element: "Water", color: "from-zinc-200 to-zinc-400" },
  3: { title: "Expansion", planet: "Jupiter", element: "Air", color: "from-yellow-200 to-yellow-500" },
  4: { title: "Structure", planet: "Rahu", element: "Earth", color: "from-blue-400 to-blue-600" },
  5: { title: "Commerce", planet: "Mercury", element: "Ether", color: "from-emerald-300 to-emerald-500" },
  6: { title: "Luxury", planet: "Venus", element: "Water", color: "from-pink-300 to-pink-500" },
  7: { title: "Wisdom", planet: "Ketu", element: "Ether", color: "from-indigo-300 to-indigo-600" },
  8: { title: "Authority", planet: "Saturn", element: "Earth", color: "from-slate-400 to-slate-700" },
  9: { title: "Action", planet: "Mars", element: "Fire", color: "from-red-400 to-red-600" },
};

export const NumericalFingerprint: React.FC<NumericalFingerprintProps> = ({ 
  presentNumbers, 
  intensity, 
  missingNumbers 
}) => {
  const gridOrder = [3, 6, 9, 2, 5, 8, 1, 4, 7]; // Vertical Chaldean Layout

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-['Orbitron'] font-bold text-white tracking-widest flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-500" />
          Numerical Fingerprint
        </h3>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Present</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Missing</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {gridOrder.map((num) => {
          const isPresent = presentNumbers.includes(num);
          const count = intensity[num] || 0;
          const meta = NUMBER_METADATA[num];

          return (
            <motion.div
              key={num}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: num * 0.05 }}
              className={`relative aspect-square rounded-3xl border-2 transition-all duration-500 overflow-hidden group ${
                isPresent 
                  ? 'bg-zinc-950/50 border-amber-500/30' 
                  : 'bg-zinc-950/20 border-zinc-900 grayscale opacity-40'
              }`}
            >
              {/* Background Glow */}
              {isPresent && (
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${meta.color} blur-xl group-hover:opacity-20 transition-opacity`} />
              )}

              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex items-start justify-between">
                  <span className={`text-3xl font-['Orbitron'] font-bold ${isPresent ? 'text-white' : 'text-zinc-700'}`}>
                    {num}
                  </span>
                  {count > 1 && (
                    <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      x{count}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className={`text-[10px] uppercase font-bold tracking-widest ${isPresent ? 'text-zinc-400' : 'text-zinc-800'}`}>
                    {meta.title}
                  </div>
                  <div className={`text-[8px] uppercase font-medium tracking-tighter ${isPresent ? 'text-amber-500/60' : 'text-zinc-900'}`}>
                    {meta.planet} / {meta.element}
                  </div>
                </div>
              </div>

              {isPresent && (
                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Sparkles className="w-16 h-16 text-amber-500" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Logic for Missing Intensity */}
      <div className="glass-card p-6 rounded-3xl border-l-[4px] border-amber-500/50">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Vibrational Deficit</h4>
            <div className="flex flex-wrap gap-2">
              {missingNumbers.map(n => (
                <div key={n} className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-['Orbitron'] font-bold text-zinc-500">{n}</span>
                  <span className="text-[10px] text-zinc-600 font-medium uppercase">{NUMBER_METADATA[n].title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
