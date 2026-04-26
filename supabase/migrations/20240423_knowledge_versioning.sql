-- Migration to add robust versioning to knowledge_base table

-- 1. Drop the UNIQUE constraint on (knowledge_type, key) to allow historical versions
ALTER TABLE knowledge_base DROP CONSTRAINT IF EXISTS knowledge_base_knowledge_type_key_key;

-- 2. Add previous_version_id column for audit trails and rollbacks
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS previous_version_id UUID REFERENCES knowledge_base(id);
ALTER TABLE knowledge_base ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));

-- 3. We create a partial unique index so that there can only be ONE 'published' or 'draft' version of a key, but infinite 'archived' versions.
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_knowledge ON knowledge_base(knowledge_type, key, status) WHERE status IN ('published', 'draft');
