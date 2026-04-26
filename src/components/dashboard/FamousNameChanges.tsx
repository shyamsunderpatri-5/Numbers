"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Star, Quote } from 'lucide-react';

const famousChanges = [
  {
    name: "A.R. Rahman",
    oldName: "A. S. Dileep Kumar",
    success: "From local musician to two-time Academy Award winner. The transition to 'Rahman' (The Merciful) aligned his vibration with global spiritual resonance.",
    photo: "/artifacts/ar_rahman_numerology_1776960610489.png",
    metric: "10x Global Reach"
  },
  {
    name: "Amitabh Bachchan",
    oldName: "Inquilaab Srivastava",
    success: "The shift to 'Amitabh' (The Light that will never die) transformed a struggling actor into the 'Star of the Millennium'.",
    photo: "/artifacts/amitabh_bachchan_numerology_1776960483988.png",
    metric: "Millennium Legend"
  },
  {
    name: "Akshay Kumar",
    oldName: "Rajiv Hari Om Bhatia",
    success: "Changing to 'Akshay' (The Imperishable) unlocked a streak of 100+ blockbusters, making him one of the highest-paid actors globally.",
    photo: "/artifacts/akshay_kumar_numerology_1776960548007.png",
    metric: "100+ Blockbusters"
  },
  {
    name: "Lady Gaga",
    oldName: "Stefani Germanotta",
    success: "The 'Gaga' vibration bypassed traditional pop barriers, creating a multi-industry icon with 13 Grammys and an Oscar.",
    photo: "/artifacts/lady_gaga_numerology_1776960676189.png",
    metric: "13x Grammy Winner"
  }
];

export const FamousNameChanges = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-4xl font-serif font-black text-white tracking-tighter uppercase">
          The <span className="text-primary italic">Vibrational</span> Shift
        </h2>
        <p className="text-muted-foreground text-lg">
          Explore how these visionaries aligned their name frequency with their destiny to achieve unprecedented success.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {famousChanges.map((person, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2.5rem] overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex flex-col sm:flex-row h-full">
              {/* Photo Area */}
              <div className="relative w-full sm:w-48 h-64 sm:h-auto overflow-hidden shrink-0">
                <Image 
                  src={person.photo} 
                  alt={person.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-primary text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block">
                    {person.metric}
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary/60">
                    <Star className="w-3 h-3 fill-primary" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Protocol Success Story</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-black text-white leading-none">
                      {person.name}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground/40 text-xs font-bold uppercase italic">
                      <span>{person.oldName}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-primary/60">{person.name}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-4 w-8 h-8 text-white/5" />
                    <p className="text-muted-foreground leading-relaxed italic text-sm relative z-10">
                      {person.success}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                   </div>
                   <div className="text-[10px] uppercase font-black tracking-widest text-white/60">
                     Vibrational Harmony Achieved
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
