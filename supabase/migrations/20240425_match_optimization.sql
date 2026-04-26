-- NUMERIQ.AI - Match Optimization (v2 - Fixed Volatility)
-- Boosting IVFFlat probes for high-accuracy retrieval of synthetic knowledge

-- Cleanup existing functions to allow signature/volatility updates
DROP FUNCTION IF EXISTS match_library_documents(vector, float, int);
DROP FUNCTION IF EXISTS match_vedic_documents(vector, float, int);

-- Update Chaldean Match
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
LANGUAGE plpgsql VOLATILE -- Must be VOLATILE to allow SET LOCAL
AS $$
BEGIN
  -- Increase probes for the current transaction to ensure we find the synthetic chunks
  SET LOCAL ivfflat.probes = 10;

  RETURN QUERY
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
END;
$$;

-- Update Vedic Match
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
LANGUAGE plpgsql VOLATILE -- Must be VOLATILE to allow SET LOCAL
AS $$
BEGIN
  SET LOCAL ivfflat.probes = 10;

  RETURN QUERY
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
END;
$$;
