/**
 * NUMERIQ.AI - Knowledge Base: Remedies
 * Centralized store for all numerological remedies.
 */

export interface Remedy {
  title: string;
  type: 'color' | 'habit' | 'name' | 'element' | 'timing';
  description: string;
  instructions: string;
}

export const REMEDIES: Record<string, Remedy[]> = {
  "missing-1": [
    { title: "Solar Activation", type: 'color', description: "Stimulate the solar plexus energy.", instructions: "Wear gold, orange, or bright yellow, especially on Sundays." },
    { title: "Point of Decision", type: 'habit', description: "Build self-reliance.", instructions: "Make one final decision every morning without asking anyone for advice." }
  ],
  "missing-2": [
    { title: "Lunar Reflection", type: 'color', description: "Enhance receptivity and intuition.", instructions: "Wear soft white, cream, or silver on Mondays." },
    { title: "The Silent Listener", type: 'habit', description: "Develop empathy.", instructions: "Practice 15 minutes of listening to music or nature without distraction." }
  ],
  "missing-3": [
    { title: "Expansion of Voice", type: 'color', description: "Unlock self-expression.", instructions: "Wear bright yellow or amber tints." },
    { title: "Morning Pages", type: 'habit', description: "Free flow creativity.", instructions: "Write 3 pages of stream-of-consciousness every morning." }
  ],
  "missing-4": [
    { title: "Grounding Earth", type: 'color', description: "Focus and stability.", instructions: "Wear deep blue, earthy brown, or gray." },
    { title: "The Anchor Habit", type: 'habit', description: "Build discipline.", instructions: "Choose one task (like making the bed) and do it at the exact same time daily." }
  ],
  "missing-5": [
    { title: "The Explorer's Green", type: 'color', description: "Openness to change.", instructions: "Wear vibrant green or turquoise." },
    { title: "Path Breaking", type: 'habit', description: "Adaptability training.", instructions: "Take a new route or try a new food once a week." }
  ],
  "missing-6": [
    { title: "Nurturing Heart", type: 'color', description: "Harmonize relationships.", instructions: "Wear soft pink, royal blue, or mauve." },
    { title: "The Caretaker's Act", type: 'habit', description: "Domestic service.", instructions: "Perform one task for your home or a loved one without being asked." }
  ],
  "missing-7": [
    { title: "Mystic Violet", type: 'color', description: "Introspection and wisdom.", instructions: "Wear lavender or deep violet." },
    { title: "The Sacred Silence", type: 'habit', description: "Mental clarity.", instructions: "Observe 20 minutes of total silence daily." }
  ],
  "missing-8": [
    { title: "Executive Command", type: 'color', description: "Financial and personal power.", instructions: "Wear deep purple or black." },
    { title: "The Power Review", type: 'habit', description: "Resource mastery.", instructions: "Review your financial accounts and goals every single day." }
  ],
  "challenging-8": [
    { title: "The Law of Karma", type: 'habit', description: "Balance power with justice.", instructions: "Dedicate 10% of your time or earnings to a selfless cause." },
    { title: "Saturn's Silence", type: 'habit', description: "Manage heavy responsibility.", instructions: "Spend time in old, historic buildings or mountains to ground your energy." }
  ],
  "challenging-4": [
    { title: "Structure for Freedom", type: 'habit', description: "Ease rigidity.", instructions: "Practice yoga or stretching to physically loosen the rigidity in your body." }
  ]
};
