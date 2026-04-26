"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  Database, AlertCircle, Save, CheckCircle, Clock, Search, History 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function KnowledgeEditorPage() {
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{text: string, type: 'error' | 'success' | 'info'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .in('status', ['published', 'draft'])
      .order('updated_at', { ascending: false });
    
    if (data) setKnowledgeList(data);
  };

  const handleSelect = (item: any) => {
    setSelectedItem(item);
    setEditContent(JSON.stringify(item.content, null, 2));
    setStatusMsg(null);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!selectedItem) return;
    setIsSaving(true);
    setStatusMsg({ text: 'Validating epistemological integrity...', type: 'info' });

    try {
      const parsedContent = JSON.parse(editContent);

      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedItem.id,
          knowledge_type: selectedItem.knowledge_type,
          key: selectedItem.key,
          content: parsedContent,
          status
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to save');

      setStatusMsg({ text: `Successfully saved as ${status}.`, type: 'success' });
      fetchKnowledge();
      if (result.data) setSelectedItem(result.data);
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRollback = async (previousId: string) => {
     // Trigger rollback API
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-['Cinzel'] font-bold text-[#d4af37]">Epistemology Editor</h1>
          <p className="text-slate-400">Strict Chaldean knowledge base management with Golden Validation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar List */}
        <div className="glass-card rounded-[2rem] p-6 border-[#2e1a66] h-[700px] overflow-y-auto custom-scrollbar">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search keys..." 
              className="w-full bg-[#1e1145]/50 border border-[#2e1a66] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#d4af37]/50 text-white"
            />
          </div>
          <div className="space-y-2">
            {knowledgeList.map(item => (
              <button 
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedItem?.id === item.id 
                    ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-white' 
                    : 'bg-[#1e1145]/30 border-transparent text-slate-400 hover:bg-[#1e1145]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">{item.knowledge_type}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="font-bold font-['Cinzel'] text-lg">Key: {item.key}</div>
                <div className="text-xs mt-2 opacity-50">v{item.version} • {new Date(item.updated_at).toLocaleDateString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-2 glass-card rounded-[2rem] p-8 border-[#2e1a66] flex flex-col h-[700px]">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-['Cinzel'] font-bold text-white mb-1">
                    Editing {selectedItem.knowledge_type}: {selectedItem.key}
                  </h2>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> v{selectedItem.version}</span>
                    {selectedItem.previous_version_id && (
                       <button className="text-[#8b5cf6] hover:underline flex items-center gap-1">
                          <History className="w-3 h-3" /> Rollback Available
                       </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl bg-[#1e1145] text-slate-300 font-bold text-sm hover:text-white transition-colors"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={() => handleSave('published')}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl amber-gradient text-black font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Validate & Publish
                  </button>
                </div>
              </div>

              {statusMsg && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-bold ${
                  statusMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  <AlertCircle className="w-5 h-5" />
                  {statusMsg.text}
                </div>
              )}

              <textarea 
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="flex-1 w-full bg-[#05020f] border border-[#2e1a66] rounded-xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-[#8b5cf6]/50 custom-scrollbar"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Database className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-['Cinzel'] text-xl">Select an epistemology node to edit.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
