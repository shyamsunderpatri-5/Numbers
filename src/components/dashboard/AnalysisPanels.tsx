"use client";

import React from "react";
import { GlassPanel, PlanetTag } from "./SovereignUI";
import { cn } from "@/lib/utils";

/**
 * Chaldean Frequency Grid (1-9) - Beo UI Spec
 */
export const ChaldeanGrid = ({ grid }: { grid: Record<number, number> }) => (
  <div className="grid grid-cols-9 gap-1">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => {
      const count = grid[num] || 0;
      return (
        <div 
          key={num}
          style={{ animationDelay: `${i * 0.06}s` }}
          className={cn(
            "p-1.5 rounded-lg text-center transition-all duration-500 animate-in fade-in zoom-in-75",
            count >= 3 ? "bg-green-500/8 border border-green-500/20 text-green-400" :
            count >= 1 ? "bg-amber-500/8 border border-amber-500/20 text-amber-500" :
            "bg-white/3 border border-white/5 text-zinc-700"
          )}
        >
          <div className="text-[10px] font-black">{num}</div>
          <div className="text-[10px] opacity-60 font-bold">{count > 0 ? `×${count}` : "—"}</div>
        </div>
      );
    })}
  </div>
);

/**
 * Lo Shu Magic Square - Beo UI Spec
 * 4 9 2
 * 3 5 7
 * 8 1 6
 */
export const LoShuGrid = ({ grid }: { grid: Record<number, number> }) => {
  const layout = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  return (
    <div className="grid grid-cols-3 gap-1.5 aspect-square">
      {layout.map((num, i) => {
        const count = grid[num] || 0;
        return (
          <div 
            key={num}
            style={{ animationDelay: `${i * 0.05}s` }}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl transition-all duration-500 animate-in fade-in zoom-in-75",
              count >= 2 ? "bg-green-500/8 border border-green-500/20 text-green-400" :
              count === 1 ? "bg-amber-500/8 border border-amber-500/20 text-amber-500" : 
              "bg-white/3 border border-white/5 text-zinc-800"
            )}
          >
            <div className="text-sm font-black">{num}</div>
            <div className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">
              {count >= 3 ? "Excess" : count >= 2 ? "Strong" : count > 0 ? "Present" : "Void"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Planetary Map
 */
export const PlanetaryMap = ({ data }: { data: Array<{ label: string, num: number, planet: string }> }) => (
  <div className="space-y-2">
    {data.map((p, i) => (
      <div key={i} className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 rounded-xl">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{p.label}</span>
        <div className="flex items-center gap-2">
          <PlanetTag name={p.planet} />
          <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-amber-800 to-yellow-600 rounded-md text-[10px] font-black text-white border border-amber-500/30">
            {p.num}
          </span>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Name Resonance Score - Beo UI Spec
 */
export const NameResonanceCard = ({ name, score, label }: { name: string, score: number, label: string }) => (
  <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
    <div className="flex justify-between items-center mb-3">
      <div className="truncate pr-4">
        <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-0.5">Analysis Target</div>
        <div className="text-sm font-bold text-white truncate">{name}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-xl font-black text-amber-500">{score}<span className="text-xs opacity-50 ml-0.5">/100</span></div>
      </div>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
      <div 
        className="h-full bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 transition-all duration-1000 ease-out animate-shimmer bg-[length:200%_auto]" 
        style={{ width: `${score}%` }}
      />
    </div>
    <p className={cn(
      "text-[10px] font-bold uppercase tracking-widest",
      score >= 80 ? "text-green-400" : score >= 60 ? "text-amber-500" : "text-red-400"
    )}>
      {label}
    </p>
  </div>
);
