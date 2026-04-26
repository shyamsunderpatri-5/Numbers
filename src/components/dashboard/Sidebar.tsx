"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  UserPlus, 
  History, 
  ShieldCheck, 
  CreditCard,
  Settings,
  LogOut,
  X,
  Activity,
  ChevronRight,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'New Reading', icon: UserPlus, href: '/dashboard/new' },
  { name: 'Reading History', icon: History, href: '/dashboard/history' },
  { name: 'Compatibility', icon: ShieldCheck, href: '/dashboard/compatibility' },
  { name: 'Forecasts', icon: Activity, href: '/dashboard/forecasts' },
  { name: 'Business Analyzer', icon: Zap, href: '/dashboard/business' },
  { name: 'Membership', icon: CreditCard, href: '/dashboard/billing' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserMetadata(user.user_metadata);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      }
    }
    getProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    // Handle nested routes like /dashboard/history/123
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
  const isPro = profile?.tier === 'pro' || profile?.role === 'pro';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background/80 backdrop-blur-2xl border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-8 px-4 font-sans overflow-hidden">
          {/* Logo Section */}
          <div className="mb-10 px-4 flex items-center justify-between flex-shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="font-serif text-xl tracking-widest text-foreground font-black">NUMERIQ</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2 pb-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                    active 
                      ? "bg-white/5 text-primary border border-white/10 shadow-2xl shadow-primary/5" 
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3.5 relative z-10">
                    <item.icon className={cn(
                      "w-5 h-5 transition-all duration-300", 
                      active ? "text-primary scale-110" : "group-hover:text-primary"
                    )} />
                    <span className={cn(
                      "text-sm font-bold tracking-tight", 
                      active ? "text-foreground" : ""
                    )}>
                      {item.name}
                    </span>
                  </div>
                  
                  {active && (
                    <motion.div 
                      layoutId="nav-active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50 relative z-10"
                    />
                  )}
                </Link>
              );
            })}

            {/* FOUNDER ADMIN LINK */}
            {isAdmin && (
              <div className="pt-8 mt-4 border-t border-white/5 space-y-1.5">
                <p className="px-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold mb-2">
                  Founder Access
                </p>
                <Link 
                  href="/dashboard/admin"
                  onClick={() => onClose?.()}
                  className={cn(
                    "group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300",
                    pathname?.startsWith('/dashboard/admin') 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                      : "text-muted-foreground/60 hover:text-primary hover:bg-white/5"
                  )}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-tight">Admin Portal</span>
                </Link>
                
                <Link 
                  href="/dashboard/admin/knowledge"
                  onClick={() => onClose?.()}
                  className={cn(
                    "group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300",
                    pathname === '/dashboard/admin/knowledge'
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground/60 hover:text-primary hover:bg-white/5"
                  )}
                >
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-tight">Epistemology Core</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Bottom Sections */}
          <div className="flex-shrink-0 pt-4 pb-8 space-y-6">
            {/* Settings & Logout */}
            <div className="space-y-1 border-t border-white/5 pt-6">
              <Link 
                href="/dashboard/settings"
                onClick={() => onClose?.()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:bg-white/5 group",
                  pathname === '/dashboard/settings' ? "text-primary bg-white/5" : "text-muted-foreground/60"
                )}
              >
                <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-700" />
                <span className="text-sm font-bold tracking-tight text-foreground">Vibration Tuning</span>
              </Link>

              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/5 group"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold tracking-tight">Exit Matrix</span>
              </button>
            </div>

            {/* User Mini Info */}
            <div className="px-2">
              <div className="glass-card rounded-2xl p-3 border border-white/5 flex items-center gap-3 group cursor-pointer hover:border-primary/20 transition-all duration-500">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center font-black text-black text-xs shadow-lg group-hover:scale-105 transition-transform">
                  {profile?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '..'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black text-foreground truncate uppercase tracking-tight">
                    {profile?.full_name || userMetadata?.full_name || 'Seeker'}
                  </div>
                  <div className="text-[9px] text-primary/60 truncate uppercase font-black tracking-widest flex items-center gap-1.5 mt-0.5">
                    {isPro ? (
                      <>
                        <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                        <span>Intelligence Tier</span>
                      </>
                    ) : (
                      <span>Seeker Tier</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
