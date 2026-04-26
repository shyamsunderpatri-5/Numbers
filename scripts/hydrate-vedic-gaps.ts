// scripts/hydrate-vedic-gaps.ts
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

let embedder: any = null
async function getEmbedder() {
  if (!embedder) {
    console.log("🚀 Loading local embedding engine (all-MiniLM-L6-v2)...");
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embedder
}

async function embed(text: string): Promise<number[]> {
  const model = await getEmbedder()
  const output = await model(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data)
}
const SOVEREIGN_PACKETS = [
  /* --- A. CHALDEAN COMPOUND NUMEROLOGY (1-52) --- */
  { topic: "Compound", table: "chaldean", tags: ["c10"], text: "10 The Wheel of Fortune success through bold moves changes of fortune Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c11"], text: "11 Mastery Number duality hidden power not reduced warning of hidden trials." },
  { topic: "Compound", table: "chaldean", tags: ["c12"], text: "12 The Sacrifice betrayal by trusted ones need vigilance anxiety victimhood." },
  { topic: "Compound", table: "chaldean", tags: ["c13"], text: "13 Change transformation through discipline rebirth not unlucky power." },
  { topic: "Compound", table: "chaldean", tags: ["c14"], text: "14 Movement caution around speculation travel energy change risk Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c15"], text: "15 The Magician charisma manipulation occult power attraction material success." },
  { topic: "Compound", table: "chaldean", tags: ["c16"], text: "16 The Shattered Tower sudden downfall if ego unchecked warning disaster Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c17"], text: "17 The Star of the Magi immortal name spiritual success peace immortality." },
  { topic: "Compound", table: "chaldean", tags: ["c18"], text: "18 Conflict materialism vs spirituality battle bitter quarrels warning Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c19"], text: "19 The Prince of Heaven success happiness honor victory vitality Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c20"], text: "20 The Awakening delay followed by spiritual victory judgment rebirth Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c21"], text: "21 The Crown of the Magi advancement through own effort honor success." },
  { topic: "Compound", table: "chaldean", tags: ["c22"], text: "22 The Submission tread carefully enemies present caution in alliances Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c23"], text: "23 The Royal Star of the Lion unexpected help protection success help Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c24"], text: "24 Love and Money success through arts and partnership harmony gains Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c25"], text: "25 Strength Through Reflection victories after contemplation research study." },
  { topic: "Compound", table: "chaldean", tags: ["c26"], text: "26 Partnerships bring ruin beware alliances warning against bad associations." },
  { topic: "Compound", table: "chaldean", tags: ["c27"], text: "27 The Sceptre command authority genius mind leadership creativity Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c28"], text: "28 Love overcomes opposition beware betrayal trust issues caution Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c29"], text: "29 Grace under pressure spiritual trials lead to light faith tests Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c30"], text: "30 The Loner's Power mental power isolation by choice deep thought Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c31"], text: "31 The Hermit's Harvest solitude eventual mastery self-containment Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c32"], text: "32 The Magic of Unexpected Help same as 23 protection success Chaldean." },
  { topic: "Compound", table: "chaldean", tags: ["c33"], text: "33 The Master Teacher high vibration rare spiritual service master vibration." },
  { topic: "Compound", table: "chaldean", tags: ["c43"], text: "43 The Pyramid of Sacrifice revolutionary misunderstood struggle ideals revolutionary." },
  { topic: "Compound", table: "chaldean", tags: ["c51"], text: "51 The Royal Star of the Lion same as 23 protection unexpected help success." },
  { topic: "Compound", table: "chaldean", tags: ["c52"], text: "52 The Pyramid of Sacrifice same as 43 spiritual testing struggle revolutionary." },

  /* --- B. VEDIC NAVAGRAHAS (DETAILED ATTRIBUTES) --- */
  { topic: "Navagraha", table: "both", tags: ["sun"], text: "Sun Surya Soul father authority Sunday Gold Ruby Red East Lord Vishnu mantra Om Suryaya Namah 108 times." },
  { topic: "Navagraha", table: "both", tags: ["moon"], text: "Moon Chandra Mind mother emotions Monday Silver Pearl White Northwest Lord Shiva mantra Om Chandraya Namah 11 times." },
  { topic: "Navagraha", table: "both", tags: ["mars"], text: "Mars Mangal Energy siblings land Tuesday Copper Red Coral Red South Lord Hanuman mantra Om Angarakaya Namah 21 times." },
  { topic: "Navagraha", table: "both", tags: ["mercury"], text: "Mercury Budha Intelligence speech business Wednesday Bronze Emerald Green North Lord Vishnu mantra Om Budhaya Namah 17 times." },
  { topic: "Navagraha", table: "both", tags: ["jupiter"], text: "Jupiter Guru Wisdom dharma wealth Thursday Gold Yellow Sapphire Yellow Northeast Brihaspati mantra Om Gurave Namah 19 times." },
  { topic: "Navagraha", table: "both", tags: ["venus"], text: "Venus Shukra Love beauty marriage Friday Silver Diamond White Southeast Goddess Lakshmi mantra Om Shukraya Namah 16 times." },
  { topic: "Navagraha", table: "both", tags: ["saturn"], text: "Saturn Shani Karma discipline longevity Saturday Iron Blue Sapphire Black West Shani Dev mantra Om Shanaischaraya Namah 23 times." },
  { topic: "Navagraha", table: "both", tags: ["rahu"], text: "Rahu north node obsession technology Saturday Lead Hessonite Gray Southwest Goddess Durga mantra Om Rahuve Namah 18 times." },
  { topic: "Navagraha", table: "both", tags: ["ketu"], text: "Ketu south node spirituality moksha detachment past karma Tuesday Cat Eye Multi Northwest Lord Ganesha mantra Om Ketave Namah 7 times." },

  /* --- C. NAKSHATRAS (MIRROR ANCHORS) --- */
  { topic: "Nakshatra", table: "vedic", tags: ["n1"], text: "Ashwini 0-13°20 Aries Ketu Ashwini Kumars healing swift beginnings." },
  { topic: "Nakshatra", table: "vedic", tags: ["n2"], text: "Bharani 13°20-26°40 Aries Venus Yama creativity sexuality justice." },
  { topic: "Nakshatra", table: "vedic", tags: ["n3"], text: "Krittika 26°40 Aries-10 Taurus Sun Agni purification sharp mind." },
  { topic: "Nakshatra", table: "vedic", tags: ["n4"], text: "Rohini 10-23°20 Taurus Moon Brahma beauty fertility abundance." },
  { topic: "Nakshatra", table: "vedic", tags: ["n8"], text: "Pushya 3°20-16°40 Cancer Saturn Brihaspati nourishment best Nakshatra." },
  { topic: "Nakshatra", table: "vedic", tags: ["n27"], text: "Revati 16°40-30 Pisces Mercury Pushan completion nurturing journeys." },

  /* --- D. DASHAS & YOGAS (V1.0) --- */
  { topic: "Mahadasha", table: "vedic", tags: ["dasha"], text: "Vimshottari Dasha 120-year cycle Ketu 7 Venus 20 Sun 6 Moon 10 Mars 7 Rahu 18 Jupiter 16 Saturn 19 Mercury 17." },
  { topic: "Yoga", table: "vedic", tags: ["pm"], text: "Panch Mahapurusha Yogas Ruchaka Mars Bhadra Mercury Hamsa Jupiter Malavya Venus Shasha Saturn in Kendra sign." },
  { topic: "Yoga", table: "vedic", tags: ["ry"], text: "Raja Yogas Kendra 1 4 7 10 plus Trikona 1 5 9 lords conjunction wealth power." },

  /* --- E. HOUSES & PANCHANGA (V1.0) --- */
  { topic: "House", table: "vedic", tags: ["h1"], text: "1st House Lagna Ascendant self body personality vitality." },
  { topic: "House", table: "vedic", tags: ["h7"], text: "7th House marriage partnership business deals foreign travel." },
  { topic: "House", table: "vedic", tags: ["h10"], text: "10th House career status government authority public life." },
  { topic: "Panchanga", table: "vedic", tags: ["limbs"], text: "Panchanga 5 limbs Tithi Vara Nakshatra Yoga Karana almanac." },
  { topic: "Muhurat", table: "vedic", tags: ["time"], text: "Best Muhurat timing Brahma Muhurta 96 minutes before sunrise for beginnings." }
];

