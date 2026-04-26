// src/app/api/oracle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { runOracleInvestigation } from '@/lib/engine/oracle/investigator';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { question, userId } = await req.json();

    // 1. Get User Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('User profile not found');

    // 2. Run Investigation
    const result = await runOracleInvestigation(question, profile);

    // 3. Save History
    await supabase.from('oracle_history').insert({
      user_id: userId,
      question,
      result_json: result,
      confidence_score: result.confidence,
      rag_sources: result.sources
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Oracle API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
