"use client";

/**
 * NUMERIQ.AI - Reading Protocol (Executive View)
 * The definitive 3-Layer intelligence presentation.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  Sparkles, 
  Download, 
  Share2,
  AlertCircle,
  Gem,
  Palette,
  Compass,
  Loader2,
  ArrowDownCircle,
  ChevronRight
} from 'lucide-react';
import { AIParsedReading } from '@/lib/numerology/types';
import { NumericalFingerprint } from './NumericalFingerprint';
import { StrategicGuidance } from './StrategicGuidance';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReadingResultViewProps {
  reading: AIParsedReading;
}

export const ReadingResultView: React.FC<ReadingResultViewProps> = ({ reading }) => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const { mathData, knowledgeContext } = reading;

  React.useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('plan_tier')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    getProfile();
  }, []);

  const isPro = (profile?.plan_tier || 1) >= 2;

  const handleExportPDF = async () => {
    if (!isPro) return; // Guard
    setIsExporting(true);
    const element = document.getElementById('reading-protocol');
    if (!element) return;

    try {
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#030303',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NUMERIQ-Protocol-${mathData.destinyNumber}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-16 pb-32">
      
      {/* 1. HERO HEADER */}
      <div className="relative pt-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="space-y-6 flex-1">
            <motion.div 
               initial={{ opacity: 0, tracking: '0.4em' }}
               animate={{ opacity: 1, tracking: '0.2em' }}
               className="flex items-center gap-3 text-amber-500 font-['Orbitron'] text-xs uppercase"
            >
               <ShieldCheck className="w-4 h-4" />
               <span>Vibrational Analysis Protocol v5.1 (Chaldean Purity)</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-['Playfair_Display'] font-bold text-white tracking-tighter leading-none">
               The <span className="text-amber-500">{mathData.destinyCompound}</span> <br />
               Complexity.
            </h1>
            
            <p className="text-zinc-400 max-w-2xl text-xl font-medium leading-relaxed italic">
              "{reading.executiveSummary}"
            </p>
          </div>

          <div className="flex flex-col gap-4 shrink-0">
             {isPro ? (
               <button 
                  disabled={isExporting}
                  onClick={handleExportPDF}
                  className="px-10 py-5 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50"
               >
                  {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  <span className="tracking-tighter uppercase font-bold">Download Full Protocol</span>
               </button>
             ) : (
               <Link 
                  href="/dashboard/billing"
                  className="px-10 py-5 rounded-2xl bg-amber-500 text-black font-bold flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-[0_20px_40px_rgba(245,158,11,0.2)] active:scale-95"
               >
                  <Lock className="w-5 h-5" />
                  <span className="tracking-tighter uppercase font-bold">Unlock Executive PDF</span>
               </Link>
             )}
             <button className="px-10 py-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold flex items-center justify-center gap-3 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
                <span className="tracking-tighter uppercase font-bold text-xs">Share Insight</span>
             </button>
          </div>
        </div>
      </div>

      <div id="reading-protocol" className="space-y-24 bg-zinc-950 p-1 rounded-3xl">
        
        {/* 2. LAYER 1: Core Mathematical Pillars */}
        <section className="space-y-10">
          <div className="flex items-center gap-4">
             <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">01 / Foundation</span>
             <div className="h-[1px] flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Destiny Number", val: mathData.destinyNumber, compound: mathData.destinyCompound, desc: "Primary Vibration" },
              { label: "Life Path", val: mathData.lifePathNumber, compound: mathData.lifePathCompound, desc: "Natural Journey" },
              { label: "Soul Urge", val: mathData.soulUrgeNumber, compound: null, desc: "Inner Desire" },
              { label: "Personality", val: mathData.personalityNumber, compound: null, desc: "Outer Mask" },
              { label: "Hidden Passion", val: mathData.hiddenPassion, compound: null, desc: "Dominant Frequency" },
              { label: "Bridge Number", val: mathData.bridgeNumber, compound: null, desc: "Unity Internal/External" },
              { label: "Cornerstone", val: mathData.cornerstone, compound: null, desc: "Inception Letter" },
              { label: "Capstone", val: mathData.capstone, compound: null, desc: "Completion Letter" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl relative group active:scale-98 transition-all"
              >
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-10">{item.label}</div>
                <div className="flex items-end justify-between">
                  <div className="text-6xl font-['Orbitron'] font-black text-white group-hover:text-amber-500 transition-colors">
                    {item.val}
                  </div>
                  {item.compound && (
                    <div className="text-xl font-bold text-zinc-500 mb-2">/{item.compound}</div>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-2 text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">
                   <div className="w-1 h-1 bg-amber-500 rounded-full" />
                   {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. NARRATIVE SYNTHESIS & FINGERPRINT */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-12">
            <div className="flex items-center gap-4">
               <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">02 / Synthesis</span>
               <div className="h-[1px] flex-1 bg-zinc-900" />
            </div>

            <div className="space-y-12">
               <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 font-['Playfair_Display']">
                     Destiny <span className="text-amber-500">Convergence.</span>
                  </h3>
                  <div className="text-zinc-400 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:text-amber-500 first-letter:mr-2 first-letter:float-left whitespace-pre-wrap">
                    {reading.destinyAnalysis}
                  </div>
               </div>

               <div className="space-y-4 pt-10 border-t border-zinc-900">
                  <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 font-['Playfair_Display']">
                     Life Path <span className="text-amber-500">Trajectory.</span>
                  </h3>
                  <div className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">
                    {reading.lifePathAnalysis}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
             <div className="flex items-center gap-4">
                <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">Matrix</span>
                <div className="h-[1px] flex-1 bg-zinc-900" />
             </div>
             <NumericalFingerprint 
                presentNumbers={Object.keys(mathData.intensityMap).map(Number)}
                intensity={mathData.intensityMap}
                missingNumbers={mathData.missingNumbers || []}
             />
          </div>
        </section>

        {/* 4. KARMIC PATTERNS & SYNERGIES (RAG MOAT) */}
        <section className="space-y-12">
           <div className="flex items-center gap-4">
              <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">03 / Advanced Analysis</span>
              <div className="h-[1px] flex-1 bg-zinc-900" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Karmic Patterns */}
              <div className="space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Karmic Frequency Patterns
                 </h4>
                 <div className="space-y-4">
                    {knowledgeContext.patternKnowledge.length > 0 ? (
                      knowledgeContext.patternKnowledge.map((p, i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl space-y-4 border-l-4 border-amber-500/30">
                           <div className="text-xl font-bold text-white font-['Playfair_Display']">{p.title}</div>
                           <p className="text-sm text-zinc-400 leading-relaxed">{p.meaning}</p>
                           <div className="pt-4 border-t border-zinc-900">
                              <span className="text-[10px] uppercase font-black tracking-widest text-amber-500/60 block mb-2">Strategic Adjustment</span>
                              <p className="text-xs text-zinc-500 italic">{p.practicalAdvice}</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-3xl bg-zinc-900/20 border border-zinc-900 text-center text-zinc-600 text-xs italic">
                         No active Karmic debt patterns detected in this frequency.
                      </div>
                    )}
                 </div>
              </div>

              {/* Synergistic Combinations */}
              <div className="space-y-6">
                 <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-amber-500" />
                    Combination Synergies (RAG)
                 </h4>
                 <div className="space-y-4">
                    {isPro ? (
                      knowledgeContext.combinationKnowledge.map((c, i) => (
                        <div key={i} className="glass-card p-8 rounded-3xl space-y-4">
                           <div className="flex items-center justify-between">
                              <div className="text-xl font-bold text-amber-500 font-['Orbitron']">{c.combinationName}</div>
                              <div className="px-3 py-1 bg-amber-500/10 rounded-full text-[10px] font-black text-amber-500 border border-amber-500/20">
                                 {c.harmonyLabel} Harmony
                              </div>
                           </div>
                           <p className="text-sm text-zinc-400 leading-relaxed">{c.narrative}</p>
                           <div className="grid grid-cols-2 gap-4 pt-4">
                              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                                 <span className="text-[9px] uppercase font-black text-emerald-500 block mb-1">Synergy</span>
                                 <div className="text-[10px] text-zinc-500">{c.keySynergies[0]}</div>
                              </div>
                              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                                 <span className="text-[9px] uppercase font-black text-rose-500 block mb-1">Friction</span>
                                 <div className="text-[10px] text-zinc-500">{c.keyFrictions[0]}</div>
                              </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="glass-card p-10 rounded-3xl text-center border-dashed border-zinc-800 space-y-4">
                         <Lock className="w-8 h-8 text-zinc-800 mx-auto" />
                         <div className="text-sm font-bold text-zinc-500 uppercase">Premium Intelligence Required</div>
                         <p className="text-[10px] text-zinc-700 leading-relaxed">
                            Upgrade to Insight Tier to unlock the deep synergistic analysis between your base numbers.
                         </p>
                         <Link href="/dashboard/billing" className="inline-block text-[10px] font-black text-amber-500 uppercase tracking-widest">Upgrade Now &rarr;</Link>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* 5. STRATEGIC PROTOCOL (Phase 3 Integration) */}
        <section className="space-y-10">
           <div className="flex items-center gap-4">
              <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">04 / Strategic Execution</span>
              <div className="h-[1px] flex-1 bg-zinc-900" />
           </div>
           <StrategicGuidance guidance={reading.strategicGuidance} />
        </section>

        {/* 5. REMEDIES & POWER ELEMENTS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="flex items-center gap-4">
                 <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">Audit</span>
                 <div className="h-[1px] flex-1 bg-zinc-900" />
              </div>
              
              <div className="glass-card p-10 rounded-[2.5rem] bg-amber-500 text-black space-y-6 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)]">
                  <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-60">
                     <AlertCircle className="w-4 h-4" />
                     Priority Optimization
                  </div>
                  <h4 className="text-2xl font-black tracking-tighter leading-tight font-['Orbitron']">REMEDY PROTOCOL</h4>
                  <p className="font-medium text-sm leading-relaxed border-t border-black/10 pt-4">
                    "{reading.remediesNarrative}"
                  </p>
                  <div className="pt-4">
                     <button className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all">
                        <span>Initiate Habits</span>
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                 <span className="text-zinc-600 font-['Orbitron'] text-sm tracking-widest uppercase">Elemental Supports</span>
                 <div className="h-[1px] flex-1 bg-zinc-900" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-10 rounded-[2.5rem] space-y-8">
                   <div className="flex items-center gap-4">
                      <Palette className="w-6 h-6 text-amber-500" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Color Spectrum</h4>
                   </div>
                   <div className="flex flex-wrap gap-4">
                      {knowledgeContext.luckyElementsForProfile.colors.map((c, i) => (
                        <div key={i} className="flex flex-col items-center gap-3">
                           <div className="w-14 h-14 rounded-2xl border-2 border-zinc-800 shadow-xl" style={{ borderTopColor: c.hex, backgroundColor: '#09090b' }}>
                              <div className="w-full h-full rounded-[0.5rem] opacity-30 blur-md" style={{ backgroundColor: c.hex }}/>
                           </div>
                           <span className="text-[10px] font-black uppercase text-zinc-500">{c.name}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[2.5rem] space-y-8">
                   <div className="flex items-center gap-4">
                      <Gem className="w-6 h-6 text-emerald-500" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Gemstone Proxy</h4>
                   </div>
                   <div className="space-y-4">
                      {knowledgeContext.luckyElementsForProfile.gems.map((gem, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-2xl group">
                           <span className="text-zinc-300 font-bold">{gem}</span>
                           <ArrowDownCircle className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
        </section>
      </div>

      {/* FOOTER NAV / CTA */}
      <div className="flex justify-center pt-20">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           className="glass-card px-10 py-6 rounded-3xl flex items-center gap-12 border-amber-500/10"
         >
            <div className="text-center">
               <div className="text-[10px] font-black text-zinc-600 uppercase mb-1">Harmony</div>
               <div className="text-xl font-['Orbitron'] font-black text-amber-500">{mathData.harmonyScore}%</div>
            </div>
            <div className="w-[1px] h-10 bg-zinc-800" />
            <div className="text-center">
               <div className="text-[10px] font-black text-zinc-600 uppercase mb-1">Cycle Focus</div>
               <div className="text-xl font-['Orbitron'] font-black text-white">Year {mathData.personalYear}</div>
            </div>
            <div className="w-[1px] h-10 bg-zinc-800" />
            <Link href="/dashboard/new" className="text-xs font-black uppercase tracking-widest text-white hover:text-amber-500 transition-colors">
               Analyze New Matrix
            </Link>
         </motion.div>
      </div>
    </div>
  );
};
