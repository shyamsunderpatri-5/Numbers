"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard if route is not found
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary animate-pulse" />
        <p className="text-muted-foreground font-serif tracking-widest text-sm uppercase">Synchronizing...</p>
      </div>
    </div>
  );
}
