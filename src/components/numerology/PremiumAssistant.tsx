"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

export function PremiumAssistant({ readingContext }: { readingContext: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: "Welcome. I am the Pilgrim. I can offer contextual guidance based on the mathematical patterns of your current reading. What would you like to explore?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, reset } = useForm();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    getProfile();
  }, []);

  const onSubmit = async (data: any) => {
    if (!data.query.trim()) return;
    
    const userMsg = data.query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    reset();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          context: readingContext,
          userId: profile?.id
        })
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || result.message || "Failed to communicate with the Pilgrim.");
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full amber-gradient flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-110 transition-transform z-40 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <Sparkles className="w-6 h-6 text-[#05020f]" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[380px] h-[600px] max-h-[80vh] glass-card rounded-[2rem] flex flex-col z-50 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-[#2e1a66]"
          >
            {/* Header */}
            <div className="bg-[#1e1145] border-b border-[#2e1a66] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full amber-gradient flex items-center justify-center">
                  <span className="font-['Cinzel'] font-bold text-[#05020f]">P</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm font-['Cinzel'] tracking-wider">The Pilgrim</h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#d4af37]">Contextual Guidance</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#05020f]/80">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#1e1145] text-white rounded-tr-sm border border-[#2e1a66]' 
                      : 'bg-[#0b061d] text-slate-300 rounded-tl-sm border border-[#d4af37]/20 shadow-inner'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 rounded-2xl bg-[#0b061d] border border-[#d4af37]/20 rounded-tl-sm flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                    <span className="text-xs text-slate-400 italic">Consulting the mathematics...</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="flex justify-center">
                  <div className="max-w-[90%] p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1e1145]/50 border-t border-[#2e1a66]">
              <form onSubmit={handleSubmit(onSubmit)} className="relative">
                <input 
                  {...register("query")}
                  placeholder="Ask about your reading..."
                  autoComplete="off"
                  disabled={isLoading}
                  className="w-full bg-[#05020f] border border-[#2e1a66] rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#d4af37]/50 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="absolute right-2 top-2 w-8 h-8 rounded-lg bg-[#1e1145] hover:bg-[#2e1a66] flex items-center justify-center text-[#d4af37] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
