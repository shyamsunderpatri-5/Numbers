const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { processSource } = require("./chaldean-purifier");

require('dotenv').config({ path: '../.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function purgeAllPurified() {
    console.log("🧹 Clearing old Purified Trait entries...");
    const { data: sources } = await supabase
        .from("library_sources")
        .select("id")
        .like("title", "%Purified Traits%");
    
    if (sources && sources.length > 0) {
        const ids = sources.map(s => s.id);
        await supabase.from("library_sources").delete().in("id", ids);
    }
}

async function runPurification() {
    await purgeAllPurified();

    // Source Files
    const sources = [
        { 
            file: "goodwin.txt", 
            title: "Matthew Goodwin Vol 1", 
            author: "Matthew Oliver Goodwin",
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22] 
        },
        { 
            file: "Numerology The Complete Guide Vol 2.txt", 
            title: "Matthew Goodwin Vol 2", 
            author: "Matthew Oliver Goodwin",
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22] 
        },
        { 
            file: "numerology-a-complete-guide-to-understanding.pdf", 
            title: "Hans Decoz Full Guide", 
            author: "Hans Decoz",
            isPdf: true,
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] 
        }
    ];

    for (const s of sources) {
        const filePath = path.join(__dirname, "../", s.file);
        
        // For each number, we try to extract traits from the source
        // In a real scenario, we'd split the file by "Number X" headers first
        // For now, the purifier handles segment-level rejection.
        for (const num of s.numbers) {
            await processSource(filePath, num, {
                title: s.title,
                author: s.author
            });
        }
    }
}

runPurification().catch(console.error);
