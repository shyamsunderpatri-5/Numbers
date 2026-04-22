const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function diagnose(queryText) {
    console.log(`\n🔍 DIAGNOSING: "${queryText}"`);
    const { pipeline } = await import("@xenova/transformers");
    const generator = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    const output = await generator(queryText, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    const { data: results, error } = await supabase.rpc('match_library_documents', { 
        query_embedding: embedding, 
        match_threshold: 0.0, // Get everything
        match_count: 10 
    });

    if (error) {
        console.error("❌ RPC Error:", error);
        return;
    }

    results.forEach((r, i) => {
        console.log(`[${i+1}] Score: ${r.similarity.toFixed(4)} | Content: ${r.chunk_text.slice(0, 100)}...`);
    });
}

async function run() {
    await diagnose("Sovereign Compound Number 23");
    await diagnose("freedom loving personality");
}

run().catch(console.error);
