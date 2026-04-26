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
const { PROBLEM_MAP } = require("../logic/problem-mapper");
const { getSuggestedNames } = require("../logic/name-engine");
const { getRankedRemedies } = require("../logic/remedy-mapper");

const SYSTEM_VERSION = "1.1-HIGH-CONVERSION";

require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

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
    const ontologyPath = path.join(process.cwd(), 'src/lib/engine/ontology/trait-ontology.json');
    const ontology = JSON.parse(fs.readFileSync(ontologyPath, 'utf8'));
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
 * 2.5 Remedy Layer
 */
async function getRemedies(number) {
    const { data } = await supabase
        .from('knowledge_base')
        .select('content')
        .eq('knowledge_type', 'number_1_9')
        .eq('key', number.toString())
        .single();
    
    const remedies = data?.content?.homeRemedies || [];
    return remedies.length > 0 ? remedies : ["No specific home remedies recorded for this frequency."];
}

/**
 * 3. Synthesis Layer (Hard Input Contract)
 */
async function synthesize(name, birthDay, birthMonth, birthYear, problemType = "confusion") {
    const startTime = Date.now();
    console.log(`🔮 Synthesizing High-Conversion Profile for: ${name} | Focus: ${problemType}`);
    
    // Name Logic
    const nameData = calculateName(name);
    const { traits: nameCompoundTraits, metadata } = await getTraits(nameData.compound, true, name);
    const nameRootTraits = ROOT_TRAITS[nameData.single].traits;

    // Birth Logic
    const birthSingle = birthDay % 9 || 9;
    const birthRootTraits = ROOT_TRAITS[birthSingle].traits;

    // Logic Layer Integration
    const problemDef = PROBLEM_MAP[problemType] || PROBLEM_MAP.confusion;
    const rankedRemedies = getRankedRemedies(nameData.single);
    const nameSuggestions = getSuggestedNames(name, problemDef.primaryVibrations);

    // Hard Input Contract
    const contract = {
        identity_layer: {
            name: name,
            compound_number: nameData.compound,
            primary_vibration: nameData.single,
            planet: PLANETARY_ADJECTIVES[nameData.single],
            raw_traits: {
                compound: nameCompoundTraits,
                root: nameRootTraits
            }
        },
        problem_layer: {
            selected_problem: problemType,
            label: problemDef.label,
            behavioral_friction: problemDef.behavioralTraits,
            impact_goal: problemDef.impactDescription
        },
        action_layer: {
            ranked_remedies: rankedRemedies,
            suggested_upgrades: nameSuggestions
        },
        system_version: VERSION
    };

    const latency = Date.now() - startTime;

    // Prompt Guardrails (Strict Behavioral Design)
    const prompt = `
[ROLE] You are the "Pilgrim", a master of Chaldean Numerology and Behavioral Design.
[INPUT] Use this HARD CONTRACT JSON: ${JSON.stringify(contract)}

[OUTPUT STRUCTURE - MANDATORY JSON ONLY]
{
  "identityHook": "One powerful line connecting their name vibration to their current state.",
  "problems": ["Bullet 1: Direct behavioral friction", "Bullet 2", "Bullet 3"],
  "rootCause": "Simplified explanation of why their current vibration causes this problem.",
  "remedies": [
    {"text": "Remedy 1", "difficulty": "easy/medium", "isQuickWin": true/false},
    ...max 5
  ],
  "topRemedy": "The one most impactful action to take today.",
  "nameUpgrade": {
    "current": "${name} (${nameData.single})",
    "suggested": "Optimized Name (Number)",
    "impact": "Behavioral improvement description"
  },
  "confidenceScore": "Strong match with your behavior"
}

[STRICT RULES]
1. NO SPIRITUAL LANGUAGE: Use "Behavioral patterns," "Decision clarity," "Vibrational friction."
2. NO PERCENTAGES: Use descriptions like "Improves professional authority."
3. PROBLEM FOCUS: Every word must address the selected problem: ${contract.problem_layer.label}.
4. ONE PRIMARY ACTION: Ensure 'topRemedy' is the clear focus.
5. CONSTRAINED NAMES: Only use the suggested upgrades from the contract: ${JSON.stringify(contract.action_layer.suggested_upgrades)}.
6. NO PYTHAGOREAN TERMS: (e.g. No 'Life Path').
    `;

    return { contract, prompt, latency };
}

module.exports = {
    synthesize,
    calculateName,
    logSovereigntyEvent
};
