const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

require('dotenv').config({ path: '../.env.local' });
const ontology = JSON.parse(fs.readFileSync(path.join(__dirname, "trait-ontology.json"), "utf8"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    const { pipeline } = await import("@xenova/transformers");
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

/**
 * Filter 1: Hard Reject (Rule 1.2)
 */
function isContaminated(text) {
  return ontology.blacklist_keywords.some(word => 
    new RegExp(`\\b${word}\\b`, "i").test(text)
  );
}

/**
 * Filter 2: Normalization (Rule 2.2)
 */
function normalizeTraits(text) {
  let cleaned = text;
  Object.entries(ontology.system_bias_replacements).forEach(([bias, replacement]) => {
    cleaned = cleaned.replace(new RegExp(`\\b${bias}\\b`, "gi"), replacement);
  });
  return cleaned;
}

/**
 * Filter 3: Planetary Binding Validation (Rule 3.4 & 5.2)
 */
async function validateTraits(traits, number) {
  const baseNumber = number > 9 ? (number % 9 || 9) : number; 
  // Note: Chaldean base is 1-8, but 9 exists as spiritual. 
  // Rule 3.4 defines mappings for 1-8 and 7 (Neptune). 
  // We'll map according to the ontology.
  
  const rules = ontology.planetary_influences[baseNumber.toString()];
  if (!rules) return traits; // No rules found for this number

  const validTraits = traits.filter(trait => {
    const lowerTrait = trait.toLowerCase();
    const isAllowed = rules.allowed_traits.some(allowed => lowerTrait.includes(allowed));
    const isForbidden = rules.forbidden_traits.some(forbidden => lowerTrait.includes(forbidden));
    return isAllowed && !isForbidden;
  });

  return validTraits;
}

/**
 * Atomic Trait Extraction (Rule 2.1)
 * Simple implementation: split by punctuation and extract adjectives/tokens
 */
function extractAtomicTraits(text) {
  const tokens = text.match(/\b\w+\b/g) || [];
  // For a "good product" we filter for actually meaningful trait words 
  // that exist in our ontology's "allowed" list across ANY planet.
  const allAllowed = Object.values(ontology.planetary_influences)
    .flatMap(p => p.allowed_traits);
  
  return [...new Set(tokens.filter(t => allAllowed.includes(t.toLowerCase())))];
}

const { PDFParse } = require('pdf-parse');

async function extractTextFromPdf(filePath) {
    console.log(`📄 Extracting text from PDF: ${path.basename(filePath)}`);
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
}

async function processSource(filePath, targetNumber, metadata) {
  console.log(`\n🪐 Purifying Source for Number ${targetNumber}: ${metadata.title}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`   ⚠️ File skip: ${filePath} not found.`);
    return;
  }

  let rawText = "";
  if (filePath.endsWith(".pdf")) {
    rawText = await extractTextFromPdf(filePath);
  } else {
    rawText = fs.readFileSync(filePath, 'utf-8');
  }

  // Improved segmentation: Look for content specifically relating to the target number
  // We search for "NUMBER X" or "Number X" or "# X" but keep it broad enough 
  // to catch the surrounding context without catching the whole book.
  const numRegex = new RegExp(`Number\\s*${targetNumber}\\b`, "i");
  const sections = rawText.split(/\n(?=(?:Chapter|Number|Chart)\s+\d+)/i);
  const targetSections = sections.filter(s => numRegex.test(s));

  if (targetSections.length === 0) {
    console.log(`   ⚠️ No sections found for Number ${targetNumber}.`);
    return;
  }

  const harvestedTraits = [];

  for (let section of targetSections) {
    const segments = section.split(/\n\s*\n/);
    for (let segment of segments) {
        if (isContaminated(segment)) continue; 

        const normalized = normalizeTraits(segment);
        const atomic = extractAtomicTraits(normalized);
        const validated = await validateTraits(atomic, targetNumber);

        harvestedTraits.push(...validated);
    }
  }

  const uniqueTraits = [...new Set(harvestedTraits)];
  console.log(`   ✅ Harvested ${uniqueTraits.length} planetary-aligned traits.`);

  if (uniqueTraits.length === 0) {
    console.log("   ⚠️ No unique traits harvested. Skipping ingestion.");
    return;
  }

  // Create Source Record
  const { data: source, error: sError } = await supabase
    .from("library_sources")
    .insert({
      title: `${metadata.title} (Purified Traits for ${targetNumber})`,
      author: metadata.author,
      file_name: path.basename(filePath),
      is_active: true
    })
    .select()
    .single();

  if (sError) throw sError;

  const generator = await getEmbedder();
  
  const finalChunk = `trait: ${uniqueTraits.join(", ")}; mapped_to: ${targetNumber} (Chaldean)`;
  const output = await generator(finalChunk, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data);

  await supabase.from("library_embeddings").insert({
    source_id: source.id,
    chunk_text: finalChunk,
    chunk_index: 0,
    embedding: embedding
  });

  console.log(`🎉 SUCCESS: ${metadata.title} Traits for ${targetNumber} indexed.`);
}

module.exports = { processSource };
