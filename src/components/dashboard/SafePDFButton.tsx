"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";

import { SovereignReportProps } from "../pdf/SovereignReport";

// Dynamically import SovereignReport
const SovereignReport = dynamic(
  () => import("../pdf/SovereignReport").then((m) => m.SovereignReport),
  { ssr: false }
);

interface SafePDFButtonProps {
  narrative?: any;
  reportData: SovereignReportProps;
  fileName: string;
}

export function SafePDFButton({ narrative, reportData, fileName }: SafePDFButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // If there's no narrative, don't allow PDF generation
  if (!narrative) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-white/50 cursor-not-allowed transition-all"
        title="Report generation is not available for this analysis."
      >
        <Download className="w-5 h-5 opacity-50" />
        <span>Report Unavailable</span>
      </button>
    );
  }

  // The 'Hover to load' pattern prevents downloading the massive PDF library
  // unless the user shows intent to use it.
  if (!isHovered) {
    return (
      <button
        onMouseEnter={() => setIsHovered(true)}
        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
      >
        <Download className="w-5 h-5 text-purple-400" />
        <span>Generate Premium Report</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink 
      document={<SovereignReport {...reportData} />} 
      fileName={fileName}
    >
      {/* @ts-ignore - The render prop typing in react-pdf can be tricky sometimes, safely ignoring for now */}
      {({ loading, error }) => (
        <button
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
            loading
              ? "bg-white/5 border-white/10 text-white/70 cursor-wait"
              : error
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-white/10 hover:bg-white/15 border-white/20 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          ) : error ? (
            <Download className="w-5 h-5" />
          ) : (
            <Download className="w-5 h-5 text-purple-400" />
          )}
          <span>
            {loading
              ? "Compiling Document..."
              : error
              ? "Generation Failed"
              : "Download Sovereign Report"}
          </span>
        </button>
      )}
    </PDFDownloadLink>
  );
}
