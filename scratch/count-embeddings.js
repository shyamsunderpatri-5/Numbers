const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
    // Count sources
    const { data: sources, error: sError } = await supabase
        .from("library_sources")
        .select("id, title, is_active");
    
    console.log("Sources Status:");
    sources.forEach(s => {
        console.log(`- ${s.title}: Active=${s.is_active}`);
    });

    // Count embeddings for new sources
    const sepharial = sources.find(s => s.title.includes("Full Depth"));
    const decoz = sources.find(s => s.title.includes("Key to Your Inner Self"));

    if (sepharial) {
        const { count, error } = await supabase
            .from("library_embeddings")
            .select("*", { count: 'exact', head: true })
            .eq("source_id", sepharial.id);
        console.log(`\nSepharial Embeddings Count: ${count}`);
    }

    if (decoz) {
        const { count, error } = await supabase
            .from("library_embeddings")
            .select("*", { count: 'exact', head: true })
            .eq("source_id", decoz.id);
        console.log(`Hans Decoz Embeddings Count: ${count}`);
    }
}

main();
