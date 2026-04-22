const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
    console.log("🔍 Searching library_embeddings for 'Pythagorean'...");
    
    const { data: matches, error } = await supabase
        .from("library_embeddings")
        .select("id, chunk_text, source_id")
        .ilike("chunk_text", "%Pythagorean%");

    if (error) {
        console.error("Search error:", error);
        return;
    }

    console.log(`Found ${matches.length} chunks containing 'Pythagorean'.`);
    
    // Get source titles for context
    const sourceIds = [...new Set(matches.map(m => m.source_id))];
    const { data: sources } = await supabase
        .from("library_sources")
        .select("id, title")
        .in("id", sourceIds);

    const sourceMap = Object.fromEntries(sources.map(s => [s.id, s.title]));

    matches.forEach((m, i) => {
        console.log(`\n[Match ${i+1}] Source: ${sourceMap[m.source_id]}`);
        console.log(`Snippet: ${m.chunk_text.substring(0, 200)}...`);
    });
}

main();
