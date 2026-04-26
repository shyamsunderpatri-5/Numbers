-- 🔯 NUMERIQ.AI — FEATURE EXPANSION MIGRATION v2.0
-- Panchang, Marriage, Oracle, and WhatsApp

-- 1. Panchang Cache (Hindu Almanac)
create table if not exists panchang_cache (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  lat double precision not null,
  lng double precision not null,
  city text,
  timezone text,
  data jsonb not null,         -- Full PanchangData object
  overall_score int,
  created_at timestamptz default now(),
  unique(date, lat, lng)
);

create index if not exists idx_panchang_lookup on panchang_cache(date, lat, lng);
create index if not exists idx_panchang_auspicious on panchang_cache(overall_score) where overall_score >= 70;

-- 2. Oracle Question History
create table if not exists oracle_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  question text not null,
  language text default 'en',
  result_json jsonb,           -- Structured Oracle response
  confidence_score int,
  rag_sources text[],
  created_at timestamptz default now()
);

-- 3. Marriage Date Readings (Vivah Muhurta)
create table if not exists marriage_date_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  bride_name text,
  bride_dob date,
  groom_name text,
  groom_dob date,
  ceremony_city text,
  search_start date,
  search_end date,
  top_dates jsonb,             -- Array of MarriageDate objects
  payment_intent_id text unique,
  created_at timestamptz default now()
);

-- 4. Kundali Match Readings (Ashtakoota)
create table if not exists kundali_match_readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  bride_name text,
  bride_dob date,
  groom_name text,
  groom_dob date,
  total_score int,
  result_json jsonb,
  payment_intent_id text unique,
  created_at timestamptz default now()
);

-- 5. WhatsApp Communication Log
create table if not exists whatsapp_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  message_type text,           -- 'daily_forecast', 'oracle_response', 'welcome'
  personal_day_number int,
  content_sent text,
  twilio_sid text,
  sent_at timestamptz default now(),
  delivered boolean default false
);

-- Row Level Security (RLS)
alter table oracle_history enable row level security;
alter table marriage_date_readings enable row level security;
alter table kundali_match_readings enable row level security;
alter table whatsapp_log enable row level security;

-- Policies
create policy "users own oracle" on oracle_history for all using (auth.uid() = user_id);
create policy "users own marriage dates" on marriage_date_readings for all using (auth.uid() = user_id);
create policy "users own kundali" on kundali_match_readings for all using (auth.uid() = user_id);
create policy "users own whatsapp log" on whatsapp_log for all using (auth.uid() = user_id);

-- Profile Extensions (if columns missing)
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='phone_whatsapp') then
    alter table profiles add column phone_whatsapp text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='whatsapp_enabled') then
    alter table profiles add column whatsapp_enabled boolean default false;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='whatsapp_tier') then
    alter table profiles add column whatsapp_tier text default 'free';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='language') then
    alter table profiles add column language text default 'en';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='timezone') then
    alter table profiles add column timezone text default 'Asia/Kolkata';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='birth_lat') then
    alter table profiles add column birth_lat double precision;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='birth_lng') then
    alter table profiles add column birth_lng double precision;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='birth_city') then
    alter table profiles add column birth_city text;
  end if;
end $$;
