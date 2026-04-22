const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkStatus() {
    console.log("🔍 Checking RAG training status...");
    
    const { data: sources, error: sError } = await supabase
        .from("library_sources")
        .select("*");
    
    if (sError) {
        console.error("Error fetching sources:", sError.message);
        return;
    }

    console.log(`\n📚 Found ${sources.length} sources:`);
    for (const source of sources) {
        const { count, error: eError } = await supabase
            .from("library_embeddings")
            .select("*", { count: "exact", head: true })
            .eq("source_id", source.id);
        
        console.log(`- [${source.id}] ${source.title}: ${count || 0} chunks`);
    }
}

checkStatus();
