"use client";

import React from "react";
import HighConversionReadingView from "@/components/dashboard/HighConversionReadingView";

/**
 * Root Landing Page - Sovereign Intelligence Implementation
 * Directly routes to the high-conversion initiation gate and workspace.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#05020f]">
      <HighConversionReadingView />
    </main>
  );
}
