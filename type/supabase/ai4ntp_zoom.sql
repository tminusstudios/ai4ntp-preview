-- =====================================================================
-- Zoom auto-registration
-- Run once in the Supabase SQL editor (project: qytiyechjtkrejhhczcg).
--
-- Backs: real-time auto-registration of session signups onto the current
-- Zoom webinar. On INSERT to ai4ntp_signups, a pg_net trigger POSTs the row
-- to /api/zoom-register, which calls the Zoom "add webinar registrant" API.
-- Zoom then emails the person their unique join link + calendar invite.
-- (Same pg_net pattern as public.beehiiv_sync_row().)
--
-- BEFORE RUNNING: replace <ZOOM_SYNC_SECRET> below with the same value set as
-- the ZOOM_SYNC_SECRET env var in Vercel. Do not commit the real secret; this
-- file (like all of supabase/) is .vercelignore'd and never deploys.
-- =====================================================================

create extension if not exists pg_net;

-- ---------------------------------------------------------------------
-- Ledger: one row per registered signup. Service-role only (RLS enabled,
-- no policies, grants revoked), like the referral tables. Gives the
-- backfill script idempotency and enables a "signed up but not registered"
-- gap query (the warm-bailer recovery play).
-- ---------------------------------------------------------------------
create table if not exists public.ai4ntp_zoom_registrations (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  email          text not null unique,          -- lowercased; idempotency key
  session        text,                          -- the ZOOM_SOURCE_PREFIX at register time, e.g. 'episode-006'
  webinar_id     text,
  registrant_id  text,
  join_url       text
);

alter table public.ai4ntp_zoom_registrations enable row level security;
revoke all on table public.ai4ntp_zoom_registrations from anon, authenticated;

-- ---------------------------------------------------------------------
-- Trigger: POST each new signup to /api/zoom-register (fire-and-forget).
-- security definer + a swallow-all exception guard so a Zoom hiccup can
-- never block or fail the signup insert (same guard as referral_capture_row).
-- The endpoint itself decides whether the source belongs to this webinar.
-- ---------------------------------------------------------------------
create or replace function public.zoom_register_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform net.http_post(
    url     := 'https://ai4ntp.com/api/zoom-register',
    headers := jsonb_build_object(
                 'Content-Type', 'application/json',
                 'x-webhook-secret', '<ZOOM_SYNC_SECRET>'
               ),
    body    := jsonb_build_object('type', 'INSERT', 'table', TG_TABLE_NAME, 'record', to_jsonb(NEW))
  );
  return NEW;
exception
  when others then
    raise warning 'zoom_register_row failed: %', sqlerrm;
    return NEW;
end;
$$;

drop trigger if exists zoom_register_ai4ntp on public.ai4ntp_signups;
create trigger zoom_register_ai4ntp
  after insert on public.ai4ntp_signups
  for each row execute function public.zoom_register_row();

-- Also fire on the legacy homepage signups table (the homepage "Save your seat" forms
-- POST here). The /api/zoom-register endpoint registers all `signups` rows, since that
-- table is exclusively the homepage funnel.
drop trigger if exists zoom_register_signups on public.signups;
create trigger zoom_register_signups
  after insert on public.signups
  for each row execute function public.zoom_register_row();
