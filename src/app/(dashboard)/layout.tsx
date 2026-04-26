"use client"

/**
 * NUMERIQ.AI - Dashboard Layout
 * Wraps all protected routes in a Sidebar shell with mobile responsiveness.
 */

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StarBackground } from '@/components/ui/StarBackground';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <StarBackground />
      
      {/* Sidebar Shell */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 overflow-y-auto custom-scrollbar z-10">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center h-16 px-4 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-muted-foreground hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-black font-bold text-sm">N</span>
            </div>
            <span className="font-serif font-black tracking-widest text-sm">NUMERIQ</span>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

