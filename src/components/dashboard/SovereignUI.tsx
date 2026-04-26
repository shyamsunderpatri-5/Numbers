"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Sovereign Glass Panel (Beo UI Spec)
 */
export const GlassPanel = ({ children, className, variant = "default", glow = false }: { children: React.ReactNode, className?: string, variant?: "default" | "dark" | "gold", glow?: boolean }) => {
  const variants = {
    default: "bg-white/2 border-white/6 backdrop-blur-[12px]",
    dark: "bg-black/30 border-white/5 backdrop-blur-[12px]",
    gold: "bg-amber-500/5 border-amber-500/15 backdrop-blur-[12px]"
  };
  
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border",
      variants[variant],
      glow && "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
      className
    )}>
      {children}
    </div>
  );
};

/**
 * Shimmer Text (Beo UI Gold)
 */
export const GoldShimmer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn(
    "bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 bg-[length:200%_auto] bg-clip-text text-fill-transparent animate-shimmer",
    className
  )}>
    {children}
  </span>
);

/**
 * Quick Reply Button (Beo UI Spec)
 */
export const QuickReply = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "bg-amber-500/5 border border-amber-500/20 text-amber-500 text-xs px-3 py-2 rounded-xl transition-all hover:bg-amber-500/12 hover:border-amber-500/40 hover:-translate-y-0.5",
      className
    )}
  >
    {children}
  </button>
);

/**
 * Typing Indicator (Beo UI Animated Dots)
 */
export const TypingIndicator = () => (
  <div className="flex gap-1 items-center h-5">
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-[typing_1s_ease_0s_infinite]"></div>
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-[typing_1s_ease_0.2s_infinite]"></div>
    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-[typing_1s_ease_0.4s_infinite]"></div>
  </div>
);

/**
 * Planet Tag
 */
export const PlanetTag = ({ name, color }: { name: string, color?: string }) => (
  <span className={cn(
    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
    color || "bg-amber-500/10 border-amber-500/30 text-amber-500"
  )}>
    {name}
  </span>
);
