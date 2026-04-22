const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const compoundMeanings = [
    { n: 1, name: "The Sun", meaning: "Carries Solar influence. CONSTRUCTIVE: Leadership, authority, ambition, creativity, and independence. DESTRUCTIVE: Dominance, arrogance, over-ambition, and lack of cooperation. (Keywords: pioneer, executive, ego, original, Sun, 1, solar power, authority, leader, leader, leader)" },
    { n: 2, name: "The Moon", meaning: "Carries Lunar influence. CONSTRUCTIVE: Imagination, sensitivity, harmony, and intuition. DESTRUCTIVE: Indecisiveness, over-sensitivity, lack of confidence, and melancholy. (Keywords: diplomatic, artistic, gentle, moody, Moon, 2, lunar influence, harmony, peace, sensitivity)" },
    { n: 3, name: "Jupiter", meaning: "Carries Jupiterian influence. CONSTRUCTIVE: Expansion, wisdom, discipline, and organization. DESTRUCTIVE: Over-extension, dictatorial tendencies, and dogmatic thinking. (Keywords: growth, abundance, justice, philosophical, Jupiter, 3, jupiterian, expansion, wisdom)" },
    { n: 4, name: "Rahu", meaning: "Carries Rahuvian influence. CONSTRUCTIVE: Unconventional innovation, practicality, and reliability. DESTRUCTIVE: Rebellion for its own sake, sudden setbacks, and stubbornness. (Keywords: radical, technical, unique, unexpected, Rahu, 4, unconventional, innovation)" },
    { n: 5, name: "Mercury", meaning: "Carries Mercurial influence. CONSTRUCTIVE: Intelligence, versatility, speed, freedom, adventure, and commerce. DESTRUCTIVE: Restlessness, fickle nature, and deceptive shrewdness. (Keywords: communication, change, quick, expressive, Mercury, 5, mercurial, freedom, freedom, freedom, adventure)" },
    { n: 6, name: "Venus", meaning: "Carries Venusian influence. CONSTRUCTIVE: Love, beauty, harmony, and domestic refinement. DESTRUCTIVE: Self-indulgence, vanity, and over-attachment to luxury. (Keywords: artistic, charm, social, affection, Venus, 6, venusian, love, beauty)" },
    { n: 7, name: "Neptune/Ketu", meaning: "Carries Neptunian influence. CONSTRUCTIVE: Spirituality, mystery, and introspection. DESTRUCTIVE: Isolation, detachment, and losing touch with material reality. (Keywords: psychic, occult, philosophical, dreamer, Neptune, 7, neptunian, mystery, spirituality)" },
    { n: 8, name: "Saturn", meaning: "Carries Saturnine influence. CONSTRUCTIVE: Discipline, endurance, responsibility, and wisdom. DESTRUCTIVE: Delay, restriction, heavy karma, and coldness. (Keywords: structured, burden, persistent, material success through effort, Saturn, 8, saturnine, discipline, karma)" },
    { n: 9, name: "Mars", meaning: "Carries Martian influence. CONSTRUCTIVE: Courage, force, and protective energy. DESTRUCTIVE: Aggression, conflict, impulsiveness, and physical violence. (Keywords: action, brave, warrior, energy, Mars, 9, martian, courage, force)" },
    { n: 10, name: "Wheel of Fortune", meaning: "Honour, faith, self-confidence. Rise and fall according to desires. Plans likely to be carried out." },
    { n: 11, name: "Clenched Hand", meaning: "Warnings of hidden dangers, trial, and treachery from others. Great difficulties to overcome." },
    { n: 12, name: "The Sacrifice", meaning: "Suffering and anxiety of mind. Being sacrificed for the plans or intrigues of others. Intellectual but doubtful success." },
    { n: 13, name: "Change", meaning: "Change of plans, place, and such-like. Not unfortunate if understood. Power and dominion if used rightly." },
    { n: 14, name: "Movement", meaning: "Combinations of people and things. Fortunate for money, speculation, and business changes. Risk from natural forces." },
    { n: 15, name: "Magic & Mystery", meaning: "Occult significance, magic, and mystery. Eloquence, music, and art. Strong personal magnetism." },
    { n: 16, name: "Shattered Citadel", meaning: "Warning of strange fatality. Danger of accidents and defeat of plans. Sudden upheavals." },
    { n: 17, name: "Star of the Magi", meaning: "Highly fortunate. Peace, love, and spiritual strength. Rising superior in spirit to trials." },
    { n: 18, name: "Spiritual Strife", meaning: "Bitterness, quarrels, and family strife. Danger from elements and treachery. War and social upheavals." },
    { n: 19, name: "Prince of Heaven", meaning: "Extremely fortunate. Happiness, success, and esteem. Plans likely to be successful." },
    { n: 20, name: "The Awakening", meaning: "New purpose, cause, or duty. Not material; doubtful for worldly success. Spiritual development required." },
    { n: 21, name: "Crown of the Magi", meaning: "Advancement, honours, elevation. Victory after a long fight. Tests of determination." },
    { n: 22, name: "Fool's Paradise", meaning: "Illusion and delusion. False judgment owing to others. Warning of danger if unawakened." },
    { n: 23, name: "Royal Star of the Lion", meaning: "Highly fortunate. Help from superiors and protection from high places. Success for plans." },
    { n: 24, name: "Favourable Association", meaning: "Assistance of those in rank. Gain through love and opposite sex. Favourable for future." },
    { n: 25, name: "Strength through Experience", meaning: "Benefits through observation. Success through strife and trials in early life." },
    { n: 26, name: "Grave Warnings", meaning: "Disasters through association with others. Ruin by bad speculations and advice. Partnership danger." },
    { n: 27, name: "The Sceptre", meaning: "Authority, power, and command. Reward from productive intellect. Fortunate for future." },
    { n: 28, name: "Contradictions", meaning: "Great promise but likelihood of loss through trust in others. Competition and legal danger." },
    { n: 29, name: "Treachery", meaning: "Uncertainties, deception, and unexpected dangers. Trials caused by opposite sex. Grave warning." },
    { n: 30, name: "Mental Superiority", meaning: "Thoughtful deduction and retrospection. Putting material things aside for mental plane. Potent will." },
    { n: 31, name: "Isolation", meaning: "Self-contained, lonely, and isolated. Not fortunate from a worldly or material standpoint." },
    { n: 32, name: "Magical Power", meaning: "Fortunate if holding to own judgment. Combinations of people/nations. Wrecked by others' stupidity if weak." }
];

