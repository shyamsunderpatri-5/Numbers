"use client";

import React, { useState } from 'react';
import { Lock, Sparkles, ShieldCheck, ArrowRight, Download, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import dynamic from 'next/dynamic';
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);
import { SovereignReport } from '../pdf/SovereignReport';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SovereignReadingView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const queryName = searchParams.get('name');
  const queryBirthDay = searchParams.get('birthDay');

  const [name, setName] = useState(queryName || '');
  const [birthDay, setBirthDay] = useState(queryBirthDay || '');
  const [loading, setLoading] = useState(false);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [stage1Result, setStage1Result] = useState<any>(null);
  const [stage2Result, setStage2Result] = useState<any>(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (sessionId && queryName && queryBirthDay && !stage2Result) {
      fetchNarrative(sessionId, queryName, queryBirthDay);
    }
  }, [sessionId]);

  const fetchNarrative = async (sid: string, n: string, bd: string) => {
    setNarrativeLoading(true);
    try {
      const res = await fetch('/api/sovereign-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n, birthDay: bd, sessionId: sid })
      });
      const data = await res.json();
      if (res.ok) {
        setStage2Result(data);
      } else {
        setError(data.error || "Failed to fetch narrative.");
      }
    } catch (err) {
      setError("Network error fetching narrative.");
    } finally {
      setNarrativeLoading(false);
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sovereign-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDay })
      });
      const data = await res.json();
      if (res.ok) {
        setStage1Result(data);
      } else {
        console.error("Error fetching deterministic read:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    // Generate checkout session via Stripe API
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDay, contract: stage1Result.contract })
      });
      const data = await res.json();
      if (res.ok) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (err) {
      console.error("Error redirecting to checkout:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-slate-200 font-sans">
      {!stage1Result ? (
        <div className="bg-slate-900/40 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl text-center">
          <h2 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Discover Your Sovereign Vibration
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Enter your name and birth day to unlock the deterministic root of your Chaldean profile.
          </p>
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Your Full Name" 
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="number" 
              placeholder="Day of Birth (e.g. 15)" 
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
            />
            <button 
              onClick={handleCalculate}
              disabled={loading || !name || !birthDay}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-300 mt-4"
            >
              {loading ? "Calculating..." : "Reveal Core Vibration"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Free Deterministic Read */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2 block">
                Deterministic Profile
              </span>
              <div className="flex items-baseline gap-4 mb-6">
                <h1 className="text-6xl font-black text-white">{stage1Result.compoundNumber}</h1>
                <span className="text-2xl font-medium text-slate-400">{stage1Result.planet}</span>
              </div>
              
              <div className="bg-slate-900/60 rounded-2xl p-6 border border-white/5 mb-8">
                <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  Preview Insight
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {stage1Result.previewInsight}
                </p>
              </div>

              {/* Upsell to Generative Reading (Hidden if Paid) */}
              {!stage2Result && !narrativeLoading && (
                <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Unlock the Pilgrim's Narrative
                    </h3>
                    <p className="text-slate-300 text-sm max-w-md">
                      Access the deep, generative interpretation of your compound vibration, planetary conflicts, and karmic synthesis. Includes a beautifully formatted PDF report.
                    </p>
                  </div>
                  <button 
                    onClick={handleUnlock}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    Unlock for $9.99 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Loading State for Narrative */}
              {narrativeLoading && (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/60 rounded-2xl border border-white/5">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                  <p className="text-slate-300">The Pilgrim is preparing your revelation...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mt-4">
                  {error}
                </div>
              )}

              {/* Full Narrative & PDF Guard */}
              {stage2Result?.narrative && (
                <div className="mt-8 bg-slate-900/80 rounded-2xl p-8 border border-indigo-500/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-indigo-300">The Pilgrim's Revelation</h3>
                    
                    {/* Guarded PDF Generation */}
                    <PDFDownloadLink
                      document={
                        <SovereignReport 
                          name={name} 
                          compoundNumber={stage1Result?.compoundNumber || 0} 
                          planet={stage1Result?.planet || "Unknown"} 
                          narrative={stage2Result.narrative} 
                        />
                      }
                      fileName={`Sovereign-Reading-${name}.pdf`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 border border-slate-600"
                    >
                      {/* Using a simple function to handle loading state from react-pdf */}
                      {({ loading }) => (
                        <>
                          <Download className="w-4 h-4" />
                          {loading ? 'Generating PDF...' : 'Download Report'}
                        </>
                      )}
                    </PDFDownloadLink>
                  </div>
                  
                  <div className="prose prose-invert prose-indigo max-w-none">
                    {stage2Result.narrative.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-slate-300 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
