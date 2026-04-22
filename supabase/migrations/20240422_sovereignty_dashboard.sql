-- NUMERIQ.AI - Migration: Sovereignty Dashboard Logs
-- Tracks the health, purity, and performance of every synthesis run.

CREATE TABLE IF NOT EXISTS public.sovereignty_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  input_name TEXT,
  input_day INTEGER,
  latency_ms INTEGER,
  confidence_score FLOAT,
  is_ambiguous BOOLEAN DEFAULT FALSE,
  
  -- Audit Results
  golden_pass BOOLEAN,
  weight_audit_pass BOOLEAN,
  poison_pill_blocked BOOLEAN DEFAULT FALSE,
  
  -- Semantic Routing
  canonical_traits_detected TEXT[],
  dominant_vibration INTEGER,
  
  -- Detailed Audit Payload
  audit_details JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only admins can view logs
ALTER TABLE public.sovereignty_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sovereignty logs" ON public.sovereignty_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Views for Dashboard
CREATE OR REPLACE VIEW public.sovereignty_health_stats AS
SELECT 
  COUNT(*) as total_runs,
  COUNT(*) FILTER (WHERE golden_pass = true) as total_golden_passes,
  AVG(latency_ms) as avg_latency,
  COUNT(*) FILTER (WHERE poison_pill_blocked = true) as total_attacks_blocked,
  AVG(confidence_score) as avg_confidence,
  COUNT(*) FILTER (WHERE is_ambiguous = true) as total_ambiguous_runs,
  (COUNT(*) FILTER (WHERE golden_pass = true)::float / COUNT(*)) * 100 as golden_health_score
FROM public.sovereignty_logs
WHERE created_at > NOW() - INTERVAL '7 days';
