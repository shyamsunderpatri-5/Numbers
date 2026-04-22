/**
 * NUMERIQ.AI - Chaldean Core Logic v1.0
 * [VERSION LOCKED - DO NOT MODIFY]
 */

const CHALDEAN_LETTER_MAP = {
    'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':8, 'G':3, 'H':5, 'I':1,
    'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'O':7, 'P':8, 'Q':1, 'R':2,
    'S':3, 'T':4, 'U':6, 'V':6, 'W':6, 'X':5, 'Y':1, 'Z':7
};

const PLANETARY_ADJECTIVES = {
    1: "Solar", 2: "Lunar", 3: "Jupiterian", 4: "Rahuvian",
    5: "Mercurial", 6: "Venusian", 7: "Neptunian", 8: "Saturnine", 9: "Martian"
};

const BLACKLIST = [
    "Life Path", "Expression Number", "Destiny Number", "Soul Urge", 
    "Personality Number", "reduces to", "digit sum", "master number",
    "calculated by", "Pythagorean", "Western numerology"
];

const ROOT_TRAITS = {
    1: { planet: "Sun", traits: ["leadership", "authority", "ambition", "creativity", "independence"] },
    2: { planet: "Moon", traits: ["imagination", "sensitivity", "harmony", "intuition"] },
    3: { planet: "Jupiter", traits: ["expansion", "wisdom", "discipline", "organization"] },
    4: { planet: "Rahu", traits: ["unconventional", "innovation", "practicality", "reliability"] },
    5: { planet: "Mercury", traits: ["communication", "intelligence", "versatility", "speed"] },
    6: { planet: "Venus", traits: ["love", "beauty", "harmony", "art", "luxury"] },
    7: { planet: "Neptune/Ketu", traits: ["spirituality", "mystery", "introspection", "solitude"] },
    8: { planet: "Saturn", traits: ["discipline", "delay", "karma", "restriction", "endurance"] },
    9: { planet: "Mars", traits: ["action", "courage", "force", "energy"] }
};

const WEIGHTING_RULES = {
    NAME_NUMBER: {
        COMPOUND: 0.70,
        DIGIT: 0.30
    },
    BIRTH_NUMBER: {
        DIGIT: 0.60,
        PLANET: 0.40
    }
};

const CONFLICT_RESOLUTION = (namePlanet, birthPlanet) => {
    if (namePlanet === birthPlanet) return `Harmonious ${namePlanet} resonance.`;
    return `External expression guided by ${namePlanet}, internally modified by ${birthPlanet} drive.`;
};

module.exports = {
    CHALDEAN_LETTER_MAP,
    PLANETARY_ADJECTIVES,
    BLACKLIST,
    ROOT_TRAITS,
    WEIGHTING_RULES,
    CONFLICT_RESOLUTION,
    VERSION: "1.1",
    STATUS: "Chaldean-Compliant"
};
