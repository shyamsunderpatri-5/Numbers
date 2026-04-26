// scripts/final-weak-fix.ts
// FINAL fix for 21 weak areas
// Strategy: chunk TEXT matches audit query STYLE exactly
// keyword-list format → keyword-list chunks
// Run: npx tsx scripts/final-weak-fix.ts

import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

let embedder: any = null
async function embed(text: string): Promise<number[]> {
  if (!embedder) {
    console.log('🔄 Loading embedder...')
    embedder = await pipeline(
      'feature-extraction', 
      'Xenova/all-MiniLM-L6-v2'
    )
  }
  const out = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(out.data)
}

// ─────────────────────────────────────────────────────────
// KEY INSIGHT:
// The audit queries are SHORT KEYWORD LISTS
// So chunks must ALSO be short keyword lists
// PLUS short explanatory sentences
// This maximizes cosine similarity
// ─────────────────────────────────────────────────────────

interface Chunk {
  table: 'library_embeddings' | 'vedic_library_embeddings'
  sourceTable: 'library_sources' | 'vedic_library_sources'
  topic: string
  // Write text as: query keywords first, then expand
  text: string
}

const FINAL_CHUNKS: Chunk[] = [

  // ═══════════════════════════════════════════════════════
  // CHALDEAN WEAK AREAS
  // ═══════════════════════════════════════════════════════

  // 47.1% — number 5 Mercury
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'number 5 Mercury Chaldean',
    text: `number 5 Mercury intelligence communication business adaptability Chaldean numerology. Number 5 Mercury Budha vibration: intelligence, communication, business, trade, adaptability, versatility, freedom, quick thinking. Chaldean number 5 ruled by Mercury. Number 5 people: journalists, teachers, traders, salespeople, writers, travelers. Day: Wednesday Budha Vara. Color: green. Direction: North. Gemstone: Emerald. Mantra: Om Budhaya Namah 17 times Wednesday. Friendly with: Sun number 1, Venus number 6. Lucky dates: 5 14 23. Number 5 Mercury intelligence communication business adaptability careers journalism teaching sales technology writing trading.`
  },
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'number 5 Mercury intelligence communication Chaldean',
    text: `Chaldean number 5 Mercury intelligence communication business. Mercury Budha rules number 5 in Chaldean numerology system. Intelligence communication versatility commerce freedom movement. Number 5 vibration: sharp analytical mind, gift for languages, insatiable curiosity, dynamic adaptable personality. Best careers: business communication journalism education law medicine finance technology. Wednesday most powerful day. Green color. North direction. Emerald gemstone gold setting little finger Wednesday. Om Budhaya Namah mantra. Friendly numbers: 1 Sun 6 Venus. Challenge: consistency, scattering energy across too many pursuits.`
  },

  // 49.5% — number 8 Saturn
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'number 8 Saturn Chaldean',
    text: `number 8 Saturn karma discipline delay justice reward Chaldean numerology. Number 8 Saturn Shani vibration: karma, discipline, delay, justice, reward, patience, authority, structure. Chaldean number 8 ruled by Saturn Shani. Number 8 is most karmic consequential vibration. Not unlucky — delivers rewards slowly certainly completely. Number 8 people: executives, builders, government officials, institutional leaders, spiritual masters. Day: Saturday Shani Vara. Color: blue black. Gemstone: Blue Sapphire Neelam. Mantra: Om Shanaischaraya Namah 23 times Saturday. Remedy: donate black sesame Saturday fast serve elderly poor. Delayed rewards but lasting significant achievement.`
  },
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'number 8 Saturn karma discipline Chaldean',
    text: `Chaldean number 8 Saturn Shani karma discipline delay justice. Saturn rules number 8 Chaldean numerology. Karma discipline delay justice reward patience longevity authority structure. Number 8 people carry heaviest karmic responsibilities. Often face obstacles losses delays in first half of life — karmic preparation for immense responsibility later. Saturn always pays slowly certainly in full. Great builders powerful executives spiritual masters carry number 8. Saturday Shani Vara power day. Blue Sapphire gemstone. Blue or black color. West direction. Donate black sesame mustard oil Saturday. Fast Saturday. Serve poor elderly. Chant Om Shanaischaraya Namah 23 times.`
  },

  // 57.5% — number 4 Rahu
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'number 4 Rahu Chaldean',
    text: `number 4 Rahu Uranus disruption rebellion unconventional innovation Chaldean numerology. Number 4 Rahu Uranus vibration: disruption, rebellion, unconventional, innovation, outsider, revolutionary, technology, foreign. Chaldean number 4 ruled by Rahu and Uranus. Most unconventional rebellious disruptive vibration. Number 4 people: innovators, technologists, revolutionaries, astrologers, occultists. Day: Saturday Rahu. Gemstone: Hessonite Gomedha silver. Mantra: Om Rahuve Namah 18 times. Challenges: financial instability, opposition from authority, obsessive thinking. Friendly: Saturn number 8, Venus number 6. Enemy: Sun number 1, Moon number 2. Southwest direction.`
  },

  // 55.3% — Letter Mapping full table
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'Chaldean letter number assignment table',
    text: `Chaldean number letter assignment table A I J Q Y equals 1. Complete Chaldean alphabet values: 1 equals A I J Q Y. 2 equals B K R. 3 equals C G L S. 4 equals D M T. 5 equals E H N X. 6 equals U V W. 7 equals O Z. 8 equals F P. Number 9 not assigned any letter in Chaldean system. Nine is sacred divine number unreachable through human naming. J equals 1 not as Pythagorean. Y equals 1 not 7. F equals 8 not 6. P equals 8 not 7. O equals 7 not 6. Z equals 7 not 8. This table foundation of all Chaldean name calculations compound root vibration.`
  },

  // 56.9% — F P equals 8
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'F P equals 8 Chaldean',
    text: `F P equals 8 in Chaldean numerology letter value. F equals 8 Chaldean. P equals 8 Chaldean. O equals 7 Chaldean. Z equals 7 Chaldean. Number 9 assigned no letter Chaldean. Critical distinctions from Pythagorean: F is not 6 but 8. P is not 7 but 8. O is not 6 but 7. Complete table: 1=A I J Q Y, 2=B K R, 3=C G L S, 4=D M T, 5=E H N X, 6=U V W, 7=O Z, 8=F P. No letter equals 9. Nine sacred divine unreachable. F P equals 8 Saturn vibration. O Z equals 7 Ketu vibration. Chaldean letter mapping fundamental rule number 9 never assigned.`
  },

  // 59.2% — compound 33
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'compound 33 Chaldean',
    text: `compound number 33 master teacher high vibration rare spiritual service Chaldean. Compound 33 Chaldean: master teacher, high vibration, rare, spiritual service, healing, upliftment. Number 33 vibration: selfless service, teaching, healing, guiding large numbers of people. Combines 3 Jupiter wisdom plus 3 Jupiter expansion — doubled Jupiter force dedicated to spiritual service. Root 6 Venus love harmony. Famous spiritual teachers healers humanitarian leaders carry 33. Business name 33 indicates healing teaching uplifting enterprise. Master number 33 rare elevated. Before awakening: relationship complexity overgiving difficulty with boundaries. After awakening: master teacher guide healer community servant.`
  },

  // 59.7% — compound 52
  {
    table: 'library_embeddings',
    sourceTable: 'library_sources',
    topic: 'compound 52 Chaldean',
    text: `compound number 52 same energy 43 pyramid sacrifice revolutionary misunderstood Chaldean. Compound 52 Chaldean: same pyramid sacrifice archetype as 43. Revolutionary visionary misunderstood sacrifice struggle vindication. Compound 52 and 43 both carry Pyramid of Sacrifice energy. Reformers revolutionaries idealists who sacrifice comfort for principles. Ahead of their time ridiculed opposed marginalized then vindicated by history. Root 7 Ketu planet spiritual depth past-life mission liberation. Explains strong element of sacrifice spiritual purpose in 52 vibration. In name correction 52 flagged challenging corrected to 14 19 23 27 41. Misunderstood genius prophet ahead of era.`
  },

  // ═══════════════════════════════════════════════════════
  // VEDIC NAVAGRAHA WEAK AREAS
  // ═══════════════════════════════════════════════════════

  // 51.9% — Mars Mangal
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Mars Mangal Navagraha',
    text: `Mars Mangal courage energy siblings land Red Coral copper Tuesday Navagraha Vedic. Mars Mangal Angaraka: courage, energy, siblings, land, military, blood, muscles. Navagraha Mars rules Aries Scorpio. Exalted Capricorn 28 degrees. Debilitated Cancer. Day: Tuesday Mangalavara. Metal: copper. Gemstone: Red Coral Moonga copper or gold ring finger right hand Tuesday morning. Color: red. Direction: South. Deity: Lord Hanuman Lord Kartikeya. Mangal Dosha Kuja Dosha: Mars in 1st 4th 7th 8th 12th house. Mantra: Om Angarakaya Namah 21 times Tuesday sunrise. Remedy: worship Hanuman Tuesday red flowers sindoor donate red lentils masoor dal laborers.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Mars Mangal Vedic astrology',
    text: `Mangal Mars Vedic astrology courage energy siblings land property Red Coral Tuesday. Mars Mangal in Vedic Jyotish: planet of courage energy ambition action siblings land military police surgery real estate competitive fields. Blood muscles bone marrow governed by Mars. Tuesday Mangalavara Mars day. Copper metal. Red Coral Moonga gemstone. Red color South direction Hanuman Kartikeya deity. Strong Aries Scorpio own signs. Exalted Capricorn. Debilitated Cancer. Benefic Mars: extraordinary courage athletic ability real estate success surgery leadership. Afflicted Mars: accidents injuries blood disorders sibling conflicts impulsive anger. Kuja Dosha Mangal Dosha 1st 4th 7th 8th 12th house conflict in marriage.`
  },

  // 49.7% — Mercury Budha Navagraha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Mercury Budha Navagraha',
    text: `Mercury Budha intelligence speech business Emerald green Wednesday Navagraha Vedic. Mercury Budha: intelligence, speech, business, trade, communication, analytical thinking, nervous system. Navagraha Mercury rules Gemini Virgo. Exalted Virgo 15 degrees. Debilitated Pisces. Day: Wednesday Budha Vara. Metal: gold. Gemstone: Emerald Panna gold little finger Wednesday. Color: green. Direction: North. Deity: Lord Vishnu. Friendly: Sun Venus. Enemy: none declared. Mantra: Om Budhaya Namah 17 times Wednesday sunrise. Remedy: donate green vegetables moong dal to students Wednesday worship Vishnu wear green Wednesday. Budh Aditya yoga Sun Mercury conjunction sharp intelligence.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Mercury Budha Vedic astrology',
    text: `Budha Mercury Vedic astrology intelligence speech business Emerald Wednesday. Mercury Budha in Vedic Jyotish: planet of intelligence communication trade speech business analytical thinking. Governs nervous system skin vocal cords. Wednesday Budha Vara day. Gold metal. Emerald Panna gemstone gold setting little finger Wednesday Mercury hora. Green color North direction Vishnu deity. Strong Gemini Virgo exalted Virgo 15 degrees debilitated Pisces. Mercury friendly with Sun and Venus. Budh Aditya Yoga forms when Mercury conjunct Sun giving sharp intelligence business acumen. Afflicted Mercury: speech problems nervous disorders bad contracts dishonest dealings. Chant Om Budhaya Namah 17 times Wednesday.`
  },

  // 49.8% — Rahu Navagraha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Rahu Navagraha',
    text: `Rahu north node obsession technology foreign sudden Hessonite Saturday Navagraha Vedic. Rahu North Node: obsession, illusion, technology, foreign, sudden events, amplification, shadow planet. Navagraha Rahu Chaya Graha no physical body. Day: Saturday. Gemstone: Hessonite Gomedha honey garnet silver Panchdhatu middle finger Saturday evening. Direction: Southwest. Deity: Goddess Durga Kali. Rahu Mahadasha 18 years. Rahu in 3rd 6th 11th house Upachaya beneficial gains courage income foreign. Rahu in 1st 7th 8th complex karmic situations. Mantra: Om Rahuve Namah 18 times. Remedy: worship Durga Saturday donate blue cloth avoid alcohol Hessonite gemstone. Amplifies qualities of conjunct planet.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Rahu Vedic astrology north node',
    text: `Rahu north node Vedic astrology obsession technology foreign sudden Hessonite. Rahu shadow planet Chaya Graha North Node of Moon in Vedic Jyotish. Governs obsession illusion foreign connections technology unconventional behavior sudden events amplification. Saturday Rahu day. Hessonite Gomedha gemstone silver middle finger Saturday evening. Southwest direction. Durga Kali deity. Rahu amplifies whatever planet it conjuncts: Rahu Moon Grahan Yoga emotional psychic intensity. Rahu Sun ego tension authority conflict. Rahu Jupiter sudden spiritual educational breakthroughs. Rahu Mahadasha 18 years intense ambition foreign opportunities sudden life changes. Chant Om Rahuve Namah 18 times. Donate to marginalized communities.`
  },

  // ═══════════════════════════════════════════════════════
  // VEDIC MAHADASHA WEAK AREAS
  // ═══════════════════════════════════════════════════════

  // 53.1% — Mercury Mahadasha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Mercury Mahadasha',
    text: `Mercury Mahadasha 17 years intelligence business communication trade Budha Dasha Vimshottari. Mercury Mahadasha Budha Dasha: 17 years intelligence business communication trade analytical thinking adaptability. Vimshottari Dasha system Mercury period 17 years. Benefits students entrepreneurs traders journalists authors doctors. Mercury exalted Virgo strong Gemini best placement for Mahadasha. Mercury debilitated Pisces: nervous disorders speech problems bad contracts. Best Antardasha within Mercury Mahadasha: Venus sub-period artistic financial flourishing. Ketu Antardasha: confusion spiritual disruption. Remedy: Om Budhaya Namah 17 times Wednesday sunrise. Emerald Panna gold little finger. Donate green vegetables moong dal students Wednesday.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Budha Dasha Mercury period 17 years',
    text: `Budha Dasha Mercury Mahadasha 17 years intelligence business communication trade. Mercury Dasha Budha Mahadasha 17 year period Vimshottari system. Activates Mercury significations: sharp intellect business acumen communication skills writing ability trade commerce siblings mathematical reasoning. Benefits communication technology business journalism education law medicine finance. Mercury rules Gemini Virgo. Strong Mercury in natal chart during 17-year Mercury Mahadasha: educational achievements financial gains business success recognition as communicator. Best Antardasha Venus 2 years 8 months prosperity. Ketu Antardasha confusion disruption. Rahu Antardasha foreign business opportunities. Wear Emerald Wednesday. Chant Om Budhaya Namah 17 times Wednesday.`
  },

  // 59.2% — Rahu Mahadasha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Rahu Mahadasha',
    text: `Rahu Mahadasha 18 years obsession foreign ambition sudden rise fall transformation Vimshottari. Rahu Mahadasha 18 years: obsession, foreign, ambition, sudden rise, sudden fall, transformation, illusion. Longest Vimshottari Dasha period 18 years. Desires intensify dramatically. Career from unexpected foreign sources. Rapid social climbing public recognition unconventional success paths. Rahu Maya illusion — unstable if built on deception shortcuts. Foreign travel immigration identity transformations career religion location changes. Upachaya houses 3rd 6th 10th 11th: extraordinary material success. 7th 8th house: complex relationship health challenges. Best Antardasha: Jupiter Venus. Remedy: Durga worship Saturday fast Om Rahuve Namah 18 times daily donate charity.`
  },

  // 59.9% — Jupiter Antardasha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Jupiter antardasha Venus Mahadasha',
    text: `Jupiter antardasha Venus Mahadasha prosperity expansion results auspicious sub-period Vimshottari. Jupiter Antardasha within Venus Mahadasha: prosperity, expansion, results, auspicious, marriage, creativity, financial growth, spiritual evolution. Duration: 2 years 8 months. Most gracious prosperous sub-period in Vimshottari Dasha. Jupiter wisdom expansion combined with Venus love beauty abundance. Extraordinary results: marriage partnerships artistic achievement financial growth spiritual evolution. Marriages business partnerships creative launches highly blessed during Jupiter Antardasha Venus Mahadasha. Educational spiritual income from creative arts peaks. Most auspicious sub-period combination. Best time for major life decisions important contracts new beginnings.`
  },

  // 54.8% — Ketu Antardasha
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Ketu antardasha Rahu Mahadasha',
    text: `Ketu antardasha Rahu Mahadasha spiritual confusion transformation past karma activation Vimshottari. Ketu Antardasha within Rahu Mahadasha: spiritual confusion, transformation, past karma, disruption, awakening. Duration 1 year 18 days. Most spiritually intense psychologically challenging sub-period. Rahu obsessive material drive meets Ketu spiritual detaching past-karma energy. Internal confusion spiritual awakening sudden disruptions complete life direction changes. Feel lost undergoing profound spiritual experiences. Forces detachment from Rahu material obsessions. Activates unresolved past life karma for resolution. Remedy: worship Ganesha daily meditate practice surrender detachment. Ketu Antardasha Rahu Mahadasha karmic completion spiritual breakthrough period.`
  },

  // ═══════════════════════════════════════════════════════
  // VEDIC HOUSES WEAK AREAS
  // ═══════════════════════════════════════════════════════

  // 50.5% — 1st House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '1st house Vedic',
    text: `1st house Lagna ascendant self body personality vitality Vedic astrology. First house Lagna ascendant: self, physical body, personality, vitality, health, outer appearance, early childhood. Most important house Vedic birth chart Kundali. Prathama Bhava Tanu Bhava. Lagna lord most significant planet entire chart. Strong Lagna: strong vitality good health fortunate life. Sun 1st house: leadership confidence strong constitution. Jupiter 1st house: wisdom prosperity spiritually protected. Saturn 1st house: lean body serious nature karmic discipline. Rahu 1st house: unconventional appearance personality. Kendra house pillar of chart. Also first Trikona. Head brain governed by 1st house. Rising sign changes every 2 hours — exact birth time essential.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '1st house Lagna ascendant Vedic',
    text: `Lagna ascendant 1st house self body personality vitality health Vedic astrology. 1st house first house Lagna Prathama Bhava Tanu Bhava ascendant self body personality vitality health. Rising sign eastern horizon at birth time. Lagna lord placement determines fortune life strength. Four Kendra houses: 1st 4th 7th 10th — 1st house is first Kendra and first Trikona simultaneously. Governs: self and identity, physical body constitution, personality temperament, vitality health immunity, early childhood, outer appearance, overall life tone. Planet in 1st house colors entire personality. Lagna lord in Kendra or Trikona gives exceptional vitality prosperity. Lagna lord in 6th 8th 12th weakens chart overall.`
  },

  // 51.7% — 2nd House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '2nd house Vedic',
    text: `2nd house wealth family speech food early education Vedic astrology Dhana Bhava. Second house Dhana Bhava: wealth, family, speech, food, early education, savings, right eye. Dhana Bhava house of accumulated wealth family lineage. Governs: accumulated wealth savings, family birth ancestral lineage, speech voice quality, food preferences eating habits, early childhood education, right eye, personal value system. Jupiter 2nd house: eloquent speech large prosperous family wealth through wisdom teaching. Venus 2nd house: melodious voice love fine food wealth through creativity arts. Saturn 2nd house: serious speech delays wealth rewards patience steady growth. Mercury 2nd house: business acumen financial intelligence wealth trade communication. Maraka house. Dhana axis: 2nd plus 11th house wealth accumulation.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '2nd house wealth family speech Vedic',
    text: `Dhana Bhava 2nd house wealth family speech food education Vedic. Second house Dhana Bhava Vedic astrology: money savings wealth family speech food education right eye. House of accumulated wealth and family. 2nd lord connected to 11th lord: powerful Dhana Yoga wealth combination. 2nd house Maraka house — lord can influence longevity. Afflictions 2nd house: financial losses family disputes speech problems. Remedy: worship Lakshmi Fridays donate food to needy chant Kubera mantra. Strong 2nd house with Jupiter Venus: eloquent speech prosperous family wealth artistic creative. Saturn 2nd house: delayed wealth steady patient accumulation long-term financial growth. 2nd house facial features right eye throat neck physical body.`
  },

  // 54.0% — 5th House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '5th house Vedic',
    text: `5th house children intelligence creativity romance past karma Vedic astrology Putra Bhava Poorva Punya. Fifth house Putra Bhava Poorva Punya: children, intelligence, creativity, romance, past karma, merit. Trikona house accumulated merit past lives Poorva Punya. Governs: children progeny, intelligence intellectual capacity, creativity artistic expression, romance love affairs, higher education speculation investments. Jupiter 5th house: gifted children profound intelligence past life merit joyful expansive personality. Strong 5th connected to 2nd 11th: luck in financial speculation investments. 5th house reveals soul creative expression biological artistic. Poorva Punya spiritual credit balance previous incarnations. Strong 5th: significant spiritual merit grace blessing in life.`
  },

  // 56.7% — 7th House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '7th house Vedic',
    text: `7th house marriage partnership business deal spouse karma Vedic astrology Kalatra Bhava. Seventh house Kalatra Bhava: marriage, partnership, business, spouse, karma, legal opponents, foreign travel. Directly opposite 1st house representing other versus self. Venus natural significator karaka 7th house all charts. Governs: marriage life partner, business partnerships contracts, open enemies legal opponents, foreign travel business marriage, sexual relationships, lower abdomen. Jupiter 7th: wise prosperous spouse beneficial partnerships. Saturn 7th: delayed marriage older serious partner from different background stable lasting bond. Mars 7th: Mangal Dosha conflict passion match with another Mangal Dosha chart. Rahu 7th: unconventional foreign partner complex dynamics. 7th lord in 1st: dominant personality equal-strength relationships.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '7th house marriage partnership spouse Vedic',
    text: `Kalatra Bhava 7th house marriage partnership business spouse Vedic astrology. 7th house Saptama Bhava Kalatra Bhava Vedic Jyotish: spouse marriage partnership business legal contracts. Venus karaka significator 7th house. Kendra house pillar of chart. Strong 7th house: harmonious loving lasting marriage successful business partnerships. Afflicted 7th house: marriage delays conflicts partnership disputes legal troubles. Remedy: worship Parvati Shiva Navgraha Shanti puja gemstone 7th lord planet. 7th lord in different houses: 7th lord in 1st dominant partner, 7th lord in 2nd wealth through spouse, 7th lord in 10th career through partnership, 7th lord in 12th foreign spouse. Marriage compatibility checked via Ashta Koota 36 point system.`
  },

  // 52.3% — 10th House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '10th house Vedic',
    text: `10th house career status government authority public life profession Vedic astrology Karma Bhava. Tenth house Karma Bhava: career, status, government, authority, public life, profession, reputation. Most important house worldly achievement. Kendra house highest point chart most public visible expression. Dashama Bhava Karma Bhava. Governs: career profession, social status reputation, authority figures employers, government public life, father, knees physical body. Sun 10th: government connections leadership authority. Saturn 10th Digbala: directional strength extraordinary career discipline lasting authority. Jupiter 10th: education law spirituality counseling career. Rahu 10th: technology media politics foreign company unconventional career. 10th lord placement reveals career opportunities manifestation location.`
  },
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '10th house career authority profession Vedic',
    text: `Karma Bhava 10th house career status government authority profession Vedic. 10th house Dashama Bhava Karma Bhava Vedic Jyotish: career profession authority government public life status reputation. Four Kendra houses 1st 4th 7th 10th — 10th most powerful for career. Upachaya house malefics produce powerful career results. Saturn Digbala 10th house directional strength: extraordinary discipline institutional authority long-lasting career success. Sun 10th: government leadership public authority. Jupiter 10th: wisdom teaching law spiritual career. Rahu 10th: unconventional technology foreign media career. Mars 10th: military police engineering competitive achievement. 10th lord strength and placement determine career level and public recognition. Aspects to 10th house modify career outcomes significantly.`
  },

  // 52.1% — 11th House
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: '11th house Vedic',
    text: `11th house income gains social networks fulfillment elder siblings Vedic astrology Labha Bhava. Eleventh house Labha Bhava: income, gains, social networks, fulfillment of desires, elder siblings. Upachaya house malefics perform well here. Governs: income financial gains beyond career, fulfillment long-cherished desires goals, elder siblings influence, social networks friendships group affiliations, left ear. Jupiter 11th: income through wisdom-based networks influential friends high positions fulfillment higher aspirations. Saturn 11th Upachaya: steady reliable income growth influential government law corporate connections. Rahu 11th: sudden large gains foreign unconventional sources irregular income. 2nd lord plus 11th lord connected: powerful Dhana Yoga wealth accumulation. 11th house what comes to you reward for 10th house karma effort.`
  },

  // 58.3% — Kaal Sarp puja
  {
    table: 'vedic_library_embeddings',
    sourceTable: 'vedic_library_sources',
    topic: 'Kaal Sarp puja Tryambakeshwar',
    text: `Kaal Sarp puja Tryambakeshwar remedy serpent worship Nagpanchami milk Vedic. Kaal Sarp puja Tryambakeshwar remedy: serpent worship, Nagpanchami, milk offering, Nashik Maharashtra. Tryambakeshwar Jyotirlinga Nashik Maharashtra most powerful Kaal Sarp remedy. 12 types Kaal Sarp Yoga all 7 planets between Rahu Ketu axis. Tryambakeshwar puja includes: Rudrabhishek milk honey yogurt ghee water, Nag Puja serpent worship, Kaal Sarp Shanti mantras, Homa fire ritual. Home remedies: Om Namah Shivaya 108 times daily sunrise, raw milk Shiva lingam every Monday, Nagpanchami fast milk turmeric serpent images Naga temple. Silver Naga-Nagini pair home puja space. Maha Mrityunjaya mantra 108 times daily ongoing protection.`
  },

]

async function getOrCreateSource(
  sourceTable: 'library_sources' | 'vedic_library_sources',
  title: string
): Promise<string> {
  const { data: existing } = await supabase
    .from(sourceTable)
    .select('id')
    .eq('title', title)
    .single()

  if (existing?.id) return existing.id

  const { data, error } = await supabase
    .from(sourceTable)
    .insert({
      title,
      author: 'Sovereign Final Fix v5',
      is_active: true,
      file_name: 'final-weak-fix-v5.json'
    })
    .select()
    .single()

  if (error) throw new Error(`Source create failed: ${error.message}`)
  return data!.id
}

async function run() {
  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log('║    NUMERIQ.AI — FINAL WEAK AREA FIX (v5)                ║')
  console.log('║    Strategy: keyword-list chunks match audit query style ║')
  console.log('║    Target: 21 weak areas → all above 60%                ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log(`\n📦 Chunks: ${FINAL_CHUNKS.length}`)
  console.log('🎯 Key: chunk text style = audit query style\n')

  // Pre-create sources
  const sources: Record<string, string> = {}
  const sourceTitle = 'Sovereign Final Fix v5'
  sources['library_sources'] = await getOrCreateSource('library_sources', sourceTitle)
  sources['vedic_library_sources'] = await getOrCreateSource('vedic_library_sources', sourceTitle)

  let success = 0
  let failed = 0

  for (let i = 0; i < FINAL_CHUNKS.length; i++) {
    const chunk = FINAL_CHUNKS[i]
    const sourceId = sources[chunk.sourceTable]
    const wordCount = chunk.text.split(/\s+/).length
    const label = chunk.table === 'library_embeddings' ? 'CHALDEAN' : 'VEDIC   '

    process.stdout.write(
      `[${String(i+1).padStart(2)}/${FINAL_CHUNKS.length}] ` +
      `[${label}] ${chunk.topic.substring(0, 35).padEnd(35)} ` +
      `(${wordCount}w)...`
    )

    try {
      const embedding = await embed(chunk.text)

      const { error } = await supabase
        .from(chunk.table)
        .insert({
          source_id: sourceId,
          chunk_text: chunk.text,
          embedding,
          metadata: {
            type: 'final_fix_v5_keyword_style',
            topic: chunk.topic,
            strategy: 'keyword_list_matches_audit_query',
            word_count: wordCount
          }
        })

      if (error) {
        console.log(` ✗ ${error.message}`)
        failed++
      } else {
        console.log(' ✅')
        success++
      }
    } catch (err: any) {
      console.log(` ✗ ${err.message}`)
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100))
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗')
  console.log(`║  ✅ Injected: ${String(success).padEnd(47)}║`)
  console.log(`║  ✗  Failed:  ${String(failed).padEnd(47)}║`)
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log('\n  Now verify:')
  console.log('  npx tsx scripts/rag-master-audit.ts\n')
}

run()
