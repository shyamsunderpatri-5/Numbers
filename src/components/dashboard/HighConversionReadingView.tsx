"use client";

import React, { useState } from "react";
import { InitiationGate } from "./InitiationGate";
import SovereignWorkspace from "./SovereignWorkspace";

export default function HighConversionReadingView() {
  const [stage, setStage] = useState<"input" | "workspace">("input");
  const [user, setUser] = useState<{ name: string, dob: string, callingName?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitiate = async (data: { name: string, dob: string, callingName?: string }) => {
    setIsLoading(true);
    
    // Simulate initial calculation depth
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setUser(data);
    setStage("workspace");
    setIsLoading(false);
  };

  const handleReset = () => {
    setStage("input");
    setUser(null);
  };

  if (stage === "input") {
    return <InitiationGate onInitiate={handleInitiate} isLoading={isLoading} />;
  }

  if (stage === "workspace" && user) {
    return (
      <div className="animate-in fade-in duration-1000">
        <SovereignWorkspace reading={user} onReset={handleReset} />
      </div>
    );
  }

  return null;
}
