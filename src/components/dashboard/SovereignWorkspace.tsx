"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  GlassPanel, 
  TypingIndicator,
  QuickReply,
  GoldShimmer
} from "./SovereignUI";
import { 
  ChaldeanGrid, 
  LoShuGrid, 
  PlanetaryMap, 
  NameResonanceCard 
} from "./AnalysisPanels";
import { 
  Sparkles, 
  Send,
  PieChart,
  Lock,
  Zap,
  Calculator,
  User,
  History,
  Activity,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Smartphone,
  Crown
} from "lucide-react";
import * as sovereignMath from "@/lib/engine/core/sovereign-math";
import { getDailyVibrationInfo } from "@/lib/engine/core/decision-logic";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

interface SovereignWorkspaceProps {
  reading: {
    name: string;
    dob: string;
    callingName?: string;
  };
  onReset: () => void;
}

export default function SovereignWorkspace({ reading, onReset }: SovereignWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(3);
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const math = React.useMemo(() => sovereignMath.analyze(reading.name, reading.dob), [reading]);
  const synergy = React.useMemo(() => reading.callingName ? sovereignMath.checkSynergy(reading.name, reading.callingName) : null, [reading]);
  const dailyVibe = React.useMemo(() => getDailyVibrationInfo(math.timeline.personalDay), [math.timeline.personalDay]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleAction = (idx: number) => {
    setCompletedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || questionsLeft <= 0) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setQuestionsLeft(prev => prev - 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reading.name,
          dob: reading.dob,
          message: text,
          context: {
            psychic: math.psychic,
            destiny: math.destiny,
            grid: math.grid,
            timeline: math.timeline
          }
        })
      });
      const data = await response.json();
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: data.text, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-[#05020f] text-zinc-300 flex overflow-hidden font-inter selection:bg-amber-500/30 relative">
      
      {/* 1. LEFT SIDEBAR: IDENTITY (Fixed & Responsive) */}
      <aside className={cn(
        "w-80 border-r border-white/5 flex flex-col bg-[#05020f] backdrop-blur-xl transition-transform duration-300 z-50",
        "fixed inset-y-0 left-0 lg:static lg:flex",
        showIdentity ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-700 to-yellow-400 flex items-center justify-center text-black font-black text-sm">N</div>
            <span className="text-lg font-bold text-white tracking-widest uppercase">NUMERIQ<span className="text-amber-500">.AI</span></span>
          </div>
          <button className="lg:hidden p-2 text-zinc-500" onClick={() => setShowIdentity(false)}><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          {/* Identity Section */}
          <section>
            <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4">Sovereign Identity</div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-800 to-yellow-600 flex items-center justify-center text-2xl font-black text-white border border-amber-500/30 shadow-glow">
                {math.psychic}
              </div>
              <div>
                <div className="text-white font-bold truncate max-w-[150px]">{reading.name}</div>
                <div className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Psychic Number</div>
              </div>
            </div>
          </section>

          {/* Numbers Section */}
          <section className="grid grid-cols-2 gap-3">
            <GlassPanel variant="dark" className="p-3">
              <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Destiny</div>
              <div className="text-xl font-black text-white">{math.destiny}</div>
            </GlassPanel>
            <GlassPanel variant="dark" className="p-3">
              <div className="text-[9px] text-zinc-500 uppercase font-black mb-1">Cycle</div>
              <div className="text-xl font-black text-amber-500">{math.timeline.personalDay}</div>
            </GlassPanel>
          </section>

          {/* WhatsApp Hook (Simulated) */}
          <section>
            <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4">Integrations</div>
            <GlassPanel variant="dark" className="p-4 bg-green-500/5 border-green-500/10 group cursor-pointer hover:border-green-500/30 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-white">Daily WhatsApp Insight</div>
              </div>
              <p className="text-[10px] text-zinc-500 leading-tight mb-3">Never miss your frequency. Get morning guidance directly.</p>
              <button className="w-full py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-[9px] font-black uppercase text-green-500 rounded-lg transition-all">
                Connect Mobile
              </button>
            </GlassPanel>
          </section>

          {/* Pro Upgrade Hint */}
          <section>
            <GlassPanel variant="dark" className="p-4 bg-amber-500/5 border-amber-500/10">
              <div className="flex items-center gap-2 mb-2 text-amber-500">
                <Crown className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">PRO ACCESS</span>
              </div>
              <p className="text-[10px] text-zinc-500 mb-3">Unlock unlimited question patterns and deep ancestral axis analysis.</p>
              <button className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-[9px] font-black uppercase rounded-lg shadow-glow">
                Upgrade Engine
              </button>
            </GlassPanel>
          </section>
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-[10px] font-black uppercase text-zinc-500">
            <span>Daily Clarity Limit</span>
            <span className={cn("text-amber-500", questionsLeft === 0 && "text-red-500")}>
              {questionsLeft}/3
            </span>
          </div>
          <button onClick={onReset} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Reset Matrix
          </button>
        </div>
      </aside>

      {/* 2. CENTER: DECISION ENGINE */}
      <main className="flex-1 flex flex-col relative bg-black/40 w-full overflow-hidden">
        {/* Header */}
        <header className="p-4 h-16 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md z-20 sticky top-0">
          <button className="lg:hidden p-2 -ml-2 text-zinc-500" onClick={() => setShowIdentity(true)}><Menu className="w-6 h-6" /></button>
          <div className="text-center flex-1">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Decision Engine</h2>
          </div>
          <button className="lg:hidden p-2 -mr-2 text-zinc-500" onClick={() => setShowAnalysis(true)}><PieChart className="w-6 h-6 text-amber-500" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-10 scrollbar-hide max-w-4xl mx-auto w-full relative">
          
          {/* Daily Insight Layer with Progress Hook */}
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="mb-6">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Sovereign Guidance</span>
              <h1 className="text-3xl font-bold text-white mt-1 leading-tight tracking-tight">Good morning, {reading.name.split(' ')[0]}</h1>
            </div>
            <GlassPanel variant="gold" className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-glow" />
                      <span className="text-xs font-black uppercase text-amber-500 tracking-widest">№{math.timeline.personalDay} Personal Day Vibration</span>
                    </div>
                    <p className="text-base text-zinc-300 leading-relaxed font-medium">
                      {dailyVibe.insight}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest flex items-center justify-between">
                      Action Checklist
                      <span className="text-amber-500">{Object.values(completedActions).filter(Boolean).length}/3 Done</span>
                    </div>
                    <div className="grid gap-2.5">
                      {dailyVibe.do.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleAction(idx)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                            completedActions[idx] 
                              ? "bg-amber-500/10 border-amber-500/20 text-zinc-300" 
                              : "bg-black/30 border-white/5 text-zinc-400 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                            completedActions[idx] ? "bg-amber-500 border-amber-500 text-black" : "border-zinc-700"
                          )}>
                            {completedActions[idx] && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-[13px] font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500/70 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-[10px] text-red-500/70 uppercase font-black tracking-widest">Critical Warning</div>
                      <p className="text-[11px] text-zinc-500 font-medium">Avoid: {dailyVibe.avoid}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0 md:flex-col lg:flex-row">
                  <div className="px-6 py-4 bg-black/30 border border-amber-500/20 rounded-2xl text-center min-w-[90px] shadow-glow">
                    <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">Energy</div>
                    <div className="text-3xl font-black text-white">{math.psychic}</div>
                  </div>
                  <div className="px-6 py-4 bg-black/30 border border-amber-500/20 rounded-2xl text-center min-w-[90px] shadow-glow">
                    <div className="text-[10px] text-zinc-500 font-black uppercase mb-1">Cycle</div>
                    <div className="text-3xl font-black text-amber-500">{math.timeline.personalDay}</div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </section>

          {/* Interaction Area / Paywall Layer */}
          <section className="space-y-6 relative">
            <div className="relative group">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                disabled={questionsLeft <= 0}
                placeholder={questionsLeft > 0 ? "Ask about your problem..." : "Daily limit reached..."}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-8 text-white placeholder-zinc-700 text-lg font-medium focus:outline-none focus:border-amber-500/40 transition-all shadow-inner disabled:opacity-20"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || questionsLeft <= 0}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all disabled:opacity-0 active:scale-95 z-10"
              >
                <Send className="w-6 h-6" />
              </button>

              {/* Paywall Overlay */}
              {questionsLeft <= 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center border border-amber-500/20 animate-in fade-in zoom-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Clarity Limit Reached</h3>
                  <p className="text-xs text-zinc-400 mb-6 max-w-xs">You've used today's 3 patterns. Unlock the Sovereign Engine for unlimited deep-fix analysis.</p>
                  <button className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-glow active:scale-95 transition-all">
                    Unlock Full Guidance
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center opacity-40 grayscale pointer-events-none">
              <QuickReply>Money</QuickReply>
              <QuickReply>Career</QuickReply>
              <QuickReply>Relationship</QuickReply>
              <QuickReply>Confusion</QuickReply>
            </div>
          </section>

          {/* Decisions with Pattern Hook */}
          <div className="space-y-8 pb-32">
            {messages.map((msg, i) => (
              <div key={msg.id} className={cn(
                "animate-in fade-in slide-in-from-bottom-4 duration-500",
                msg.role === "user" ? "hidden" : "block"
              )}>
                <GlassPanel className="p-8 space-y-8 border-white/10" glow={i === messages.length - 1}>
                  {msg.content.split('\n\n').map((section, j) => {
                    if (section.startsWith("Problem:")) {
                      return (
                        <div key={j}>
                          <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mb-1.5 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> THE PROBLEM
                          </div>
                          <p className="text-base text-white font-bold leading-tight">{section.replace("Problem:", "").trim()}</p>
                        </div>
                      );
                    }
                    if (section.startsWith("Why:")) {
                      return (
                        <div key={j}>
                          <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mb-1.5 flex items-center gap-2">
                            <Calculator className="w-3.5 h-3.5" /> NUMERICAL ROOT
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed font-medium">{section.replace("Why:", "").trim()}</p>
                        </div>
                      );
                    }
                    if (section.startsWith("Do this:")) {
                      return (
                        <div key={j} className="pt-6 border-t border-white/5 space-y-4">
                          <div className="text-[11px] text-amber-500 uppercase font-black tracking-widest flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> DIRECT ACTION PROTOCOL
                          </div>
                          <div className="grid gap-3">
                            {section.replace("Do this:", "").trim().split('\n').map((action, k) => (
                              <div key={k} className="flex items-start gap-4 p-4 bg-white/3 border border-white/5 rounded-2xl group hover:border-amber-500/30 transition-all">
                                <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 text-xs font-black shrink-0">{k+1}</div>
                                <span className="text-[13px] text-white font-medium leading-normal">{action.replace('•', '').trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}

                  {/* Pattern Hook */}
                  <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Structural Pattern Detected</span>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 hover:text-white transition-colors">
                      Want a deeper fix? <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </GlassPanel>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-center py-6">
                <TypingIndicator />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR: STRUCTURAL ANALYSIS */}
      <aside className={cn(
        "w-96 border-l border-white/5 flex flex-col bg-[#05020f] backdrop-blur-xl transition-transform duration-300 z-50",
        "fixed inset-y-0 right-0 lg:static lg:flex",
        showAnalysis ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Structural Analysis</div>
          <button className="lg:hidden p-2 text-zinc-500" onClick={() => setShowAnalysis(false)}><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 scrollbar-hide pb-20">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Chaldean Matrix</h3>
              <div className="text-[9px] text-zinc-500 font-bold px-2 py-0.5 bg-white/5 rounded border border-white/5 uppercase">Frequency</div>
            </div>
            <ChaldeanGrid grid={math.chaldeanGrid} />
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Lo Shu Magic Square</h3>
            <LoShuGrid grid={math.grid} />
          </section>

          {synergy && (
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Name Resonance Audit</h3>
              <NameResonanceCard 
                name={reading.callingName || reading.name}
                score={synergy.score}
                label={synergy.label}
              />
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Planetary Intelligence</h3>
            <PlanetaryMap data={[
              { label: "Psychic", num: math.psychic, planet: "Sun" },
              { label: "Destiny", num: math.destiny, planet: "Jupiter" },
              { label: "Matrix", num: 5, planet: "Mercury" }
            ]} />
          </section>
        </div>
      </aside>

      {/* Mobile Backdrops */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden pointer-events-none opacity-0",
          (showIdentity || showAnalysis) && "pointer-events-auto opacity-100"
        )}
        onClick={() => { setShowIdentity(false); setShowAnalysis(false); }}
      />
    </div>
  );
}
