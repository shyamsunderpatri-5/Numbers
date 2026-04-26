/**
 * NUMERIQ.AI — Constrained Name Engine
 * Generates realistic name variations to reach favorable vibrations.
 * RULES: Only suggest +1/-1 letter or vowel extensions. No artificial fabrications.
 */

const CHALDEAN_LETTER_MAP: Record<string, number> = {
    'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':8, 'G':3, 'H':5, 'I':1,
    'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':7, 'P':8, 'Q':1, 'R':2,
    'S':3, 'T':4, 'U':6, 'V':6, 'W':6, 'X':5, 'Y':1, 'Z':7
};

export interface NameVariation {
    name: string;
    compound: number;
    single: number;
    impact: string;
}

/**
 * Calculates the Chaldean values for a given name.
 */
function calculate(name: string) {
    const values = [...name.toUpperCase()].map(c => CHALDEAN_LETTER_MAP[c] || 0);
    const compound = values.reduce((a, b) => a + b, 0);
    const single = compound % 9 || 9;
    return { compound, single };
}

/**
 * Generates constrained variations of a name.
 */
export function getSuggestedNames(currentName: string, targetVibrations: number[]): NameVariation[] {
    const variations: string[] = [];
    const upperName = currentName.toUpperCase();
    const lastChar = upperName[upperName.length - 1];

    // 1. Vowel Extension (e.g., SHYAM -> SHYAAM)
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    for (let i = 0; i < upperName.length; i++) {
        if (vowels.includes(upperName[i])) {
            const extended = upperName.slice(0, i) + upperName[i] + upperName.slice(i);
            variations.push(extended);
        }
    }

    // 2. Letter Duplication (e.g., SHYAM -> SHYAMM)
    if (lastChar && !vowels.includes(lastChar)) {
        variations.push(upperName + lastChar);
    }

    // 3. Simple Suffix (e.g., SHYAM -> SHYAMA)
    variations.push(upperName + 'A');

    // 4. Letter Removal (-1)
    if (upperName.length > 3) {
        for (let i = 0; i < upperName.length; i++) {
            const removed = upperName.slice(0, i) + upperName.slice(i + 1);
            variations.push(removed);
        }
    }

    const results: NameVariation[] = [];
    const seen = new Set<string>();

    for (const v of variations) {
        if (v === upperName || seen.has(v)) continue;
        seen.add(v);

        const { compound, single } = calculate(v);
        if (targetVibrations.includes(single)) {
            results.push({
                name: v,
                compound,
                single,
                impact: getImpactForVibration(single)
            });
        }
    }

    // Limit to 3 variations
    return results.slice(0, 3);
}

function getImpactForVibration(vibration: number): string {
    switch (vibration) {
        case 1: return "Improves professional authority and leadership.";
        case 3: return "Enhances discipline and organizational growth.";
        case 5: return "Strengthens intellect and communication speed.";
        case 6: return "Stabilizes financial flow and luxury.";
        default: return "Improves overall decision clarity.";
    }
}
