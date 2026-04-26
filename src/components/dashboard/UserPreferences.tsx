"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, AlertTriangle, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UserPreferences = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({
    daily_vibration: true,
    crisis_nodes: false,
    privacy_mode: true
  });

  const togglePref = async (key: keyof typeof prefs) => {
    setLoading(key);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: key, enabled: !prefs[key] })
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-10">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-black text-white uppercase tracking-tighter">Psychological <span className="text-primary italic">Resonance.</span></h3>
        <p className="text-zinc-500 text-sm font-medium">Control how the system interacts with your sovereign identity.</p>
      </div>

      <div className="space-y-6">
        {[
          { id: 'daily_vibration', label: 'Identity Path Alerts', icon: Zap, desc: 'Narrative guidance for your daily pattern. "Today pushes you toward change. Most people resist this. You shouldn\'t."' },
          { id: 'crisis_nodes', label: 'Pressure Node Warnings', icon: AlertTriangle, desc: 'Alerts for when your pattern hits a structural wall. "Tomorrow will test your resolve. Here is how to prepare."' },
          { id: 'privacy_mode', label: 'Identity Ghosting', icon: Shield, desc: 'Absolute privacy. Scrub all trace of your vibrational signature 24 hours after each synthesis.' },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-black text-white uppercase tracking-tight">{item.label}</div>
                <div className="text-[10px] text-zinc-500 font-medium leading-relaxed max-w-xs">{item.desc}</div>
              </div>
            </div>

            <button 
              onClick={() => togglePref(item.id as any)}
              disabled={loading === item.id}
              className={cn(
                "relative w-12 h-6 rounded-full transition-all duration-300",
                prefs[item.id as keyof typeof prefs] ? "bg-primary" : "bg-zinc-800"
              )}
            >
              <motion.div 
                animate={{ x: prefs[item.id as keyof typeof prefs] ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white flex items-center justify-center"
              >
                {loading === item.id && <Loader2 className="w-2 h-2 text-primary animate-spin" />}
              </motion.div>
            </button>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 text-center">
         <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Protocol 5.1 Hardened Access</p>
      </div>
    </div>
  );
};
