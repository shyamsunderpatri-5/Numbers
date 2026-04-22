const { createClient } = require("@supabase/supabase-js");
require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const DEACTIVATE_IDS = [
    "167d9d79-a45a-49a2-be64-42492903e472", // Linda Goodman
    "af180312-cbe4-4c63-8f2c-1a6e1f2731f6", // Chaldean Numerology Knowledge
    "71fb7544-0f98-43c8-8e7a-9291bdb06e8d", // Bostjan Lovrat
    "be9db0f2-9a90-428c-83cd-7fc607909630", // Goodwin Vol 2
    "ab2b023e-c206-4797-b9b2-ec182173a333", // Goodwin Vol 1
    "90ca2414-8e6a-461f-acc1-8fb59401efaa", // Goodwin Vol 2 Adv
    "b8c7f951-ebf0-43e6-bc4e-9f90d666299d"  // Decoz Full Guide
];

async function main() {
    console.log("🔥 THE PURGE: Deactivating contaminated Pythagorean sources...");
    
    const { data, error } = await supabase
        .from("library_sources")
        .update({ is_active: false })
        .in("id", DEACTIVATE_IDS);

    if (error) {
        console.error("Purge failure:", error);
        return;
    }

    console.log(`✅ Successfully deactivated ${DEACTIVATE_IDS.length} sources.`);
}

main().catch(console.error);
