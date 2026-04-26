// scripts/hydrate-all-gaps.ts
// COMPLETE GAP FIX — fixes all 13 product-breaking gaps + 41 weak areas
// Run: npx tsx scripts/hydrate-all-gaps.ts
// Then: npx tsx scripts/rag-master-audit.ts  ← verify score jumps to 85%+

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

// ─────────────────────────────────────────────────────────────
// WHY THE OLD CHUNKS FAILED:
// Single-sentence chunks like "Mercury Budha Intelligence speech Wednesday"
// score 32% because the embedding model can't find enough semantic context.
// Rich 150-200 word chunks with multiple related keywords score 70-90%.
// ─────────────────────────────────────────────────────────────

interface Chunk {
    text: string
    silo: 'chaldean' | 'vedic'
    topic: string
    tags: string[]
}

const RICH_CHUNKS: Chunk[] = [

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 1 — Chaldean Letter-Number Table [was 37.1%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Letter Mapping',
        tags: ['letter_table', 'chaldean_alphabet', 'number_assignment'],
        text: `The Chaldean numerology system assigns specific number values to each letter of the alphabet based on their vibrational frequency. The complete Chaldean letter-number table is as follows: the number 1 corresponds to letters A, I, J, Q, and Y. The number 2 corresponds to letters B, K, and R. The number 3 corresponds to letters C, G, L, and S. The number 4 corresponds to letters D, M, and T. The number 5 corresponds to letters E, H, N, and X. The number 6 corresponds to letters U, V, and W. The number 7 corresponds to letters O and Z. The number 8 corresponds to letters F and P. Crucially, the number 9 is never assigned to any letter in the Chaldean system because 9 is considered sacred and divine — the number of completion that cannot be contained in a name. This is the fundamental difference from the Pythagorean system. To calculate a name number, each letter is replaced by its Chaldean value, all values are summed to get the compound number, and then reduced to a single root digit.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 2 — Birth Number Calculation [was 27.6%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Birth Number',
        tags: ['birth_number', 'day_of_birth', 'root_number', 'calculation'],
        text: `The Birth Number in Chaldean numerology is calculated from the day of the month on which a person was born, reduced to a single digit. This is also called the Day Number or Radical Number. To calculate it: take the birth day, and if it is a two-digit number, add the digits together to reduce it to a single digit. For example, someone born on the 23rd has a birth number of 2+3 = 5. Someone born on the 11th has 1+1 = 2. Someone born on the 1st, 10th, 19th, or 28th all have birth number 1. The birth number reveals the outer personality — how others perceive you in the world. It governs your day-to-day behavior, instinctive reactions, and physical vitality. In Chaldean numerology, this number is assigned its corresponding planetary ruler: birth number 1 is ruled by the Sun, 2 by the Moon, 3 by Jupiter, 4 by Rahu, 5 by Mercury, 6 by Venus, 7 by Ketu, 8 by Saturn, and 9 by Mars. The birth number is the most immediately visible expression of your cosmic identity.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 3 — Destiny Number Calculation [was 20.9%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Destiny Number',
        tags: ['destiny_number', 'full_date_birth', 'life_purpose', 'calculation'],
        text: `The Destiny Number in Chaldean numerology is calculated by summing all digits of the full date of birth — day, month, and year — and reducing to a single digit. This number is also called the Life Vibration or Fadic Number. For example, a person born on 14 August 1990: 1+4+0+8+1+9+9+0 = 32, then 3+2 = 5, giving a Destiny Number of 5. Another example: born 23 July 1998: 2+3+0+7+1+9+9+8 = 39, then 3+9 = 12, then 1+2 = 3, giving a Destiny Number of 3. The Destiny Number is more profound than the Birth Number. While the Birth Number reveals your personality, the Destiny Number reveals your life's ultimate purpose — the karmic mission your soul chose before incarnating. It governs your fate, long-term trajectory, and the lessons you must master. In Vedic-Chaldean fusion, the Destiny Number planet is compared to the Atmakaraka (soul significator planet) in the birth chart to find whether the person's name, birthdate, and chart are in harmony or conflict.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 4 — Personal Year Number [was 26.6%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Personal Year',
        tags: ['personal_year', 'personal_month', 'personal_day', 'timing', 'calculation'],
        text: `The Personal Year number in Chaldean numerology reveals the dominant vibration governing any given year of a person's life. It is calculated by adding the birth day, birth month, and the current year, then reducing to a single digit. Formula: Personal Year = (Birth Day digits) + (Birth Month digits) + (Current Year digits), all reduced to a single root. Example: DOB 22 February, current year 2025. Birth day: 2+2=4. Birth month: 0+2=2. Current year: 2+0+2+5=9. Total: 4+2+9=15, then 1+5=6. Personal Year is 6. Personal Year 1 = new beginnings. Personal Year 3 = creativity and expansion. Personal Year 5 = change and movement. Personal Year 8 = financial power and karmic reward. Personal Year 9 = endings and completion. The Personal Month is calculated by adding the Personal Year number to the current month number. The Personal Day is found by adding the Personal Month to the current day. Together these create a precise daily energetic map for timing decisions.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 5 — Soul Urge / Vowel Number [was 41.4%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Soul Urge',
        tags: ['soul_urge', 'vowel_number', 'heart_desire', 'inner_motivation', 'vowels'],
        text: `The Soul Urge Number in Chaldean numerology, also called the Heart Desire or Inner Motivation Number, is calculated using only the vowels in a person's full birth name. The vowels in the Chaldean system are A, E, I, O, and U. Each vowel is assigned its Chaldean value: A=1, E=5, I=1, O=7, U=6. To calculate, extract only the vowels from the full name, sum their values, find the compound, and reduce to a single root digit. The Soul Urge number reveals what the person's soul craves at the deepest level — beyond career, beyond public persona. Soul Urge 1 craves leadership and independence. Soul Urge 2 craves love and partnership. Soul Urge 3 craves creative expression. Soul Urge 6 craves harmony and beauty. Soul Urge 7 craves spiritual wisdom and solitude — the Ketu vibration seeking moksha. Soul Urge 8 craves recognition and power. Soul Urge 9 craves universal service. This number remains hidden from the world — it drives major life decisions invisibly and often explains why someone succeeds in one area but feels unfulfilled despite outward achievements.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 6 — Planetary Friendship Table [was 40.2%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Planetary Friendship',
        tags: ['planetary_friendship', 'enemy_planets', 'neutral_planets', 'sun_friends', 'fusion'],
        text: `The Chaldean-Vedic planetary friendship table is essential for the Fusion Intelligence Layer. It determines whether a person's name number planet harmonizes or conflicts with today's planetary ruler. The complete friendship table: Sun (Surya) is friends with Moon, Mars, and Jupiter; enemies with Saturn and Venus; neutral with Mercury. Moon (Chandra) is friends with Sun and Mercury; has no true enemies; neutral with Mars, Jupiter, Venus, and Saturn. Mars (Mangal) is friends with Sun, Moon, and Jupiter; enemy with Mercury; neutral with Venus and Saturn. Mercury (Budha) is friends with Sun and Venus; enemy with Moon; neutral with Mars, Jupiter, and Saturn. Jupiter (Guru) is friends with Sun, Moon, and Mars; enemies with Mercury and Venus; neutral with Saturn. Venus (Shukra) is friends with Mercury and Saturn; enemies with Sun and Moon; neutral with Mars and Jupiter. Saturn (Shani) is friends with Mercury and Venus; enemies with Sun, Moon, and Mars; neutral with Jupiter. Rahu and Ketu are friendly with Saturn and Venus; enemies with Sun, Moon, and Mars. When a user's name planet and today's Vara planet are enemies, the daily energy is conflicted and caution is advised. When they are friends, the day amplifies positive results.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 7 — Saturn Planetary Friendship [was 37.0%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Saturn Planetary Friendship',
        tags: ['saturn_friendship', 'shani_enemies', 'mercury_venus_friends', 'planetary_relationship'],
        text: `Saturn's planetary relationships are crucial for understanding karmic compatibility in the Chaldean fusion system. Saturn (Shani) is friendly with Mercury (Budha) and Venus (Shukra). This means a person with name number 8 (Saturn) will find Wednesday and Friday to be supportive days — Mercury's Wednesday brings analytical clarity and business success, while Venus's Friday brings luxury and harmony. Saturn's enemies are Sun (Surya), Moon (Chandra), and Mars (Mangal). Therefore, a number 8 person will find Sunday, Monday, and Tuesday particularly challenging — authority clashes on Sunday, emotional instability on Monday, conflicts on Tuesday. Saturn is neutral toward Jupiter. When Saturn meets Jupiter's Thursday, results are mixed — expansion is possible but delayed. The Sun-Saturn enmity is especially significant: a person with name number 1 (Sun) facing Saturn's Saturday will experience suppressed confidence and karmic delays. The Moon-Saturn enmity means number 2 people face emotional heaviness on Saturdays. Understanding these relationships allows the system to generate precise daily guidance calibrated to each user's unique planetary identity.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 8 — Mercury / Budha Navagraha [was 32.6%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Mercury Budha',
        tags: ['mercury', 'budha', 'emerald', 'wednesday', 'intelligence', 'speech', 'business'],
        text: `Mercury, known as Budha in Vedic astrology, is the planet of intelligence, communication, speech, trade, and the analytical mind. Mercury governs the nervous system, skin, and respiratory system in the physical body. The day of Mercury is Wednesday (Budhavara). Mercury's metal is bronze or mixed metals. The gemstone for Mercury is Emerald (Panna), which should be worn in gold on the little finger of the right hand on a Wednesday during the Mercury hora. Mercury's color is green, its direction is North, and its deity is Lord Vishnu in the Budha form. Mercury is strong in Gemini and Virgo (its own signs) and exalted in Virgo at 15 degrees. Mercury is debilitated in Pisces. Mercury governs the 3rd and 6th houses of the natural zodiac. In the body, Mercury rules the lungs, tongue, vocal cords, and nervous system. Afflicted Mercury causes speech problems, poor memory, indecision, skin diseases, and business failures. The Mercury mantra is "Om Budhaya Namah" chanted 17 times on Wednesdays at sunrise. Remedy for weak Mercury: donate green vegetables or moong dal to students on Wednesdays, wear green on Wednesday, and offer Tulsi leaves to Lord Vishnu.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 9 — Sade Sati Three Phases [was 42.2%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Sade Sati',
        tags: ['sade_sati', 'three_phases', 'rising_phase', 'peak_phase', 'setting_phase', 'saturn_transit'],
        text: `Sade Sati is the 7.5-year period during which Saturn transits through three consecutive zodiac signs centered on the natal Moon sign. It is one of the most significant and life-altering transits in Vedic astrology. Sade Sati has three distinct phases: The Rising Phase (Dhaiya) occurs when Saturn transits the sign immediately before the natal Moon sign. This phase lasts approximately 2.5 years and affects the person's father, family, and finances. Physical health may require attention. The Peak Phase occurs when Saturn transits directly over the natal Moon sign. This is the most intense period — the mind, mother, emotions, and mental peace are directly challenged. Major life restructuring occurs. Career changes, relocations, and relationship transformations are common. However, this phase also burns away karma and creates space for authentic growth. The Setting Phase occurs when Saturn transits the sign immediately after the natal Moon sign. This phase brings gradual relief and often a period of reward and recognition for efforts made during the peak. Sade Sati is not a period of punishment but of deep karmic acceleration. Remedy: chant "Om Shanaischaraya Namah" 23 times every Saturday, donate black sesame seeds and mustard oil to a Shani temple, fast on Saturdays, and offer oil to the Shani deity.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 10 — Mercury Mahadasha [was 43.6%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Mercury Mahadasha',
        tags: ['mercury_mahadasha', 'budha_dasha', '17_years', 'intelligence', 'business', 'communication'],
        text: `Mercury Mahadasha lasts 17 years in the Vimshottari Dasha system. This is a period of heightened intellectual activity, business expansion, communication skill, and analytical development. Mercury governs trade, education, writing, teaching, technology, and all forms of exchange. During Mercury Mahadasha, the native typically experiences success in careers related to business, media, writing, teaching, medicine, accounting, law, or technology. If Mercury is well-placed in the natal chart — especially in Gemini, Virgo, or Taurus — this period brings extraordinary intellectual achievement, financial gains through trade, and improvements in communication. If Mercury is afflicted (in Pisces, or conjunct Rahu or Ketu), the period may bring nervous disorders, indecision, speech problems, or financial instability through bad deals. The sub-periods (Antardashas) within Mercury Mahadasha that are most productive are Venus Antardasha and Jupiter Antardasha. The most challenging sub-period is typically Ketu Antardasha. During Mercury Mahadasha, strengthening Mercury through emerald gemstone, Wednesday fasting, and Vishnu worship amplifies positive results. Students and entrepreneurs particularly benefit from this Mahadasha when Mercury is strong.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 11 — 2nd House [was 32.2%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: '2nd House',
        tags: ['2nd_house', 'dhana_bhava', 'wealth', 'family', 'speech', 'food', 'early_education'],
        text: `The 2nd House in Vedic astrology is called Dhana Bhava — the house of wealth and accumulated resources. It governs the family of birth, accumulated wealth and savings, speech and voice, food and eating habits, early childhood education, and the right eye. The 2nd house also represents one's value system, self-worth, and how one earns and accumulates resources. Jupiter placed in the 2nd house gives eloquence, wealth through wisdom, and a large, supportive family. Venus in the 2nd house gives a melodious voice, love of fine food, and wealth through artistic pursuits. Saturn in the 2nd house creates speech difficulties and delays in wealth accumulation, but rewards with steady financial growth in later life. Rahu in the 2nd house can bring wealth through unconventional means and foreign connections but also creates issues with truthfulness. The 2nd house lord's placement determines where and how wealth comes to the native. When the 2nd and 11th lords are in conjunction or mutual aspect, Dhana Yoga is formed — indicating strong wealth accumulation. Afflictions to the 2nd house can cause financial losses, family disputes, or speech defects. Remedy for a weak 2nd house: worship Goddess Lakshmi on Fridays, donate food to the poor, and chant the Kubera mantra.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 12 — 11th House [was 37.0%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: '11th House',
        tags: ['11th_house', 'labha_bhava', 'income', 'gains', 'social_networks', 'fulfillment', 'elder_siblings'],
        text: `The 11th House in Vedic astrology is called Labha Bhava — the house of gains, income, and fulfillment of desires. It governs all forms of income and profit, elder siblings, social networks and friendships, large groups and communities, long-term goals and aspirations, and the fulfillment of desires. The 11th house is one of the most auspicious houses — any planet placed here tends to give material gains, though the nature of gains depends on the planet. Jupiter in the 11th house is exceptionally powerful, bringing wealth through wisdom, networks, and spiritual connections. Saturn in the 11th house gives steady, disciplined income growth and influential friends in high positions, though gains may come slowly. Rahu in the 11th house brings sudden and unexpected financial gains, often through foreign connections or unconventional channels. The 11th house is also known as the house of elder siblings — its condition reveals the relationship with older brothers and sisters. When the 11th house lord is strong and connected to the 2nd house lord, it forms a powerful Dhana Yoga for wealth. The 11th house governs the left ear and left leg in the physical body. Remedy for a weak 11th house: strengthen the 11th lord's planet through appropriate gemstone and mantra practices.`
    },

    // ════════════════════════════════════════════════════════════
    // CRITICAL GAP 13 — Sun Remedy [was 42.4%]
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Sun Remedy',
        tags: ['sun_remedy', 'surya_remedy', 'ruby', 'sunday_fast', 'wheat_jaggery', 'surya_namaskar'],
        text: `The Sun (Surya) remedy protocol in Vedic astrology addresses weakness or affliction of the Sun in the birth chart. An afflicted Sun causes low confidence, poor relationship with father or authority figures, government problems, heart issues, and lack of vitality. The primary gemstone remedy for the Sun is Ruby (Manik), which should be set in gold and worn on the ring finger of the right hand on a Sunday during the Sun hora (one hour after sunrise). The ruby should be at least 3 carats and activated by chanting "Om Suryaya Namah" 108 times before wearing. Supporting remedies for a weak Sun: practice Surya Namaskar (12 sun salutations) every morning at sunrise while facing East. Offer water to the rising Sun mixed with red sandalwood or red flowers — this is called Arghya and is performed daily. Fast on Sundays, avoiding salt and oil. Donate wheat and jaggery to a temple or to workers on Sundays. Feed wheat bread to cows on Sundays. Offer red flowers to Lord Surya Dev. Chant the Aditya Hridayam stotra for powerful solar strengthening. Wear orange, golden, or copper-colored clothes on Sundays. The copper vessel is sacred to Surya — drinking water stored overnight in a copper vessel daily strengthens Sun energy significantly.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREA FIXES — Number 1-9 Traits (richer chunks)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Number 1 Sun Traits',
        tags: ['number_1', 'sun_surya', 'leadership', 'pioneer', 'individuality', 'chaldean'],
        text: `Number 1 in Chaldean numerology is ruled by the Sun (Surya) and represents the primal force of leadership, individuality, and pioneering energy. People with a dominant number 1 — whether in their name, birth, or destiny position — carry the Sun's qualities of authority, confidence, creativity, and the drive to be first and original. Number 1 personalities are natural leaders who excel in positions of authority and independence. They struggle to follow others and work best when self-employed or in command. The shadow side of number 1 is ego, arrogance, and difficulty collaborating. In the Vedic-Chaldean fusion, a number 1 person's Sun energy interacts powerfully on Sundays (Sun's day), and is supported by the presence of Moon, Mars, and Jupiter days. Saturday (Saturn's day) is the most challenging for number 1 people due to the Sun-Saturn enmity. Lucky colors for number 1: gold, orange, copper. Auspicious direction: East. Mantra: "Om Suryaya Namah" 108 times at sunrise. Best careers: government, politics, management, medicine, entrepreneurship. The number 1 compound archetypes include 10 (Wheel of Fortune), 19 (Prince of Heaven), 28, and 37 — all carrying distinctly solar victories.`
    },

    {
        silo: 'chaldean',
        topic: 'Number 2 Moon Traits',
        tags: ['number_2', 'moon_chandra', 'emotion', 'intuition', 'sensitivity', 'chaldean'],
        text: `Number 2 in Chaldean numerology is ruled by the Moon (Chandra) and represents emotional intelligence, intuition, diplomacy, and the need for partnership. People with number 2 prominent in their chart are deeply sensitive, empathetic, and naturally attuned to the feelings of others. They excel in roles requiring emotional understanding — counseling, nursing, diplomacy, hospitality, and the arts. The Moon's cyclic nature makes number 2 people prone to mood swings and emotional fluctuations that mirror the lunar phases. They thrive in partnerships and struggle with solitude. Number 2 personalities are natural peacemakers and mediators. Their strength is their intuition — they often "know" things without being told. Their weakness is over-sensitivity, indecisiveness, and dependency on others for emotional validation. In the Vedic fusion, Monday (Chandra Vara) is the power day for number 2 people. New Moon (Amavasya) and Full Moon (Purnima) days have heightened effects on their emotional state. Lucky colors: white, silver, pearl. Gemstone: Pearl (Moti) in silver on the little finger. Mantra: "Om Chandraya Namah" 11 times on Monday. Food recommendation: avoid overly spicy food, favor milk, rice, and white foods.`
    },

    {
        silo: 'chaldean',
        topic: 'Number 4 Rahu Traits',
        tags: ['number_4', 'rahu', 'uranus', 'disruption', 'rebellion', 'unconventional', 'chaldean'],
        text: `Number 4 in Chaldean numerology is ruled by Rahu (and Uranus in Western correspondence), making it the most unconventional and disruptive of all numbers. People with number 4 as their dominant vibration are rebels, innovators, and reformers who challenge established systems. They think differently from the crowd, often ahead of their time, and attract both intense supporters and intense opposition. Number 4 people frequently experience sudden changes, unexpected events, and reversals of fortune. Rahu's amplifying nature makes their obsessions intense — they pursue goals with single-minded focus. They excel in technology, research, foreign trade, astrology, occult sciences, and any field that breaks conventional boundaries. The challenges of number 4 include: being misunderstood, facing opposition from authority, and experiencing erratic financial flows — periods of sudden abundance followed by unexpected loss. In relationships, number 4 people need partners who can handle their unconventional nature. Tuesday and Saturday are mixed days for number 4 (Rahu shares energy with Saturn). Remedy for number 4: chant "Om Rahuve Namah" 18 times, donate to causes involving outcasts or marginalized people, wear hessonite gemstone after proper astrological evaluation. Lucky colors: electric blue, gray, metallic tones.`
    },

    {
        silo: 'chaldean',
        topic: 'Number 5 Mercury Traits',
        tags: ['number_5', 'mercury', 'budha', 'intelligence', 'communication', 'business', 'chaldean'],
        text: `Number 5 in Chaldean numerology is ruled by Mercury (Budha), making it the vibration of intellect, communication, adaptability, and commerce. Number 5 is the most versatile and freedom-loving of all numbers. People with a dominant number 5 are quick thinkers, excellent communicators, natural salespeople, and thrive on variety and change. They process information rapidly and become bored easily with routine. Number 5 personalities excel in business, media, writing, teaching, sales, travel, and any field that rewards adaptability and wit. The freedom of movement — both physical and intellectual — is essential for number 5 people. When constrained or forced into monotony, they become restless and self-destructive. The shadow of number 5 is inconsistency, over-commitment, and a tendency to spread energy too thin across multiple projects. In the Vedic fusion, Wednesday (Budha Vara) is the most powerful day for number 5 people. Their planetary friendship with Venus makes Friday also productive. Moon's Monday creates some emotional tension. Remedy: chant "Om Budhaya Namah" 17 times on Wednesdays. Wear emerald. Lucky color: green. Best careers: journalism, business, teaching, travel industry, technology, stock trading.`
    },

    {
        silo: 'chaldean',
        topic: 'Number 8 Saturn Traits',
        tags: ['number_8', 'saturn_shani', 'karma', 'discipline', 'delay', 'justice', 'chaldean'],
        text: `Number 8 in Chaldean numerology is ruled by Saturn (Shani), the planet of karma, discipline, delayed reward, and justice. Number 8 is one of the most powerful and karmic vibrations in the entire system. People with a dominant number 8 carry heavy karmic responsibility — they are here to master material power through sustained effort, discipline, and service to a larger cause. Number 8 people often face significant obstacles in the first half of their lives, only to achieve remarkable power and recognition in the latter half. They are natural builders, executives, and leaders in large organizations. Saturn's energy makes number 8 people methodical, patient under pressure, and capable of extraordinary endurance. The shadow of number 8 includes workaholism, emotional coldness, and a tendency to attract karmic debts through shortcuts or unethical means. The number 8 is frequently misunderstood as "unlucky" — this is a misconception. It is the number of great builders: architects, CEOs, political leaders, and spiritual masters often carry the 8 vibration. Saturday (Shani Vara) is both the power day and the most intense day for number 8 people. Remedy: wear blue sapphire (only after proper evaluation), donate black sesame on Saturdays, chant "Om Shanaischaraya Namah" 23 times, fast on Saturdays.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Mahadasha enrichment
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Ketu Mahadasha',
        tags: ['ketu_mahadasha', '7_years', 'past_life', 'spirituality', 'sudden_events', 'detachment'],
        text: `Ketu Mahadasha lasts 7 years in the Vimshottari Dasha system and is one of the most spiritually significant periods in a person's life. Ketu represents past karma, spiritual liberation, detachment, and sudden unexpected events. During Ketu Mahadasha, the native often experiences a disconnection from worldly ambitions — material pursuits feel hollow and the pull toward spirituality, introspection, and inner truth becomes overwhelming. Ketu Mahadasha frequently brings sudden changes: unexpected job losses, relationship endings, geographic relocations, or health episodes that force a complete reassessment of life priorities. These events, though painful, serve to burn away accumulated karma and align the native with their soul's true purpose. If Ketu is well-placed in the natal chart — especially in the 12th house, 9th house, or conjunct Jupiter — this Mahadasha can bring extraordinary spiritual experiences, occult powers, foreign travel for spiritual purposes, and liberation from karmic cycles. If Ketu is afflicted or in the 7th or 2nd house, the period may bring losses in relationships and finances. Remedy during Ketu Mahadasha: worship Lord Ganesha and Lord Bhairava, chant "Om Ketave Namah" 7 times daily, donate multicolored cloth or blankets on Tuesdays, wear cat's eye gemstone after evaluation, and practice meditation and pranayama to channel Ketu's inward energy constructively.`
    },

    {
        silo: 'vedic',
        topic: 'Sun Mahadasha',
        tags: ['sun_mahadasha', '6_years', 'authority', 'government', 'career', 'father', 'status'],
        text: `Sun Mahadasha lasts 6 years and governs a period of authority, self-realization, career advancement, and focus on public status and recognition. The Sun represents the soul, father, government, and the authentic self. During Sun Mahadasha, the native's relationship with authority figures comes into sharp focus — with the father, with employers, with government institutions. Career advancement is strongly favored, particularly in government service, politics, medicine, or any field requiring leadership and public presence. Sun Mahadasha activates the native's confidence, health, and vitality. Those with a strong Sun in their natal chart experience this as a period of great achievement and recognition. Those with an afflicted Sun may face conflicts with authority, issues with father or government, health problems related to heart or eyes, and ego-driven mistakes. The native must be careful of arrogance and must channel the Sun's energy into service leadership rather than ego-leadership. The most productive Antardashas within Sun Mahadasha are Moon Antardasha (emotional support amplifies leadership) and Mars Antardasha (courage and decisive action). The most challenging is Saturn Antardasha due to the Sun-Saturn enmity. Remedy: practice Surya Namaskar daily, offer Arghya to the sunrise, chant the Gayatri Mantra 108 times.`
    },

    {
        silo: 'vedic',
        topic: 'Moon Mahadasha',
        tags: ['moon_mahadasha', '10_years', 'emotions', 'mother', 'mind', 'travel', 'fluctuation'],
        text: `Moon Mahadasha lasts 10 years and governs the mind, emotions, mother, the public, and fluctuating life experiences. The Moon rules the subconscious mind, instincts, and emotional security. During Moon Mahadasha, the native's emotional life becomes the central theme — relationships with the mother and maternal figures are highlighted, and the native may experience heightened emotional sensitivity that can be both a gift and a vulnerability. Travel is frequently indicated during Moon Mahadasha, particularly water-related travel or relocation near water bodies. The native may work in fields involving the public, hospitality, food, or caregiving. Business ventures related to agriculture, dairy, or the sea prosper. If the Moon is strong and well-placed in the natal chart — especially in Taurus, Cancer, or conjunct benefics — this Mahadasha brings popularity, emotional fulfillment, and prosperity. If the Moon is afflicted — conjunct Rahu (Grahan Yoga), in Scorpio, or aspected by Saturn — the period may bring depression, anxiety, mental instability, and troubled relationships. Remedy: wear a natural pearl in silver on Monday, fast on Mondays, offer white flowers and milk to Lord Shiva and the Moon deity, chant "Om Chandraya Namah" 11 times daily.`
    },

    {
        silo: 'vedic',
        topic: 'Mars Mahadasha',
        tags: ['mars_mahadasha', '7_years', 'energy', 'courage', 'property', 'conflicts', 'siblings'],
        text: `Mars Mahadasha lasts 7 years and brings a period of high energy, ambition, courage, conflict, and decisive action. Mars governs energy, courage, siblings, land, property, surgery, and the military. During Mars Mahadasha, the native experiences a surge in physical energy and ambition. This is an excellent period for athletic achievement, military advancement, real estate acquisition, and launching competitive ventures. However, Mars Mahadasha also increases the risk of accidents, surgeries, aggressive conflicts, and impulsive decisions that lead to setbacks. Siblings may play a significant role during this period — either as allies or as sources of conflict. If Mars is well-placed — especially in Aries, Scorpio, or Capricorn — the native can achieve remarkable breakthroughs in career and property accumulation. If Mars is afflicted or in Cancer (debilitated), the period brings accidents, legal conflicts, and strained relationships. Mars Mahadasha is particularly transformative for number 9 people (Chaldean Mars rulers) and those with Aries or Scorpio Lagna. Remedy: worship Lord Hanuman on Tuesdays, offer red flowers and sindoor, chant "Om Angarakaya Namah" 21 times, donate red lentils, wear red coral in copper after proper evaluation. Avoid anger and impulsive decisions throughout this period.`
    },

    {
        silo: 'vedic',
        topic: 'Rahu Mahadasha',
        tags: ['rahu_mahadasha', '18_years', 'obsession', 'foreign', 'ambition', 'sudden_rise', 'fall'],
        text: `Rahu Mahadasha is the longest at 18 years and is one of the most transformative, unpredictable, and intensely karmic periods in the Vimshottari system. Rahu represents obsession, illusion, foreign connections, technology, and sudden amplified events. During Rahu Mahadasha, the native becomes deeply driven by desire — ambitions intensify, opportunities appear from unexpected sources, and there is often a dramatic rise in status or wealth. However, Rahu's illusory nature means that what appears as solid success can dissolve unexpectedly. Foreign travel and foreign connections are powerfully favored during this period. Careers in technology, media, pharmaceuticals, politics, and mass entertainment prosper. The native may become involved with unconventional philosophies or communities. The most challenging aspect of Rahu Mahadasha is the psychological intensity — obsessive thinking, restlessness, fear of the unknown, and a feeling of being driven by forces beyond conscious control. If Rahu is placed in the 3rd, 6th, or 11th house — upachaya houses — this Mahadasha brings extraordinary worldly success. If Rahu is in the 1st, 7th, or 8th house, significant upheaval in identity and relationships occurs. Remedy: worship Goddess Durga on Saturdays, chant "Om Rahuve Namah" 18 times, donate blue cloth and sesame to the poor, wear hessonite after evaluation.`
    },

    {
        silo: 'vedic',
        topic: 'Saturn Mahadasha',
        tags: ['saturn_mahadasha', '19_years', 'karma', 'discipline', 'hard_work', 'delays', 'reward'],
        text: `Saturn Mahadasha is the second longest at 19 years and represents the most profound karmic reckoning in the Vimshottari system. Saturn (Shani Dev) is the great equalizer — the planet of karma, discipline, hard work, service, and delayed but certain justice. During Saturn Mahadasha, the native's life is restructured around the themes of effort and accountability. Shortcuts and unethical behavior are eliminated. The native must work harder than in any other Mahadasha, but the rewards — when they come — are lasting and profound. The first half of Saturn Mahadasha is typically more challenging: delays in career, health issues related to bones and joints, burdens of responsibility, and financial pressure. The second half brings consolidation, authority, and recognition for sustained effort. Saturn Mahadasha is particularly favorable for professions in law, government, mining, construction, agriculture, and social service. It is unfavorable for speculative ventures and get-rich-quick schemes — Saturn punishes impatience. If Saturn is well-placed in Libra (exalted), Capricorn, or Aquarius, this becomes a period of extraordinary achievement and institutional power. Remedy: fast on Saturdays, donate black sesame and mustard oil at a Shani temple, chant "Om Shanaischaraya Namah" 23 times every Saturday, serve the poor and elderly throughout this period.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Houses (missing ones enriched)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: '5th House',
        tags: ['5th_house', 'putra_bhava', 'children', 'intelligence', 'creativity', 'romance', 'past_karma', 'poorva_punya'],
        text: `The 5th house in Vedic astrology is called Putra Bhava and is one of the three Trikona houses (1st, 5th, 9th) — the most auspicious house grouping in the entire chart. The 5th house governs children and progeny, intelligence and intellect, creativity and artistic talent, romance and love affairs, speculation and gambling, higher education, and most importantly — Poorva Punya, the accumulated merit from past lives. The condition of the 5th house reveals the quality of creative expression, the blessings or challenges with children, and the depth of one's spiritual merit. Jupiter placed in the 5th house is one of the most auspicious combinations in Vedic astrology — it brings multiple children, exceptional intelligence, wisdom, and strong past-life merit. Sun in the 5th house gives creative leadership and children who achieve prominence. Saturn in the 5th house delays or complicates the birth of children and requires effort in creative expression. Rahu in the 5th can cause unconventional approaches to romance, adoption, or children from foreign partners. The 5th house lord's placement indicates the area of life through which creative expression and past-life merit manifest. Remedy for an afflicted 5th house: worship Lord Ganesha for children, chant the Santana Gopala mantra 108 times for fertility, offer yellow flowers to Jupiter, and perform charitable acts for children in need.`
    },

    {
        silo: 'vedic',
        topic: 'Sade Sati Detection',
        tags: ['sade_sati', 'saturn_transit', 'moon_sign', 'challenge', 'remedy', '7.5_years'],
        text: `Sade Sati detection requires knowing the native's natal Moon sign (Janma Rashi) and comparing it to Saturn's current transit position. Saturn transits each zodiac sign for approximately 2.5 years, completing its journey through all 12 signs in approximately 29.5 years. Sade Sati begins when Saturn enters the sign immediately before the natal Moon sign and ends when Saturn exits the sign immediately after it — a total transit through three signs equaling 7.5 years. For example, if the natal Moon is in Aquarius (Kumbha), Sade Sati begins when Saturn enters Capricorn, peaks when Saturn is in Aquarius directly over the Moon, and ends when Saturn exits Pisces. The detection algorithm: check if Saturn's current zodiac position is within the range of (Moon sign - 1) to (Moon sign + 1). If yes, Sade Sati is active. Determine the phase based on whether Saturn is in the sign before (rising phase), the same sign (peak phase), or the sign after (setting phase). The intensity of effects depends on Saturn's natal house strength, aspects, and whether the native is also running a Saturn Mahadasha simultaneously. Sade Sati is not universally negative — for Capricorn and Aquarius Moon signs (Saturn's own signs), and Libra Moon (Saturn exalted), Sade Sati can bring significant achievements alongside challenges.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Koota Compatibility (full enrichment)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Ashta Koota Milan Complete',
        tags: ['ashta_koota', 'koota_milan', '36_points', 'marriage_matching', 'minimum_18', 'compatibility'],
        text: `Ashta Koota Milan is the Vedic system of marriage compatibility analysis that examines eight parameters (Kootas) between two people's birth Nakshatras, awarding points that are summed to a total out of 36. The eight Kootas and their points are: Varna Koota (1 point) — spiritual compatibility based on caste classification of Nakshatras. Vashya Koota (2 points) — natural attraction and control balance between partners. Tara Koota (3 points) — birth star compatibility through sequential counting. Yoni Koota (4 points) — sexual and intimate compatibility through symbolic animal assignment. Graha Maitri Koota (5 points) — mental and intellectual compatibility through Moon sign lords' friendship. Gana Koota (6 points) — temperament compatibility through Deva, Manushya, Rakshasa classification. Bhakoot Koota (7 points) — financial and health compatibility through Moon sign relationships. Nadi Koota (8 points) — physiological and genetic compatibility through Aadi, Madhya, Antya Nadi classification. Total maximum: 36 points. A score of 18 or above is considered the minimum acceptable for marriage. A score of 28 or above indicates an excellent match. Specific Doshas (incompatibilities) — especially Nadi Dosha and Bhakoot Dosha — can override a high total score and require remedial action before marriage.`
    },

    {
        silo: 'vedic',
        topic: 'Nadi Koota',
        tags: ['nadi_koota', '8_points', 'nadi_dosha', 'aadi_madhya_antya', 'marriage', 'compatibility'],
        text: `Nadi Koota is the most heavily weighted of the eight compatibility parameters in Ashta Koota Milan, carrying 8 points out of 36. Nadi refers to the three energy channels (Nadis) of the human body: Aadi (Vata/wind energy), Madhya (Pitta/fire energy), and Antya (Kapha/water energy). Each of the 27 Nakshatras is classified into one of these three Nadis. Nadi Dosha occurs when both partners belong to the same Nadi — both Aadi, both Madhya, or both Antya. Same-Nadi couples score zero points in this category and carry the risk of health problems, childlessness, or premature death of a partner. Different Nadis score the full 8 points, indicating physiological and genetic compatibility. The Nakshatra-to-Nadi assignments: Aadi Nadi — Ashwini, Ardra, Punarvasu, Uttara Phalguni, Hasta, Jyeshtha, Mula, Shatabhisha, Purva Bhadrapada. Madhya Nadi — Bharani, Mrigashira, Pushya, Purva Phalguni, Chitra, Anuradha, Purva Ashadha, Dhanishta, Uttara Bhadrapada. Antya Nadi — Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, Uttara Ashadha, Shravana, Revati. Nadi Dosha can be partially mitigated if both partners have the same birth Nakshatra but different Padas, or through specific Nadi Dosha Nivarana puja performed by a qualified priest.`
    },

    {
        silo: 'vedic',
        topic: 'Gana Koota',
        tags: ['gana_koota', '6_points', 'deva', 'manushya', 'rakshasa', 'temperament', 'marriage'],
        text: `Gana Koota carries 6 points in Ashta Koota Milan and assesses temperament compatibility between marriage partners. All 27 Nakshatras are classified into three temperamental groups called Ganas. Deva Gana (Divine temperament) includes: Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, and Revati. These natives are gentle, religious, flexible, and spiritually inclined. Manushya Gana (Human temperament) includes: Bharani, Rohini, Ardra, Purva Phalguni, Uttara Phalguni, Purva Ashadha, Uttara Ashadha, Purva Bhadrapada, and Uttara Bhadrapada. These natives are balanced — neither extremely spiritual nor extremely material. Rakshasa Gana (Fierce temperament) includes: Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Mula, Dhanishta, and Shatabhisha. These natives are intense, passionate, strong-willed, and independent. Scoring: same Gana (Deva-Deva, Manushya-Manushya, Rakshasa-Rakshasa) = 6 points. Deva-Manushya = 5 points. Manushya-Rakshasa = 1 point. Deva-Rakshasa = 0 points — this is considered the most temperamentally incompatible combination and often leads to serious marital conflict. Rakshasa Gana individuals often do best marrying within their own Gana.`
    },

    {
        silo: 'vedic',
        topic: 'Bhakoot Koota',
        tags: ['bhakoot_koota', '7_points', 'moon_sign', '2-12', '6-8', 'dosha', 'marriage'],
        text: `Bhakoot Koota carries 7 points in Ashta Koota Milan and governs financial prosperity, health, and longevity in marriage. It is calculated by examining the numerical relationship between the Moon signs of bride and groom. Count from the groom's Moon sign to the bride's — and vice versa — and use both numbers to determine the Bhakoot relationship. Auspicious relationships: 1-1 (same Moon sign), 1-7 (opposite signs), 3-11, 4-10, 5-9 configurations in some traditions. Inauspicious Bhakoot Doshas: 2-12 relationship between Moon signs — this indicates one partner may cause financial loss or separation to the other. 6-8 relationship — this creates Shad-Ashtaka Dosha associated with serious health problems, conflict, and unhappiness in marriage. 5-9 relationship in stricter traditions may affect children and fortune. Bhakoot Dosha can be cancelled or mitigated if both partners share the same Nadi, if the Rashi lords are mutual friends, or if both belong to the same Rashi. The effects of Bhakoot Dosha are significantly reduced when Jupiter aspects both Moon signs or when the overall Ashta Koota score is above 28. Specific remedies for Bhakoot Dosha include Mangal Dosha puja, joint worship of Lakshmi-Narayan, and wearing complementary gemstones as prescribed by a qualified astrologer.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Panchanga enrichment
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Tithi Auspicious',
        tags: ['tithi', 'lunar_day', 'auspicious', 'inauspicious', 'activities', '30_tithis'],
        text: `Tithi is one of the five limbs of the Panchanga (daily almanac) and represents the lunar day — there are 30 Tithis in a complete lunar month, 15 in the waxing phase (Shukla Paksha) and 15 in the waning phase (Krishna Paksha). Each Tithi has distinct qualities that make it auspicious or inauspicious for specific activities. Auspicious Tithis for important activities: Pratipada (1st), Panchami (5th), Saptami (7th), Dashami (10th), Ekadashi (11th), and Trayodashi (13th) are generally favorable. Purnima (15th, Full Moon) is highly auspicious for worship and spiritual practices. Inauspicious Tithis to avoid for new ventures: Chaturthi (4th), Ashtami (8th), Navami (9th), Chaturdashi (14th), and Amavasya (30th, New Moon) are generally avoided for starting new businesses, marriages, or important undertakings. Amavasya is sacred for ancestral worship (Pitru Tarpan) but inauspicious for worldly beginnings. Ekadashi (11th Tithi of both Shukla and Krishna Paksha) is the most sacred fasting day in the Vaishnava tradition, dedicated to Lord Vishnu. For a complete Muhurat analysis, the Tithi must be considered alongside Vara (weekday), Nakshatra, Yoga, and Karana to find a time when all five factors are favorable simultaneously.`
    },

    {
        silo: 'vedic',
        topic: 'Amavasya and Shukla Krishna Paksha',
        tags: ['amavasya', 'new_moon', 'shukla_paksha', 'krishna_paksha', 'waxing_waning', 'ancestor_worship', 'pitru'],
        text: `The lunar month in the Vedic calendar is divided into two fortnights: Shukla Paksha (the waxing or bright fortnight) and Krishna Paksha (the waning or dark fortnight). Shukla Paksha begins on the day after Amavasya (New Moon) and culminates at Purnima (Full Moon). This is the period of increasing lunar energy — the Moon grows from a sliver to completeness. Shukla Paksha is auspicious for beginning new ventures, conducting auspicious ceremonies, planting seeds (both literal and metaphorical), and any activity where growth and increase are desired. Krishna Paksha begins the day after Purnima and culminates at Amavasya (New Moon). This is the period of decreasing lunar energy. Krishna Paksha is better suited for completing existing work, introspection, spiritual practices, fasting, and letting go of what no longer serves. Amavasya (New Moon) is a sacred day for ancestor worship — the Pitru Tarpan ritual, where water, sesame, and rice are offered to the departed ancestors. Starting new businesses, marriages, or auspicious ceremonies on Amavasya is strongly avoided. Purnima (Full Moon) is ideal for worship, gratitude practices, and beginning spiritual sadhana. The waxing Moon amplifies whatever is initiated — making Shukla Paksha the premium window for all new beginnings in the Numeriq.AI Muhurat finder.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Planet in House (fuller chunks)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Jupiter 5th House',
        tags: ['jupiter_5th_house', 'children', 'wisdom', 'past_karma', 'auspicious', 'poorva_punya'],
        text: `Jupiter (Guru) placed in the 5th house is one of the most auspicious planetary positions in the entire Vedic birth chart. The 5th house governs children, intelligence, creativity, and Poorva Punya (past-life merit). Jupiter — the planet of wisdom, expansion, and dharma — placed here amplifies all these qualities exponentially. Jupiter in the 5th house bestows multiple children or exceptional children who bring honor to the family, outstanding intelligence and academic ability, strong spiritual merit from previous lives, creative and philosophical genius, and natural skill in teaching and counseling. This placement creates a natural inclination toward spiritual wisdom and the ability to attract good fortune through righteous action. The native is often blessed with a sharp, expansive mind and performs exceptionally well in higher education, philosophy, law, and spiritual pursuits. If Jupiter is retrograde or afflicted in the 5th, the blessings are still present but may manifest later in life or require conscious spiritual effort. Jupiter in the 5th house in a man's chart also indicates a deeply protective and nurturing relationship with his children. In the Chaldean fusion system, a person with a number 3 name (Jupiter-ruled) and natal Jupiter in the 5th house carries extraordinary creative and spiritual potential — the planetary identity and chart placement reinforce each other powerfully.`
    },

    {
        silo: 'vedic',
        topic: 'Saturn 7th House',
        tags: ['saturn_7th_house', 'marriage', 'delay', 'discipline', 'partner', 'karma'],
        text: `Saturn (Shani) placed in the 7th house has significant implications for marriage, partnerships, and one-to-one relationships. The 7th house governs marriage, business partnerships, open enemies, and foreign connections. Saturn's presence here brings delayed marriage — the native typically marries later than their peer group, often in their thirties or beyond. This delay is not a punishment but a preparation — Saturn ensures that when marriage comes, it is built on a foundation of maturity, commitment, and realistic expectations. Saturn in the 7th house often brings a partner who is older, more serious, or who carries Saturnine qualities — responsibility, discipline, practicality, and a focused work ethic. The marriage is typically stable once established, but requires conscious effort to maintain warmth and emotional connection. If Saturn is well-placed in Libra (exalted in the 7th for Aries Lagna) or in its own signs, this placement can bring a highly successful marriage to a partner of status and authority. If Saturn is afflicted or retrograde, there may be cold emotional dynamics, separations, or chronic health issues affecting the partner. Remedy: worship Shani Dev on Saturdays, offer oil to the Shani idol, perform Navgraha Shanti puja, and both partners should practice patience and service as the foundation of their relationship.`
    },

    {
        silo: 'vedic',
        topic: 'Rahu 10th House',
        tags: ['rahu_10th_house', 'career', 'status', 'unconventional', 'foreign', 'ambition'],
        text: `Rahu (North Node) placed in the 10th house is a powerful placement for worldly ambition, career success through unconventional means, and recognition in the public sphere. The 10th house governs career, status, authority, government, and public life. Rahu's amplifying and obsessive nature in the 10th house creates individuals who are intensely career-driven, willing to break conventions to achieve professional recognition, and often drawn to careers that connect them with foreign countries, technology, media, or mass audiences. Many politicians, media personalities, and technology entrepreneurs have Rahu in the 10th house. The native may have a meteoric but volatile career trajectory — sudden rises followed by unexpected falls and recoveries. There is often a foreign country or foreign culture connection that plays a significant role in career advancement. The career path is typically unconventional — the native does not follow a traditional or expected professional route. If Rahu is well-placed in the 10th and receives no malefic aspects, this placement brings extraordinary career heights and public recognition. If afflicted, there can be career scandals, sudden public reversals, or conflicts with authority figures. Remedy: worship Goddess Durga on Saturdays, donate blue items, and chant the Rahu mantra to channel the ambition constructively.`
    },

    {
        silo: 'vedic',
        topic: 'Venus 12th House',
        tags: ['venus_12th_house', 'foreign', 'pleasure', 'private', 'sensual', 'expenses', 'spiritual'],
        text: `Venus (Shukra) placed in the 12th house creates a complex and nuanced placement that governs pleasures of the bed, hidden relationships, spiritual luxury, and expenses through beauty. The 12th house governs foreign lands, liberation, hospitals, losses, and the subconscious. Venus here creates a native who seeks pleasure and love in private settings, who may conduct romantic relationships with great secrecy, and who often finds their most profound aesthetic or spiritual experiences in solitude or in foreign countries. Venus in the 12th house is associated with a love of foreign cultures, a preference for privacy in romantic matters, expenses on luxury items, and potential for artistic or spiritual work in institutions such as ashrams, retreats, or international organizations. This placement frequently indicates a spouse or romantic partner from a foreign country or different cultural background. The native may also work in fields such as hospitality, luxury goods, international beauty industries, or spiritual healing. If Venus is strong and well-aspected, the 12th house placement can indicate spiritual liberation through love and beauty — a deeply devotional approach to relationships. Remedy: worship Goddess Lakshmi on Fridays, offer white flowers, keep white jasmine near the bed, and practice the Venus mantra "Om Shukraya Namah" 16 times on Fridays.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Rahu remedy and Kaal Sarp puja
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Rahu Remedy',
        tags: ['rahu_remedy', 'hessonite', 'gomedha', 'saturday', 'durga_worship', 'donate_blue'],
        text: `The Rahu remedy protocol addresses an afflicted or challenging Rahu placement in the natal chart. Rahu's afflictions cause obsessive thinking, fear, illusion, confusion about one's true path, and unexpected upheavals. The primary gemstone remedy for Rahu is Hessonite (Gomedha) — a honey-colored garnet that should be set in Panchdhatu (five-metal alloy) or silver and worn on the middle finger of the right hand on a Saturday evening during the Rahu hora. The stone should be energized by chanting "Om Rahuve Namah" 18 times. Supporting Rahu remedies: worship Goddess Durga or Goddess Kali on Saturdays — Durga's fierce energy transforms Rahu's illusions into clarity. Donate blue or smoky-colored cloth, black sesame, and blankets to the needy on Saturdays. Feed stray dogs, as dogs are associated with Rahu in certain traditions. Chant the Rahu Beej Mantra: "Om Bhraam Bhreem Bhroum Sah Rahave Namah" 18,000 times during Rahu's favorable transit periods. Keep a piece of rock crystal or clear quartz near the bed to neutralize Rahu's illusion energy. Avoid alcohol, non-vegetarian food, and intoxicants as they amplify Rahu's negative qualities. Meditation and pranayama are highly recommended throughout Rahu Mahadasha to maintain mental clarity against Rahu's fog.`
    },

    {
        silo: 'vedic',
        topic: 'Kaal Sarp Puja',
        tags: ['kaal_sarp', 'tryambakeshwar', 'remedy', 'serpent_worship', 'nagpanchami', 'milk'],
        text: `Kaal Sarp Yoga remedy requires specific ritual intervention, with Tryambakeshwar Jyotirlinga in Nashik, Maharashtra being the most sacred and powerful location for the Kaal Sarp Puja. This ancient Shiva temple is one of the 12 Jyotirlingas and is specifically associated with liberation from the serpent axis of Rahu and Ketu. The Kaal Sarp Puja at Tryambakeshwar involves a full day ritual performed by qualified priests (Guruji) who specialize in this specific puja. The ritual includes: Rudrabhishek (sacred bath of the Shiva lingam), Nag Puja (serpent deity worship), Kaal Sarp Shanti Mantra recitation 108 times, and specific offerings determined by the type of Kaal Sarp Yoga in the native's chart. Daily home remedies for Kaal Sarp Yoga: chant "Om Namah Shivaya" 108 times every morning. Offer milk to a Shiva lingam on Mondays. On Nagpanchami (the 5th day of Shukla Paksha in Shravan month), offer milk, turmeric, and sandalwood paste to snake idols or live snakes at a serpent temple — this ritual specifically honors the Naga Devatas who govern Rahu and Ketu. Keep a silver serpent pair (Naga-Nagini) in the puja room and offer milk to them weekly. Recite the Maha Mrityunjaya mantra daily for protection during Rahu-Ketu periods.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Exaltation/Debilitation (Jupiter and Saturn)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Exaltation Debilitation',
        tags: ['exaltation', 'debilitation', 'jupiter_cancer', 'saturn_libra', 'neecha', 'uccha'],
        text: `Planetary exaltation (Uccha) and debilitation (Neecha) represent the signs in which a planet achieves its maximum and minimum strength respectively. The complete exaltation and debilitation table: Sun is exalted in Aries (highest exaltation at 10° Aries) and debilitated in Libra. Moon is exalted in Taurus (highest at 3° Taurus) and debilitated in Scorpio. Mars is exalted in Capricorn (highest at 28° Capricorn) and debilitated in Cancer. Mercury is exalted in Virgo (highest at 15° Virgo) and debilitated in Pisces. Jupiter is exalted in Cancer (highest at 5° Cancer) and debilitated in Capricorn — Jupiter in Cancer brings exceptional wisdom, generosity, strong family values, and extraordinary blessings for children and home. Jupiter in Capricorn (debilitated) restricts wisdom, creates cynicism, and delays spiritual growth until maturity. Venus is exalted in Pisces (highest at 27° Pisces) and debilitated in Virgo. Saturn is exalted in Libra (highest at 20° Libra) and debilitated in Aries — Saturn in Libra creates a supremely balanced, just, disciplined, and powerful individual capable of great institutional authority. Saturn in Aries (debilitated) creates impulsive karma, disciplinary failures, and health issues related to head and blood pressure. Neecha Bhanga Raja Yoga occurs when a planet's debilitation is cancelled by specific conditions, creating a powerful rise against odds.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Antardasha enrichment
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Antardasha Sub Periods',
        tags: ['antardasha', 'sub_period', 'rahu_saturn', 'jupiter_venus', 'ketu_rahu'],
        text: `Antardasha (sub-period) within a Mahadasha (major period) determines the specific flavor and events of each phase within the larger Mahadasha cycle. Each Mahadasha contains all nine planetary Antardashas in a specific sequence. Rahu Antardasha within Saturn Mahadasha is one of the most intense periods — Saturn's karmic discipline meets Rahu's obsessive ambition, creating a period of intense karmic acceleration, unexpected upheavals in career and relationships, and possible foreign travel or foreign associations that carry both opportunity and risk. Results depend heavily on the natal positions of both Saturn and Rahu. Jupiter Antardasha within Venus Mahadasha creates one of the most prosperous and spiritually rich sub-periods — wisdom (Jupiter) combined with beauty, love, and abundance (Venus) produces extraordinary artistic, spiritual, and material flourishing. Marriage, wealth, and creative recognition are frequently experienced during this period. Ketu Antardasha within Rahu Mahadasha creates a period of spiritual conflict and inner crisis — the obsessive material drive of Rahu clashes with Ketu's detachment and past-karma themes, producing confusion about life direction, sudden spiritual experiences, and the potential for either breakdown or spiritual breakthrough depending on the native's level of consciousness and the natal chart's strength.`
    },

    // ════════════════════════════════════════════════════════════
    // WEAK AREAS — Neecha Bhanga Raja Yoga
    // ════════════════════════════════════════════════════════════
    {
        silo: 'vedic',
        topic: 'Neecha Bhanga Raja Yoga',
        tags: ['neecha_bhanga', 'raja_yoga', 'debilitated_cancelled', 'rise', 'recovery'],
        text: `Neecha Bhanga Raja Yoga is one of the most powerful and transformative yogas in Vedic astrology. It occurs when a debilitated (Neecha) planet's weakness is cancelled by specific conditions, transforming what would have been a weakness into an extraordinary strength. The conditions that cancel debilitation: If the lord of the sign in which a planet is debilitated is in a Kendra (1st, 4th, 7th, or 10th house) from the Lagna or Moon, the debilitation is cancelled. If the planet that gets exalted in the sign of debilitation is in a Kendra from Lagna or Moon, the debilitation is cancelled. If the debilitated planet itself is in a Kendra from Lagna, debilitation is reduced or cancelled. If the dispositor of the debilitated planet is in a Kendra or Trikona, the debilitation is weakened. Neecha Bhanga Raja Yoga creates individuals who rise dramatically after a period of significant struggle or apparent failure. The native may face humiliation, setback, or being underestimated in the first half of life, only to achieve remarkable heights in the area governed by the debilitated planet. Examples: a debilitated Jupiter in Capricorn with Saturn (Jupiter's Neecha sign lord and ruler of Capricorn) in a Kendra creates a person of unexpected wisdom and institutional authority. This yoga is associated with self-made success, comeback stories, and achievements that defy conventional expectations.`
    },

    // ════════════════════════════════════════════════════════════
    // ADDITIONAL — Name Number Calculation Procedure
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Name Number Calculation',
        tags: ['name_number', 'calculation', 'compound', 'reduce', 'root', 'chaldean_method'],
        text: `The name number calculation in Chaldean numerology follows a precise step-by-step procedure. First, write the full name as used in daily life. Second, assign each letter its Chaldean numerical value using the table: A,I,J,Q,Y=1; B,K,R=2; C,G,L,S=3; D,M,T=4; E,H,N,X=5; U,V,W=6; O,Z=7; F,P=8. Note: the number 9 is never assigned to any letter. Third, sum all the letter values to get the compound number. Fourth, if the compound is above 9, add its digits together to find the root (single digit) number. The compound number is always shown alongside the root — for example, "Compound 23, Root 5." The compound carries specific archetypal meaning (e.g., 23 = Royal Star of the Lion) while the root reveals the planetary ruler. For multi-word names, calculate each word's compound separately, then sum all words' totals for the grand compound and reduce to the grand root. Name correction involves finding alternative spellings that shift the compound to an auspicious number such as 10, 19, 23, 27, 32, 37, or 41 while maintaining the person's recognizable identity. Only one or two letter additions or substitutions are permitted to preserve the name's integrity.`
    },

    // ════════════════════════════════════════════════════════════
    // ADDITIONAL — Compound 12 enrichment (was 59.6%, borderline)
    // ════════════════════════════════════════════════════════════
    {
        silo: 'chaldean',
        topic: 'Compound 12',
        tags: ['compound_12', 'sacrifice', 'betrayal', 'victimhood', 'warning'],
        text: `Compound number 12 in Chaldean numerology is called "The Sacrifice" or "The Victim." It carries a warning vibration — one of sacrifice, suffering, and betrayal by those trusted most closely. People with a name or destiny compound of 12 often find themselves in situations where they give generously, only to be exploited or taken for granted by those they trust. There is a recurring pattern of feeling like the martyr or the scapegoat in group situations. The 12 vibration can also indicate someone who is used as a sacrifice for others' ambitions. However, the root of 12 is 3 (Jupiter), which means that spiritual wisdom, creativity, and expansion are available as transformative antidotes to the 12's challenges. The person with compound 12 must learn to set boundaries and discern who genuinely deserves their loyalty. When the 12 energy is mastered, the person becomes extraordinarily wise about human nature and develops remarkable compassion without self-destruction. In name correction analysis, compound 12 is one of the primary inauspicious compounds (alongside 16, 18, 22, 26, 34, 35, and 44) that should be corrected through spelling adjustment to reach a more auspicious vibration.`
    },
]

// ─────────────────────────────────────────────────────────────
// INJECTION ENGINE
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
            author: 'Sovereign Authority v2',
            is_active: true,
            file_name: 'sovereign-rich-chunks.json'
        })
        .select()
        .single()

    if (error) throw new Error(`Failed to create source: ${error.message}`)
    return created!.id
}

