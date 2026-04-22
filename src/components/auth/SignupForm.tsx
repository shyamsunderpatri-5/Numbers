"use client";

/**
 * NUMERIQ.AI - Sign Up Form
 * Enterprise-grade validation, security logging, and path initiation.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { supabase } from '@/lib/supabase/client';
import { trackLoginAttempt, logSecurityEvent } from '@/app/auth/actions';

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const password = watch("password");

  // Integrated server-side security logging

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setServerError(error.message);
        await trackLoginAttempt(data.email, false);
      } else {
        setIsSuccess(true);
        await logSecurityEvent(authData.user?.id || 'unknown', "SIGNUP_SUCCESS", { 
          email: data.email
        });
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 relative">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-zinc-950"
            >
              <Shield className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tighter">Validation Required</h3>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
          We've dispatched a secure link to your inbox. <br />
          Click to activate your path and unlock the dashboard.
        </p>
        
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-widest font-bold"
        >
          Resend Link
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {serverError}
        </motion.div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            {...register("fullName")}
            type="text"
            placeholder="John Doe"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        {errors.fullName && <p className="text-[10px] text-red-400 ml-1">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        {errors.email && <p className="text-[10px] text-red-400 ml-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Create Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        <PasswordStrengthMeter password={password || ""} />
        {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>
        {errors.confirmPassword && <p className="text-[10px] text-red-400 ml-1">{errors.confirmPassword.message}</p>}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 pt-2">
        <input
          {...register("terms")}
          type="checkbox"
          id="terms"
          className="mt-0.5 w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500/20"
        />
        <label htmlFor="terms" className="text-[10px] text-zinc-500 leading-tight">
          I agree to the <a href="#" className="underline text-zinc-400">Terms of Service</a> and <a href="#" className="underline text-zinc-400">Privacy Policy</a>.
        </label>
      </div>
      {errors.terms && <p className="text-[10px] text-red-400 ml-1">{errors.terms.message}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Initiate My Path"
        )}
      </button>

      <div className="text-center mt-6">
        <p className="text-[10px] text-zinc-600">
          Already a member? <a href="/login" className="text-amber-500 hover:underline">Sign In</a>
        </p>
      </div>
    </form>
  );
};
