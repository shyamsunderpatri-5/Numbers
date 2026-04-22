const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  console.log("Check if .env.local exists in the project root.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BLACKLIST = [
  "Life Path",
  "Expression Number",
  "Destiny Number",
  "Soul Urge",
  "reduces to",
  "digit sum"
];

async function scan() {
  console.log("🔍 Starting Keyword Contamination Scan on library_embeddings...");
  
  let totalContaminated = 0;

  for (const keyword of BLACKLIST) {
    console.log(`Scanning for: "${keyword}"...`);
    
    // Note: library_embeddings table has 'chunk_text' column in some versions, 
    // or 'content' in others. Based on chaldean-purifier, it's 'chunk_text'.
    const { data, error, count } = await supabase
      .from('library_embeddings')
      .select('id, chunk_text, source_id', { count: 'exact' })
      .ilike('chunk_text', `%${keyword}%`);

    if (error) {
      // Fallback to 'content' if 'chunk_text' fails
      const { data: data2, error: error2, count: count2 } = await supabase
        .from('library_embeddings')
        .select('id, content, source_id', { count: 'exact' })
        .ilike('content', `%${keyword}%`);
      
      if (error2) {
        console.error(`Error scanning for ${keyword}:`, error2.message);
        continue;
      }
      
      handleMatches(keyword, data2, count2);
      totalContaminated += count2;
    } else {
      handleMatches(keyword, data, count);
      totalContaminated += count;
    }
  }

  function handleMatches(keyword, matches, count) {
    if (count > 0) {
      console.log(`⚠️ FOUND ${count} matches for "${keyword}"!`);
      matches.slice(0, 2).forEach(match => {
        const text = match.chunk_text || match.content || "";
        console.log(`   - ID: ${match.id} (Source: ${match.source_id})`);
        console.log(`     Snippet: ...${text.substring(0, 100)}...`);
      });
    } else {
      console.log(`✅ No matches for "${keyword}".`);
    }
  }

  console.log("\n-----------------------------------");
  if (totalContaminated === 0) {
    console.log("💎 PURIFICATION SUCCESS: 0 contaminated chunks found in active database.");
  } else {
    console.log(`🚨 CONTAMINATION DETECTED: ${totalContaminated} total chunks must be purged or re-purified.`);
    console.log("These are likely residues from old sources that were deactivated but not yet deleted.");
  }
}

scan();
