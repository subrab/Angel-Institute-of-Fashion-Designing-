-- ANGEL DIGITAL PLATFORM — Release 1 schema
-- Applied to Neon project: angel-institute-platform (id: noisy-dew-58591893), database: angel
-- This file is the source of truth for the schema — re-run (or diff against) this after any change.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN','ADMIN','STAFF','FACULTY','STUDENT','CUSTOMER');
CREATE TYPE lead_interest AS ENUM ('institute','tailoring');
CREATE TYPE lead_source AS ENUM ('website','instagram','whatsapp','google','referral','other');
CREATE TYPE lead_status AS ENUM ('new','contacted','converted','lost');
CREATE TYPE gallery_category AS ENUM ('institute','tailoring');
CREATE TYPE review_status AS ENUM ('pending','approved','rejected');
CREATE TYPE course_track AS ENUM ('fashion_designing','tailoring');

-- users table. admin, staff and faculty log in today. student and customer roles are reserved for later releases.
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- courses table. name and duration only, no fee column, per confirmed policy.
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track course_track NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  is_certification BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_courses_active ON courses(is_active);

-- leads table. every website, institute or tailoring enquiry lands here.
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  interested_in lead_interest NOT NULL,
  source lead_source NOT NULL DEFAULT 'website',
  message TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES users(id),
  converted_to_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- gallery_items table
CREATE TABLE gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  category gallery_category NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_gallery_category ON gallery_items(category, sort_order);

-- reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status review_status NOT NULL DEFAULT 'pending',
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_status ON reviews(status);

-- site_settings table. key value store for contact info, hours, etc. editable without a redeploy.
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- seed confirmed business facts
INSERT INTO site_settings (key, value) VALUES
  ('business_name', 'Angel Institute of Fashion Designing / Angel Tailoring'),
  ('location', 'Tirunelveli'),
  ('phone', '8072382192'),
  ('whatsapp', '8072382192'),
  ('email', 'swathigamaheswari6@gmail.com'),
  ('instagram_handle', 'angel_institute_72_'),
  ('hours', '10:00-20:00 daily'),
  ('fees_policy', 'not_publicly_displayed');

-- seed confirmed course durations, no fees
INSERT INTO courses (track, name, duration, description, is_certification, sort_order) VALUES
  ('fashion_designing', 'Fashion Designing', '1 Month', 'Quick, focused start', false, 1),
  ('fashion_designing', 'Fashion Designing', '3 Months', 'Build real skill', false, 2),
  ('fashion_designing', 'Fashion Designing', '6 Months', 'Certification course', true, 3),
  ('tailoring', 'Tailoring', '1 Month', 'Quick, focused start', false, 1),
  ('tailoring', 'Tailoring', '3 Months', 'Build real skill', false, 2),
  ('tailoring', 'Tailoring', '6 Months', 'Certification course', true, 3);
