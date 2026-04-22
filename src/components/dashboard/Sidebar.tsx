"use client";

/**
 * NUMERIQ.AI - Sidebar
 * High-fidelity navigation with dynamic role-based access.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserPlus, 
  History, 
  Settings, 
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase/client';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'New Reading', icon: UserPlus, href: '/dashboard/new' },
  { name: 'Reading History', icon: History, href: '/dashboard/history' },
  { name: 'Compatibility', icon: ShieldCheck, href: '/dashboard/compatibility' },
  { name: 'Membership', icon: CreditCard, href: '/dashboard/billing' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isPro = (profile?.plan_tier || 1) >= 2;

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800/50 w-64 pt-8 px-4 font-['DM_Sans']">
      
      {/* Brand Logo */}
      <div className="px-4 mb-10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 amber-gradient rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <span className="font-['Orbitron'] font-bold text-black text-lg">N</span>
          </div>
          <div>
            <span className="text-lg font-['Playfair_Display'] font-bold text-white tracking-wide">NUMERIQ<span className="text-amber-500">.AI</span></span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5">
        <div className="px-4 text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-4 flex items-center justify-between">
          <span>Core Intelligence</span>
          {isPro && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_4px_12px_rgba(245,158,11,0.05)]" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400")} />
                <span className="text-sm font-medium tracking-tight">{item.name}</span>
              </div>
              {isActive && (
                <motion.div layoutId="nav-active" className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}

        {/* FOUNDER ADMIN LINK (Conditional) */}
        {isAdmin && (
           <div className="pt-6 space-y-1.5">
              <div className="px-4 text-[10px] uppercase tracking-widest text-zinc-700 font-bold mb-4">Founder Space</div>
              <Link 
                href="/dashboard/admin"
                className={cn(
                  "group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                  pathname?.startsWith('/dashboard/admin')
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                    : "text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4.5 h-4.5" />
                  <span className="text-sm font-medium tracking-tight">Founder Admin</span>
                </div>
                <Activity className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
           </div>
        )}
      </nav>

      {/* Footer Nav */}
      <div className="pb-8 space-y-1.5 border-t border-zinc-900 pt-6 mt-6">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:bg-zinc-900/50",
            pathname === '/dashboard/settings' ? "text-white" : "text-zinc-500"
          )}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4.5 h-4.5" />
            <span className="text-sm font-medium tracking-tight">Settings</span>
          </div>
        </Link>

        <button 
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-zinc-500 hover:text-red-400 hover:bg-red-500/5 group"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4.5 h-4.5 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium tracking-tight">Logout</span>
          </div>
        </button>
      </div>

      {/* User Mini Info */}
      <div className="pb-8">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50 flex items-center gap-3 group cursor-pointer hover:border-zinc-700 transition-all">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden shrink-0">
            <div className="w-full h-full amber-gradient flex items-center justify-center font-bold text-black text-xs">
              {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || '..'}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">{profile?.full_name || 'Synchronizing...'}</div>
            <div className="text-[10px] text-zinc-500 truncate uppercase tracking-tighter flex items-center gap-1.5">
               {isPro ? (
                 <>
                   <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                   <span className="text-amber-500/80">Intelligence Tier</span>
                 </>
               ) : (
                 <span>Seeker Tier</span>
               )}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>
    </div>
  );
};
