-- =====================================================================
-- Referral / affiliate tracker
-- Run once in the Supabase SQL editor (project: qytiyechjtkrejhhczcg).
--
-- Backs:
--   /r/<code>            -> api/r.js         (click log + redirect to current session)
--   /refer               -> api/refer-link.js (create/retrieve an affiliate link)
--   /portal?t=<token>    -> api/portal-stats.js (private stats by portal token)
--
-- Security model (deliberate): these three tables hold affiliate PII and secret
-- portal tokens, so they get ZERO anon access. RLS is enabled with no policies and
-- privileges are revoked from anon/authenticated. Only the serverless functions
-- (service-role key, which bypasses RLS) read/write them. Contrast with
-- ai4ntp_partner_apps / ai4ntp_signups, which allow anon INSERT.
--
-- Referrals are populated server-side by a trigger on the signup tables (mirrors
-- the beehiiv_sync_row() pattern), NOT by the browser, so the reward-gating counter
-- cannot be inflated by a forged client POST.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. affiliates: one row per referrer
-- ---------------------------------------------------------------------
create table if not exists public.ai4ntp_affiliates (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text not null unique,          -- lowercased+trimmed on write; idempotency key
  first_name    text,
  code          text not null unique,          -- public share code -> /r/<code>
  portal_token  text not null unique,          -- secret -> /portal?t=<token>
  source        text                           -- 'refer-page' | 'auto:build' | 'auto:sessions-006' ...
);

-- ---------------------------------------------------------------------
-- 2. referral_clicks: one row per /r/<code> hit
-- ---------------------------------------------------------------------
create table if not exists public.ai4ntp_referral_clicks (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  code          text not null,
  affiliate_id  uuid references public.ai4ntp_affiliates(id),  -- null if code unknown
  ip_hash       text,                          -- sha256(ip + salt); never the raw IP
  user_agent    text,
  referer       text,
  is_bot        boolean not null default false -- prefetch/unfurl/crawler; portal counts only is_bot=false
);
create index if not exists ai4ntp_referral_clicks_code_idx
  on public.ai4ntp_referral_clicks (code);

-- ---------------------------------------------------------------------
-- 3. referrals: one row per referred signup (the credit ledger)
-- ---------------------------------------------------------------------
create table if not exists public.ai4ntp_referrals (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  affiliate_id        uuid not null references public.ai4ntp_affiliates(id),
  code                text not null,                 -- denormalized for convenience
  referred_email      text not null unique,          -- lowercased; GLOBAL dedup => first-touch wins
  referred_first_name text,
  referred_source     text,                          -- the signup 'source' string
  signup_table        text,                          -- 'ai4ntp_signups' | 'signups'
  signup_id           text,                          -- NEW.id::text (pk types vary across tables)
  status              text not null default 'pending'
                      check (status in ('pending','attended','rewarded','disqualified')),
  attended_at         timestamptz
);
create index if not exists ai4ntp_referrals_affiliate_idx
  on public.ai4ntp_referrals (affiliate_id);

-- ---------------------------------------------------------------------
-- RLS: enable, add NO policies, and revoke grants (defense in depth).
-- service_role bypasses RLS, so the serverless functions still have full access.
-- ---------------------------------------------------------------------
alter table public.ai4ntp_affiliates      enable row level security;
alter table public.ai4ntp_referral_clicks enable row level security;
alter table public.ai4ntp_referrals       enable row level security;

revoke all on table public.ai4ntp_affiliates      from anon, authenticated;
revoke all on table public.ai4ntp_referral_clicks from anon, authenticated;
revoke all on table public.ai4ntp_referrals       from anon, authenticated;

-- ---------------------------------------------------------------------
-- Attribution column on the signup tables the browser POSTs to.
-- Additive + nullable, so existing forms that do not send it are unaffected.
-- The client writes ref_code; the trigger below reads it.
-- ---------------------------------------------------------------------
alter table public.ai4ntp_signups add column if not exists ref_code text;
alter table public.signups        add column if not exists ref_code text;

-- Framing A/B test: which post-signup share-moment copy variant this affiliate was
-- shown (blend | status | generosity | gamified), assigned round-robin in api/refer-link.js.
-- Null = pre-experiment affiliate. The growth console (/internal/refer) groups by this.
alter table public.ai4ntp_affiliates add column if not exists variant text;

-- ---------------------------------------------------------------------
-- Capture trigger: mint a referral when a signup carries a valid ref_code.
-- security definer so it can insert into the anon-locked referrals table.
-- to_jsonb(NEW) keeps it column-set-agnostic across both signup tables
-- (same technique as public.beehiiv_sync_row()).
-- ---------------------------------------------------------------------
create or replace function public.referral_capture_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec        jsonb := to_jsonb(NEW);
  v_ref      text;
  v_email    text;
  v_aff_id   uuid;
  v_aff_mail text;
begin
  v_ref   := nullif(trim(rec->>'ref_code'), '');
  v_email := lower(nullif(trim(rec->>'email'), ''));
  if v_ref is null or v_email is null then
    return NEW;                    -- no ref or no email: nothing to credit
  end if;

  select id, lower(email) into v_aff_id, v_aff_mail
    from public.ai4ntp_affiliates
   where code = v_ref
   limit 1;

  if v_aff_id is null then
    return NEW;                    -- unknown code
  end if;
  if v_aff_mail = v_email then
    return NEW;                    -- self-referral, ignore
  end if;

  insert into public.ai4ntp_referrals
    (affiliate_id, code, referred_email, referred_first_name, referred_source, signup_table, signup_id)
  values
    (v_aff_id, v_ref, v_email, nullif(trim(rec->>'first_name'), ''),
     rec->>'source', TG_TABLE_NAME, rec->>'id')
  on conflict (referred_email) do nothing;    -- global first-touch dedup

  return NEW;
exception
  when others then
    -- Never let referral capture block or fail a signup insert.
    raise warning 'referral_capture_row failed: %', sqlerrm;
    return NEW;
end;
$$;

drop trigger if exists referral_capture_ai4ntp on public.ai4ntp_signups;
create trigger referral_capture_ai4ntp
  after insert on public.ai4ntp_signups
  for each row execute function public.referral_capture_row();

drop trigger if exists referral_capture_signups on public.signups;
create trigger referral_capture_signups
  after insert on public.signups
  for each row execute function public.referral_capture_row();

-- ---------------------------------------------------------------------
-- Beehiiv: sync new affiliates (some are created via /refer with no prior
-- signup) using the existing pg_net trigger function. Remember to add
-- ai4ntp_affiliates to SOURCE_BY_TABLE in api/beehiiv-sync.js.
-- ---------------------------------------------------------------------
drop trigger if exists beehiiv_sync_affiliates on public.ai4ntp_affiliates;
create trigger beehiiv_sync_affiliates
  after insert on public.ai4ntp_affiliates
  for each row execute function public.beehiiv_sync_row();
