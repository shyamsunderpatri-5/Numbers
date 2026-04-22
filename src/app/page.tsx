"use client";

/**
 * NUMERIQ.AI - Main Landing Page
 * Premium, atmospheric, and high-converting.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ChevronDown,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-['DM_Sans'] overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 amber-gradient rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <span className="font-['Orbitron'] font-bold text-black text-lg">N</span>
            </div>
            <span className="text-xl font-['Playfair_Display'] font-bold tracking-wide">NUMERIQ<span className="text-amber-500">.AI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
            <a href="#science" className="hover:text-amber-500 transition-colors">The Science</a>
            <a href="#enterprise" className="hover:text-amber-500 transition-colors">Enterprise</a>
            <a href="#pricing" className="hover:text-amber-500 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]">
              Initiate
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase tracking-[0.2em] font-bold text-amber-500 mb-8"
          >
            <Zap className="w-3 h-3 fill-amber-500" />
            <span>Worlds Most Advanced Numerology AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-['Playfair_Display'] font-bold mb-8 leading-[1.1] tracking-tight"
          >
            Ancient Mathematical Science.<br />
            <span className="text-amber-500">Modern Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Discover your destiny through the lens of Chaldean mathematics and 
            enterprise-grade RAG artificial intelligence. Pure logic. Zero fluff.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl amber-gradient text-black font-['Orbitron'] font-bold text-sm tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(245,158,11,0.2)] hover:scale-105 transition-transform"
            >
              <span>BEGIN INITIATION</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#science" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800 transition-colors">
              Explore the Science
            </a>
          </motion.div>
        </div>

        {/* Floating Numbers micro-animation background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 select-none">
          {[1, 5, 7, 11, 22, 9, 3, 33].map((num, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 5 + i, repeat: Infinity }}
              className="absolute font-['Orbitron'] text-zinc-500"
              style={{ 
                left: `${10 + (i * 12)}%`, 
                top: `${20 + (i % 4) * 15}%`,
                fontSize: `${2 + (i % 3)}rem`
              }}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section id="science" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Deterministic Math",
                desc: "Every calculation is performed using strict Chaldean algorithms with 100% accuracy. Zero AI involvement in the math layer."
              },
              {
                icon: Globe,
                title: "RAG Knowledge Base",
                desc: "Our AI (Llama 3.3) draws from an enterprise-grade database of 50,000+ verified expert-authored interpretations."
              },
              {
                icon: Cpu,
                title: "Zero-Trust Security",
                desc: "Bank-level encryption, MFA, and absolute privacy for your numerical identity and personal patterns."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:amber-gradient group-hover:text-black transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-['Playfair_Display']">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Science Section */}
      <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-amber-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-8">
            <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Protocol Architecture</div>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold leading-tight">
              The Three-Layer<br />Intelligence Engine.
            </h2>
            <div className="space-y-6">
              {[
                { l: "Layer 1", t: "Pure Discrete Mathematics", d: "Pure TypeScript engine handling 18+ deterministic functions including Name Compounds and Personal Cycles." },
                { l: "Layer 2", t: "Knowledge Retrieval (RAG)", d: "Expert meanings for all 52 compounds and 36 unique combination pairs fetched in milliseconds." },
                { l: "Layer 3", t: "Natural Language Synthesis", d: "Enterprise-grade LLMs synthesize data into actionable Life Strategy Protocols." }
              ].map((layer, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="text-amber-500 font-['Orbitron'] text-xs pt-1">{layer.l}</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{layer.t}</h4>
                    <p className="text-zinc-500 text-sm">{layer.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg aspect-square glass-card rounded-[40px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1),transparent)]" />
            <motion.div 
               animate={{ rotate: [0, 360] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-64 h-64 border border-zinc-700/50 rounded-full border-dashed flex items-center justify-center"
            >
              <div className="w-48 h-48 border border-zinc-700/50 rounded-full border-dashed flex items-center justify-center">
                <div className="w-32 h-32 border border-zinc-700/50 rounded-full border-dashed flex items-center justify-center">
                   <span className="text-4xl font-['Orbitron'] font-bold text-amber-500">NUMERIQ</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-4xl mx-auto glass-card p-16 rounded-[40px] border-amber-500/10 shadow-[0_40px_100px_rgba(0,0,0,1)]">
          <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display'] font-bold mb-8 italic">Ready to see your matrix?</h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-xl mx-auto">
            Join the elite circle of those who use mathematical intelligence 
            to navigate their global professional and personal paths.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center gap-3 px-12 py-6 rounded-2xl amber-gradient text-black font-['Orbitron'] font-bold text-sm tracking-[0.2em] shadow-[0_20px_40px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform"
          >
            Initiate System
            <Zap className="w-4 h-4 fill-black" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-6 h-6 amber-gradient rounded text-black flex items-center justify-center font-bold text-xs font-['Orbitron']">N</div>
            <span className="font-['Playfair_Display'] font-bold text-sm">NUMERIQ.AI</span>
          </div>
          <div className="flex gap-10 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
            <span>&copy; {new Date().getFullYear()} All Rights Reserved</span>
            <a href="#" className="hover:text-amber-500">Security</a>
            <a href="#" className="hover:text-amber-500">Privacy</a>
            <a href="#" className="hover:text-amber-500">Ethics</a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none z-40" />
    </div>
  );
}
