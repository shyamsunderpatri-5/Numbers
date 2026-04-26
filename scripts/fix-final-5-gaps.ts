// scripts/fix-final-5-gaps.ts
// Fixes the 5 remaining product-breaking gaps + 29 weak areas
// NO PURGE — only adds missing chunks
// Run: npx tsx scripts/fix-final-5-gaps.ts
// Then: npx tsx scripts/rag-master-audit.ts

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
    console.log('🔄 Loading embedding engine...')
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  const out = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(out.data)
}

interface Chunk {
  text: string
  silo: 'chaldean' | 'vedic'
  topic: string
  tags: string[]
}

// ─────────────────────────────────────────────────────────────
// TARGETED CHUNKS — Only for the 5 critical gaps + weak areas
// Each chunk is 180-250 words for maximum embedding strength
// ─────────────────────────────────────────────────────────────

const FIX_CHUNKS: Chunk[] = [

  // ══════════════════════════════════════════════════════════
  // CRITICAL GAP 1 — 1st House Lagna [was 98% → now 41.7%]
  // Root cause: purge deleted the working chunk. Adding richer one.
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: '1st House Lagna',
    tags: ['1st_house', 'lagna', 'ascendant', 'self', 'body', 'personality', 'vitality', 'first_house'],
    text: `The 1st house in Vedic astrology is called the Lagna or Ascendant — it is the most important house in the entire birth chart and the foundation of all astrological interpretation. The 1st house (Prathama Bhava) governs the self, physical body, overall personality, health and vitality, outer appearance, early childhood, and the general direction and tone of the entire life. The Lagna is the zodiac sign rising on the eastern horizon at the exact moment of birth. It changes approximately every two hours, which is why the exact birth time is essential for accurate Kundali calculation. The lord of the 1st house (Lagna lord) is the most significant planet in the entire chart — its placement by house and sign determines the overall strength, fortune, and life direction of the native. A strong Lagna lord in a Kendra (1st, 4th, 7th, 10th) or Trikona (1st, 5th, 9th) house gives exceptional vitality, good health, and a fortunate life. The 1st house governs the head and brain in the physical body. Sun placed in the 1st house gives leadership, confidence, and strong constitution. Jupiter in the 1st house (especially for Cancer or Sagittarius Lagna) gives wisdom, prosperity, and a spiritually protected life. Saturn in the 1st house gives a lean body, serious nature, and a life of karmic discipline. Rahu in the 1st house creates an unconventional appearance and personality that defies social norms. The Lagna sign determines which planets are benefic (friendly) and which are malefic (challenging) for that specific person — making Lagna the master key of the entire Vedic chart interpretation.`
  },

  // ══════════════════════════════════════════════════════════
  // CRITICAL GAP 2 — 2nd House Dhana Bhava [was 32.2% → 26.3%]
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: '2nd House Dhana Bhava',
    tags: ['2nd_house', 'dhana_bhava', 'wealth', 'family', 'speech', 'food', 'education', 'second_house'],
    text: `The 2nd house in Vedic astrology is called Dhana Bhava — the house of accumulated wealth, family, and speech. It is one of the most practically important houses as it governs material resources and financial security. The 2nd house significations include: accumulated wealth and savings, the family of birth and ancestral lineage, speech and voice quality, food preferences and eating habits, early childhood education, the right eye, and one's personal value system. The 2nd house is directly connected to the 11th house (income) — together they form the Dhana axis that determines the native's financial trajectory. When the 2nd lord and 11th lord are in conjunction, trine, or mutual aspect, a powerful Dhana Yoga (wealth combination) is formed. Jupiter placed in the 2nd house gives eloquent speech, a large and prosperous family, and wealth through wisdom and teaching. Venus in the 2nd house gives a melodious singing voice, love of fine food, and wealth through creative and artistic pursuits. Saturn in the 2nd house causes speech difficulties or a serious, measured speaking style, and delays in wealth accumulation — but rewards patience with steady long-term financial growth. Mercury in the 2nd house gives business acumen, sharp financial intelligence, and wealth through communication and trade. The 2nd house is one of the Maraka houses (1-2 houses from the 7th) — its lord can become a Maraka planet capable of influencing longevity. Afflictions to the 2nd house indicate financial losses, family disputes, or problems with speech. Remedy: worship Goddess Lakshmi on Fridays, donate food to the needy, and chant Kubera mantra for wealth activation.`
  },

  // ══════════════════════════════════════════════════════════
  // CRITICAL GAP 3 — 7th House Kalatra Bhava [was 63.5% → 43.5%]
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: '7th House Kalatra Bhava',
    tags: ['7th_house', 'kalatra_bhava', 'marriage', 'partnership', 'spouse', 'business', 'seventh_house'],
    text: `The 7th house in Vedic astrology is called Kalatra Bhava — the house of marriage, life partner, business partnerships, and one-on-one relationships of all kinds. It is directly opposite the 1st house (Lagna), representing the "other" in contrast to the "self." The 7th house governs marriage and the spouse, business partnerships and contracts, open enemies and legal opponents, foreign travel (especially for business or marriage), sexual relationships, and the lower abdomen in the physical body. The condition of the 7th house, its lord, and the planets placed within it reveal the nature of the life partner, the timing and quality of marriage, and the success of business collaborations. Venus is the natural significator (Karaka) of the 7th house for all charts — a strong Venus indicates a loving, beautiful, and harmonious marriage. Jupiter in the 7th house gives a wise, prosperous, and spiritually inclined spouse and brings beneficial partnerships. Saturn in the 7th house delays marriage significantly and often brings a partner who is older, serious, or from a different social background — but once committed, the marriage is stable and enduring. Mars in the 7th house creates Mangal Dosha (Kuja Dosha), which can bring conflict and passion into marriage — ideally matched with another Mars-afflicted chart. Rahu in the 7th house brings an unconventional or foreign partner and complex relationship dynamics. The 7th house lord placed in the 1st house indicates a self-focused or dominant personality who attracts relationships of equal strength. Remedy for 7th house afflictions: worship Goddess Parvati and Lord Shiva together, perform Navgraha Shanti puja, and wear gemstones prescribed by the 7th lord's planet.`
  },

  // ══════════════════════════════════════════════════════════
  // CRITICAL GAP 4 — 10th House Karma Bhava [was 94% → 32.5%]
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: '10th House Karma Bhava',
    tags: ['10th_house', 'karma_bhava', 'career', 'status', 'government', 'authority', 'profession', 'tenth_house'],
    text: `The 10th house in Vedic astrology is called Karma Bhava — the house of career, professional life, status, authority, and one's contribution to society. It is one of the four Kendra houses (1st, 4th, 7th, 10th) — the pillars of the chart — and is considered one of the most powerful and important houses for worldly achievement. The 10th house governs career and profession, social status and reputation, relationship with authority figures and employers, government and public life, the father (in some traditions), and the knees in the physical body. The 10th house is the highest point of the chart and represents the native's most public and visible expression in the world. The condition of the 10th house, its lord, and the planet sitting in it directly determines the nature of the career, the level of professional achievement, and the degree of public recognition. Sun in the 10th house is exceptionally powerful — it gives government connections, leadership positions, and authority in the chosen field. Saturn in the 10th house (especially for Taurus or Libra Lagna) creates a Digbala Saturn — Saturn achieves directional strength in the 10th house, giving extraordinary career discipline and long-lasting authority. Jupiter in the 10th house gives a career in education, law, spirituality, or counseling. Rahu in the 10th house creates a career in unconventional fields — technology, media, politics, or foreign companies. The 10th lord's placement by house reveals where career opportunities manifest. Planets aspecting the 10th house significantly modify career outcomes. Remedy for career struggles: worship Lord Ganesha before any new career endeavor, perform Karma Yoga (selfless service), and strengthen the 10th lord's planet through appropriate gemstone and mantra.`
  },

  // ══════════════════════════════════════════════════════════
  // CRITICAL GAP 5 — Mercury Mahadasha [stuck at 44.2%]
  // The previous chunk may have gone to wrong table. Adding stronger version.
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Mercury Mahadasha Budha Dasha',
    tags: ['mercury_mahadasha', 'budha_dasha', 'budha_mahadasha', '17_years', 'intelligence', 'business', 'communication', 'trade'],
    text: `Mercury Mahadasha (Budha Dasha) lasts 17 years in the Vimshottari Dasha system and is the period governed by Mercury — the planet of intelligence, communication, trade, analytical thinking, and adaptability. Mercury rules Gemini and Virgo and governs all forms of mental and commercial activity. During Mercury Mahadasha, the native's intellect sharpens dramatically, opportunities in business, writing, teaching, technology, law, accounting, and communication multiply. The mind becomes highly active — sometimes excessively so, leading to overthinking or nervous anxiety if Mercury is afflicted. Mercury Mahadasha is particularly beneficial for students, entrepreneurs, traders, journalists, authors, doctors, and anyone in the field of intellectual or commercial exchange. If Mercury is well-placed in the birth chart — especially in Gemini, Virgo, or exalted — this 17-year period brings extraordinary educational achievements, financial gains through business, and recognition as a skilled communicator or advisor. If Mercury is afflicted — debilitated in Pisces, conjunct malefics like Rahu, Ketu, or Mars — the period can bring nervous disorders, speech problems, dishonest business dealings, and financial instability through bad contracts. The sub-periods (Antardashas) within Mercury Mahadasha that are most beneficial: Venus Antardasha brings artistic and financial flourishing; Jupiter Antardasha brings wisdom-based expansion. Most challenging: Ketu Antardasha brings confusion and spiritual disruption. Remedy during Mercury Mahadasha: chant "Om Budhaya Namah" 17 times every Wednesday at sunrise, wear Emerald (Panna) in gold, donate green vegetables and moong dal to students on Wednesdays, and worship Lord Vishnu for Mercury's blessings.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA FIXES — Navagrahas (all scoring under 60%)
  // Mars, Mercury, Jupiter, Saturn, Rahu, Ketu need richer chunks
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Mars Mangal Navagraha',
    tags: ['mars', 'mangal', 'red_coral', 'tuesday', 'courage', 'siblings', 'land', 'copper', 'hanuman'],
    text: `Mars, known as Mangal or Angaraka in Vedic astrology, is the planet of energy, courage, ambition, action, siblings, land, and the military. Mars governs the blood, muscles, bone marrow, and the south direction. The day of Mars is Tuesday (Mangalavara). Mars's metal is copper. The gemstone for Mars is Red Coral (Moonga), which should be set in copper or gold and worn on the ring finger of the right hand on a Tuesday morning. Mars's color is red, its direction is South, and its deity is Lord Hanuman and Lord Kartikeya. Mars is strong in Aries and Scorpio (its own signs) and exalted in Capricorn at 28 degrees. Mars is debilitated in Cancer. Mangal Dosha (also called Kuja Dosha) occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house of the birth chart — this creates intensity and conflict in marriage and requires matching with another Mangal Dosha chart. Benefic Mars in the chart gives extraordinary courage, athletic ability, leadership in the military or police, success in surgery, real estate, and competitive fields. Afflicted Mars causes accidents, injuries, blood disorders, conflicts with siblings, and impulsive anger that damages relationships. The Mars mantra is "Om Angarakaya Namah" chanted 21 times on Tuesdays at sunrise. Remedy for weak Mars: worship Lord Hanuman every Tuesday, offer red flowers and sindoor, donate red lentils (masoor dal) to laborers, and wear red coral after proper astrological evaluation from a qualified Jyotishi.`
  },

  {
    silo: 'vedic',
    topic: 'Jupiter Guru Brihaspati Navagraha',
    tags: ['jupiter', 'guru', 'brihaspati', 'yellow_sapphire', 'thursday', 'wisdom', 'dharma', 'children'],
    text: `Jupiter, known as Guru or Brihaspati in Vedic astrology, is the largest planet and the most auspicious among the nine Navagrahas. Jupiter governs wisdom, knowledge, dharma, spiritual growth, children, wealth through righteousness, higher education, and the liver. The day of Jupiter is Thursday (Guruvara or Brihaspativara). Jupiter's metal is gold. The gemstone for Jupiter is Yellow Sapphire (Pukhraj), which should be set in gold and worn on the index finger of the right hand on a Thursday morning during Jupiter hora. Jupiter's color is yellow, its direction is Northeast (Ishanya), and its deity is Brihaspati Dev (teacher of the gods). Jupiter is strong in Cancer (exalted), Sagittarius, and Pisces (its own signs). Jupiter is debilitated in Capricorn. In the Kaal Purusha chart, Jupiter governs the 9th and 12th houses — dharma and moksha. Gaja Kesari Yoga forms when Jupiter is in a Kendra (1st, 4th, 7th, 10th house) from the Moon, giving wisdom, name, fame, and prosperity. Jupiter aspects the 5th, 7th, and 9th houses from its position — these aspects are highly auspicious and bring blessings to those houses. Afflicted Jupiter causes liver problems, obesity, overindulgence, poor judgment, and financial losses through misplaced generosity. The Jupiter mantra is "Om Gurave Namah" chanted 19 times on Thursdays at sunrise. Remedy for weak Jupiter: donate yellow lentils (chana dal) or yellow cloth to a Brahmin on Thursdays, offer yellow flowers to the Brihaspati idol, fast on Thursdays, and wear yellow on that day.`
  },

  {
    silo: 'vedic',
    topic: 'Saturn Shani Navagraha',
    tags: ['saturn', 'shani', 'blue_sapphire', 'saturday', 'karma', 'discipline', 'delay', 'iron', 'shani_dev'],
    text: `Saturn, known as Shani or Shanaischaraya in Vedic astrology, is the planet of karma, discipline, patience, service, delayed rewards, and the lessons of time. Saturn governs the bones, teeth, hair, skin, and the nervous system. The day of Saturn is Saturday (Shanivara). Saturn's metal is iron or lead. The gemstone for Saturn is Blue Sapphire (Neelam), the most powerful and fastest-acting gemstone in Vedic astrology — it must be tested before wearing as it shows results within 72 hours. Saturn's color is blue or black, its direction is West, and its deity is Shani Dev (son of Sun and Chhaya). Saturn is strong in Capricorn and Aquarius (its own signs) and exalted in Libra at 20 degrees. Saturn is debilitated in Aries. Saturn's 7.5-year transit over the natal Moon sign is called Sade Sati — one of the most transformative transit periods in Vedic astrology. Saturn also creates Dhaiya (2.5-year mini-Sade Sati) when transiting the 4th or 8th house from the natal Moon. Benefic Saturn in the chart (especially in Libra, Capricorn, or Aquarius) gives extraordinary discipline, longevity, institutional authority, and the ability to build lasting structures. Afflicted Saturn causes chronic delays, depression, bone problems, loneliness, and unresolved karma. The Saturn mantra is "Om Shanaischaraya Namah" chanted 23 times every Saturday. Remedy: donate black sesame (til) and mustard oil to a Shani temple on Saturdays, feed black dogs, serve the poor and elderly, and fast on Saturdays.`
  },

  {
    silo: 'vedic',
    topic: 'Rahu North Node Navagraha',
    tags: ['rahu', 'north_node', 'hessonite', 'gomedha', 'saturday', 'obsession', 'technology', 'foreign', 'durga'],
    text: `Rahu, the North Node of the Moon, is one of the shadow planets (Chaya Graha) in Vedic astrology and represents the head of the cosmic serpent that swallows the Sun and Moon during eclipses. Rahu governs obsession, illusion, foreign connections, technology, unconventional behavior, sudden events, and the amplification of whatever planet it associates with. Rahu has no physical body but exerts profound psychological and karmic influence. The day associated with Rahu is Saturday (shared with Saturn). Rahu's gemstone is Hessonite (Gomedha), a honey-colored garnet set in silver or Panchdhatu, worn on the middle finger on a Saturday evening. Rahu's direction is Southwest. The deity associated with Rahu is Goddess Durga or Goddess Kali — fierce transformers of illusion into truth. Rahu amplifies the qualities of whatever planet it conjuncts: Rahu with Moon (Grahan Yoga) intensifies emotions and psychic sensitivity; Rahu with Sun creates ego tension and conflict with authority; Rahu with Jupiter can give sudden spiritual or educational breakthroughs. Rahu placed in the 3rd, 6th, or 11th house (Upachaya houses) is beneficial and gives material gains, courage, and income from foreign sources. Rahu in the 1st, 7th, or 8th house creates more complex karmic situations. During Rahu Mahadasha (18 years), the native experiences intense ambition, foreign opportunities, and sudden life changes. The Rahu mantra is "Om Rahuve Namah" chanted 18 times. Remedy: worship Goddess Durga on Saturdays, donate blue cloth, and avoid alcohol which amplifies Rahu's negative effects.`
  },

  {
    silo: 'vedic',
    topic: 'Ketu South Node Navagraha',
    tags: ['ketu', 'south_node', 'cat_eye', 'spirituality', 'moksha', 'detachment', 'past_life', 'liberation', 'ganesha'],
    text: `Ketu, the South Node of the Moon, represents the tail of the cosmic serpent and is the most spiritual of all the nine planets in Vedic astrology. Ketu governs past-life karma, spiritual liberation (Moksha), detachment from material desires, occult sciences, sudden unexpected events, and the dissolution of worldly ties. Like Rahu, Ketu has no physical form but exerts powerful karmic and spiritual influence. Ketu is associated with Tuesdays (shared with Mars). Ketu's gemstone is Cat's Eye (Lehsunia or Vaidurya), set in silver and worn on the middle or little finger. Ketu's direction is Northwest. The deity of Ketu is Lord Ganesha and Lord Bhairava (fierce form of Shiva). Ketu is exalted in Scorpio and debilitated in Taurus according to some traditions. Ketu functions like Mars in its energy but channels it inward toward spiritual realization rather than outward toward worldly conquest. Benefic Ketu in the 12th house gives Moksha Yoga — the potential for spiritual liberation. Ketu in the 9th house gives deep spiritual wisdom and past-life religious merit. Ketu in the 4th or 7th house can disrupt domestic peace and marriage. During Ketu Mahadasha (7 years), the native experiences withdrawal from material desires, sudden spiritual experiences, and karmic completion of past-life debts. Ketu conjunct Jupiter gives exceptional occult and spiritual knowledge. The Ketu mantra is "Om Ketave Namah" chanted 7 times. Remedy: worship Lord Ganesha and Lord Bhairava, donate multicolored cloth on Tuesdays, and practice daily meditation to channel Ketu's inward energy.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Chaldean Letter Mapping (53.6%, 56.9%)
  // Need a dedicated chunk that specifically names F=8, P=8, O=7, Z=7
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Chaldean Letter Number Table Complete',
    tags: ['chaldean_table', 'letter_mapping', 'alphabet_values', 'F_equals_8', 'P_equals_8', 'O_equals_7', 'Z_equals_7'],
    text: `The complete Chaldean numerology letter-to-number assignment table is the foundation of all name calculations. The table maps each letter of the English alphabet to a vibrational number from 1 to 8. Number 1 letters: A, I, J, Q, Y. Number 2 letters: B, K, R. Number 3 letters: C, G, L, S. Number 4 letters: D, M, T. Number 5 letters: E, H, N, X. Number 6 letters: U, V, W. Number 7 letters: O, Z. Number 8 letters: F, P. The critical rule that distinguishes Chaldean from Pythagorean: the number 9 is never assigned to any letter because 9 is considered the divine number of completion — sacred and unreachable through human naming. This means F equals 8, P equals 8, O equals 7, Z equals 7. These specific assignments are frequently tested: the letter F is not 6 (as in some other systems) but 8 in Chaldean. The letter P is 8, not 7. The letter O is 7, not 6. The letter Z is 7, not 8. To calculate any name number: write the name, replace each letter with its Chaldean value, sum all values to get the compound number, note the compound's archetypal meaning, then add the compound's digits to find the root number which reveals the planetary ruler. Example: the name JOHN = J(1)+O(7)+H(5)+N(5) = 18, root 9 (Mars). Always show both compound and root in any reading.`
  },

  {
    silo: 'chaldean',
    topic: 'Chaldean Letter Mapping A I J Q Y equals 1',
    tags: ['letter_mapping', 'A_equals_1', 'I_equals_1', 'J_equals_1', 'Q_equals_1', 'Y_equals_1', 'chaldean_alphabet'],
    text: `In Chaldean numerology, the number 1 is assigned to the letters A, I, J, Q, and Y — all of which carry the vibration of the Sun and its energy of leadership, individuality, and pioneer spirit. This specific assignment is one of the most important distinctions of the Chaldean system. The letter A (value 1) begins the alphabet and carries the solar force of initiation. The letter I (value 1) represents the self and individual consciousness. The letter J (value 1) — this often surprises students, as Pythagorean systems assign J a different value, but in Chaldean J equals 1. The letter Q (value 1) is less common but carries the same solar vibration. The letter Y (value 1) — another Chaldean-specific assignment where Y equals 1, not 7 as in Pythagorean. To use the complete table for name calculation: 1=A,I,J,Q,Y / 2=B,K,R / 3=C,G,L,S / 4=D,M,T / 5=E,H,N,X / 6=U,V,W / 7=O,Z / 8=F,P. The number 9 is assigned to NO letter — this is the fundamental Chaldean rule. When calculating business names, the same table applies. When performing name correction analysis, a desired compound number is targeted and the spelling is adjusted one or two letters at a time using this precise table, ensuring the corrected name still sounds like the original name and is socially acceptable.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Number 2 Moon (59.4%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Number 2 Moon Chandra Chaldean',
    tags: ['number_2', 'moon', 'chandra', 'emotion', 'intuition', 'sensitivity', 'partnership', 'chaldean_number'],
    text: `Number 2 in Chaldean numerology is ruled by the Moon (Chandra) and represents the vibration of emotion, intuition, receptivity, diplomacy, and the need for partnership and connection. The Moon is the mind in Vedic astrology — and number 2 people are deeply mind-sensitive individuals who process the world through feeling rather than logic. Number 2 personalities are natural peacemakers, counselors, and supporters who excel in roles requiring empathy and emotional attunement: nursing, counseling, hospitality, music, and diplomacy. The Moon's cyclic nature means number 2 people experience regular emotional fluctuations — high sensitivity is both their greatest gift (deep intuition, psychic awareness, natural creativity) and their greatest challenge (mood swings, over-sensitivity, emotional dependency). Number 2 people thrive in partnership — they need a strong, reliable partner to feel secure. When supported, they create beautiful, harmonious environments. When unsupported, they become withdrawn or clingy. In the Vedic-Chaldean fusion system, Monday (Chandra Vara) is the most powerful day for number 2 people. The waxing and waning Moon cycles directly affect their energy levels and mood. Full Moon (Purnima) brings emotional heights; New Moon (Amavasya) brings introspection and withdrawal. Planetary friendship: Moon is friendly with Sun and Mercury, neutral with all others, and has no declared enemies. Lucky color: white or silver. Lucky gemstone: Pearl in silver on Monday. Mantra: "Om Chandraya Namah" 11 times on Mondays. Best careers: healthcare, hospitality, art, music, counseling, diplomacy, import-export.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Number 4 Rahu (57.5%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Number 4 Rahu Uranus Chaldean',
    tags: ['number_4', 'rahu', 'uranus', 'disruption', 'rebellion', 'unconventional', 'innovation', 'chaldean_number'],
    text: `Number 4 in Chaldean numerology is governed by Rahu (the North Node of the Moon) and Uranus in the Western correspondence — making it the most unconventional, rebellious, and disruptive of all nine vibrations. Number 4 represents the energy of the outsider who sees the world differently, the innovator who breaks existing systems, and the revolutionary who attracts intense opposition precisely because their ideas challenge the status quo. People with number 4 as their dominant vibration — whether in their name, birth, or destiny — are often misunderstood by their family and society, frequently considered eccentric or difficult, but carry within them a spark of genuine originality that can change the world when properly channeled. Rahu's amplifying, obsessive nature makes number 4 people extremely focused and single-minded in pursuit of their unconventional goals. They are drawn to technology, foreign cultures, astrology, occult sciences, and any field that operates outside conventional boundaries. The greatest challenges of number 4 include: financial instability (Rahu creates sudden gains and losses), opposition from authority figures who fear their disruption, and a tendency toward obsessive thinking that leads to burnout. In the Vedic-Chaldean fusion, Rahu days (Saturday, shared with Saturn) are complex for number 4 people — intense and potentially transformative. Remedy: chant "Om Rahuve Namah" 18 times, wear hessonite after proper evaluation, donate to marginalized communities, and channel the rebellious energy into structured innovation rather than chaos.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Number 5 Mercury (47.1% — nearly critical)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Number 5 Mercury Budha Chaldean',
    tags: ['number_5', 'mercury', 'budha', 'intelligence', 'communication', 'business', 'adaptability', 'chaldean_number'],
    text: `Number 5 in Chaldean numerology is ruled by Mercury (Budha) and carries the vibration of intelligence, communication, versatility, commerce, and freedom of movement. Number 5 is arguably the most dynamic and versatile of all numbers — it represents the energy of the marketplace, the journalist, the trader, the teacher, and the traveler who thrives on variety and exchange. People with number 5 as a dominant vibration are exceptionally quick thinkers, natural communicators, and gifted salespeople who can adapt instantly to changing environments. The Mercury influence gives them sharp analytical minds, a gift for languages, and an insatiable curiosity about ideas, people, and places. Number 5 people process information at remarkable speed and become bored easily when confined to routine. They perform best in dynamic, changing environments with multiple projects running simultaneously. The challenge of number 5 is consistency — their love of variety can lead to scattering energy across too many pursuits, leaving many projects unfinished. In relationships, number 5 people need a partner who respects their need for freedom and mental stimulation. In the Vedic-Chaldean fusion, Wednesday (Budha Vara) is the most powerful day for number 5 people — ideal for business meetings, contract signings, communication, learning, and new ventures. Mercury is friendly with Sun and Venus, making Sundays and Fridays also productive. Lucky color: green. Lucky direction: North. Mantra: "Om Budhaya Namah" 17 times on Wednesdays. Best careers: business, journalism, teaching, sales, technology, stock trading, writing, travel.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Number 8 Saturn (49.5%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Number 8 Saturn Shani Chaldean',
    tags: ['number_8', 'saturn', 'shani', 'karma', 'discipline', 'delay', 'justice', 'reward', 'chaldean_number'],
    text: `Number 8 in Chaldean numerology is ruled by Saturn (Shani), the planet of karma, discipline, time, and ultimate justice. Number 8 is the most karmic and consequential vibration in the entire Chaldean system — it is the number of great builders, powerful executives, spiritual masters, and those who carry the heaviest karmic responsibilities. People with number 8 dominant in their chart are here on Earth to master the material plane through sustained effort, accountability, and service to a larger cause beyond personal gratification. The most misunderstood vibration in numerology — number 8 is frequently and wrongly labeled "unlucky." This is a profound error. The number 8 is the vibration of the great achiever who earns their success through extraordinary discipline and patience. Number 8 people often face significant obstacles, losses, and delays in the first half of their lives — these are not punishments but karmic preparation for the immense responsibility they will shoulder in the second half. Saturn always pays — slowly, certainly, and in full. Number 8 people who maintain integrity and work with diligence eventually receive rewards of lasting significance: institutional authority, wealth through systemic effort, and deep respect from society. Famous number 8 people frequently appear in positions of immense power and responsibility. In the Vedic fusion, Saturday (Shani Vara) is both the power day and the most intensely karmic day for number 8 people. Remedy: donate black sesame on Saturdays, chant "Om Shanaischaraya Namah" 23 times, fast on Saturdays, and serve the elderly and poor to honor Saturn's energy of service.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Compound 16 Shattered Tower (56.1%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Compound 16 Shattered Tower',
    tags: ['compound_16', 'shattered_tower', 'downfall', 'ego', 'warning', 'sixteen', 'chaldean'],
    text: `Compound number 16 in Chaldean numerology carries the archetype of "The Shattered Tower" — one of the most serious warning vibrations in the entire system. The imagery is of a tall tower struck by lightning, its top shattering, representing the sudden collapse of what has been built through ego, pride, or disregard for others. People with a name or destiny compound of 16 are at risk of a dramatic fall from whatever heights they have achieved if their ego remains unchecked. The 16 vibration is associated with sudden reversals of fortune, humiliation in public, the undoing of relationships and careers through arrogance, and the experience of having their carefully constructed life shattered in an unexpected moment. However, understanding the 16's deeper teaching transforms it: the Tower must be broken so that what is built on illusion can be replaced by what is real. The root number of 16 is 7 (1+6=7), ruled by Ketu — the planet of spiritual liberation and past-life karma. This reveals that the 16's destruction serves a spiritual purpose: to strip away the false ego and force the native toward genuine spiritual growth and humility. Compound 16 is one of the primary inauspicious numbers that numerologists recommend correcting through a name spelling adjustment — shifting to a more auspicious compound like 17, 19, or 23 without changing the name's essential sound. If the name cannot be changed, the remedy is developing consistent humility, service to others, and genuine spiritual practice that voluntarily dissolves the ego before circumstances force it.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Rahu Mahadasha (59.2% — just below threshold)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Rahu Mahadasha 18 Years',
    tags: ['rahu_mahadasha', 'rahu_dasha', '18_years', 'obsession', 'foreign', 'ambition', 'sudden', 'rise', 'fall'],
    text: `Rahu Mahadasha is the longest planetary period in the Vimshottari Dasha system, lasting 18 full years. This extended period governed by Rahu — the planet of obsession, illusion, foreign connections, and amplification — is one of the most transformative and unpredictable phases in any person's life. During Rahu Mahadasha, desires intensify dramatically. The native becomes driven by ambitions that feel consuming and almost beyond conscious control. Rahu's nature is to amplify — whatever the person wants during this period, they want with extraordinary intensity. Career opportunities appear from unexpected and foreign sources. The native may experience rapid social climbing, sudden public recognition, and unconventional paths to success. However, Rahu's essence is Maya (illusion) — success gained during this period can prove unstable if built on deception, shortcuts, or the suppression of karma. The middle phase of Rahu Mahadasha (years 7-12) is typically the most intense, bringing the peak of both opportunities and challenges. Foreign travel, immigration, or significant involvement with foreign people, cultures, or companies is extremely common during this period. Many people undergo complete identity transformations — changing careers, religions, relationships, or geographic locations multiple times. If Rahu is placed in an Upachaya house (3rd, 6th, 10th, or 11th) in the birth chart, Rahu Mahadasha brings extraordinary material success. If Rahu is in the 7th or 8th house, complex relationship and health challenges accompany the rise. The beneficial Antardashas within Rahu Mahadasha are Jupiter and Venus sub-periods. Remedy: worship Goddess Durga on Saturdays, fast on Saturdays, chant "Om Rahuve Namah" 18 times daily, and donate to charitable causes.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Saturn Mahadasha (59.1% — just below threshold)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Saturn Mahadasha 19 Years Karma',
    tags: ['saturn_mahadasha', 'shani_dasha', '19_years', 'karma', 'discipline', 'delays', 'reward', 'hard_work'],
    text: `Saturn Mahadasha (Shani Dasha) is the second longest period in the Vimshottari system at 19 years and represents the most profound karmic reckoning in any lifetime. Saturn is the planet of karma, discipline, time, service, and the slow but certain delivery of justice — both rewards for righteous action and consequences for unethical choices. The 19 years of Saturn Mahadasha are characterized by a fundamental restructuring of the native's life around the principles of hard work, accountability, and genuine service. There are no shortcuts during Saturn Mahadasha — any attempt to bypass effort or compromise integrity is swiftly corrected by Saturn's inexorable karmic law. The early years of Saturn Mahadasha (years 1-7) typically involve heavy responsibilities, financial pressure, health challenges related to bones or joints, and a sense of burden and isolation. The native may feel that progress is impossibly slow and that success will never come. The middle years (8-13) show gradual consolidation as effort accumulates into tangible results. The later years (14-19) deliver the true harvest of Saturn — authority, recognition, institutional power, and the deep respect that only comes from sustained, proven discipline over time. Saturn Mahadasha is most powerful when Saturn is well-placed in Libra (exalted), Capricorn, or Aquarius in the birth chart. For those with Taurus or Libra Lagna, Saturn becomes the Yogakaraka (most beneficial planet) and its Mahadasha brings extraordinary achievements. The most beneficial Antardasha within Saturn Mahadasha is the Jupiter sub-period. Remedy: chant "Om Shanaischaraya Namah" 23 times every Saturday, donate black sesame and mustard oil, and serve the poor and elderly consistently throughout this entire 19-year period.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Ketu Antardasha / Jupiter Antardasha (54-59%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Antardasha Sub Periods Detailed',
    tags: ['antardasha', 'sub_period', 'ketu_antardasha', 'rahu_mahadasha', 'jupiter_antardasha', 'venus_mahadasha', 'inner_period'],
    text: `Antardasha sub-periods within Mahadashas create the micro-timing within the larger planetary period. Each of the nine major Mahadashas contains nine Antardashas — one for each planet — in a specific sequence that mirrors the Vimshottari order. The duration of each Antardasha within a Mahadasha is proportional to both planets' periods. Ketu Antardasha within Rahu Mahadasha is one of the most spiritually intense and psychologically challenging sub-periods. The obsessive material drive of Rahu (18-year Mahadasha) encounters the spiritually detaching, past-karma activating energy of Ketu — creating internal confusion, spiritual awakening experiences, sudden disruptions to the ambitions built during Rahu's period, and sometimes complete life direction changes. This sub-period lasts approximately 1 year and 18 days. Natives often report feeling "lost" or undergoing profound spiritual experiences during this time. Jupiter Antardasha within Venus Mahadasha (20 years) creates one of the most gracious and prosperous sub-periods in any person's life. Jupiter's wisdom and expansion combined with Venus's love, beauty, and abundance produce extraordinary results in marriage, artistic achievement, financial growth, and spiritual evolution. This sub-period lasts approximately 2 years and 8 months. Marriages, business partnerships, and creative launches during this period tend to be highly blessed. Rahu Antardasha within Saturn Mahadasha creates karmic acceleration — Saturn's disciplined effort meets Rahu's sudden and foreign opportunities, producing significant career changes, foreign connections, and unexpected breakthroughs or upheavals in the area governed by their natal positions.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — 5th House (54%), 11th House (52%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: '5th House Putra Bhava Poorva Punya',
    tags: ['5th_house', 'putra_bhava', 'children', 'intelligence', 'creativity', 'romance', 'poorva_punya', 'past_karma', 'fifth_house'],
    text: `The 5th house (Putra Bhava) in Vedic astrology is one of the three auspicious Trikona houses (1st, 5th, 9th) and carries the signature of Poorva Punya — the accumulated merit from all previous lifetimes. It governs children and progeny, intelligence and intellectual capacity, creativity and artistic expression, romance and love affairs, higher education and speculation, and the blessings carried over from past lives. The 5th house is fundamentally the house of the soul's creative expression — both biological (children) and artistic (creative works). Its condition reveals how freely and joyfully the native expresses their inner world. Jupiter placed in the 5th house is the most celebrated placement — it bestows multiple children or exceptionally gifted children, profound intelligence, strong past-life merit, and a naturally joyful, expansive personality. The 5th house is also significant for investments and speculation — when the 5th lord is strong and connected to the 2nd and 11th houses (wealth axis), the native has good luck in calculated financial risks. The connection between the 5th house and Poorva Punya means that the strength or weakness of this house reveals the spiritual credit balance from previous incarnations. A strongly fortified 5th house (with Jupiter, well-placed 5th lord, or strong natural benefics) indicates a soul who arrives with significant spiritual merit, and consequently experiences more grace, creativity, and blessing in life. Afflictions to the 5th house challenge the creative spirit and complicate the experience of parenting and education. Remedy: worship Lord Ganesha for intelligence and children, chant the Santana Gopala mantra for fertility, and offer yellow flowers to Jupiter on Thursdays.`
  },

  {
    silo: 'vedic',
    topic: '11th House Labha Bhava Gains Income',
    tags: ['11th_house', 'labha_bhava', 'income', 'gains', 'social_networks', 'fulfillment', 'elder_siblings', 'eleventh_house'],
    text: `The 11th house (Labha Bhava) in Vedic astrology is the house of gains, income, fulfillment of desires, and social networks. It is one of the Upachaya houses (3rd, 6th, 10th, 11th) where malefic planets can produce exceptionally good material results. The 11th house governs: all forms of income and financial gains beyond the primary career, fulfillment of long-cherished desires and goals, elder siblings and their influence in the native's life, social networks, friendships, and group affiliations, income from profession (in conjunction with the 10th house), and the left ear. The 11th house is the house of "what comes to you" — while the 10th house shows your karma and effort, the 11th shows the reward that flows back. When the 2nd lord (accumulated wealth) and 11th lord (income) are well-connected in the birth chart, this creates one of the most powerful Dhana Yogas indicating strong wealth accumulation throughout life. Jupiter placed in the 11th house is highly auspicious — it gives income through wisdom-based networks, influential friends in high positions, and the fulfillment of higher aspirations. Saturn in the 11th house (especially for Aries or Cancer Lagna) is a powerful placement — despite Saturn being a natural malefic, the 11th is an Upachaya house where Saturn's discipline and persistence translate into steady, reliable income growth and influential connections in government, law, or corporate structures. Rahu in the 11th house brings sudden and large gains from unconventional or foreign sources, though the income may be irregular. Remedy for weak 11th house: strengthen the 11th lord's planet, network consciously, and donate a portion of income to charitable causes.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Panchanga details (Tithi, Brahma Muhurta, Amavasya)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Tithi Lunar Day Activities',
    tags: ['tithi', 'lunar_day', 'auspicious_tithi', 'inauspicious_tithi', 'activities', '30_tithis', 'panchanga'],
    text: `Tithi is the lunar day and forms one of the five essential limbs of the Panchanga (Vedic almanac). There are 30 Tithis in a complete lunar month — 15 in the waxing Shukla Paksha (ending at Purnima, Full Moon) and 15 in the waning Krishna Paksha (ending at Amavasya, New Moon). Each Tithi lasts approximately 24 hours but varies based on the Moon's actual orbital speed. The auspicious Tithis for initiating new ventures, conducting ceremonies, and performing auspicious activities are: Pratipada (1st), Dwitiya (2nd), Tritiya (3rd), Panchami (5th), Saptami (7th), Dashami (10th), Ekadashi (11th), Trayodashi (13th), and Purnima (15th — Full Moon). The inauspicious Tithis to avoid for important new beginnings are: Chaturthi (4th), Ashtami (8th), Navami (9th), Chaturdashi (14th), and Amavasya (30th — New Moon). Ashtami and Navami together are called Bhadra — considered particularly inauspicious for starting new work. Ekadashi (11th Tithi) is the most sacred fasting day in the Vaishnava tradition — dedicated to Lord Vishnu — and is auspicious for spiritual practices and worship but not for material ventures. Purnima (Full Moon Tithi) is ideal for major worship ceremonies, gratitude practices, and spiritual initiations. In the Muhurat engine, the Tithi must be checked alongside the Nakshatra, Vara, Yoga, and Karana to identify windows where all five Panchanga limbs are simultaneously auspicious — these moments represent the highest quality Muhurta for important life events.`
  },

  {
    silo: 'vedic',
    topic: 'Brahma Muhurta Auspicious Timing',
    tags: ['brahma_muhurta', 'auspicious_time', '96_minutes', 'before_sunrise', 'new_beginnings', 'morning', 'timing'],
    text: `Brahma Muhurta is the most auspicious time window in Vedic astrology and spiritual practice — it is the period of 96 minutes (approximately one and a half hours) before sunrise each morning. The word Brahma Muhurta means "the hour of Brahma" or "the creator's hour" — the time when cosmic creative energy is at its purest and most accessible before the day's activities begin. According to ancient Vedic texts, Brahma Muhurta begins 1 hour 36 minutes before sunrise and ends approximately 48 minutes before sunrise — though different traditions calculate the exact boundaries slightly differently. During Brahma Muhurta, the atmosphere carries an exceptionally high concentration of prana (life force), divine energies are most responsive to prayer and meditation, and the mind — not yet disturbed by the day's activities — is clearest and most receptive. All spiritual practices performed during Brahma Muhurta carry multiplied benefit: meditation, pranayama, mantra japa, scripture study, and prayer. New ventures mentally initiated during this time receive a blessing from the creative energy of Brahma. In the Numeriq.AI Muhurat engine, Brahma Muhurta is always recommended as the optimal time window within any auspicious day identified by the Panchanga analysis. Even if a specific Muhurta window cannot be calculated for a user's exact location, Brahma Muhurta provides a reliable daily window for auspicious beginnings. Practically: wake before Brahma Muhurta, complete ablutions in silence, perform meditation or mantra practice, and use the first rays of sunrise for Surya Arghya (solar offering) and intention setting for the day's important work.`
  },

  {
    silo: 'vedic',
    topic: 'Amavasya New Moon Pitru Worship',
    tags: ['amavasya', 'new_moon', 'ancestor_worship', 'pitru_tarpan', 'inauspicious', 'shraddha', 'puja'],
    text: `Amavasya is the New Moon day — the 30th and final Tithi of the Krishna Paksha (waning fortnight) in the Vedic lunar calendar. On Amavasya, the Moon is completely dark, invisible in the night sky. In Vedic tradition, Amavasya holds profound significance for ancestor worship (Pitru Puja) but is considered inauspicious for initiating new ventures, marriages, business launches, or auspicious ceremonies. The Moon's complete absence on Amavasya means the mind (governed by the Moon) is at its lowest energy — making it a day for introspection, completion, and letting go rather than initiation and creation. However, Amavasya is the most sacred day for performing Pitru Tarpan — the ritual offering of water, sesame seeds, rice, and prayers to departed ancestors. Hindu tradition holds that the souls of ancestors can receive offerings most readily on Amavasya. The Mahalaya Amavasya (occurring in the month of Bhadrapada, typically September-October) is the most significant Amavasya for ancestor worship — the entire fortnight preceding it is called Pitru Paksha, dedicated entirely to ancestral remembrance. Shraddha ceremonies (annual ancestor memorial rituals) are performed on the Amavasya of the month corresponding to the ancestor's death tithi. In practical guidance within the Numeriq.AI system: Amavasya days are flagged as inauspicious for all Muhurat calculations involving new beginnings. Users are advised to avoid important decisions, sign contracts, or begin new relationships on Amavasya, and instead use this day for gratitude practices, meditation, ancestor prayers, and reflection.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Name Correction (58.4%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Name Correction Protocol',
    tags: ['name_correction', 'inauspicious_compound', 'spelling_adjustment', 'lucky_name', 'chaldean_correction'],
    text: `Name correction in Chaldean numerology is the systematic process of adjusting a person's name spelling to shift from an inauspicious compound number to an auspicious one, thereby improving their vibrational alignment and life outcomes. The process follows these precise steps: First, calculate the current name's compound number using the Chaldean letter-value table. Second, identify if the compound falls into the inauspicious category — the primary warning compounds are 12, 16, 18, 22, 26, 34, 35, and 44. Third, identify the target auspicious compound — the most favorable compounds are 10, 14, 19, 23, 27, 32, 37, and 41. Fourth, systematically try adding, removing, or changing one or two letters in the name to reach the target compound, while ensuring the corrected name remains pronounceable and recognizable as the same person's name. For example, changing "NEIL" (N5+E5+I1+L3=14, root 5) to "NIEIL" or modifying the surname to shift the total. Fifth, check that the corrected name's root number is friendly with the person's birth number planet. Sixth, verify the corrected name also harmonizes with the Lagna lord's planet in the Vedic chart for the Astro-Numerology fusion system. Important rules: never change a name so dramatically that the person becomes unrecognizable. The correction should be subtle — one letter added, one removed, or one changed in spelling. Business name corrections follow the same protocol, additionally checking alignment with the owner's birth number and the business's launch Nakshatra.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Saturn exalted Libra (53.6%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Saturn Exalted Libra Debilitated Aries',
    tags: ['saturn_exalted', 'libra', 'debilitated_aries', 'saturn_strong', 'neecha_saturn', 'uccha_saturn'],
    text: `Saturn achieves its highest dignity — exaltation (Uccha) — in the zodiac sign of Libra (Tula Rashi), with maximum exaltation at 20 degrees Libra. In Libra, the sign of balance, justice, and refined social interaction, Saturn's qualities of discipline, fairness, and karmic accountability find their most elevated expression. A person with Saturn exalted in Libra carries exceptional qualities: extraordinary sense of justice and fairness, strong institutional authority, disciplined diplomatic skills, ability to create balanced and enduring structures in law, government, business, and society. Saturn exalted in Libra in the 10th house (Karma Bhava) from Lagna creates one of the most powerful placements for career authority — this is the Digbala Saturn (directional strength) in the sign of exaltation, producing legendary institutional leaders. Saturn is debilitated (Neecha) — at its weakest — in Aries (Mesha Rashi), with maximum debilitation at 20 degrees Aries. In Aries, the sign of impulse, fire, and hasty action, Saturn's qualities of patience, discipline, and measured progress struggle to manifest. Saturn in Aries creates difficulty with patience, impulsive karmic mistakes, health issues related to blood and head, and challenges establishing lasting structures. Neecha Bhanga (cancellation of debilitation) for Saturn in Aries occurs when Venus (lord of Libra, the exaltation sign) or Mars (lord of Aries) is placed in a Kendra from Lagna or Moon — this transforms the apparent weakness into a powerful rise against odds, particularly in career and social standing.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Kaal Sarp Puja (58.3%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'vedic',
    topic: 'Kaal Sarp Puja Tryambakeshwar',
    tags: ['kaal_sarp', 'tryambakeshwar', 'serpent_worship', 'nagpanchami', 'milk', 'remedy', 'rahu_ketu'],
    text: `Kaal Sarp Yoga remedy through the Tryambakeshwar Jyotirlinga puja is the most powerful and recognized ritual intervention for this challenging planetary configuration. Tryambakeshwar is one of the 12 sacred Jyotirlinga temples of Lord Shiva, located in Nashik district of Maharashtra, and is specifically associated with liberation from the Rahu-Ketu serpent axis. Kaal Sarp Yoga occurs when all seven planets — Sun, Moon, Mars, Mercury, Jupiter, Venus, and Saturn — are hemmed between the Rahu-Ketu axis, with no planets outside this axis. There are 12 types of Kaal Sarp Yoga, each named after a serpent king (Anant, Kulik, Vasuki, Shankhapada, Padma, Mahapadma, Takshak, Karkotak, Shankhachud, Ghatak, Vishadhar, Sheshnag) based on the house position of Rahu. The Tryambakeshwar Kaal Sarp Puja is performed by qualified Brahmin priests over a full day. It includes Rudrabhishek (sacred ablution of the Shiva lingam with milk, honey, yogurt, ghee, and water), Nag Puja (worship of serpent deities), specific Kaal Sarp Shanti mantras, and Homa (fire ritual). The puja cost varies by ritual complexity and priest qualification. Home remedies for Kaal Sarp Yoga: chant "Om Namah Shivaya" 108 times daily at sunrise, offer raw milk to a Shiva lingam every Monday, observe Nagpanchami fasting and offer milk and turmeric to serpent images or living snakes at a Naga temple. Keep a silver Naga-Nagini pair in the home puja space and offer milk to them weekly. The Maha Mrityunjaya mantra chanted 108 times daily provides ongoing protection throughout the Kaal Sarp period.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Rahu Ketu Planetary Friendship (60.0% — borderline)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Rahu Ketu Planetary Friendship Table',
    tags: ['rahu_ketu_friendship', 'shadow_planet_friends', 'saturn_venus_friendly', 'sun_moon_enemy', 'planetary_relationship'],
    text: `Rahu and Ketu, the shadow nodes of the Moon, have their own planetary friendship relationships that are essential for the Chaldean-Vedic Fusion Intelligence Layer. Rahu is friendly with Saturn and Venus. This means that for number 4 people (Rahu-ruled), Saturdays and Fridays are generally supportive days — Saturn's Saturday brings disciplined focus that channels Rahu's obsessive energy productively, while Venus's Friday brings creative and social opportunities that soften Rahu's intensity. Rahu is enemy to Sun, Moon, and Mars. This creates significant energy conflicts: for a number 4 person (Rahu), Sundays bring authority clashes and ego conflicts, Mondays bring emotional instability and mental fog, Tuesdays bring impulsive actions and aggressive confrontations. Ketu shares Rahu's friendship patterns in general — Ketu is also considered friendly with Saturn and Venus, and challenging in relation to Sun and Moon. However, Ketu has a unique relationship with Mars: both Ketu and Mars are associated with Tuesday and share a karmic, intense quality, making this relationship more complex and not simply enemy-classified. In the daily fusion reading, when a user's name planet (Rahu=number 4, Ketu=number 7) encounters a day ruled by a friendly planet (Saturn or Venus), the guidance is supportive. When meeting an enemy planet day (Sun or Moon), specific remedies are recommended to mitigate the conflict. The Rahu mantra for difficult days: "Om Rahuve Namah" 18 times. Ketu mantra: "Om Ketave Namah" 7 times.`
  },

  // ══════════════════════════════════════════════════════════
  // WEAK AREA — Compound 33, 43, 52 (all 53-59%)
  // ══════════════════════════════════════════════════════════
  {
    silo: 'chaldean',
    topic: 'Compound 33 Master Teacher',
    tags: ['compound_33', 'master_teacher', 'high_vibration', 'spiritual_service', 'rare', 'chaldean'],
    text: `Compound number 33 in Chaldean numerology is called "The Master Teacher" — one of the rarest and most elevated vibrations in the system. The number 33 carries the energy of the master who has moved beyond personal ambition and now exists primarily to serve, teach, and uplift others. People whose name or destiny reduces to compound 33 carry an extraordinary responsibility — they are often placed by karma into roles where they must guide, heal, or enlighten large numbers of people. The 33 vibration combines the energies of 3 (Jupiter — wisdom and creativity) and 3 again (Jupiter — expansion and dharma), creating a doubled Jupiter force dedicated to spiritual service. The root of 33 is 6 (3+3=6), ruled by Venus — love, beauty, and harmony — suggesting that the 33's master teaching is delivered through love rather than authority. Famous spiritual teachers, healers, and humanitarian leaders often carry the 33 vibration. However, the 33 must be distinguished from a regular 6 — it only operates at the master level when the person has embraced their service calling. Until that awakening, a 33 person may experience the challenges of the 6 — relationship complexity, overgiving, and difficulty establishing personal boundaries. Compound 33 in a business name indicates an enterprise dedicated to healing, teaching, or uplifting its community.`
  },

  {
    silo: 'chaldean',
    topic: 'Compound 43 Pyramid Sacrifice',
    tags: ['compound_43', 'pyramid', 'sacrifice', 'revolutionary', 'misunderstood', 'struggle', 'chaldean'],
    text: `Compound number 43 in Chaldean numerology carries the archetype of "The Pyramid of Sacrifice" — a vibration associated with revolutionary ideals, being ahead of one's time, and experiencing struggle and misunderstanding before eventual recognition. The 43 vibration belongs to those who hold visionary ideas that challenge existing systems. They are reformers, revolutionaries, and idealists who often sacrifice personal comfort and social acceptance for their principles. The Pyramid symbol suggests an immense structure built through extraordinary effort, layer by layer, over a long period — but one that requires sacrifice from both the builder and those around them. Number 43 people are rarely understood in their own time. They may be ridiculed, opposed, or marginalized, only to be vindicated later when history proves their vision correct. This is the vibration of the misunderstood genius, the prophet ahead of their era. The root of 43 is 7 (4+3=7), ruled by Ketu — the planet of spiritual depth, past-life mission, and liberation. This connection to Ketu explains why 43 carries such a strong element of sacrifice and spiritual purpose. Compound 52 carries the same energy as 43 — both are forms of the Pyramid archetype, indicating that the revolutionary struggle and eventual vindication are the central themes. In name correction analysis, compound 43 and 52 are flagged as challenging and are often corrected to more immediately harmonious compounds unless the person specifically embraces the reformer archetype.`
  },

]

// ─────────────────────────────────────────────────────────────
// INJECTION ENGINE — No purge, only additions
// ─────────────────────────────────────────────────────────────

async function getOrCreateSource(
  sourceTable: string,
  title: string
): Promise<string> {
  const { data: existing } = await supabase
    .from(sourceTable)
    .select('id')
    .eq('title', title)
    .single()

  if (existing?.id) return existing.id

  const { data: created, error } = await supabase
    .from(sourceTable)
    .insert({
      title,
      author: 'Sovereign Authority v3',
      is_active: true,
      file_name: 'sovereign-targeted-fix.json'
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create source: ${error.message}`)
  return created!.id
}

async function run() {
  console.log('\n')
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║    NUMERIQ.AI — TARGETED GAP FIX (v3)                   ║')
  console.log('║    5 critical gaps + 29 weak areas                       ║')
  console.log('║    NO PURGE — only adding missing chunks                  ║')
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log(`\n📦 Chunks to inject: ${FIX_CHUNKS.length}`)
  console.log('⚠️  NO purge this time — previous working chunks preserved')
  console.log('📈 Expected: 74% → 90%+ coverage\n')

  const chaldeanSourceId = await getOrCreateSource('library_sources', 'Sovereign Targeted Fix v3')
  const vedicSourceId = await getOrCreateSource('vedic_library_sources', 'Sovereign Targeted Fix v3')

  let success = 0
  let failed = 0

  for (let i = 0; i < FIX_CHUNKS.length; i++) {
    const chunk = FIX_CHUNKS[i]
    const isChaldean = chunk.silo === 'chaldean'
    const embTable = isChaldean ? 'library_embeddings' : 'vedic_library_embeddings'
    const sourceId = isChaldean ? chaldeanSourceId : vedicSourceId
    const wordCount = chunk.text.split(/\s+/).length

    process.stdout.write(
      `[${String(i + 1).padStart(2)}/${FIX_CHUNKS.length}] ` +
      `[${chunk.silo.toUpperCase()}] ${chunk.topic.substring(0, 35).padEnd(35)} ` +
      `(${wordCount}w)...`
    )

    try {
      const embedding = await embed(chunk.text)
      const { error } = await supabase.from(embTable).insert({
        source_id: sourceId,
        chunk_text: chunk.text,
        embedding,
        metadata: {
          type: 'targeted_fix_v3',
          topic: chunk.topic,
          tags: chunk.tags,
          silo: chunk.silo,
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

    await new Promise(r => setTimeout(r, 120))
  }

  console.log('\n')
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log(`║  Injected: ${String(success).padEnd(49)}║`)
  console.log(`║  Failed:   ${String(failed).padEnd(49)}║`)
  console.log('╚══════════════════════════════════════════════════════════╝')
  console.log('\n  ✅ Now run the audit to verify:')
  console.log('     npx tsx scripts/rag-master-audit.ts\n')
}

run()
