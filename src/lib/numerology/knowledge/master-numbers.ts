/**
 * NUMERIQ.AI - Knowledge Base: Master Numbers
 * Deep interpretations for 11, 22, and 33.
 */

export interface MasterNumberKnowledge {
  number: number;
  title: string;
  vibration: string;
  coreMeaning: string;
  challenges: string[];
  remedy: string;
}

export const MASTER_NUMBERS: Record<number, MasterNumberKnowledge> = {
  11: {
    number: 11,
    title: "The Visionary / The Illuminator",
    vibration: "Spiritual Insight & High Intuition",
    coreMeaning: "The 11 is the first of the Master Numbers. It indicates a highly charged frequency of spiritual awareness. Often called the 'Illuminator', those with this number are built for a higher purpose. It brings great sensitivity and the ability to channel insights from beyond the mundane. However, it is a narrow path—the 11 must ground themselves or risk nervous exhaustion. It is the vibration of the teacher who leads by example rather than force.",
    challenges: [
      "Extreme nervous tension",
      "Over-sensitivity to noise and atmosphere",
      "Feeling overwhelmed by the burden of insight",
      "Impracticality if not grounded"
    ],
    remedy: "Practice consistent grounding through nature (walking on earth) and learn to filter the input of your environment. You are a channel; keep the channel clear but grounded."
  },
  22: {
    number: 22,
    title: "The Master Architect",
    vibration: "Manifestation & Large-scale Building",
    coreMeaning: "The 22 is considered the most powerful of all numbers in terms of material manifestation. It is the 'Master Architect'. While 11 has the vision, 22 has the power to build that vision into physical reality. It indicates a person who can organize and lead large enterprises or movements. It is an immense responsibility and demands absolute integrity and discipline.",
    challenges: [
      "Significant anxiety due to high stakes",
      "Tendency toward workaholism",
      "Risk of delusion if ego takes over",
      "Feeling the weight of thousands on your shoulders"
    ],
    remedy: "Focus on selfless service and absolute transparency. Your power is a tool for the collective, not just the self. Build for perpetuity, not just for today."
  },
  33: {
    number: 33,
    title: "The Master Teacher",
    vibration: "Universal Love & Compassionate Service",
    coreMeaning: "The 33 is the frequency of the 'Master Teacher' or 'The Avatar of Love'. It represents the complete synthesis of intuition and building. It is the highest spiritual vibration, focused entirely on the well-being of humanity. Those with 33 are here to inspire and heal through selfless service. It is a very rare and demanding path that requires the total sublimation of personal ego.",
    challenges: [
      "Emotional exhaustion from carrying others' burdens",
      "Impossible standards for self and others",
      "Difficulty in personal relationships due to universal focus",
      "Martyrdom tendencies"
    ],
    remedy: "You must learn to love the one as much as the many. Do not neglect your own heart in your mission to save the world. Balance your universal service with personal joy."
  }
};
