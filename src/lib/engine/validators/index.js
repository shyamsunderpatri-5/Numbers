const fs = require('fs');
const path = require('path');
const { ROOT_TRAITS } = require('../core/chaldean-core-v1');

const goldenOutputs = JSON.parse(fs.readFileSync(path.join(__dirname, "../ontology/golden-outputs.json"), "utf8"));

/**
 * 5. Consistency Validator & Golden Audit
 */
function validateInterpretation(interpretation, number, planet, isCompound = false) {
    const lowerOutput = interpretation.toLowerCase();
    
    // 1. Basic Semantic Check
    const requiredTraits = isCompound ? [] : (ROOT_TRAITS[number]?.traits || []);
    const planetRegex = new RegExp(planet, 'i');
    const hasPlanet = planetRegex.test(lowerOutput) || (planet === 'Mercury' && lowerOutput.includes('mercurial'));
    const matchedTraits = requiredTraits.filter(t => lowerOutput.includes(t.toLowerCase()));
    
    // 2. Golden Case Check
    const goldenCase = goldenOutputs.cases.find(c => 
        c.input === String(number) && 
        c.type === (isCompound ? "Compound" : "Root")
    );

    const goldenResults = { pass: true, missing: [], forbiddenFound: [] };
    if (goldenCase) {
        goldenCase.must_include.forEach(t => {
            const traitRegex = new RegExp(t, 'i');
            // Special case for protection/protected
            if (!traitRegex.test(lowerOutput) && !(t === 'protection' && lowerOutput.includes('protected'))) {
                goldenResults.pass = false;
                goldenResults.missing.push(t);
            }
        });
        goldenCase.forbidden.forEach(t => {
            if (lowerOutput.includes(t.toLowerCase())) {
                goldenResults.pass = false;
                goldenResults.forbiddenFound.push(t);
            }
        });
    }

    // 3. Weight Audit Test (For Compounds)
    let weightAuditPass = true;
    if (isCompound && goldenCase) {
        // Compound traits must appear MORE or as prominently as root traits
        const rootTraits = ROOT_TRAITS[number % 9 || 9].traits;
        const rootCount = rootTraits.filter(t => lowerOutput.includes(t)).length;
        const compoundCount = goldenCase.must_include.filter(t => lowerOutput.includes(t)).length;
        
        if (compoundCount < 1 && rootCount > 0) weightAuditPass = false; // Compound must lead
    }

    return {
        pass: hasPlanet && goldenResults.pass && weightAuditPass,
        matchedTraits,
        hasPlanet,
        goldenResults,
        weightAuditPass
    };
}

module.exports = { validateInterpretation };
