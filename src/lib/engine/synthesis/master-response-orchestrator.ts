/**
 * MASTER RESPONSE ORCHESTRATOR
 * Implements the "Golden Response Structure" and "Astro-Numerology Fusion Logic"
 * for NUMERIQ.AI production layer.
 */

import { MASTER_SYSTEM_PROMPT } from '../intelligence/master-system-prompt';

export interface FusionContext {
  numerology: {
    birth_number: number;
    destiny_number: number;
    personal_year?: number;
    traits: string[];
  };
  astrology: {
    dominant_planets: string[];
    mahadasha?: string;
    house_placements: Record<string, any>;
    timing_signals: string[];
  };
  user_question: string;
}

export class MasterResponseOrchestrator {
  private static PLANET_MAP: Record<number, string> = {
    1: 'Sun',
    2: 'Moon',
    3: 'Jupiter',
    4: 'Rahu',
    5: 'Mercury',
    6: 'Venus',
    7: 'Ketu',
    8: 'Saturn',
    9: 'Mars'
  };

  /**
   * Generates the Master System Prompt for the LLM
   */
  public static getSystemPrompt(): string {
    return MASTER_SYSTEM_PROMPT;
  }

  /**
   * Planetary Friendship Matrix (Vedic-Chaldean Bridge)
   */
  private static FRIENDSHIP_MATRIX: Record<string, { friends: string[], enemies: string[], neutral: string[] }> = {
    'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Saturn', 'Venus'], neutral: ['Mercury'] },
    'Moon': { friends: ['Sun', 'Mercury'], enemies: [], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'] },
    'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'], neutral: ['Venus', 'Saturn'] },
    'Mercury': { friends: ['Sun', 'Venus'], enemies: ['Moon'], neutral: ['Mars', 'Jupiter', 'Saturn'] },
    'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'], neutral: ['Saturn'] },
    'Venus': { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'], neutral: ['Mars', 'Jupiter'] },
    'Saturn': { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutral: ['Jupiter'] },
    'Rahu': { friends: ['Saturn', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutral: [] },
    'Ketu': { friends: ['Saturn', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'], neutral: [] }
  };

  /**
   * Synthesizes a structured fusion insight
   */
  public static synthesizeFusion(context: FusionContext): string {
    const { numerology, astrology } = context;
    
    // 1. Map Numbers to Planets
    const bPlanet = this.PLANET_MAP[numerology.birth_number];
    const dPlanet = this.PLANET_MAP[numerology.destiny_number];

    // 2. Cross-reference with Current dominant planet
    const currentPlanet = astrology.dominant_planets[0];
    const relationship = this.FRIENDSHIP_MATRIX[bPlanet];

    let fusionType = 'Neutral';
    if (relationship.friends.includes(currentPlanet)) fusionType = 'Friendly';
    if (relationship.enemies.includes(currentPlanet)) fusionType = 'Enemy';

    // 3. Build Logic
    let fusionLogic = "";
    if (fusionType === 'Friendly') {
      fusionLogic = `Today, your [Number ${numerology.birth_number} / ${bPlanet}] meets [${currentPlanet}]. These are friendly energies. Expect progress and synergy.`;
    } else if (fusionType === 'Enemy') {
      fusionLogic = `Today, your [Number ${numerology.birth_number} / ${bPlanet}] meets [${currentPlanet}]. These are enemy energies. Shani/Saturn watch is active - prepare for delays.`;
    } else {
      fusionLogic = `Stable energy. Your vibration and today's transit are in a neutral state. Focus on routine.`;
    }

    return `
[FUSION_LOGIC_V1.0]
Relationship: ${fusionType}
Birth Planet: ${bPlanet}
Transit Planet: ${currentPlanet}
Logic: ${fusionLogic}
    `.trim();
  }
}
