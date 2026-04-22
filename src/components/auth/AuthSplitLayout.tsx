"use client";

/**
 * NUMERIQ.AI - Auth Split Layout
 * 60% Animated Particle Field / 40% Glassmorphism Form
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-[#030303] text-zinc-100 overflow-hidden font-['DM_Sans']">
      
      {/* Left 60%: Animated Particle Field & Brand Branding */}
      <div className="hidden lg:flex relative w-[60%] bg-zinc-950 items-center justify-center border-r border-zinc-800/50">
        
        {/* Animated Grid/Particles Background (Simulated with CSS/Framer) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-transparent"
          />
        </div>

        <div className="relative z-10 text-center max-w-xl px-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight"
          >
            Ancient Science.<br />
            <span className="text-amber-500 italic">Modern Intelligence.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-zinc-400 text-lg leading-relaxed mb-8"
          >
            NUMERIQ.AI transforms Chaldean mathematical patterns into deep, 
            actionable insights using enterprise-grade RAG technology.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 border-t border-zinc-800 pt-8"
          >
            <div className="text-center">
              <div className="text-2xl font-['Orbitron'] text-white">50K+</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Charts Studied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-['Orbitron'] text-white">99.8%</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Math Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-['Orbitron'] text-white">120+</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">Global Regions</div>
            </div>
          </motion.div>
        </div>

        {/* Floating Numbers micro-animation */}
        {[7, 3, 11, 5, 22].map((num, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.2, y: [-20, 20, -20] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            className="absolute text-zinc-600 font-['Orbitron'] select-none pointer-events-none"
            style={{ 
              left: `${15 + i * 15}%`, 
              top: `${20 + (i % 3) * 20}%`,
              fontSize: `${2 + i}%` 
            }}
          >
            {num}
          </motion.div>
        ))}
      </div>

      {/* Right 40%: Glassmorphism Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.05),transparent)]"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="mb-10 lg:text-left text-center">
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-2 tracking-tight">
              {title}
            </h2>
            <p className="text-zinc-500 text-sm">
              {subtitle}
            </p>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effect */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-amber-500/5 blur-[120px] rounded-full group-hover:bg-amber-500/10 transition-colors duration-500" />
            
            <div className="relative z-10">
              {children}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} NUMERIQ.AI — Globally Encrypted Enterprise Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
