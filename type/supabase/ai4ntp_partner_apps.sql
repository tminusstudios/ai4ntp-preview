-- =====================================================================
-- ai4ntp_partner_apps
-- Backs the application form at https://ai4ntp.com/partner
-- Run this once in the Supabase SQL editor (project: qytiyechjtkrejhhczcg).
-- Mirrors the INSERT-only RLS pattern used by ai4ntp_signups.
-- =====================================================================

create table if not exists public.ai4ntp_partner_apps (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  partner_type     text        not null,          -- guest | sponsor | not_sure
  name             text,
  email            text        not null,

  -- guest branch
  topic            text,                           -- one-line topic: what they present
  result           text,                           -- the provable result shown live
  link             text,                           -- LinkedIn
  website          text,                           -- website or product URL
  work_link        text,                           -- live demo link
  icp              text,                           -- who they want in the room (their ICP)
  preferred_dates  text,                           -- three ideal dates + times
  gift             text,                           -- gift/giveaway for qualified attendees
  notes            text,                           -- anything else worth mentioning

  -- sponsor branch
  company          text,
  offering         text,                           -- what they sell
  partnership_goal text,                           -- what a win looks like for them
  budget           text,                           -- optional ballpark range

  -- not-sure / general branch
  message          text,

  source           text        not null default 'partner-page'
);

-- Migration (July 7, 2026): guest branch expanded to the full application question set.
-- Idempotent, safe to re-run. Run this in the Supabase SQL editor BEFORE deploying the
-- expanded partner form, or every anon INSERT will 400 on the new columns.
alter table public.ai4ntp_partner_apps
  add column if not exists website         text,
  add column if not exists icp             text,
  add column if not exists preferred_dates text,
  add column if not exists gift            text,
  add column if not exists notes           text;

-- Clients (anon key) may INSERT only. They can never read this table.
alter table public.ai4ntp_partner_apps enable row level security;

drop policy if exists "anon insert partner apps" on public.ai4ntp_partner_apps;
create policy "anon insert partner apps"
  on public.ai4ntp_partner_apps
  for insert
  to anon
  with check (true);

grant insert on table public.ai4ntp_partner_apps to anon;

-- To read submissions, use the Supabase dashboard / Table editor, or query
-- with the service-role key from a trusted server. The anon key cannot SELECT.
