// src/app/api/compatibility/kundali/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { calculateAshtakoota } from '@/lib/engine/core/kundali-matching';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { bride, groom } = body;
    const matchResult = await calculateAshtakoota({
      bride: { ...bride, dob: new Date(bride.dob) },
      groom: { ...groom, dob: new Date(groom.dob) }
    });
    await supabase.from('kundali_match_readings').insert({
      bride_name: bride.name,
      bride_dob: bride.dob,
      groom_name: groom.name,
      groom_dob: groom.dob,
      total_score: matchResult.totalScore,
      result_json: matchResult
    });
    return NextResponse.json(matchResult);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}