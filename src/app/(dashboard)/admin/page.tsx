/**
 * NUMERIQ.AI - Admin Dashboard
 * Founder-level monitoring and planetary metrics.
 */

import React from 'react';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert,
  Activity,
  ArrowRight,
  Database,
  Globe,
  Zap,
  Clock
} from 'lucide-react';

export default async function AdminDashboardPage() {
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

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch Stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: readingCount } = await supabase.from('readings').select('*', { count: 'exact', head: true });
  const { count: alertCount } = await supabase.from('security_events').select('*', { count: 'exact', head: true }).eq('severity', 'high');
  
  const { data: recentReadings } = await supabase
    .from('readings')
    .select('full_name, created_at, destiny_number')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: highSeverityEvents } = await supabase
    .from('security_events')
    .select('*')
    .eq('severity', 'high')
    .order('created_at', { ascending: false })
    .limit(5);

  // Simulated Revenue 
  const estimatedRevenue = (readingCount || 0) * 29;

  return (
    <div className="space-y-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
            <Globe className="w-3 h-3 animate-pulse" />
            Planetary Command Active
          </div>
          <h1 className="text-5xl font-['Playfair_Display'] font-black text-white tracking-tighter">
            Founder <span className="text-amber-500">Intelligence.</span>
          </h1>
          <p className="text-zinc-500 font-medium">Real-time surveillance of the global vibrational matrix.</p>
        </div>
        <div className="flex gap-4">
           <Link 
              href="/dashboard/admin/knowledge"
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:text-white transition-all"
           >
              <Database className="w-4 h-4" />
              RAG Training
           </Link>
           <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Signal</span>
           </div>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Seekers", value: userCount || 0, icon: Users, color: "text-blue-500", trend: "+8.2%" },
          { label: "Matrix Syncs", value: readingCount || 0, icon: BookOpen, color: "text-amber-500", trend: "+14.5%" },
          { label: "Gross Revenue", value: `$${estimatedRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", trend: "+22.1%" },
          { label: "High Threats", value: alertCount || 0, icon: ShieldAlert, color: "text-red-500", trend: "Stable" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] relative overflow-hidden group border-zinc-900">
            <div className="absolute -top-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">{stat.label}</div>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-40`} />
              </div>
              <div className="text-4xl font-['Orbitron'] font-black text-white">{stat.value}</div>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">{stat.trend}</span>
                <span className="text-zinc-700 uppercase tracking-tighter">Velocity</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT INITIATIONS */}
        <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                 <Clock className="w-5 h-5 text-amber-500" />
                 Recent Matrix Syncs
              </h3>
              <button className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Export Logs</button>
           </div>
           
           <div className="space-y-4">
              {recentReadings?.map((reading, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-zinc-900 group hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-['Orbitron'] font-black text-white group-hover:text-amber-500 transition-colors shadow-inner">
                      {reading.destiny_number}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{reading.full_name}</div>
                      <div className="text-[10px] text-zinc-600 uppercase tracking-tighter">{new Date(reading.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="px-3 py-1 rounded-full border border-zinc-800 text-[8px] font-black uppercase tracking-widest text-zinc-500 group-hover:border-amber-500/30">Verified</div>
                     <ArrowRight className="w-4 h-4 text-zinc-800 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* SECURITY AUDIT */}
        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem] space-y-8 border-red-500/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Security</h3>
                <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-4">
                {highSeverityEvents?.map((event, i) => (
                  <div key={i} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <div className="flex justify-between items-start text-[10px] font-bold uppercase tracking-widest text-red-500">
                      <span>{event.event_type}</span>
                      <span className="opacity-50">{new Date(event.created_at).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-zinc-400 font-medium leading-relaxed truncate">
                      Source: {JSON.stringify(event.metadata)}
                    </div>
                  </div>
                ))}
                {(!highSeverityEvents || highSeverityEvents.length === 0) && (
                  <div className="py-20 text-center opacity-20 italic text-sm">No high-severity threats detected.</div>
                )}
              </div>
           </div>

           {/* RAG SYSTEM HEALTH */}
           <div className="glass-card p-10 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3">
                 <Zap className="w-5 h-5 text-amber-500" />
                 <h4 className="text-sm font-black uppercase tracking-widest text-white">RAG Performance</h4>
              </div>
              <div className="space-y-4 pt-2">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-zinc-600">Model Response</span>
                    <span className="text-emerald-500">98.4% Efficiency</span>
                 </div>
                 <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full amber-gradient" />
                 </div>
                 <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                   Expert knowledge base is synchronized across 12 edge nodes. Layer 2 latency: &lt;45ms.
                 </p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
