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
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE SET NULL
);

ALTER TABLE IF EXISTS stories
  ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS albums_status_idx ON albums(status);
CREATE INDEX IF NOT EXISTS albums_created_at_idx ON albums(created_at DESC);

CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  album_id TEXT REFERENCES albums(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  mime_type TEXT,
  bytes INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS photos_album_id_idx ON photos(album_id);
CREATE INDEX IF NOT EXISTS photos_created_at_idx ON photos(created_at DESC);

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

CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_members_sort_order_idx
  ON team_members(sort_order ASC, created_at ASC);

INSERT INTO settings (section, data)
VALUES ('team', '{"items":[]}'::jsonb)
ON CONFLICT (section) DO NOTHING;

INSERT INTO team_members (
  id,
  name,
  role,
  photo,
  sort_order
)
SELECT
  COALESCE(NULLIF(item->>'id', ''), CONCAT('team-', entry.ordinality::text)) AS id,
  item->>'name' AS name,
  item->>'role' AS role,
  NULLIF(item->>'photo', '') AS photo,
  (entry.ordinality - 1)::INTEGER AS sort_order
FROM settings s
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(s.data->'items', '[]'::jsonb)) WITH ORDINALITY AS entry(item, ordinality)
WHERE s.section = 'team'
  AND NULLIF(item->>'name', '') IS NOT NULL
  AND NULLIF(item->>'role', '') IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM team_members)
ON CONFLICT (id) DO NOTHING;

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
