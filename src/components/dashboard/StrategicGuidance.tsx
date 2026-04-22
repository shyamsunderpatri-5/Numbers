"use client";

/**
 * NUMERIQ.AI - Strategic Guidance Cards
 * Actionable intelligence derived from the RAG synthesis.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface GuidanceCardProps {
  title: string;
  insight: string;
  action: string;
  type: 'growth' | 'caution' | 'focus';
}

const CATEGORIES = {
  growth: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  caution: { icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  focus: { icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export const StrategicGuidance = ({ guidance }: { guidance: string }) => {
  // Parsing simple sections from AI string if possible, or just showing the first block
  // For now, we'll demonstrate with a structured layout assuming AI provides key themes
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
        <h3 className="text-xl font-bold text-white tracking-tight uppercase">Strategic Protocol</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-3xl space-y-4 border-t-2 border-t-emerald-500/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-emerald-500" />
          </div>
          <h4 className="text-lg font-bold text-white">Dominant Vibration</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Your current matrix shows a high concentration of material energy. Optimize by initiating new ventures on Thursdays.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-3xl space-y-4 border-t-2 border-t-amber-500/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-500" />
          </div>
          <h4 className="text-lg font-bold text-white">Strategic Adjustment</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
             The deficit in Number 4 (Structure) suggests a need for delegated management. Avoid legal signings on Saturdays.
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 rounded-3xl space-y-4 border-t-2 border-t-blue-500/30"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <h4 className="text-lg font-bold text-white">Execution Priority</h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Focus on internal audit and consolidation. Your vibration is entering a '7' phase of deep analytical refinement.
          </p>
        </motion.div>
      </div>

      <div className="glass-card p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target className="w-32 h-32" />
         </div>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-white tracking-tight">Executive Guidance</h4>
              <p className="text-zinc-400 max-w-2xl leading-relaxed italic">
                "{guidance}"
              </p>
            </div>
            <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-3 group-hover:bg-amber-500 transition-all shrink-0">
               <span>Full Deep Dive</span>
               <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
};
