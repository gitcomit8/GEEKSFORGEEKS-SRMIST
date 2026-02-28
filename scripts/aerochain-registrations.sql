-- Migration: create aerochain_registrations table
-- Run this in the Supabase SQL editor for the GFG-SRMIST project.

CREATE TABLE IF NOT EXISTS aerochain_registrations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name       TEXT        NOT NULL,
  lead_name       TEXT        NOT NULL,
  lead_email      TEXT        NOT NULL,
  lead_semester   TEXT        NOT NULL,
  lead_reg_no     TEXT        NOT NULL,
  lead_phone      TEXT        NOT NULL,
  lead_section    TEXT        NOT NULL,
  lead_department TEXT        NOT NULL,
  lead_alt_email  TEXT,
  members         JSONB       NOT NULL DEFAULT '[]',
  team_size       INTEGER     NOT NULL DEFAULT 1,
  track           TEXT        NOT NULL DEFAULT 'AI',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id),
  UNIQUE (lead_email)
);

-- Enable Row Level Security
ALTER TABLE aerochain_registrations ENABLE ROW LEVEL SECURITY;

-- API routes use the service role key, so no RLS policy needed for server-side writes.
-- This policy allows authenticated users to read their own record if accessed directly.
CREATE POLICY "Users can view own aerochain registration"
  ON aerochain_registrations
  FOR SELECT
  USING (auth.uid() = user_id);
