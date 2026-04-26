// src/app/api/marriage-dates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findMarriageDates } from '@/lib/engine/core/vivah-muhurta';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { searchStart, searchEnd, lat, lng, timezone } = await req.json();

    const dates = await findMarriageDates({
      searchStart: new Date(searchStart),
      searchEnd: new Date(searchEnd),
      lat,
      lng,
      timezone
    });

    await supabase.from('marriage_date_readings').insert({
      search_start: searchStart,
      search_end: searchEnd,
      ceremony_city: 'Target City',
      top_dates: dates
    });

    return NextResponse.json(dates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
