const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let embedder = null;

async function getEmbedding(text) {
    if (!embedder) {
        const { pipeline } = await import("@xenova/transformers");
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }
    const output = await embedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
}

async function testSearch(query) {
    console.log(`\n🔍 Testing Search for: "${query}"`);
    const embedding = await getEmbedding(query);
    
    // Using the rpc call for match_library_documents
    const { data, error } = await supabase.rpc("match_library_documents", {
        query_embedding: embedding,
        match_threshold: 0.2, // Drastically lower to ensure we see SOMETHING
        match_count: 5
    });

    if (error) {
        console.error("Search error:", error);
        return;
    }

    data.forEach((match, i) => {
        console.log(`[Result ${i+1}] Score: ${match.similarity.toFixed(4)}`);
        console.log(`Source: ${match.source_title}`);
        console.log(`Text snippet: ${match.chunk_text.substring(0, 200)}...\n`);
    });
}

async function main() {
    // Test Sepharial's compound number 58
    await testSearch("Sepharial compound number 58 meaning");
    
    // Test Hans Decoz career narrative
    await testSearch("Hans Decoz career narrative for number 7");
}

main().catch(console.error);
