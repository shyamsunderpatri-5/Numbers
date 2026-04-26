// src/app/(dashboard)/kundali-match/page.tsx
'use client';

import React, { useState } from 'react';
import { Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function KundaliMatchPage() {
  const [formData, setFormData] = useState({
    bride: { name: '', dob: '' },
    groom: { name: '', dob: '' }
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/compatibility/kundali', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pink-950 flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
          Marriage Compatibility (Kundali)
        </h1>
        <p className="text-gray-500 mt-2">Traditional 36-Point Vedic Ashtakoota Matching</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bride Details */}
        <Card className="border-pink-100 shadow-xl bg-gradient-to-br from-white to-pink-50/20">
          <CardHeader>
            <CardTitle className="text-pink-900">Bride's Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-3 rounded-lg border-pink-200 focus:ring-pink-500"
              value={formData.bride.name}
              onChange={(e) => setFormData({...formData, bride: {...formData.bride, name: e.target.value}})}
            />
            <input 
              type="date" 
              className="w-full p-3 rounded-lg border-pink-200 focus:ring-pink-500"
              value={formData.bride.dob}
              onChange={(e) => setFormData({...formData, bride: {...formData.bride, dob: e.target.value}})}
            />
          </CardContent>
        </Card>

        {/* Groom Details */}
        <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/20">
          <CardHeader>
            <CardTitle className="text-blue-900">Groom's Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-3 rounded-lg border-blue-200 focus:ring-blue-500"
              value={formData.groom.name}
              onChange={(e) => setFormData({...formData, groom: {...formData.groom, name: e.target.value}})}
            />
            <input 
              type="date" 
              className="w-full p-3 rounded-lg border-blue-200 focus:ring-blue-500"
              value={formData.groom.dob}
              onChange={(e) => setFormData({...formData, groom: {...formData.groom, dob: e.target.value}})}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button 
          size="xl" 
          className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-8 text-xl rounded-full shadow-2xl transition-transform hover:scale-105"
          onClick={handleMatch}
          disabled={loading}
        >
          {loading ? 'Analyzing Souls...' : 'Check Compatibility'}
        </Button>
      </div>

      {result && (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-12">
          {/* Main Score Ring */}
          <div className="flex flex-col items-center">
            <div className={`w-48 h-48 rounded-full border-8 ${result.totalScore >= 18 ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'} flex flex-col items-center justify-center bg-white shadow-2xl`}>
              <span className="text-5xl font-black">{result.totalScore}</span>
              <span className="text-sm font-bold uppercase opacity-60">Out of 36</span>
            </div>
            <h2 className={`mt-6 text-2xl font-bold ${result.totalScore >= 18 ? 'text-green-700' : 'text-red-700'}`}>
              Verdict: {result.verdict}
            </h2>
          </div>

          {/* Koota Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.kootas.map((k: any) => (
              <div key={k.name} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
                <div className="text-sm text-gray-500 uppercase font-bold tracking-tighter">{k.name}</div>
                <div className="text-2xl font-bold my-1">{k.score} / {k.max}</div>
                <div className="text-xs text-gray-400 leading-tight">{k.explanation}</div>
              </div>
            ))}
          </div>

          {/* Dosha Warnings */}
          {result.nadiDosha && (
            <Card className="border-red-500 bg-red-50">
               <CardContent className="p-6 flex items-center gap-4">
                 <AlertCircle className="w-10 h-10 text-red-600" />
                 <div>
                   <h4 className="text-red-900 font-bold text-lg">Critical Alert: Nadi Dosha Detected</h4>
                   <p className="text-red-700">Traditional Vedic rules recommend performing specific remedies before proceeding with this alliance.</p>
                 </div>
               </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
