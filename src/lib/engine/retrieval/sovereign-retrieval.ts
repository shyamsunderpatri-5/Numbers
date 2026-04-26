// src/lib/engine/retrieval/sovereign-retrieval.ts
// FINAL PRODUCTION VERSION — optimized for maximum coverage across fragmented indices

import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import * as dotenv from 'dotenv'
import path from 'path'

if (typeof process !== 'undefined' && process.env) {
    dotenv.config({ path: path.join(process.cwd(), '.env.local') });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── VOCABULARY BRIDGE (Query Expansion) ─────────────────────
const QUERY_REWRITER: Record<string, string[]> = {
  'soul urge': ['vowel number calculation', 'heart desire inner vibration', 'soul urge 1-9 meaning'],
  'name correction': ['lucky name spelling change', 'inauspicious name compound correction', 'change name numerology'],
  'compound number': ['compound vibration meaning', 'chaldean compound logic'],
  'personal year': ['personal year cycle 1-9', 'current year numerology prediction'],
  'nakshatra': ['personality traits and career', 'mythology and symbol', 'nakshatra deity remedy'],
  'bharani': ['yama deity transformation nakshatra', 'bharani career creativity'],
  'swati': ['vayu deity wind independence nakshatra', 'swati career business'],
  'jyeshtha': ['indra deity eldest authority nakshatra', 'jyeshtha challenges protection'],
  'dhanishta': ['vasus deity wealth music nakshatra', 'dhanishta prosperity marital'],
  'kaal sarp': ['kala sarpa dosha rahu ketu hemmed', 'serpent yoga effects remedies'],
  'gaja kesari': ['jupiter moon conjunction gaja kesari yoga', 'elephant lion yoga wealth'],
  '8th house': ['ayu bhava longevity transformation', '8th house sudden events occult'],
  '5th house': ['putra bhava children intelligence karma', '5th house past life merit'],
  'nadi koota': ['nadi dosha marriage matching vata pitta kapha', 'nadi compatibility points'],
  'bhakoot': ['bhakoot dosha moon sign relationship', 'rashi matching marriage'],
  'koota': ['ashta koota milan marriage compatibility', 'nakshatra match points'],
  'tara koota': ['tara matching janma sampat vipat', 'nakshatra tara compatibility'],
}

export interface SearchResult {
  content: string
  similarity: number
  source: string
  tags?: string[]
}

let embedder: any = null

export class SovereignRetrieval {
  private static async getEmbedder() {
    if (!embedder) embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    return embedder
  }

  static async search(query: string, domain: 'chaldean' | 'vedic' = 'chaldean', topK: number = 3): Promise<SearchResult[]> {
    const model = await this.getEmbedder()
    const matchFn = domain === 'vedic' ? 'match_vedic_documents' : 'match_library_documents'
    
    // 1. Expand query
    const expandedQueries = [query]
    for (const [term, expansions] of Object.entries(QUERY_REWRITER)) {
      if (query.toLowerCase().includes(term)) expandedQueries.push(...expansions)
    }

    const allHits: any[] = []

    // 2. Multi-probe search
    for (const q of [...new Set(expandedQueries)]) {
      const out = await model(q, { pooling: 'mean', normalize: true })
      const embedding = Array.from(out.data)

      const { data, error } = await supabase.rpc(matchFn, {
        query_embedding: embedding,
        match_threshold: 0.1, // very low threshold to capture everything for re-ranking
        match_count: topK
      })

      if (!error && data) allHits.push(...data)
    }

    // 3. Deduplicate and re-rank
    const unique = new Map<string, any>()
    for (const hit of allHits) {
      const text = hit.chunk_text || hit.content
      if (!unique.has(text) || unique.get(text).similarity < hit.similarity) {
        unique.set(text, hit)
      }
    }

    return Array.from(unique.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .map(h => ({
        content: h.chunk_text || h.content,
        similarity: h.similarity,
        source: h.source_title || 'Expert Knowledge Base',
        tags: h.tags || h.metadata?.tags
      }))
  }
}
