// src/app/(dashboard)/panchang/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [panchangData, setPanchangData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPanchang = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch('/api/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date.toISOString(),
          lat: 17.3850, // Hyderabad
          lng: 78.4867,
          timezone: 'Asia/Kolkata',
          city: 'Hyderabad'
        })
      });
      const data = await response.json();
      setPanchangData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchang(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vedic Panchang</h1>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <input 
            type="date" 
            className="border-none focus:ring-0"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Panchang Card */}
        <Card className="md:col-span-2 border-indigo-100 shadow-xl bg-gradient-to-br from-white to-indigo-50/30">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-900">Today's Alamanac</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {loading ? (
              <div className="h-64 flex items-center justify-center text-indigo-300 animate-pulse">Calculating Cosmic Alignment...</div>
            ) : panchangData && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                    <div className="text-sm text-gray-500">Tithi</div>
                    <div className="text-lg font-bold text-indigo-700">{panchangData.tithi.name}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                    <div className="text-sm text-gray-500">Nakshatra</div>
                    <div className="text-lg font-bold text-indigo-700">{panchangData.nakshatra.name}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                    <div className="text-sm text-gray-500">Yoga</div>
                    <div className="text-lg font-bold text-indigo-700">{panchangData.yoga.name}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50">
                    <div className="text-sm text-gray-500">Day</div>
                    <div className="text-lg font-bold text-indigo-700">{panchangData.vara.day}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Auspicious Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {panchangData.tithi.suitable_for.map((item: string) => (
                      <span key={item} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Side Info */}
        <div className="space-y-6">
          <Card className="border-orange-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-orange-900">Sun & Moon</CardTitle>
            </CardHeader>
            <CardContent>
              {panchangData && (
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Sunrise</span>
                    <span className="font-medium text-orange-600">{panchangData.sunrise}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Sunset</span>
                    <span className="font-medium text-orange-600">{panchangData.sunset}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Rahu Kaal</span>
                    <span className="font-medium text-red-600">{panchangData.rahu_kaal.start}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className={`border-2 ${panchangData?.overall_day_score > 70 ? 'border-green-200 bg-green-50/20' : 'border-amber-100 bg-amber-50/20'} shadow-md`}>
            <CardHeader>
              <CardTitle className="text-lg">Overall Verdict</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{panchangData?.overall_day_score}</div>
              <div className={`font-semibold ${panchangData?.overall_day_score > 70 ? 'text-green-700' : 'text-amber-700'}`}>
                {panchangData?.overall_verdict}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