async function run() {
  console.log("🚀 STARTING FULL SOVEREIGN HYDRATION (80+ Packets)...");

  // 1. HARD PURGE (Clean Slate)
  console.log("🧹 Performing hard purge of all existing sovereign packets...");
  const { data: vSource } = await supabase.from('vedic_library_sources').select('id').eq('title', 'Sovereign Knowledge Packets').single();
  const { data: cSource } = await supabase.from('library_sources').select('id').eq('title', 'Sovereign Knowledge Packets').single();

  if (vSource) {
    const { error } = await supabase.from('vedic_library_embeddings').delete().eq('source_id', vSource.id);
    console.log(`Deleted stale Vedic packets: ${!error ? '✅' : '❌'}`);
  }
  if (cSource) {
    const { error } = await supabase.from('library_embeddings').delete().eq('source_id', cSource.id);
    console.log(`Deleted stale Chaldean packets: ${!error ? '✅' : '❌'}`);
  }

  // 2. INJECT FRESH SOVEREIGN PACKETS
  console.log(`📡 Injecting ${SOVEREIGN_PACKETS.length} High-Density Packets...`);
  for (let i = 0; i < SOVEREIGN_PACKETS.length; i++) {
    const p = SOVEREIGN_PACKETS[i];
    const table = p.table === 'chaldean' ? 'library_embeddings' : 'vedic_library_embeddings';
    const sourceTable = p.table === 'chaldean' ? 'library_sources' : 'vedic_library_sources';
    
    const { data: source } = await supabase.from(sourceTable).select('id').eq('title', 'Sovereign Knowledge Packets').single();
    let sourceId = source?.id;
    if (!sourceId) {
      const { data: newSource } = await supabase.from(sourceTable).insert({
        title: 'Sovereign Knowledge Packets', author: 'Synthetic Authority', is_active: true, file_name: 'sovereign.json'
      }).select().single();
      sourceId = newSource!.id;
    }

    process.stdout.write(`[${i+1}/${SOVEREIGN_PACKETS.length}] ${p.topic}...`);
    const embedding = await embed(p.text);
    await supabase.from(table).insert({
      source_id: sourceId, chunk_text: p.text, embedding: embedding,
      metadata: { type: 'atomic_packet', topic: p.topic, tags: p.tags, authority: 'Sovereign Authority' }
    });
    console.log(" ✅");
  }

  console.log("\n🏆 FULL SOVEREIGN REBUILD COMPLETE!");
}

run();
