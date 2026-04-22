-- NUMERIQ.AI - Initial Migration
-- Core Database Schema

-- 1. Profiles & Users
CREATE TABLE profiles (
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

-- 2. Numerology Readings History
CREATE TABLE readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reading_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  data JSONB NOT NULL, -- Full computed numbers (Layer 1)
  insights JSONB,      -- AI Generated Narrative (Layer 3)
  type TEXT NOT NULL CHECK (type IN ('personal', 'compatibility', 'business', 'forecast')),
  is_saved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Knowledge Base Table (RAG Layer)
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_type TEXT NOT NULL
    CHECK (knowledge_type IN (
      'number_1_9',       -- Core meanings for numbers 1-9
      'compound',         -- Compound meanings 10-52
      'combination',      -- Number pair combinations
      'missing_number',   -- Missing number content
      'personal_year',    -- Personal year meanings
      'personal_month',   -- Personal month meanings
      'personal_day',     -- Personal day meanings
      'master_number',    -- 11, 22, 33 deep analysis
      'pattern_number',   -- 13, 14, 16, 19 patterns
      'lucky_elements',   -- Lucky elements per number
      'compatibility'     -- Compatibility matrix entries
    )),
  key TEXT NOT NULL,             -- e.g., "7", "29", "1-3", "missing-4"
  content JSONB NOT NULL,        -- Full knowledge object object per schema
  version INTEGER DEFAULT 1,     -- For content versioning
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(knowledge_type, key)
);

CREATE INDEX idx_knowledge_type_key ON knowledge_base(knowledge_type, key);

-- 4. Auth Security & Monitoring
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  country_code TEXT,
  status TEXT CHECK (status IN ('success', 'failed')),
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  device_info JSONB,
  ip_address TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Readings Policies
CREATE POLICY "Users can view their own readings" ON readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own readings" ON readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own readings" ON readings FOR DELETE USING (auth.uid() = user_id);

-- Knowledge Base Policies
CREATE POLICY "Anyone can view knowledge base" ON knowledge_base FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage knowledge base" ON knowledge_base FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
);

-- Security Logs (Read-only for users, Full for admins)
CREATE POLICY "Users can view their own security events" ON security_events FOR SELECT USING (auth.uid() = user_id);
