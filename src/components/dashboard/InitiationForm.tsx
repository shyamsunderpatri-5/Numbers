"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Briefcase, 
  Coins, 
  Heart, 
  HelpCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InitiationFormProps {
  onSubmit: (data: InitiationData) => void;
  isLoading?: boolean;
}

export interface InitiationData {
  name: string;
  dob: string;
  problemType: "money" | "career" | "relationships" | "confusion";
}

const PROBLEM_TYPES = [
  { id: "money", label: "Money", icon: Coins, description: "Flow & Stability" },
  { id: "career", label: "Career", icon: Briefcase, description: "Growth & Authority" },
  { id: "relationships", label: "Relationships", icon: Heart, description: "Harmony & Connection" },
  { id: "confusion", label: "Confusion", icon: HelpCircle, description: "Clarity & Direction" },
];

export function InitiationForm({ onSubmit, isLoading }: InitiationFormProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<InitiationData>>({
    problemType: "confusion"
  });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Who are you?</h2>
            <p className="text-zinc-400">Enter your birth details for vibrational mapping.</p>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Spelling as per birth certificate" 
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="bg-zinc-900/50 border-zinc-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input 
                id="dob" 
                type="date"
                value={data.dob || ""}
                onChange={(e) => setData({ ...data, dob: e.target.value })}
                className="bg-zinc-900/50 border-zinc-800 text-white"
              />
            </div>
          </div>
          
          <Button 
            onClick={nextStep} 
            disabled={!data.name || !data.dob}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Continue to Problem Mapping <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">What is the primary friction?</h2>
            <p className="text-zinc-400">Select the area where you feel the most resistance right now.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PROBLEM_TYPES.map((p) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.id}
                  onClick={() => setData({ ...data, problemType: p.id as any })}
                  className={cn(
                    "p-6 cursor-pointer border-2 transition-all duration-300 bg-zinc-900/30",
                    data.problemType === p.id 
                      ? "border-indigo-500 bg-indigo-500/10" 
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <Icon className={cn(
                    "w-8 h-8 mb-4",
                    data.problemType === p.id ? "text-indigo-400" : "text-zinc-500"
                  )} />
                  <div className="font-bold text-white">{p.label}</div>
                  <div className="text-xs text-zinc-500">{p.description}</div>
                </Card>
              )
            })}
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setStep(1)} className="text-zinc-400">Back</Button>
            <Button 
              onClick={() => onSubmit(data as InitiationData)}
              disabled={isLoading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Pattern...</>
              ) : (
                "Initiate Analysis"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
