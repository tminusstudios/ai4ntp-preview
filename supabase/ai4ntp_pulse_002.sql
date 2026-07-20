-- Episode 002 live brief-picker schema.
-- Run this in the Supabase SQL editor (project qytiyechjtkrejhhczcg) BEFORE the live.
-- This is the missing piece that was causing /sessions/002/assess to silently fail:
-- the page was inserting into tables that did not exist yet.
--
-- The audience page composes its question answers into the single `idea` column,
-- which is what /api/synthesize and the host dashboard read.

-- submissions (audience problems + the vote they later cast)
create table if not exists public.ai4ntp_pulse_002 (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text,
  idea          text,
  vote_for_id   uuid
);

-- AI-synthesized candidate businesses (5 of them)
create table if not exists public.ai4ntp_pulse_002_options (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  one_liner   text not null,
  vibe        text
);

-- single-row state (phase + winner)
create table if not exists public.ai4ntp_pulse_002_state (
  id         int primary key default 1 check (id = 1),
  phase      text not null default 'submitting'
    check (phase in ('submitting','voting','locked')),
  winner_id  uuid references public.ai4ntp_pulse_002_options(id),
  updated_at timestamptz not null default now()
);
insert into public.ai4ntp_pulse_002_state (id, phase) values (1, 'submitting')
  on conflict (id) do nothing;

-- RLS: anon can read everything, insert submissions, update own vote
alter table public.ai4ntp_pulse_002 enable row level security;
alter table public.ai4ntp_pulse_002_options enable row level security;
alter table public.ai4ntp_pulse_002_state enable row level security;

drop policy if exists "anyone reads pulse"   on public.ai4ntp_pulse_002;
drop policy if exists "anyone inserts pulse"  on public.ai4ntp_pulse_002;
drop policy if exists "anyone updates vote"   on public.ai4ntp_pulse_002;
drop policy if exists "anyone reads options"  on public.ai4ntp_pulse_002_options;
drop policy if exists "anyone reads state"    on public.ai4ntp_pulse_002_state;

create policy "anyone reads pulse"     on public.ai4ntp_pulse_002        for select using (true);
create policy "anyone inserts pulse"   on public.ai4ntp_pulse_002        for insert with check (true);
create policy "anyone updates vote"    on public.ai4ntp_pulse_002        for update using (true) with check (true);
create policy "anyone reads options"   on public.ai4ntp_pulse_002_options for select using (true);
create policy "anyone reads state"     on public.ai4ntp_pulse_002_state   for select using (true);

-- realtime (idempotent: ignore if already added)
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_002;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_002_options;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_002_state;
exception when duplicate_object then null; end $$;
