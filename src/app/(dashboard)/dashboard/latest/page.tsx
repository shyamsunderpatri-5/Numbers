/**
 * NUMERIQ.AI - Latest Reading Page
 * Fetches the user's most recent reading and displays it.
 */

import { ReadingResultView } from "@/components/dashboard/ReadingResultView";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AIParsedReading } from "@/lib/numerology/types";

export default async function LatestReadingPage() {
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

  // Fetch latest reading for this user
  const { data, error } = await supabase
    .from('readings')
    .select('ai_reading_json')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    redirect('/dashboard/new');
  }

  const reading = data.ai_reading_json as unknown as AIParsedReading;

  return <ReadingResultView reading={reading} />;
}
