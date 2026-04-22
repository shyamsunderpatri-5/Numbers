-- NUMERIQ.AI - Migration: Sovereign Bonus
-- Prioritizes purified, high-fidelity traits in semantic search.

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
    le.id,
    le.chunk_text,
    ls.title AS source_title,
    ls.author AS source_author,
    (1 - (le.embedding <=> query_embedding)) + 
    (CASE WHEN le.contamination_level = 'C_SAFE' THEN 0.25 ELSE 0 END) AS similarity
  FROM library_embeddings le
  JOIN library_sources ls ON le.source_id = ls.id
  WHERE ls.is_active = true
    AND (1 - (le.embedding <=> query_embedding)) > (match_threshold - 0.2)
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
