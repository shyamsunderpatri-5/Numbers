"use client";

/**
 * NUMERIQ.AI - Password Strength Meter
 * Live feedback for enterprise-grade security.
 */

import React, { useMemo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const requirements = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    { label: "Contains a special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: "Mixed case (upper & lower)", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ], [password]);

  const strength = requirements.filter(req => req.met).length;

  const colorClass = useMemo(() => {
    if (strength === 0) return "bg-zinc-800";
    if (strength <= 1) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    if (strength <= 3) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  }, [strength]);

  const label = useMemo(() => {
    if (password.length === 0) return "Enter password";
    if (strength <= 1) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength === 4) return "Strong";
    return "Very Strong";
  }, [password, strength]);

  return (
    <div className="space-y-3 mt-2">
      <div className="flex justify-between items-center text-xs text-zinc-400 mb-1">
        <span>Password Strength</span>
        <span className={cn(
          "font-medium transition-colors",
          strength >= 4 ? "text-emerald-400" : strength >= 2 ? "text-amber-400" : "text-zinc-500"
        )}>
          {label}
        </span>
      </div>
      
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={cn(
              "flex-1 rounded-full transition-all duration-500",
              step <= strength ? colorClass : "bg-zinc-800"
            )}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 mt-3">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              req.met ? "bg-emerald-500 shadow-[0_0_5px_#10b981]" : "bg-zinc-700"
            )} />
            <span className={cn(
              "text-[10px] transition-colors",
              req.met ? "text-zinc-300" : "text-zinc-500"
            )}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