async function injectAllChunks() {
    console.log('\n')
    console.log('╔══════════════════════════════════════════════════════════╗')
    console.log('║    NUMERIQ.AI — COMPLETE GAP FIX HYDRATION ENGINE       ║')
    console.log('║    Rich 150-200 word chunks for all 13 critical gaps     ║')
    console.log('╚══════════════════════════════════════════════════════════╝')
    console.log(`\n📦 Total chunks to inject: ${RICH_CHUNKS.length}`)
    console.log('📝 Strategy: Rich semantic chunks (150-200 words each)')
    console.log('🎯 Expected result: Coverage 58% → 85%+\n')

    // Step 1: Purge old thin sovereign packets
    console.log('🧹 Purging old thin sovereign packets...')
    for (const sourceTable of ['library_sources', 'vedic_library_sources']) {
        const embTable = sourceTable === 'library_sources'
            ? 'library_embeddings'
            : 'vedic_library_embeddings'

        const { data: oldSource } = await supabase
            .from(sourceTable)
            .select('id')
            .eq('title', 'Sovereign Knowledge Packets')
            .single()

        if (oldSource?.id) {
            await supabase
                .from(embTable)
                .delete()
                .eq('source_id', oldSource.id)
            console.log(`  Purged old packets from ${embTable} ✅`)
        }
    }

    // Step 2: Get/create source IDs
    const chaldeanSourceId = await getOrCreateSource(
        'library_sources',
        'Sovereign Rich Chunks v2'
    )
    const vedicSourceId = await getOrCreateSource(
        'vedic_library_sources',
        'Sovereign Rich Chunks v2'
    )

    // Step 3: Inject all chunks
    console.log('\n🚀 Injecting rich chunks...\n')

    let success = 0
    let failed = 0
    const failedTopics: string[] = []

    for (let i = 0; i < RICH_CHUNKS.length; i++) {
        const chunk = RICH_CHUNKS[i]
        const isChalden = chunk.silo === 'chaldean'
        const embTable = isChalden ? 'library_embeddings' : 'vedic_library_embeddings'
        const sourceId = isChalden ? chaldeanSourceId : vedicSourceId

        const wordCount = chunk.text.split(/\s+/).length
        process.stdout.write(
            `[${String(i + 1).padStart(2)}/${RICH_CHUNKS.length}] ` +
            `[${chunk.silo.toUpperCase()}] ${chunk.topic.padEnd(30)} ` +
            `(${wordCount} words)...`
        )

        try {
            const embedding = await embed(chunk.text)

            const { error } = await supabase
                .from(embTable)
                .insert({
                    source_id: sourceId,
                    chunk_text: chunk.text,
                    embedding,
                    metadata: {
                        type: 'rich_sovereign_chunk',
                        topic: chunk.topic,
                        tags: chunk.tags,
                        silo: chunk.silo,
                        word_count: wordCount,
                        version: 'v2'
                    }
                })

            if (error) {
                console.log(` ✗ ${error.message}`)
                failed++
                failedTopics.push(chunk.topic)
            } else {
                console.log(' ✅')
                success++
            }
        } catch (err: any) {
            console.log(` ✗ ${err.message}`)
            failed++
            failedTopics.push(chunk.topic)
        }

        // Tiny delay to avoid embedding rate limits
        await new Promise(r => setTimeout(r, 120))
    }

    // Final report
    console.log('\n')
    console.log('╔══════════════════════════════════════════════════════════╗')
    console.log('║                  INJECTION COMPLETE                     ║')
    console.log('╠══════════════════════════════════════════════════════════╣')
    console.log(`║  Injected successfully: ${String(success).padEnd(32)}║`)
    console.log(`║  Failed:                ${String(failed).padEnd(32)}║`)
    console.log('╚══════════════════════════════════════════════════════════╝')

    if (failedTopics.length > 0) {
        console.log('\n  ❌ Failed topics (check Supabase schema):')
        failedTopics.forEach(t => console.log(`     - ${t}`))
    }

    console.log('\n  ✅ Next step: Run the audit to verify improvement:')
    console.log('     npx tsx scripts/rag-master-audit.ts\n')
    console.log('  📈 Expected result: 58% → 85%+ coverage score')
    console.log('  🎯 Expected: 0 product-breaking gaps remaining\n')
}

injectAllChunks()