"use client";

/**
 * NUMERIQ.AI - Knowledge Manager (RAG Trainer)
 * Founder-level UI for updating expert system data.
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Edit3, 
  Save, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function KnowledgeManagerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('knowledge_type', { ascending: true })
      .order('key', { ascending: true });
    
    if (!error) setItems(data);
    setLoading(false);
  };

  const saveKnowledge = async () => {
    if (!editingItem) return;
    setSaveStatus('saving');
    
    const { error } = await supabase
      .from('knowledge_base')
      .update({ content: editingItem.content })
      .eq('id', editingItem.id);

    if (!error) {
      setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setEditingItem(null);
    } else {
      setSaveStatus('idle');
      alert("Failed to update knowledge.");
    }
  };

  const filteredItems = items.filter(item => 
    item.key.toLowerCase().includes(search.toLowerCase()) ||
    item.knowledge_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
            Knowledge <span className="text-amber-500">Repository.</span>
          </h1>
          <p className="text-zinc-500">Train the RAG layer by updating expert numerical interpretations.</p>
        </div>
        <button 
          onClick={fetchKnowledge}
          className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left: List & Search */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by key (e.g. '37')..."
              className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          <div className="glass-card rounded-3xl overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : filteredItems.map((item, i) => (
              <button 
                key={item.id}
                onClick={() => setEditingItem(item)}
                className={`w-full text-left p-6 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50 transition-colors flex items-center justify-between group ${editingItem?.id === item.id ? 'bg-amber-500/5' : ''}`}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">{item.knowledge_type}</div>
                  <div className="text-lg font-['Orbitron'] font-bold text-white">{item.key}</div>
                </div>
                <Edit3 className="w-4 h-4 text-zinc-800 group-hover:text-amber-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {editingItem ? (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="glass-card p-10 rounded-[40px] space-y-8 h-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Sparkles className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Refining Pattern: {editingItem.key}</h3>
                      <p className="text-zinc-500 text-xs">Training Type: {editingItem.knowledge_type}</p>
                    </div>
                  </div>
                  <button 
                    onClick={saveKnowledge}
                    disabled={saveStatus === 'saving'}
                    className="amber-gradient px-8 py-3 rounded-xl text-black font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saveStatus === 'saving' ? 'TRAINING...' : 'COMMIT CHANGES'}</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* JSON Editor for Content */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Expert Meaning Protocol (JSON Body)</label>
                    <textarea 
                      value={JSON.stringify(editingItem.content, null, 2)}
                      onChange={(e) => {
                        try {
                          const newContent = JSON.parse(e.target.value);
                          setEditingItem({ ...editingItem, content: newContent });
                        } catch (err) {}
                      }}
                      className="w-full h-[400px] bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 font-mono text-sm text-amber-500/80 focus:outline-none focus:border-amber-500/30 transition-all resize-none"
                    />
                  </div>

                  {saveStatus === 'success' && (
                    <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                      <CheckCircle2 className="w-4 h-4" />
                      RAG System Trained Successfully. Redirecting weights...
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 glass-card rounded-[40px] border-dashed border-zinc-800">
                <Database className="w-20 h-20 text-zinc-900 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Select a Vibration to Train</h3>
                <p className="text-zinc-500 text-sm max-w-xs">
                  Choose a compound or combination from the left to adjust its 
                  expert narrative and RAG context.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
