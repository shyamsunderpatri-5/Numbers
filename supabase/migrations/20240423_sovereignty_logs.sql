-- NUMERIQ.AI - Sovereignty Logs & Safety Instrumentation
-- Tracks LLM behavior, safety interventions, and epistemological health.

CREATE TABLE sovereignty_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  
  -- Request Data
  query_text TEXT,
  intent_tag TEXT, -- e.g., [SELF], [REL], [ATTACK]
  
  -- Engine Metadata
  engine_version TEXT DEFAULT '1.0.0',
  llm_model TEXT DEFAULT 'llama-3.3-70b-versatile',
  
  -- Safety Metrics
  safety_status TEXT CHECK (safety_status IN ('success', 'blocked_input', 'blocked_output')),
  blocked_pattern TEXT, -- The regex pattern that triggered the block
  outcome_type TEXT CHECK (outcome_type IN ('ANSWERED', 'BLOCKED', 'FALLBACK', 'AMBIGUOUS')),
  
  -- Epistemological Metrics
  confidence_score FLOAT DEFAULT 1.0,
  is_ambiguous BOOLEAN DEFAULT FALSE,
  validator_intervention BOOLEAN DEFAULT FALSE,
  
  -- Behavioral Metrics
  retry_count INTEGER DEFAULT 0,
  
  -- Performance
  latency_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE sovereignty_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all sovereignty logs" ON sovereignty_logs 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Indexing for Dashboard
CREATE INDEX idx_sovereignty_status ON sovereignty_logs(safety_status);
CREATE INDEX idx_sovereignty_intent ON sovereignty_logs(intent_tag);
CREATE INDEX idx_sovereignty_created ON sovereignty_logs(created_at);
