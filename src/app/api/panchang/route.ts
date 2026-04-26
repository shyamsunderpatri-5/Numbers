// src/app/api/panchang/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { calculatePanchang } from '@/lib/engine/core/panchang';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { date, lat, lng, timezone, city } = await req.json();
    const isoDate = new Date(date).toISOString().split('T')[0];

    // 1. Check Cache
    const { data: cached } = await supabase
      .from('panchang_cache')
      .select('data')
      .eq('date', isoDate)
      .eq('lat', lat)
      .eq('lng', lng)
      .single();

    if (cached) return NextResponse.json(cached.data);

    // 2. Compute if Miss
    const panchang = await calculatePanchang(new Date(date), lat, lng, timezone, city);

    // 3. Save to Cache
    await supabase.from('panchang_cache').insert({
      date: isoDate,
      lat,
      lng,
      city,
      timezone,
      data: panchang,
      overall_score: panchang.overall_day_score
    });

    return NextResponse.json(panchang);
  } catch (error: any) {
    console.error('Panchang API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
