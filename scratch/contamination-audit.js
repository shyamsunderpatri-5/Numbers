const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const BLACKLIST = [
    "Life Path",
    "Expression Number",
    "Destiny Number",
    "Soul Urge",
    "Personality Number",
    "reduce to",
    "digit sum",
    "master number"
];

async function main() {
    console.log("🔍 Scanning for Contamination (Rule 1.2)...");
    
    const contaminationSummary = {};
    
    // Get all active sources
    const { data: sources } = await supabase.from("library_sources").select("id, title").eq("is_active", true);

    for (const source of sources) {
        let sourceContaminationCount = 0;
        
        // Check for each blacklist item
        for (const word of BLACKLIST) {
            const { count, error } = await supabase
                .from("library_embeddings")
                .select("*", { count: 'exact', head: true })
                .eq("source_id", source.id)
                .ilike("chunk_text", `%${word}%`);
            
            if (count > 0) sourceContaminationCount += count;
        }
        
        contaminationSummary[source.title] = sourceContaminationCount;
    }

    console.log("\n📊 Contamination Audit Result (Pythagorean Keywords):");
    Object.entries(contaminationSummary).forEach(([title, count]) => {
        console.log(`- ${title}: ${count} chunks contaminated`);
    });
}

main().catch(console.error);
