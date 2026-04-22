const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { 
    CHALDEAN_LETTER_MAP, 
    PLANETARY_ADJECTIVES, 
    ROOT_TRAITS, 
    WEIGHTING_RULES, 
    CONFLICT_RESOLUTION,
    VERSION 
} = require("../core/chaldean-core-v1");
const SYSTEM_VERSION = "1.0-SOVEREIGN";

require('dotenv').config({ path: path.join(__dirname, '../../../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * 0. Observability Layer
 */
async function logSovereigntyEvent(data) {
    const { error } = await supabase.from('sovereignty_logs').insert(data);
    if (error) console.error("❌ Failed to log sovereignty event:", error.message);
}

/**
 * 1. Calculation Layer
 */
function calculateName(name) {
    const values = [...name.toUpperCase()].map(c => CHALDEAN_LETTER_MAP[c] || 0);
    const compound = values.reduce((a, b) => a + b, 0);
    const single = compound % 9 || 9;
    return { compound, single };
}

/**
 * 2. Retrieval Layer (Purified RAG)
 */
async function getTraits(number, isCompound = false, originalQuery = null) {
    const { pipeline } = await import("@xenova/transformers");
    const generator = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    const type = isCompound ? "Compound" : "Root";
    const label = `Sovereign ${type} Number ${number}`;
    const scanText = originalQuery ? `${originalQuery} ${label}` : label;

    // 0. Trait Canonicalization (New Layer)
    const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, '../ontology/trait-ontology.json'), 'utf8'));
    let forcedVibration = null;
    let highestPriority = -1;

    // Scan query for canonical traits
    for (const [trait, vib] of Object.entries(ontology.traits)) {
        if (scanText.toLowerCase().includes(trait)) {
            const priority = ontology.priorities[trait] || 1;
            if (priority > highestPriority) {
                highestPriority = priority;
                forcedVibration = vib;
            }
        }
    }

    // 1. Try Exact Keyword Match first (Deterministic)
    const { data: exactResults } = await supabase
        .from('library_embeddings')
        .select('chunk_text, contamination_level')
        .ilike('chunk_text', `%Sovereign ${type} Number ${number}%`)
        .limit(5);

    if (exactResults && exactResults.length > 0) {
        return {
            traits: exactResults.map(r => r.chunk_text),
            metadata: {
                forcedVibration,
                canonicalTraits: Object.keys(ontology.traits).filter(t => scanText.toLowerCase().includes(t))
            }
        };
    }

    // 2. Semantic Search with Forced Canonical Routing
    const output = await generator(label, { pooling: "mean", normalize: true });

    const { data: semanticResults } = await supabase.rpc('match_library_documents', { 
        query_embedding: Array.from(output.data), 
        match_threshold: 0.1, 
        match_count: 20
    });

    // 3. Sovereign Boost & Boundary Filter
    const rootNumber = number % 9 || 9;
    const allowedVibrations = [
        `Vibration: ${number}`,
        `Vibration: ${rootNumber}`
    ];
    
    // If we have a forced vibration from canonicalization, add it to allowed
    if (forcedVibration) allowedVibrations.push(`Vibration: ${forcedVibration}`);

    const boostedResults = (semanticResults || [])
        .map(r => ({
            ...r,
            effectiveSimilarity: r.similarity + (r.contamination_level === 'S_SOVEREIGN' ? 0.25 : 0)
        }))
        .filter(r => 
            allowedVibrations.some(v => r.chunk_text.includes(v)) || r.effectiveSimilarity > 0.85
        )
        .sort((a, b) => b.effectiveSimilarity - a.effectiveSimilarity);

    // 4. Confidence & Ambiguity Calculation
    const topScore = boostedResults[0]?.effectiveSimilarity || 0;
    const secondScore = boostedResults[1]?.effectiveSimilarity || 0;
    
    // AMBIGUITY: If top two results are from different vibrations but have very close scores
    const isAmbiguous = (topScore - secondScore < 0.05) && (boostedResults.length > 1);
    
    // CONFIDENCE: 1.0 if forced, otherwise based on similarity
    const confidence = forcedVibration ? 1.0 : Math.min(topScore / 0.85, 1.0);

    return {
        traits: boostedResults.map(r => r.chunk_text),
        metadata: {
            forcedVibration,
            canonicalTraits: Object.keys(ontology.traits).filter(t => scanText.toLowerCase().includes(t)),
            confidence,
            isAmbiguous
        }
    };
}

/**
 * 3. Synthesis Layer (Hard Input Contract)
 */
async function synthesize(name, birthDay) {
    const startTime = Date.now();
    console.log(`🔮 Synthesizing Chaldean Profile for: ${name} (Day ${birthDay})`);
    
    // Name Logic
    const nameData = calculateName(name);
    const { traits: nameCompoundTraits, metadata } = await getTraits(nameData.compound, true, name);
    const nameRootTraits = ROOT_TRAITS[nameData.single].traits;

    // Birth Logic
    const birthSingle = birthDay % 9 || 9;
    const birthRootTraits = ROOT_TRAITS[birthSingle].traits;

    // Hard Input Contract
    const contract = {
        identity_layer: {
            name: name,
            compound_number: nameData.compound,
            primary_vibration: nameData.single,
            planet: PLANETARY_ADJECTIVES[nameData.single],
            weighting: WEIGHTING_RULES.NAME_NUMBER,
            raw_traits: {
                compound: nameCompoundTraits,
                root: nameRootTraits
            },
            metadata
        },
        foundation_layer: {
            day: birthDay,
            primary_vibration: birthSingle,
            planet: PLANETARY_ADJECTIVES[birthSingle],
            weighting: WEIGHTING_RULES.BIRTH_NUMBER,
            raw_traits: birthRootTraits
        },
        conflict_resolution: CONFLICT_RESOLUTION(PLANETARY_ADJECTIVES[nameData.single], PLANETARY_ADJECTIVES[birthSingle]),
        system_version: VERSION
    };

    const latency = Date.now() - startTime;

    // Prompt Guardrails
    const prompt = `
[ROLE] You are the "Pilgrim", a master of Chaldean Numerology.
[INPUT] Use the following HARD CONTRACT JSON: ${JSON.stringify(contract)}

[GUIDELINES]
1. COMPOUND FIRST: Always prioritize the Compound Number meaning (${contract.identity_layer.compound_number}).
2. PLANETARY IDENTITY: Frame everything through ${contract.identity_layer.planet} and ${contract.foundation_layer.planet} influences.
3. POLARITY: Include both Constructive and Destructive traits.
4. FORBIDDEN: NEVER mention "Life Path", "Expression Number", "Destiny Number", "reduces to", or "digit sum".
5. STRUCTURE: 
   - Identity (Name)
   - Foundation (Birth)
   - Synthesis (Conflict Resolution)

[NARRATIVE TONE] Compassionate, expert, and dignified.
    `;

    return { contract, prompt, latency };
}

// Example usage
async function main() {
    const { contract, prompt } = await synthesize("RAHUL", 6);
    console.log("\n--- HARD INPUT CONTRACT ---");
    console.log(JSON.stringify(contract, null, 2));
    console.log("\n--- GUARDED PROMPT ---");
    console.log(prompt);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { synthesize };
