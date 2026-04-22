/**
 * NUMERIQ.AI - Dashboard Layout
 * Wraps all protected routes in a Sidebar shell.
 */

import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden text-zinc-100 font-['DM_Sans']">
      {/* Sidebar Shell */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.03),transparent)] overflow-y-auto custom-scrollbar">
        
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-10" />

        <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
}
