/**
 * NUMERIQ.AI — Remedy Mapper
 * Handles ranking, difficulty tagging, and impact-based sorting of home remedies.
 */

export interface Remedy {
  text: string;
  difficulty: "easy" | "medium";
  impact: "high" | "moderate";
  isQuickWin: boolean;
}

export const REMEDY_RANKING: Record<number, Remedy[]> = {
  1: [
    { text: "Wear a red thread on your right wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Rise before the sun (Brahma Muhurta)", difficulty: "medium", impact: "high", isQuickWin: false },
    { text: "Offer water in a glass vessel to the sun", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Use a red handkerchief daily", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Speak respectfully with father figures", difficulty: "medium", impact: "high", isQuickWin: false }
  ],
  2: [
    { text: "Wear a white thread on your left wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Drink water from a glass or silver vessel", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Keep a white handkerchief in your pocket", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Spend 5 minutes under moonlight", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Spend 5 minutes listening to mother figures", difficulty: "medium", impact: "high", isQuickWin: false }
  ],
  3: [
    { text: "Wear a yellow thread on your right wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Read 1 page of a wisdom book daily", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Apply a small tilak of turmeric on your forehead", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Seek advice from a mentor or elder", difficulty: "medium", impact: "high", isQuickWin: false },
    { text: "Keep a yellow handkerchief daily", difficulty: "easy", impact: "moderate", isQuickWin: false }
  ],
  4: [
    { text: "Wear a grey or blue thread on your wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Feed stray birds daily", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Discard or donate 1 unused item daily", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Keep your footwear away from the entrance", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Help a stranger or someone in need", difficulty: "medium", impact: "high", isQuickWin: false }
  ],
  5: [
    { text: "Wear a green thread on your right wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Keep a green plant on your desk", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Use a green handkerchief daily", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Speak clearly and avoid slang", difficulty: "medium", impact: "moderate", isQuickWin: false },
    { text: "Connect with a sibling or colleague", difficulty: "medium", impact: "high", isQuickWin: false }
  ],
  6: [
    { text: "Wear a pink or white thread on your wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Use a mild fragrance daily", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Keep fresh flowers nearby", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Keep your space clean", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Speak gently in conversations", difficulty: "medium", impact: "high", isQuickWin: false }
  ],
  7: [
    { text: "Wear a multicolored thread on your wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Spend 10 minutes in complete silence daily", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Feed a stray dog or birds", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Donate a blanket or clothes", difficulty: "medium", impact: "high", isQuickWin: false },
    { text: "Ask an elder about their life experience", difficulty: "medium", impact: "moderate", isQuickWin: false }
  ],
  8: [
    { text: "Wear a dark blue thread on your wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Light an oil lamp (diya) in the evening", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Thank those who serve you", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Be punctual and honest in one task", difficulty: "medium", impact: "high", isQuickWin: false },
    { text: "Eat your meals on time without waste", difficulty: "easy", impact: "moderate", isQuickWin: false }
  ],
  9: [
    { text: "Wear a red thread on your right wrist", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Practice 10 minutes of physical exercise", difficulty: "easy", impact: "high", isQuickWin: true },
    { text: "Breathe deeply before responding to stress", difficulty: "easy", impact: "moderate", isQuickWin: true },
    { text: "Donate a red fruit on Tuesdays", difficulty: "easy", impact: "moderate", isQuickWin: false },
    { text: "Support a sibling or colleague in a task", difficulty: "medium", impact: "high", isQuickWin: false }
  ]
};

/**
 * Returns ranked remedies for a vibration.
 * Sorts by impact and quick-win status.
 */
export function getRankedRemedies(vibration: number): Remedy[] {
  const remedies = REMEDY_RANKING[vibration] || [];
  return [...remedies].sort((a, b) => {
    if (a.isQuickWin && !b.isQuickWin) return -1;
    if (!a.isQuickWin && b.isQuickWin) return 1;
    if (a.impact === "high" && b.impact !== "high") return -1;
    return 0;
  });
}
