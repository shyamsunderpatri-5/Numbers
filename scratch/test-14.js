const { getQualityExplanation, getNumberQuality } = require("./src/lib/numerology/number-quality");

function testCompound(num) {
    console.log(`\n🧪 Testing Compound Recognition: ${num}`);
    
    const quality = getNumberQuality(num);
    const explanation = getQualityExplanation(num);
    
    console.log(`Quality: ${quality}`);
    console.log(`Explanation Start: ${explanation.substring(0, 150)}...`);
    
    if (explanation.includes("14")) {
        console.log(`✅ SUCCESS: Primary meaning for ${num} detected.`);
    } else {
        console.log(`❌ FAILURE: Blind reduction detected.`);
    }
}

testCompound(14);
