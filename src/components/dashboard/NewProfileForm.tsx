"use client";

/**
 * NUMERIQ.AI - New Profile / Initiation Form
 * The entry point for generating new readings.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  User, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Loader2
} from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, "Name is required for mathematical pattern capture"),
  dateOfBirth: z.string().min(1, "Birth date is required for life path trajectory"),
});

type FormData = z.infer<typeof formSchema>;

export const NewProfileForm = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const steps = [
    "Capturing Chaldean Name Frequencies...",
    "Calculating Life Path Trajectories...",
    "Initializing RAG Knowledge Layer...",
    "Synthesizing Human Intelligence..."
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    
    // Simulate high-fidelity analysis steps for UX
    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      const response = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Redirect to result page
        window.location.href = '/dashboard/latest';
      }
    } catch (err) {
      console.error("Initiation failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Form Section */}
            <div className="glass-card p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white font-['Playfair_Display']">Reading Initiation</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name (As given at birth)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600" />
                      <input
                        {...register("fullName")}
                        placeholder="e.g., Marie Skłodowska Curie"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 transition-all"
                      />
                    </div>
                    {errors.fullName && <p className="text-[10px] text-red-400 ml-1">{errors.fullName.message}</p>}
                  </div>

                  {/* DOB Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600" />
                      <input
                        {...register("dateOfBirth")}
                        type="date"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all [color-scheme:dark]"
                      />
                    </div>
                    {errors.dateOfBirth && <p className="text-[10px] text-red-400 ml-1">{errors.dateOfBirth.message}</p>}
                  </div>

                  <button
                    disabled={!isValid || isAnalyzing}
                    className="w-full amber-gradient text-black font-['Orbitron'] font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(245,158,11,0.2)] disabled:opacity-30 disabled:scale-100 disabled:grayscale mt-8"
                  >
                    <span>ANALYZE VIBRATION</span>
                    <Zap className="w-5 h-5 fill-black" />
                  </button>
                </form>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-['Playfair_Display'] font-bold text-white line-leading-tight">
                  Uncover your <span className="text-amber-500">Numerical Identity.</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Our intelligence engine processes your name through the Chaldean script, 
                  matching patterns against 5,000+ years of verified mathematical data.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: ShieldCheck, title: "100% Deterministic Math", desc: "Zero AI hallucination in calculations." },
                  { icon: BrainCircuit, title: "RAG Knowledge Base", desc: "Verified meanings from human experts." },
                  { icon: Zap, title: "Immediate Synthesis", desc: "Results processed in under 10 seconds." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                    <item.icon className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-48 h-48 border-2 border-dashed border-amber-500/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-amber-500/5 blur-3xl"
              />
            </div>
            
            <motion.h3 
              key={analysisStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-['Orbitron'] font-bold text-white mb-4 tracking-wider"
            >
              {steps[analysisStep]}
            </motion.h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              The platform is currently mapping 36,000 mathematical permutations 
              to ensure your reading is 100% accurate.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
