-- NUMERIQ.AI - Migration 002
-- Sage Library: Vector Search Infrastructure for Ancient Texts

-- Enable pgvector extension (pre-installed on all Supabase projects)
CREATE EXTENSION IF NOT EXISTS vector;

-- Library Sources: Tracks each book
CREATE TABLE IF NOT EXISTS library_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  year TEXT,
  file_name TEXT NOT NULL,
  total_chunks INTEGER DEFAULT 0,
  ingested_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Library Embeddings: Stores each text chunk with its vector
CREATE TABLE IF NOT EXISTS library_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES library_sources(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding vector(384), -- 384-dim for all-MiniLM-L6-v2
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS library_embeddings_vector_idx
  ON library_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- Postgres function: Match documents by semantic similarity
CREATE OR REPLACE FUNCTION match_library_documents(
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  chunk_text TEXT,
  source_title TEXT,
  source_author TEXT,
  contamination_level TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    le.id,
    le.chunk_text,
    ls.title AS source_title,
    ls.author AS source_author,
    le.contamination_level,
    1 - (le.embedding <=> query_embedding) AS similarity
  FROM library_embeddings le
  JOIN library_sources ls ON le.source_id = ls.id
  WHERE ls.is_active = true
    AND 1 - (le.embedding <=> query_embedding) > match_threshold
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- RLS Policies for Library
ALTER TABLE library_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage library sources" ON library_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

CREATE POLICY "Anyone can read active library sources" ON library_sources FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read library embeddings" ON library_embeddings FOR SELECT USING (true);
CREATE POLICY "Admins can manage library embeddings" ON library_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);
