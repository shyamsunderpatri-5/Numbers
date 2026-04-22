"use client";

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Zap, Target, AlertTriangle, CheckCircle, Activity, Search, Database } from 'lucide-react';

interface SovereigntyLog {
  id: string;
  input_name: string;
  latency_ms: number;
  golden_pass: boolean;
  weight_audit_pass: boolean;
  poison_pill_blocked: boolean;
  canonical_traits_detected: string[];
  dominant_vibration: number;
  created_at: string;
}

export default function SovereigntyDashboard() {
  const supabase = createClientComponentClient();
  const [logs, setLogs] = useState<SovereigntyLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('sovereignty_changes')
      .on('postgres_changes', { event: 'INSERT', table: 'sovereignty_logs' }, (payload) => {
        setLogs(prev => [payload.new as SovereigntyLog, ...prev].slice(0, 50));
        fetchStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchLogs(), fetchStats()]);
    setLoading(false);
  };

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('sovereignty_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setLogs(data || []);
  };

  const fetchStats = async () => {
    const { data } = await supabase
      .from('sovereignty_health_stats')
      .select('*')
      .single();
    setStats(data);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#05070a]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            SOVEREIGNTY COMMAND
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            NUMERIQ.AI Epistemological Guard v1.1
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            SYSTEM ACTIVE
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Integrity Score" 
          value={`${stats?.golden_health_score?.toFixed(1) || 100}%`} 
          desc="Golden Audit Pass Rate" 
          icon={<Target className="w-6 h-6 text-emerald-400" />}
          color="emerald"
        />
        <StatCard 
          title="System Confidence" 
          value={`${((stats?.avg_confidence || 0) * 100).toFixed(1)}%`} 
          desc="Average Mapping Precision" 
          icon={<Zap className="w-6 h-6 text-amber-400" />}
          color="amber"
        />
        <StatCard 
          title="Ambiguous Runs" 
          value={stats?.total_ambiguous_runs || 0} 
          desc="Multiple Routing Conflicts" 
          icon={<AlertTriangle className="w-6 h-6 text-rose-400" />}
          color="rose"
        />
        <StatCard 
          title="Attacks Blocked" 
          value={stats?.total_attacks_blocked || 0} 
          desc="Poison Pill Triggers" 
          icon={<Shield className="w-6 h-6 text-indigo-400" />}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Observability Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                Live Sovereignty Feed
              </h2>
              <span className="text-xs text-slate-500">Showing last 50 events</span>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/20">
              {logs.map((log) => (
                <div key={log.id} className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-4 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full ${log.confidence_score > 0.85 ? 'bg-emerald-500' : log.confidence_score > 0.7 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">Profile: {log.input_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400">Vib: {log.dominant_vibration}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${log.is_ambiguous ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {log.is_ambiguous ? 'AMBIGUOUS' : 'STABLE'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(log.created_at).toLocaleTimeString()} • {log.latency_ms}ms • Conf: {(log.confidence_score * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Ambiguous Inputs (The Ontology Roadmap) */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Top Ambiguous Queries (Ontology Roadmap)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {logs.filter(l => l.is_ambiguous).slice(0, 10).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 flex justify-between items-center">
                  <span className="text-sm text-slate-300 truncate max-w-[200px]">{log.input_name}</span>
                  <span className="text-[10px] font-bold text-rose-400">REVIEW REQUIRED</span>
                </div>
              ))}
              {logs.filter(l => l.is_ambiguous).length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-500 italic">No ambiguous routing detected. System is deterministic.</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="space-y-6">
          {/* Epistemological Status */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Symbolic Mapping
            </h3>
            <div className="space-y-4">
              <DiagnosticItem label="Trait Ontology" status="Deterministic" />
              <DiagnosticItem label="Sovereign Anchors" status="Isolated (32)" />
              <DiagnosticItem label="Hybrid Routing" status="Active" />
              <DiagnosticItem label="Purification Tier" status="S_SOVEREIGN" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-4">Guard Controls</h3>
            <button className="w-full mb-3 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Run Integrity Audit
            </button>
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold border border-white/5 transition-all duration-300">
              Refresh Epistemology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon, color }: any) {
  const colors: any = {
    emerald: "from-emerald-500/20 to-teal-500/5 border-emerald-500/20",
    amber: "from-amber-500/20 to-orange-500/5 border-amber-500/20",
    rose: "from-rose-500/20 to-pink-500/5 border-rose-500/20",
    indigo: "from-indigo-500/20 to-blue-500/5 border-indigo-500/20",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-6 backdrop-blur-xl`}>
      <div className="flex justify-between items-start mb-4">
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm font-bold text-slate-100 mb-1">{title}</div>
      <div className="text-xs text-slate-500">{desc}</div>
    </div>
  );
}

function DiagnosticItem({ label, status }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-xs font-bold text-indigo-400">{status}</span>
    </div>
  );
}
