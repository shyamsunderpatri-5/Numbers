/**
 * NUMERIQ.AI — Cheiro's Book of Numbers (Pure Edition)
 * Interpretations for 13, 14, 16, and 19.
 * Source: Cheiro's Book of Numbers (provided TXT)
 */

export interface PatternNumberKnowledge {
  number: number;
  title: string;
  meaning: string;
  impact: string;
  practicalAdvice: string;
}

export const PATTERN_NUMBERS: Record<number, PatternNumberKnowledge> = {
  13: {
    number: 13,
    title: "Change and Power (Death Symbol)",
    meaning: "Often misunderstood as unfortunate, but in ancient writings: 'He who understands the number 13 will be given power and dominion.' It is a symbol of upheaval and destruction, representing 'Power' which if wrongly used will wreak destruction upon itself.",
    impact: "Indicates change of plans, place, and such-like. It is a number of warning of the unknown or unexpected if it appears in calculations.",
    practicalAdvice: "Harness the power of transformation. Be prepared for sudden shifts and use them as fuel for new growth rather than fearing the 'death' of the old."
  },
  14: {
    number: 14,
    title: "Movement and Risk",
    meaning: "A number of movement and combination of people and things. It denotes danger from natural forces (tempests, water, fire) but is fortunate for dealings with money and speculation.",
    impact: "There is always a strong element of risk and danger, often due to the foolhardiness of others. It demands extreme caution and prudence in future planning.",
    practicalAdvice: "Act with caution. While money matters look good, the 'risk' vibration is high. Double-check all partnerships and environmental factors."
  },
  16: {
    number: 16,
    title: "The Shattered Citadel",
    meaning: "Pictured as 'a Tower Struck by Lightning from which a man is falling with a Crown on his head.' It is the 'Shattered Citadel'—a warning of strange fatalities and the defeat of one's plans.",
    impact: "Indicates a sudden shift or accident that can dismantle current progress. It is a fatalistic indicator that requires advanced planning to avert.",
    practicalAdvice: "Do not build on pride. If you see this pattern emerging, simplify your plans and strengthen your foundations. Humility is the only shield against the lightning."
  },
  19: {
    number: 19,
    title: "The Prince of Heaven (The Sun)",
    meaning: "Regarded as extremely fortunate. Symbolised as 'The Sun' and called 'The Prince of Heaven.' It promises happiness, success, esteem, and honour.",
    impact: "A powerful promise of success in future plans. It is one of the most favorable vibrations in Cheiro's system.",
    practicalAdvice: "Step into your power with confidence. This is a time for visibility, leadership, and reaping the rewards of your previous efforts."
  }
};
