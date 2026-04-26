"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Instagram, Twitter, MessageCircle, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ShareCardProps {
  name: string;
  number: number;
  archetype: string;
  tagline: string;
}

export const ShareCard: React.FC<ShareCardProps> = ({ name, number, archetype, tagline }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(r => setTimeout(r, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        backgroundColor: '#0d0d0f',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `NUMERIQ-Share-${name}-${number}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate share image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Card (Hidden from direct view, or styled as a preview) */}
      <div className="flex justify-center">
        <div 
          ref={cardRef}
          className="w-[400px] aspect-[4/5] bg-[#0d0d0f] p-10 flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-2xl rounded-3xl"
        >
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -ml-32 -mb-32" />
          
          {/* Content */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-black font-black text-xs">N</div>
              <span className="font-serif font-black text-sm tracking-widest text-white/50">NUMERIQ.AI</span>
            </div>
            
            <div className="space-y-2 pt-10">
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-[0.3em]">The Revelation of</p>
              <h2 className="text-3xl font-serif font-black text-white tracking-tight">{name}</h2>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center py-10">
            <div className="text-9xl font-serif font-black text-primary leading-none text-glow-lg">
              {number}
            </div>
            <div className="mt-4 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest">
              The {archetype}
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <p className="text-zinc-300 text-lg font-medium italic leading-tight text-center px-4">
              "{tagline}"
            </p>
            
            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="text-[8px] uppercase font-black tracking-widest text-zinc-600">
                Chaldean Mathematical Protocol
              </div>
              <div className="text-[8px] uppercase font-black tracking-widest text-primary/60">
                Sovereign Access v5.1
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export Image
        </button>
        
        <div className="flex items-center gap-2">
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-primary hover:bg-white/10 transition-all">
            <Instagram className="w-5 h-5" />
          </button>
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-primary hover:bg-white/10 transition-all">
            <Twitter className="w-5 h-5" />
          </button>
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-primary hover:bg-white/10 transition-all">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-primary hover:bg-white/10 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
