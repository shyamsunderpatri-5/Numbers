const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
    const { data, error } = await supabase
        .from("library_sources")
        .select("id, title, file_name, is_active");
    
    if (error) {
        console.error("Error fetching sources:", error);
        return;
    }
    
    console.log("Current Sources:");
    data.forEach(s => {
        console.log(`- ID: ${s.id} | Title: ${s.title} | File: ${s.file_name} | Active: ${s.is_active}`);
    });
}

main();
