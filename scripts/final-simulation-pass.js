const { synthesize } = require("../src/lib/engine/synthesis/chaldean-synthesis-engine");

const MESSY_INPUTS = [
    "I feel lost but want success",
    "I love people but need independence",
    "I am spiritual but also ambitious",
    "I want freedom but stability",
    "I overthink everything"
];

async function runSimulation() {
    console.log("🧪 STARTING FINAL SIMULATION PASS (Messy Inputs)...");
    
    for (const input of MESSY_INPUTS) {
        console.log(`\nTesting Query: "${input}"`);
        // We simulate a profile generation for this intent
        // Using a dummy birth day 1
        const { contract, latency } = await synthesize(input, 1);
        
        const metadata = contract.identity_layer.metadata;
        console.log(`- Detected Traits: ${metadata.canonicalTraits.join(", ") || "NONE"}`);
        console.log(`- Confidence: ${(metadata.confidence * 100).toFixed(1)}%`);
        console.log(`- Ambiguous: ${metadata.is_ambiguous ? "⚠️ YES" : "✅ NO"}`);
        console.log(`- Routing To: ${contract.identity_layer.compound_number} (Planet: ${contract.identity_layer.planet})`);
        
        if (metadata.canonicalTraits.length === 0) {
            console.log("  ⚠️ HIGH RISK: Pure semantic fallback detected.");
        }
    }
    
    console.log("\n🏁 SIMULATION COMPLETE.");
}

runSimulation().catch(console.error);
