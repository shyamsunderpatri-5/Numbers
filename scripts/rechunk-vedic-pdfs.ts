// scripts/rechunk-vedic-pdfs.ts
// Run: npx tsx scripts/rechunk-vedic-pdfs.ts
// Purpose: Re-chunk existing PDFs with smarter 150-200 word topic-aware chunking

// ── CHUNKING CONFIG ──────────────────────────────────────────
export const CONFIG = {
  targetChunkWords: 150,    // was probably 400-500 before — too large
  overlapWords: 20,         // overlap between chunks preserves context
  minChunkWords: 80,        // discard chunks smaller than this
  similarityThreshold: 0.60 // LOWERED from 0.75 — important change
}

// ── TOPIC BOUNDARY MARKERS ───────────────────────────────────
// These phrases signal a NEW topic starts — we force a chunk split here
export const TOPIC_BOUNDARIES = [
  // Nakshatras
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
  'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  // Houses
  'First House', 'Second House', 'Third House', 'Fourth House', 'Fifth House',
  'Sixth House', 'Seventh House', 'Eighth House', 'Ninth House', 'Tenth House',
  'Eleventh House', 'Twelfth House',
  'Lagna', 'Putra Bhava', 'Ayu Bhava', 'Vyaya Bhava',
  // Yogas
  'Kaal Sarp', 'Gaja Kesari', 'Raja Yoga', 'Dhana Yoga', 'Viparita',
  'Neecha Bhanga', 'Panch Mahapurusha', 'Budh Aditya', 'Chandra Mangal',
  // Kootas
  'Nadi Koota', 'Bhakoot', 'Gana Koota', 'Yoni Koota', 'Graha Maitri',
  'Varna', 'Vashya', 'Tara Koota',
  // Planets
  'Sun in', 'Moon in', 'Mars in', 'Mercury in', 'Jupiter in', 'Venus in',
  'Saturn in', 'Rahu in', 'Ketu in',
  // Dashas
  'Ketu Mahadasha', 'Venus Mahadasha', 'Sun Mahadasha', 'Moon Mahadasha',
  'Mars Mahadasha', 'Rahu Mahadasha', 'Jupiter Mahadasha',
  'Saturn Mahadasha', 'Mercury Mahadasha',
]

export function smartChunk(rawText: string): string[] {
  // Step 1: Clean the text
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\x00-\x7F]/g, ' ')  // remove non-ASCII junk from PDF extraction
    .trim()

  // Step 2: Split into sentences
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned]

  // Step 3: Build chunks with topic-boundary awareness
  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentWordCount = 0

  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/)
    const wordCount = words.length

    // Check if this sentence starts a new topic
    const isTopicBoundary = TOPIC_BOUNDARIES.some(marker =>
      sentence.includes(marker)
    )

    // Force chunk split at topic boundaries (if current chunk has enough content)
    if (isTopicBoundary && currentWordCount >= CONFIG.minChunkWords) {
      // Save current chunk with overlap
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' ').trim())
        // Keep last N words as overlap for next chunk
        const allWords = currentChunk.join(' ').split(/\s+/)
        const overlapText = allWords.slice(-CONFIG.overlapWords).join(' ')
        currentChunk = [overlapText]
        currentWordCount = CONFIG.overlapWords
      }
    }

    currentChunk.push(sentence.trim())
    currentWordCount += wordCount

    // Split when target size reached
    if (currentWordCount >= CONFIG.targetChunkWords) {
      chunks.push(currentChunk.join(' ').trim())
      const allWords = currentChunk.join(' ').split(/\s+/)
      const overlapText = allWords.slice(-CONFIG.overlapWords).join(' ')
      currentChunk = [overlapText]
      currentWordCount = CONFIG.overlapWords
    }
  }

  // Don't lose the last chunk
  if (currentWordCount >= CONFIG.minChunkWords) {
    chunks.push(currentChunk.join(' ').trim())
  }

  return chunks.filter(c => c.split(/\s+/).length >= CONFIG.minChunkWords)
}

// ── KEYWORD TAGGER ───────────────────────────────────────────
// Auto-tag chunks based on content — fixes Gap Type 3 (keyword mismatch)
export function autoTag(chunkText: string): string[] {
  const tags: string[] = []
  const text = chunkText.toLowerCase()

  // Nakshatra detection
  const nakshatras = ['ashwini','bharani','krittika','rohini','mrigashira','ardra',
    'punarvasu','pushya','ashlesha','magha','purva phalguni','uttara phalguni',
    'hasta','chitra','swati','vishakha','anuradha','jyeshtha','mula',
    'purva ashadha','uttara ashadha','shravana','dhanishta','shatabhisha',
    'purva bhadrapada','uttara bhadrapada','revati']
  nakshatras.forEach(n => { if (text.includes(n)) tags.push(n.replace(' ', '_')) })

  // Planet detection
  const planets = ['sun','moon','mars','mercury','jupiter','venus','saturn','rahu','ketu',
                   'surya','chandra','mangal','budha','guru','shukra','shani']
  planets.forEach(p => { if (text.includes(p)) tags.push(p) })

  // Topic detection
  if (text.includes('nakshatra')) tags.push('nakshatra')
  if (text.includes('house') || text.includes('bhava')) tags.push('house_signification')
  if (text.includes('yoga')) tags.push('yoga')
  if (text.includes('dasha')) tags.push('dasha')
  if (text.includes('koota') || text.includes('compatibility') || text.includes('marriage matching')) tags.push('compatibility')
  if (text.includes('remedy') || text.includes('mantra') || text.includes('gemstone')) tags.push('remedy')
  if (text.includes('mahadasha')) tags.push('dasha')
  if (text.includes('transit') || text.includes('gochar')) tags.push('transit')

  // Chaldean-specific
  if (text.includes('compound number')) tags.push('compound_number')
  if (text.includes('name number') || text.includes('chaldean')) tags.push('chaldean')
  if (text.includes('soul urge') || text.includes('vowel')) tags.push('soul_urge', 'vowel_sum')
  if (text.includes('name correction')) tags.push('name_correction')

  return [...new Set(tags)] // deduplicate
}

export function detectKnowledgeType(chunkText: string): string {
  const text = chunkText.toLowerCase()
  if (text.includes('nakshatra')) return 'nakshatra'
  if (text.includes('yoga')) return 'yoga'
  if (text.includes('dasha') || text.includes('mahadasha')) return 'dasha'
  if (text.includes('koota') || text.includes('compatibility')) return 'compatibility'
  if (text.includes('remedy') || text.includes('mantra') || text.includes('gemstone')) return 'remedy'
  if (text.includes('house') || text.includes('bhava')) return 'house_signification'
  if (text.includes('compound') || text.includes('chaldean')) return 'compound_number'
  if (text.includes('planet') || text.includes('graha')) return 'planet_trait'
  return 'general_vedic'
}
