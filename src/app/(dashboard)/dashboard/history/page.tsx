/**
 * NUMERIQ.AI - Reading History Page
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { History, ArrowRight, User, Calendar, Sparkles } from 'lucide-react';

export default async function HistoryPage() {
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

  const { data: readings } = await supabase
    .from('readings')
    .select('id, full_name, date_of_birth, destiny_number, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
          Vibrational History
        </h1>
        <p className="text-zinc-500 max-w-xl">
          A secure log of all captured mathematical patterns and historical protocols.
        </p>
      </div>

      <div className="grid gap-4">
        {readings && readings.length > 0 ? (
          readings.map((reading) => (
            <Link 
              key={reading.id} 
              href={`/dashboard/reading/${reading.id}`}
              className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-amber-500/20 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl font-['Orbitron'] font-bold text-amber-500">
                  {reading.destiny_number}
                </div>
                <div>
                  <h4 className="font-bold text-white">{reading.full_name}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                      <Calendar className="w-3 h-3" />
                      {new Date(reading.date_of_birth).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                      Captured: {new Date(reading.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-amber-500 transition-colors group-hover:translate-x-1" />
            </Link>
          ))
        ) : (
          <div className="py-20 text-center glass-card rounded-3xl space-y-4">
            <div className="flex justify-center">
              <History className="w-12 h-12 text-zinc-800" />
            </div>
            <h3 className="text-lg font-bold text-white">No history found</h3>
            <p className="text-zinc-500 text-sm">Your numerical matrix is currently empty.</p>
            <Link 
              href="/dashboard/new" 
              className="inline-block mt-4 text-amber-500 font-bold text-sm hover:underline"
            >
              Initiate your first reading
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
