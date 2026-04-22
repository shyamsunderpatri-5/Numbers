/**
 * NUMERIQ.AI - New Reading Page
 */

import SovereignReadingView from "@/components/dashboard/SovereignReadingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Reading | NUMERIQ.AI",
  description: "Initiate a new numerical analysis.",
};

export default function NewReadingPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-['Playfair_Display'] font-bold text-white tracking-tight">
          Numerical Initiation
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Enter the primary variables below. Ensure names are spelled exactly as they appeared 
          on the birth certificate for 100% mathematical resonance.
        </p>
      </div>

      <SovereignReadingView />
    </div>
  );
}
