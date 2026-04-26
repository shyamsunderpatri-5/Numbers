-- NUMERIQ.AI - Vedic Knowledge Base Isolation
-- Dedicated Infrastructure for Vedic (Anka Shastra) Texts

-- 1. Vedic Sources: Tracks each Vedic authoritative text
CREATE TABLE IF NOT EXISTS vedic_library_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  year TEXT,
  file_name TEXT NOT NULL,
  total_chunks INTEGER DEFAULT 0,
  ingested_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'active'
);

-- 2. Vedic Embeddings: Stores each Vedic text chunk with its vector
CREATE TABLE IF NOT EXISTS vedic_library_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES vedic_library_sources(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding vector(384), -- 384-dim for all-MiniLM-L6-v2
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vedic Knowledge Base: Structured Vedic Logic (Isolated from Chaldean)
CREATE TABLE IF NOT EXISTS vedic_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_type TEXT NOT NULL, -- e.g., 'vedic_number_1_9', 'vedic_remedy'
  key TEXT NOT NULL,             -- e.g., "1", "7", "jupiter-remedy"
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(knowledge_type, key)
);

-- 4. Vector Index
CREATE INDEX IF NOT EXISTS vedic_library_embeddings_vector_idx
  ON vedic_library_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- 5. Vedic Retrieval Function
CREATE OR REPLACE FUNCTION match_vedic_documents(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  chunk_text TEXT,
  source_title TEXT,
  source_author TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    vle.id, vle.chunk_text,
    vls.title AS source_title, vls.author AS source_author,
    1 - (vle.embedding <=> query_embedding) AS similarity
  FROM vedic_library_embeddings vle
  JOIN vedic_library_sources vls ON vle.source_id = vls.id
  WHERE vls.is_active = true
    AND 1 - (vle.embedding <=> query_embedding) > match_threshold
  ORDER BY vle.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 6. RLS Policies
ALTER TABLE vedic_library_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE vedic_library_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vedic_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vedic sources" ON vedic_library_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
CREATE POLICY "Anyone can read active vedic sources" ON vedic_library_sources FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read vedic embeddings" ON vedic_library_embeddings FOR SELECT USING (true);
CREATE POLICY "Admins can manage vedic embeddings" ON vedic_library_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can read vedic knowledge" ON vedic_knowledge_base FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage vedic knowledge" ON vedic_knowledge_base FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
