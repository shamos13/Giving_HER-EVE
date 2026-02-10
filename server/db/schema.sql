CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  label TEXT,
  title TEXT,
  short_description TEXT,
  description TEXT,
  image TEXT,
  raised INTEGER,
  goal INTEGER,
  location TEXT,
  category TEXT,
  status TEXT,
  start_date DATE,
  end_date DATE
);

CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  status TEXT,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  quote TEXT,
  name TEXT,
  role TEXT,
  avatar TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT,
  answer TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  donor_name TEXT,
  donor_email TEXT,
  source TEXT,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL,
  category TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS donations_created_at_idx ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS donations_source_idx ON donations(source);
CREATE INDEX IF NOT EXISTS donations_status_idx ON donations(status);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  description TEXT,
  timeline TEXT,
  beneficiaries TEXT,
  location TEXT,
  progress INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  type TEXT,
  preview TEXT,
  message TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at DESC);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  initials TEXT,
  role TEXT,
  email TEXT,
  phone TEXT,
  status TEXT,
  joined TEXT,
  verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS content_sections (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  status TEXT,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS settings (
  section TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS dashboard (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  focus JSONB NOT NULL DEFAULT '{}'::jsonb,
  operations_pulse JSONB NOT NULL DEFAULT '{}'::jsonb,
  donation_commitments JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_sla JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  analytics JSONB NOT NULL DEFAULT '{}'::jsonb,
  metric_meta JSONB NOT NULL DEFAULT '[]'::jsonb
);