async function getEmbedder() {
    const { pipeline } = await import("@xenova/transformers");
    return await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
}

async function main() {
    console.log("🌊 Hydrating Sovereign Compounds (10-32)...");
    const generator = await getEmbedder();

    const influenceMap = {
        1: "Solar", 2: "Lunar", 3: "Jupiterian", 4: "Rahuvian",
        5: "Mercurial", 6: "Venusian", 7: "Neptunian", 8: "Saturnine", 9: "Martian"
    };

    for (const item of compoundMeanings) {
        const single = item.n % 9 || 9;
        const type = item.n <= 9 ? "Root" : "Compound";
        const influence = influenceMap[single];
        
        let meaning = item.meaning;
        if (type === "Compound") {
            meaning = `Carries ${influence} influence. ${meaning}`;
        }

        const text = `Sovereign ${type} Number ${item.n} (${item.name}): ${meaning} | Vibration: ${item.n} | Primary Vibration: ${single} (Chaldean Truth) | Keywords: number ${item.n}, ${type.toLowerCase()} ${item.n}, vibration ${item.n}, Name Number ${item.n}, Primary Vibration ${item.n}`;
        
        console.log(`   💎 Processing ${item.n}...`);
        
        const output = await generator(text, { pooling: "mean", normalize: true });
        const embedding = Array.from(output.data);

        // We use an insert as we know these are new system entries
        const { error } = await supabase
            .from("library_embeddings")
            .insert({
                chunk_text: text,
                embedding: embedding,
                contamination_level: 'S_SOVEREIGN',
                source_id: 'd2cf0e14-2a9e-4f1f-bcbe-07c4bb28b45f' // Cheiro's Book of Numbers
            });

        if (error) console.error(`❌ Error hydrating ${item.n}:`, error.message);
    }

    console.log("\n✅ Sovereign Hydration Complete.");
}

main().catch(console.error);
