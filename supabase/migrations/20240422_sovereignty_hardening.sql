-- Add version tracking and payment idempotency columns to sovereignty_logs
ALTER TABLE public.sovereignty_logs 
ADD COLUMN IF NOT EXISTS engine_version TEXT DEFAULT '1.0-SOVEREIGN',
ADD COLUMN IF NOT EXISTS llm_model TEXT DEFAULT 'llama-3.3-70b-versatile',
ADD COLUMN IF NOT EXISTS prompt_version TEXT DEFAULT 'v1',
ADD COLUMN IF NOT EXISTS ontology_version TEXT DEFAULT 'v1',
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create an index to speed up the idempotency check
CREATE INDEX IF NOT EXISTS idx_sovereignty_logs_payment_intent 
ON public.sovereignty_logs (payment_intent_id) 
WHERE payment_intent_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sovereignty_logs_session_id 
ON public.sovereignty_logs (session_id) 
WHERE session_id IS NOT NULL;
