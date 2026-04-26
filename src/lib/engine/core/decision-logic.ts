/**
 * Decision Engine Logic - Deterministic Responses
 */

export const getDailyVibrationInfo = (personalDay: number) => {
  const vibrations: Record<number, { insight: string, do: string[], avoid: string }> = {
    1: {
      insight: "A day of high-velocity agency. If you don't lead, you will be overridden by external agendas.",
      do: ["Initiate one uncomfortable conversation", "Seal a pending commitment", "Audit your personal output"],
      avoid: "Waiting for external validation"
    },
    2: {
      insight: "Today will feel sensitive and collaborative. Friction is high if you push solo agendas.",
      do: ["Mediate a team conflict", "Listen for the 'subtext' in meetings", "Sync with a primary partner"],
      avoid: "Making hasty or aggressive solo decisions"
    },
    3: {
      insight: "A day of expressive expansion. Your words carry 2x weight today—use them carefully.",
      do: ["Present a bold idea", "Network with a high-influence contact", "Write down your 3-month goal"],
      avoid: "Scattered focus or over-committing to social filler"
    },
    4: {
      insight: "Today you will feel slow and blocked. Structural foundations demand your full attention.",
      do: ["Finish one long-pending 'boring' task", "Audit your current physical workspace", "Review your financial hygiene"],
      avoid: "Starting new work or making major financial moves"
    },
    5: {
      insight: "A day of sudden pivots. Rigid plans will fail. Adaptability is your only currency today.",
      do: ["Pivot a failing strategy", "Try a new route or method", "Engage in high-speed sales/outreach"],
      avoid: "Holding onto an outdated routine"
    },
    6: {
      insight: "A day of responsibility and emotional gravity. Family or close circles will demand energy.",
      do: ["Address a home-related friction point", "Nurture a high-value relationship", "Practice emotional boundary setting"],
      avoid: "Ignoring intuition or personal health needs"
    },
    7: {
      insight: "A day for deep structural silence. External noise will lead to mental exhaustion.",
      do: ["Audit your internal data/research", "Schedule 2 hours of deep solitude", "Finalize a mental strategy"],
      avoid: "Loud environments or materialistic distractions"
    },
    8: {
      insight: "Today is about material authority. Your power is high, but the stakes are higher.",
      do: ["Negotiate a financial deal", "Execute a power move", "Audit your long-term wealth assets"],
      avoid: "Emotional overreactions to power shifts"
    },
    9: {
      insight: "A day of transitions and endings. Clear the path or be dragged by the past.",
      do: ["Close a failing or finished project", "Delegate or donate a resource", "Plan your next 9-day cycle"],
      avoid: "Starting long-term new ventures today"
    }
  };

  return vibrations[personalDay] || vibrations[1];
};
