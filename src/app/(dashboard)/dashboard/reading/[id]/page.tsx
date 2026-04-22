/**
 * NUMERIQ.AI - Specific Reading Detail Page
 */

import { ReadingResultView } from "@/components/dashboard/ReadingResultView";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { AIParsedReading } from "@/lib/numerology/types";

export default async function ReadingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data, error } = await supabase
    .from('readings')
    .select('ai_reading_json')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const reading = data.ai_reading_json as unknown as AIParsedReading;

  return <ReadingResultView reading={reading} />;
}
