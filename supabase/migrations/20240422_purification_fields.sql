-- ═══════════════════════════════════════════════════════════════════
-- PURIFICATION FIELDS & LOGIC MIGRATION
-- ═══════════════════════════════════════════════════════════════════

-- Add contamination_level to library_embeddings
ALTER TABLE library_embeddings ADD COLUMN IF NOT EXISTS contamination_level TEXT;

-- Add status to library_sources
ALTER TABLE library_sources ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Update match_library_documents to handle filtered status with stricter threshold
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
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    le.id, le.chunk_text,
    ls.title AS source_title, ls.author AS source_author,
    1 - (le.embedding <=> query_embedding) AS similarity
  FROM library_embeddings le
  JOIN library_sources ls ON le.source_id = ls.id
  WHERE ls.is_active = true
    AND (
      -- Normal active sources use the standard threshold
      (ls.status != 'filtered' AND 1 - (le.embedding <=> query_embedding) > match_threshold)
      OR
      -- Filtered sources (Decoz/Goodwin) require higher similarity to be retrieved
      (ls.status = 'filtered' AND 1 - (le.embedding <=> query_embedding) > (match_threshold + 0.15))
    )
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;
