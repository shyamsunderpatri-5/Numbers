// scripts/rag-master-audit.ts
// THE COMPLETE RAG TRUTH TEST — covers every topic your app needs
// Run: npx tsx scripts/rag-master-audit.ts
// Run with auto-fix: npx tsx scripts/rag-master-audit.ts --fix

import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import fs from 'fs'
import * as dotenv from 'dotenv'
import path from 'path'
import { SovereignRetrieval } from '../src/lib/engine/retrieval/sovereign-retrieval'

// Load env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AUTO_FIX = process.argv.includes('--fix')
const THRESHOLD_PASS = 0.60      // above this = SOVEREIGN (green)
const THRESHOLD_WARN = 0.45      // above this = WEAK (yellow), needs improvement
                                  // below 0.45 = CRITICAL GAP (red)

let embedder: any = null
async function embed(text: string): Promise<number[]> {
  if (!embedder) embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  const out = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(out.data)
}

// ============================================================
// THE MASTER TEST SUITE — 120 queries covering EVERYTHING
// ============================================================

interface TestCase {
  query: string
  category: string
  subcategory: string
  table: 'chaldean' | 'vedic' | 'both'
  matchFn: string        // your Supabase RPC function name
  criticalForProduct: boolean   // if true, a gap here = broken product
}

