-- NUMERIQ.AI - Synthetic Authority Registration
-- Registering the "Ground Truth" sources for synthetic gap hydration

-- 1. Chaldean Synthetic Source
INSERT INTO library_sources (title, author, file_name, status)
VALUES ('Synthetic Chaldean Authority', 'NUMERIQ AI', 'synthetic-chaldean.json', 'active')
ON CONFLICT DO NOTHING;

-- 2. Vedic Synthetic Source
INSERT INTO vedic_library_sources (title, author, file_name, status)
VALUES ('Synthetic Vedic Authority', 'NUMERIQ AI', 'synthetic-vedic.json', 'active')
ON CONFLICT DO NOTHING;
