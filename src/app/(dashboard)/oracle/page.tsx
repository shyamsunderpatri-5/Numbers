// src/app/(dashboard)/oracle/page.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Clock, BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OraclePage() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInvestigate = async () => {
    if (question.length < 10) return;
    setLoading(true);
    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          userId: '00000000-0000-0000-0000-000000000000' // Mocked
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-indigo-950 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          Ask the Deep Oracle
        </h1>
        <p className="text-gray-500 text-lg">One specific question. Deep investigation. Canonical answers.</p>
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl border border-indigo-100 space-y-4">
        <textarea
          className="w-full h-32 p-4 text-lg border-none focus:ring-2 focus:ring-indigo-500 rounded-xl bg-indigo-50/30 placeholder:text-indigo-300"
          placeholder="e.g. Should I accept the job offer I got this week? Will 2025 be lucky for my business?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="flex justify-end">
          <Button 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all"
            onClick={handleInvestigate}
            disabled={loading || question.length < 10}
          >
            {loading ? 'Investigating...' : 'Run Deep Investigation'}
          </Button>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-indigo-200 bg-indigo-900 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-indigo-300" />
                <span className="text-indigo-200 uppercase tracking-widest text-xs font-bold">Direct Verdict</span>
              </div>
              <CardTitle className="text-3xl font-bold leading-tight">
                {result.direct_answer}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 border-t border-indigo-800 bg-indigo-950/50 p-6">
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 text-sm">Confidence Score:</span>
                <div className="flex-1 h-2 bg-indigo-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${result.confidence}%` }}></div>
                </div>
                <span className="text-indigo-100 font-bold">{result.confidence}%</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-amber-100 shadow-md">
                <CardHeader className="bg-amber-50/50 border-b pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                    <BookOpen className="w-5 h-5" /> Reasoning & Proof
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-gray-700 leading-relaxed">
                  <p><strong>Numerology:</strong> {result.reasoning.numerology}</p>
                  <p><strong>Astrology:</strong> {result.reasoning.astrology}</p>
                </CardContent>
             </Card>

             <Card className="border-indigo-100 shadow-md">
                <CardHeader className="bg-indigo-50/50 border-b pb-4">
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                    <Clock className="w-5 h-5" /> Cosmic Timing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 text-gray-700 leading-relaxed">
                  {result.reasoning.timing}
                </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
