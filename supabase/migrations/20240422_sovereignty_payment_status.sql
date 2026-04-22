-- Add payment_status column to sovereignty_logs
ALTER TABLE public.sovereignty_logs 
ADD COLUMN payment_status TEXT DEFAULT 'free';

-- Update the view to include payment stats if needed
DROP VIEW IF EXISTS public.sovereignty_health_stats;
CREATE VIEW public.sovereignty_health_stats AS
SELECT
  COUNT(*) as total_runs,
  COUNT(*) FILTER (WHERE golden_pass = true) as total_golden_passes,
  AVG(latency_ms) as avg_latency,
  COUNT(*) FILTER (WHERE poison_pill_blocked = true) as total_attacks_blocked,
  AVG(confidence_score) as avg_confidence,
  COUNT(*) FILTER (WHERE is_ambiguous = true) as total_ambiguous_runs,
  (COUNT(*) FILTER (WHERE golden_pass = true)::float / NULLIF(COUNT(*), 0)) * 100 as golden_health_score,
  COUNT(*) FILTER (WHERE payment_status = 'paid') as total_paid_runs
FROM public.sovereignty_logs
WHERE created_at > NOW() - INTERVAL '7 days';
