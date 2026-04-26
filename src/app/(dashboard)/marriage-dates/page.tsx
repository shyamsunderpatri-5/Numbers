// src/app/(dashboard)/marriage-dates/page.tsx
'use client';

import React, { useState } from 'react';
import { CalendarRange, Sparkles, MapPin, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MarriageDatesPage() {
  const [params, setParams] = useState({
    searchStart: '',
    searchEnd: '',
    lat: 17.3850,
    lng: 78.4867,
    timezone: 'Asia/Kolkata'
  });
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/marriage-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-indigo-950 flex items-center justify-center gap-3">
          <CalendarRange className="w-10 h-10 text-indigo-600" />
          Marriage Date Finder
        </h1>
        <p className="text-gray-500 text-lg">Find the most auspicious Vivah Muhurtas for your wedding.</p>
      </div>

      {/* Search Controls */}
      <Card className="border-indigo-100 shadow-2xl bg-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Search From</label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 rounded-xl border-gray-200"
              onChange={(e) => setParams({...params, searchStart: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Search Until</label>
            <input 
              type="date" 
              className="w-full p-3 bg-gray-50 rounded-xl border-gray-200"
              onChange={(e) => setParams({...params, searchEnd: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Ceremony City</label>
            <div className="flex items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-700">Hyderabad</span>
            </div>
          </div>
          <Button 
            className="w-full py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Scanning Almanac...' : 'Find Best Dates'}
          </Button>
        </div>
      </Card>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {results.map((r, idx) => (
          <Card key={idx} className="border-indigo-100 hover:border-indigo-300 transition-all shadow-lg hover:shadow-2xl overflow-hidden group">
            <div className="h-2 bg-indigo-600"></div>
            <CardHeader className="bg-indigo-50/50">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-black text-indigo-900">
                  {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </CardTitle>
                <div className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-indigo-700 text-xs font-black">
                  SCORE: {r.score}
                </div>
              </div>
              <p className="text-indigo-600 font-bold">{new Date(r.date).toLocaleDateString('en-IN', { weekday: 'long' })}</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Tithi</div>
                  <div className="text-sm font-black text-gray-800">{r.panchang.tithi.name}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Nakshatra</div>
                  <div className="text-sm font-black text-gray-800">{r.panchang.nakshatra.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Excellent Ceremony Window</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                 <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-indigo-600" />
                   <span className="text-indigo-950 font-bold">11:42 AM - 02:30 PM</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