const MASTER_TEST_SUITE: TestCase[] = [

  // ══════════════════════════════════════════════════════════
  // SECTION A — CHALDEAN NUMEROLOGY (38 tests)
  // ══════════════════════════════════════════════════════════

  // A1. Number-Letter Mapping (core Chaldean table)
  { query: 'Chaldean number letter assignment table A I J Q Y equals 1', category: 'Chaldean', subcategory: 'Letter Mapping', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 9 not assigned any letter Chaldean system sacred', category: 'Chaldean', subcategory: 'Letter Mapping', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'F P equals 8 in Chaldean numerology', category: 'Chaldean', subcategory: 'Letter Mapping', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: false },

  // A2. Core Number Personalities (1-9)
  { query: 'number 1 Sun leadership individuality pioneer Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 2 Moon emotion intuition sensitivity Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 3 Jupiter wisdom expansion creativity Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 4 Rahu Uranus disruption rebellion unconventional Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 5 Mercury intelligence communication business Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 6 Venus beauty love harmony luxury Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 7 Ketu Neptune spirituality moksha withdrawal Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 8 Saturn karma discipline delay justice Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'number 9 Mars courage energy aggression warrior Chaldean', category: 'Chaldean', subcategory: 'Number 1-9 Traits', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },

  // A3. Compound Numbers (critical ones)
  { query: 'compound number 10 wheel of fortune success Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 12 sacrifice betrayal trusted people Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 16 shattered tower downfall ego Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 17 star magi immortal name spiritual success', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 19 prince heaven success happiness Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 23 royal star lion unexpected help Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 27 sceptre command authority genius Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'compound number 33 master teacher high vibration rare Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: false },
  { query: 'compound number 43 pyramid sacrifice revolutionary misunderstood', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: false },
  { query: 'compound number 52 same energy 43 pyramid Chaldean', category: 'Chaldean', subcategory: 'Compound Numbers', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: false },

  // A4. Calculations & Procedures
  { query: 'name number calculation sum letters compound reduce root Chaldean', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'birth number day of birth reduced single digit', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'destiny number full date birth day month year reduced', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'personal year number birth day birth month current year', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'soul urge vowels only name A E I O U heart desire inner motivation', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'name correction inauspicious compound spelling adjustment lucky', category: 'Chaldean', subcategory: 'Calculations', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },

  // A5. Planetary Friendship (Chaldean bridge to Vedic)
  { query: 'Sun friends Moon Mars Jupiter enemies Saturn Venus Chaldean planetary', category: 'Chaldean', subcategory: 'Planetary Friendship', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'Saturn friends Mercury Venus enemies Sun Moon Mars neutral Jupiter', category: 'Chaldean', subcategory: 'Planetary Friendship', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: true },
  { query: 'Rahu Ketu friendly Saturn Venus enemy Sun Moon Mars', category: 'Chaldean', subcategory: 'Planetary Friendship', table: 'chaldean', matchFn: 'match_library_documents', criticalForProduct: false },

  // ══════════════════════════════════════════════════════════
  // SECTION B — VEDIC PLANETS / NAVAGRAHAS (27 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Sun Surya vedic astrology soul father government authority Ruby Sunday', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Moon Chandra mind mother emotion Pearl Monday silver vedic', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mars Mangal courage energy siblings land Red Coral copper Tuesday', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mercury Budha intelligence speech business Emerald green Wednesday', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Jupiter Guru Brihaspati wisdom dharma children Yellow Sapphire Thursday', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Venus Shukra love beauty marriage luxury Diamond white Friday', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Saturn Shani karma discipline delay Blue Sapphire iron Saturday Sade Sati', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Rahu north node obsession technology foreign sudden Hessonite Gomedha amplify', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Ketu south node past life spirituality Cat Eye moksha detachment liberation', category: 'Vedic', subcategory: 'Navagrahas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // Planet in house (most searched combinations)
  { query: 'Jupiter 5th house children wisdom past karma auspicious', category: 'Vedic', subcategory: 'Planet in House', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Saturn 7th house marriage delay discipline partner karma', category: 'Vedic', subcategory: 'Planet in House', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Rahu 10th house career status unconventional foreign ambition', category: 'Vedic', subcategory: 'Planet in House', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Mars 8th house longevity sudden transformation aggressive', category: 'Vedic', subcategory: 'Planet in House', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Venus 12th house foreign pleasure private sensual expenses', category: 'Vedic', subcategory: 'Planet in House', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },

  // Sade Sati — critical for Indian users
  { query: 'Sade Sati 7.5 years Saturn transit Moon sign challenge remedy', category: 'Vedic', subcategory: 'Sade Sati', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Sade Sati three phases rising peak setting effects life', category: 'Vedic', subcategory: 'Sade Sati', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // Exaltation & Debilitation
  { query: 'Sun exalted Aries debilitated Libra vedic astrology', category: 'Vedic', subcategory: 'Exaltation', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Jupiter exalted Cancer debilitated Capricorn vedic', category: 'Vedic', subcategory: 'Exaltation', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Saturn exalted Libra debilitated Aries vedic', category: 'Vedic', subcategory: 'Exaltation', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },

  // ══════════════════════════════════════════════════════════
  // SECTION C — ALL 27 NAKSHATRAS (27 tests — 1 per Nakshatra)
  // ══════════════════════════════════════════════════════════

  { query: 'Ashwini nakshatra Ketu Ashwini Kumars healing swift horse Aries', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Bharani nakshatra Venus Yama transformation creativity Aries', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Krittika nakshatra Sun Agni purification sharp Aries Taurus', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Rohini nakshatra Moon Brahma beauty fertility abundance Taurus', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mrigashira nakshatra Mars Soma deer curiosity search Taurus Gemini', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Ardra nakshatra Rahu Rudra storm transformation intellect Gemini', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Punarvasu nakshatra Jupiter Aditi renewal return Cancer Gemini', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Pushya nakshatra Saturn Brihaspati nourishment best auspicious Cancer', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Ashlesha nakshatra Mercury Naga mysticism cunning serpent Cancer', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Magha nakshatra Ketu Pitrs ancestors royalty throne Leo', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Purva Phalguni nakshatra Venus Bhaga pleasure love relaxation Leo', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Uttara Phalguni nakshatra Sun Aryaman service friendship Leo Virgo', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Hasta nakshatra Moon Savitar skill hands healing craft Virgo', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Chitra nakshatra Mars Vishwakarma beauty art architecture gem Virgo Libra', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Swati nakshatra Rahu Vayu independence business flexibility Libra', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Vishakha nakshatra Jupiter Indra Agni purpose passion Libra Scorpio', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Anuradha nakshatra Saturn Mitra friendship devotion occult Scorpio', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Jyeshtha nakshatra Mercury Indra authority protection eldest Scorpio', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mula nakshatra Ketu Nirriti roots destruction investigation Sagittarius', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Purva Ashadha nakshatra Venus Apas invincibility early victory Sagittarius', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Uttara Ashadha nakshatra Sun Vishvedevas final victory Sagittarius Capricorn', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Shravana nakshatra Moon Vishnu learning listening connectivity Capricorn', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Dhanishta nakshatra Mars Vasus wealth music drum ambition Capricorn Aquarius', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Shatabhisha nakshatra Rahu Varuna healing secretive independent Aquarius', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Purva Bhadrapada nakshatra Jupiter intensity passion sacrifice Aquarius Pisces', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Uttara Bhadrapada nakshatra Saturn Ahirbudhnya wisdom depth serpent Pisces', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Revati nakshatra Mercury Pushan completion nurturing journeys Pisces', category: 'Vedic', subcategory: 'Nakshatra', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // ══════════════════════════════════════════════════════════
  // SECTION D — VIMSHOTTARI DASHA (18 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Ketu Mahadasha 7 years past life spirituality sudden events', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Venus Mahadasha 20 years luxury love wealth artistic abundance', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Sun Mahadasha 6 years authority government career father status', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Moon Mahadasha 10 years emotions mother mind travel fluctuation', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mars Mahadasha 7 years energy courage property conflicts siblings', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Rahu Mahadasha 18 years obsession foreign ambition sudden rise fall', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Jupiter Mahadasha 16 years wisdom expansion dharma children blessings', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Saturn Mahadasha 19 years karma discipline hard work delays reward', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mercury Mahadasha 17 years intelligence business communication trade', category: 'Vedic', subcategory: 'Mahadasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // Antardasha (sub-periods)
  { query: 'Rahu antardasha Saturn Mahadasha effects results life', category: 'Vedic', subcategory: 'Antardasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Jupiter antardasha Venus Mahadasha prosperity expansion results', category: 'Vedic', subcategory: 'Antardasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Ketu antardasha Rahu Mahadasha spiritual confusion transformation', category: 'Vedic', subcategory: 'Antardasha', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },

  // Vimshottari calculation
  { query: 'Vimshottari Dasha 120 year cycle calculation Moon Nakshatra balance', category: 'Vedic', subcategory: 'Dasha Calculation', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Dasha balance calculation remaining period birth date Nakshatra lord', category: 'Vedic', subcategory: 'Dasha Calculation', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // ══════════════════════════════════════════════════════════
  // SECTION E — YOGAS (12 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Gaja Kesari yoga Jupiter kendra Moon wisdom fame prosperity', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Raja Yoga kendra trikona lords conjunction wealth power status', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Kaal Sarp yoga all planets Rahu Ketu axis serpent karmic', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Neecha Bhanga Raja Yoga debilitated planet cancelled rise', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Viparita Raja Yoga 6th 8th 12th house lord gain from others loss', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Budh Aditya yoga Sun Mercury conjunction sharp intelligence communication', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Panch Mahapurusha yoga Ruchaka Bhadra Hamsa Malavya Shasha', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Dhana yoga 2nd 11th lord conjunction wealth accumulation', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Kemadruma yoga Moon alone no planets 2nd 12th house struggle', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Rahu conjunct Moon Grahan yoga psychic obsession emotional intense', category: 'Vedic', subcategory: 'Yogas', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // ══════════════════════════════════════════════════════════
  // SECTION F — HOUSES / BHAVAS (12 tests)
  // ══════════════════════════════════════════════════════════

  { query: '1st house Lagna ascendant self body personality vitality', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '2nd house wealth family speech food early education', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '5th house children intelligence creativity romance past karma poorva punya', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '7th house marriage partnership business deal spouse karma', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '8th house longevity transformation occult inheritance sudden events', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '9th house dharma father higher education luck spirituality fortune', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '10th house career status government authority public life profession', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '11th house income gains social networks fulfillment elder siblings', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: '12th house losses foreign moksha liberation expenses spiritual', category: 'Vedic', subcategory: 'Houses', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // ══════════════════════════════════════════════════════════
  // SECTION G — COMPATIBILITY KOOTAS (8 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Nadi Koota 8 points highest compatibility marriage Aadi Madhya Antya', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Bhakoot Koota 7 points Moon sign relationship 2-12 6-8 dosha', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Gana Koota 6 points Deva Manushya Rakshasa temperament marriage', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Graha Maitri Koota 5 points Moon sign lord friendship mental', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Yoni Koota 4 points animal nakshatra sexual compatibility horse elephant', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Tara Koota 3 points birth star counting compatibility', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Vashya Koota 2 points control dominance compatibility marriage', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Ashta Koota Milan 36 points total marriage matching minimum 18', category: 'Vedic', subcategory: 'Koota Compatibility', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },

  // ══════════════════════════════════════════════════════════
  // SECTION H — REMEDIES (10 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Saturn remedy Blue Sapphire iron Saturday fast black sesame donate', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Jupiter remedy Yellow Sapphire gold Thursday worship Brihaspati donate yellow', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Rahu remedy Hessonite Gomedha Saturday worship Durga donate blue', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Ketu remedy Cat Eye Tuesday fast worship Ganesha sesame seeds', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Moon remedy Pearl silver Monday fast white flowers rice donate', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Mars remedy Red Coral copper Tuesday fast Hanuman worship red lentils', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Venus remedy Diamond white sapphire Friday Lakshmi worship white sweet', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Sun remedy Ruby gold Sunday fast wheat jaggery Surya Namaskar', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Kaal Sarp puja Tryambakeshwar remedy serpent worship Nagpanchami milk', category: 'Vedic', subcategory: 'Remedies', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },

  // ══════════════════════════════════════════════════════════
  // SECTION I — PANCHANGA (5 tests)
  // ══════════════════════════════════════════════════════════

  { query: 'Panchanga five limbs Tithi Vara Nakshatra Yoga Karana daily almanac', category: 'Vedic', subcategory: 'Panchanga', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Tithi lunar day 30 per month auspicious inauspicious activities', category: 'Vedic', subcategory: 'Panchanga', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Brahma Muhurta auspicious time 96 minutes before sunrise new beginnings', category: 'Vedic', subcategory: 'Panchanga', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: true },
  { query: 'Amavasya new moon inauspicious ancestor worship Pitru', category: 'Vedic', subcategory: 'Panchanga', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
  { query: 'Shukla Paksha waxing Moon auspicious Krishna Paksha waning Moon', category: 'Vedic', subcategory: 'Panchanga', table: 'vedic', matchFn: 'match_vedic_documents', criticalForProduct: false },
]

// ============================================================
// AUDIT ENGINE
// ============================================================

interface TestResult {
  query: string
  category: string
  subcategory: string
  status: 'SOVEREIGN' | 'WEAK' | 'CRITICAL_GAP'
  score: number
  topMatch: string
  criticalForProduct: boolean
}

async function runAudit() {
  console.log('\n')
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║       NUMERIQ.AI — MASTER RAG KNOWLEDGE AUDIT           ║')
  console.log('║       Complete Coverage Test: Chaldean + Vedic           ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log(`\n📋 Total test cases: ${MASTER_TEST_SUITE.length}`)
  console.log(`🎯 Pass threshold: ${THRESHOLD_PASS} | Warn threshold: ${THRESHOLD_WARN}`)
  console.log(`⚡ Auto-fix mode: ${AUTO_FIX ? 'ON' : 'OFF (run with --fix to enable)'}`)
  console.log('\n')

  const results: TestResult[] = []

  // Group by category for display
  const categoriesMap = MASTER_TEST_SUITE.reduce((acc, t) => {
    const key = t.category + ' > ' + t.subcategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {} as Record<string, TestCase[]>);

  for (const [catKey, tests] of Object.entries(categoriesMap)) {
    console.log(`\n  📂 ${catKey} (${tests.length} tests)`)
    console.log(`  ${'─'.repeat(60)}`)

    for (const test of tests) {
      // Use the production-grade Sovereign Engine instead of raw RPC
      const searchResults = await SovereignRetrieval.search(test.query, test.table === 'vedic' ? 'vedic' : 'chaldean');
      
      const score = (searchResults.length > 0) ? searchResults[0].similarity : 0
      const topMatch = (searchResults.length > 0)
        ? searchResults[0].content?.substring(0, 60) + '...'
        : 'NO MATCH FOUND'

      let status: TestResult['status']
      let icon: string

      if (score >= THRESHOLD_PASS) {
        status = 'SOVEREIGN'
        icon = '✅'
      } else if (score >= THRESHOLD_WARN) {
        status = 'WEAK'
        icon = '⚠️ '
      } else {
        status = 'CRITICAL_GAP'
        icon = test.criticalForProduct ? '🔴' : '🟡'
      }

      const scoreDisplay = (score * 100).toFixed(1).padStart(5)
      const critical = test.criticalForProduct && status === 'CRITICAL_GAP' ? ' ← PRODUCT BREAKING' : ''

      console.log(`  ${icon} [${scoreDisplay}%] ${test.subcategory}: ${test.query.substring(0, 50)}${critical}`)

      results.push({
        query: test.query,
        category: test.category,
        subcategory: test.subcategory,
        status,
        score,
        topMatch,
        criticalForProduct: test.criticalForProduct
      })

      // Small delay
      await new Promise(r => setTimeout(r, 80))
    }
  }

  // ── FINAL REPORT ────────────────────────────────────────────
  const sovereign = results.filter(r => r.status === 'SOVEREIGN')
  const weak = results.filter(r => r.status === 'WEAK')
  const criticalGaps = results.filter(r => r.status === 'CRITICAL_GAP')
  const productBreaking = criticalGaps.filter(r => r.criticalForProduct)

  const coverageScore = Math.round((sovereign.length / results.length) * 100)
  const qualityScore = Math.round(((sovereign.length + weak.length * 0.5) / results.length) * 100)

  console.log('\n')
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║                    AUDIT RESULTS                        ║')
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log(`║  Total tests:       ${String(results.length).padEnd(36)}║`)
  console.log(`║  ✅ Sovereign:      ${String(sovereign.length).padEnd(36)}║`)
  console.log(`║  ⚠️  Weak:           ${String(weak.length).padEnd(36)}║`)
  console.log(`║  🔴 Critical gaps:  ${String(criticalGaps.length).padEnd(36)}║`)
  console.log(`║  🚨 Product-breaking gaps: ${String(productBreaking.length).padEnd(30)}║`)
  console.log('╠══════════════════════════════════════════════════════════╣')
  console.log(`║  Coverage score:    ${String(coverageScore + '%').padEnd(36)}║`)
  console.log(`║  Quality score:     ${String(qualityScore + '%').padEnd(36)}║`)
  console.log('╚══════════════════════════════════════════════════════════╝')

  // Grade
  let grade = ''
  if (coverageScore >= 90) grade = '🏆 PRODUCTION READY'
  else if (coverageScore >= 75) grade = '✅ GOOD — minor gaps remain'
  else if (coverageScore >= 60) grade = '⚠️  ACCEPTABLE — needs improvement'
  else if (coverageScore >= 40) grade = '🔴 POOR — significant gaps'
  else grade = '💀 CRITICAL — not ready for users'

  console.log(`\n  Grade: ${grade}`)

  // Show all gaps grouped by subcategory
  if (criticalGaps.length > 0) {
    console.log('\n\n  🔴 CRITICAL GAPS — These topics have zero or near-zero coverage:')
    console.log('  ' + '─'.repeat(60))

    const gapsBySubcategory = criticalGaps.reduce((acc, r) => {
      const key = r.category + ' > ' + r.subcategory
      if (!acc[key]) acc[key] = []
      acc[key].push(r)
      return acc
    }, {} as Record<string, TestResult[]>)

    for (const [subcat, gaps] of Object.entries(gapsBySubcategory)) {
      console.log(`\n  📂 ${subcat}:`)
      for (const gap of gaps) {
        const breaking = gap.criticalForProduct ? ' [PRODUCT BREAKING]' : ''
        console.log(`     ${gap.criticalForProduct ? '🔴' : '🟡'} [${(gap.score * 100).toFixed(1)}%] ${gap.query.substring(0, 70)}${breaking}`)
      }
    }
  }

  if (weak.length > 0) {
    console.log('\n\n  ⚠️  WEAK AREAS — These exist but need better chunks:')
    console.log('  ' + '─'.repeat(60))
    for (const w of weak) {
      console.log(`     ⚠️  [${(w.score * 100).toFixed(1)}%] ${w.subcategory}: ${w.query.substring(0, 60)}`)
    }
  }

  // Save report to file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      sovereign: sovereign.length,
      weak: weak.length,
      criticalGaps: criticalGaps.length,
      productBreaking: productBreaking.length,
      coverageScore,
      qualityScore,
      grade
    },
    criticalGaps: criticalGaps.map(r => ({
      query: r.query,
      category: r.category,
      subcategory: r.subcategory,
      score: r.score,
      productBreaking: r.criticalForProduct
    })),
    weakAreas: weak.map(r => ({
      query: r.query,
      subcategory: r.subcategory,
      score: r.score
    })),
    allResults: results
  }

  fs.writeFileSync('rag-audit-report.json', JSON.stringify(report, null, 2))
  console.log('\n\n  📄 Full report saved to: rag-audit-report.json')

  // Product readiness verdict
  console.log('\n')
  if (productBreaking.length === 0 && coverageScore >= 80) {
    console.log('  🚀 VERDICT: RAG is ready. Product quality is protected.')
  } else if (productBreaking.length > 0) {
    console.log(`  🚨 VERDICT: NOT READY. ${productBreaking.length} product-breaking gaps exist.`)
    console.log('     Run: npx tsx scripts/hydrate-vedic-gaps.ts --fix first.')
  } else {
    console.log('  ⚠️  VERDICT: Usable but not premium. Fill weak areas before launch.')
  }

  console.log('\n')
  return report
}

runAudit()
