const { synthesize } = require("../src/lib/engine/synthesis/chaldean-synthesis-engine");
const { validateInterpretation } = require("../src/lib/engine/validators");
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function runNarrativeAudit() {
    console.log("🦁 STARTING FINAL NARRATIVE AUDIT (Full Loop)...");

    const testCases = [
        { name: "LOTUS", day: 1, compound: 23, planet: "Jupiterian" },
        { name: "RAHUL", day: 6, compound: 17, planet: "Saturnian" }
    ];

    for (const test of testCases) {
        console.log(`\n--- Testing ${test.name} (Compound ${test.compound}) ---`);
        
        // 1. Get Synthesis Contract
        const { contract, prompt } = await synthesize(test.name, test.day);
        
        // 2. Call GROQ for Narrative Generation
        console.log("📡 Generating narrative via Groq...");
        try {
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are the Pilgrim, an expert in Chaldean Numerology." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1 // Low temperature for maximum adherence to guardrails
            }, {
                headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' }
            });

            const interpretation = response.data.choices[0].message.content;
            console.log("\n--- GENERATED INTERPRETATION ---");
            console.log(interpretation.slice(0, 500) + "...");

            // 3. Run Validation Audit
            const audit = validateInterpretation(interpretation, test.compound, test.planet, true);
            
            console.log("\n--- AUDIT RESULTS ---");
            console.log(`- Golden Pass: ${audit.pass ? "✅ YES" : "❌ NO"}`);
            console.log(`- Planet Mentioned: ${audit.hasPlanet ? "✅ YES" : "❌ NO"}`);
            console.log(`- Weight Audit (Compound First): ${audit.weightAuditPass ? "✅ PASS" : "❌ FAIL"}`);
            
            if (!audit.pass) {
                console.log("- Missing Traits:", audit.goldenResults.missing);
                console.log("- Forbidden Terms Found:", audit.goldenResults.forbiddenFound);
            }

        } catch (err) {
            console.error("❌ Narrative generation failed:", err.response?.data || err.message);
        }
    }

    console.log("\n🏁 FINAL NARRATIVE AUDIT COMPLETE.");
}

runNarrativeAudit().catch(console.error);
