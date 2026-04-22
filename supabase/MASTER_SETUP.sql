-- ═══════════════════════════════════════════════════════════════════
-- NUMERIQ.AI — Master Database Setup (Run this in Supabase SQL Editor)
-- ═══════════════════════════════════════════════════════════════════

-- ─── STEP 1: Enable pgvector ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS vector;

-- ─── STEP 2: Core Tables ─────────────────────────────────────────────

-- Profiles & Users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  plan_tier INTEGER DEFAULT 1,
  total_readings_used INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Numerology Readings History
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reading_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  data JSONB NOT NULL,
  insights JSONB,
  ai_reading_json JSONB,
  type TEXT NOT NULL CHECK (type IN ('personal', 'compatibility', 'business', 'forecast')),
  is_saved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RAG Knowledge Base (Structured Expert Data)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_type TEXT NOT NULL
    CHECK (knowledge_type IN (
      'number_1_9', 'compound', 'combination', 'missing_number',
      'personal_year', 'personal_month', 'personal_day',
      'master_number', 'pattern_number', 'lucky_elements', 'compatibility'
    )),
  key TEXT NOT NULL,
  content JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(knowledge_type, key)
);

CREATE INDEX IF NOT EXISTS idx_knowledge_type_key ON knowledge_base(knowledge_type, key);

-- ─── STEP 3: Security & Monitoring ───────────────────────────────────

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country_code TEXT,
  status TEXT CHECK (status IN ('success', 'failed')),
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  device_info JSONB,
  ip_address TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STEP 4: Sage Library (Ancient Text Vector Search) ───────────────

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

CREATE TABLE IF NOT EXISTS library_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES library_sources(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding vector(384),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS library_embeddings_vector_idx
  ON library_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- Semantic similarity search function
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
    AND 1 - (le.embedding <=> query_embedding) > match_threshold
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ─── STEP 5: Auto-create Profile on Signup ───────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── STEP 6: Row Level Security ──────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_embeddings ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- Readings
CREATE POLICY "Users can view own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own readings" ON readings FOR DELETE USING (auth.uid() = user_id);

-- Knowledge Base
CREATE POLICY "Anyone can view active knowledge" ON knowledge_base FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage knowledge" ON knowledge_base FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- Security Events 
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all security events" ON security_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- Library
CREATE POLICY "Anyone can read library" ON library_sources FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read embeddings" ON library_embeddings FOR SELECT USING (true);
CREATE POLICY "Admins can manage library" ON library_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);
CREATE POLICY "Admins can manage embeddings" ON library_embeddings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','super_admin'))
);

-- ─── DONE ────────────────────────────────────────────────────────────
-- NUMERIQ.AI database is fully initialized.
-- Tables: profiles, readings, knowledge_base, library_sources,
--         library_embeddings, login_attempts, user_sessions, security_events
