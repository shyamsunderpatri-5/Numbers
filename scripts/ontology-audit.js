const fs = require('fs');
const path = require('path');

function auditOntology() {
    console.log("🧐 AUDITING TRAIT ONTOLOGY...");
    const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, 'trait-ontology.json'), 'utf8'));
    
    const traits = Object.keys(ontology.traits);
    const conflicts = [];
    const overlaps = [];

    // 1. Check for Overlaps (Semantic proximity in keys - simple check for now)
    for (let i = 0; i < traits.length; i++) {
        for (let j = i + 1; j < traits.length; j++) {
            const t1 = traits[i];
            const t2 = traits[j];
            
            // Substring overlap check
            if (t1.includes(t2) || t2.includes(t1)) {
                overlaps.push({ t1, t2, vib1: ontology.traits[t1], vib2: ontology.traits[t2] });
            }
        }
    }

    // 2. Check for Priority Conflicts
    // (If two traits map to different vibrations but have same priority)
    const priorityGroups = {};
    for (const [trait, vib] of Object.entries(ontology.traits)) {
        const priority = ontology.priorities[trait] || 1;
        if (!priorityGroups[priority]) priorityGroups[priority] = [];
        priorityGroups[priority].push({ trait, vib });
    }

    console.log("\n--- Overlap Diagnostics ---");
    if (overlaps.length === 0) console.log("✅ No simple string overlaps detected.");
    overlaps.forEach(o => {
        const isConflict = o.vib1 !== o.vib2;
        console.log(`${isConflict ? '⚠️' : 'ℹ️'} overlap: "${o.t1}" (${o.vib1}) vs "${o.t2}" (${o.vib2})`);
    });

    console.log("\n--- Priority Density ---");
    Object.keys(priorityGroups).sort((a, b) => b - a).forEach(p => {
        const group = priorityGroups[p];
        const uniqueVibs = [...new Set(group.map(g => g.vib))];
        console.log(`Priority ${p}: ${group.length} traits mapping to ${uniqueVibs.length} vibrations.`);
        if (uniqueVibs.length > 1 && group.length > 5) {
            console.log(`  ⚠️ High density conflict zone at priority ${p}.`);
        }
    });

    console.log("\n🏁 ONTOLOGY AUDIT COMPLETE.");
}

auditOntology();
