-- Episode 005 live brief-picker schema (the "build-off" brief vote).
-- Run this in the Supabase SQL editor (project qytiyechjtkrejhhczcg) BEFORE the live.
-- Mirrors the 002 three-table brief-picker: the audience submits what we should
-- build, /api/synthesize-005 remixes the room into 5 candidate companies and opens
-- voting, the host locks the winner. That winner is the single brief all three
-- builders (Ian, Justin, Alec) race to build in under an hour.
--
-- The audience page composes its answers into the single `idea` column, which is
-- what /api/synthesize-005 and the host dashboard read.

-- submissions (audience ideas + the vote they later cast)
create table if not exists public.ai4ntp_pulse_005 (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text,
  idea          text,
  vote_for_id   uuid
);

-- AI-synthesized candidate companies (5 of them)
create table if not exists public.ai4ntp_pulse_005_options (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  one_liner   text not null,
  vibe        text
);

-- single-row state (phase + winner)
create table if not exists public.ai4ntp_pulse_005_state (
  id         int primary key default 1 check (id = 1),
  phase      text not null default 'submitting'
    check (phase in ('submitting','voting','locked')),
  winner_id  uuid references public.ai4ntp_pulse_005_options(id),
  updated_at timestamptz not null default now()
);
insert into public.ai4ntp_pulse_005_state (id, phase) values (1, 'submitting')
  on conflict (id) do nothing;

-- RLS: anon can read everything, insert submissions, update own vote
alter table public.ai4ntp_pulse_005 enable row level security;
alter table public.ai4ntp_pulse_005_options enable row level security;
alter table public.ai4ntp_pulse_005_state enable row level security;

drop policy if exists "anyone reads pulse 005"   on public.ai4ntp_pulse_005;
drop policy if exists "anyone inserts pulse 005"  on public.ai4ntp_pulse_005;
drop policy if exists "anyone updates vote 005"   on public.ai4ntp_pulse_005;
drop policy if exists "anyone reads options 005"  on public.ai4ntp_pulse_005_options;
drop policy if exists "anyone reads state 005"    on public.ai4ntp_pulse_005_state;

create policy "anyone reads pulse 005"     on public.ai4ntp_pulse_005        for select using (true);
create policy "anyone inserts pulse 005"   on public.ai4ntp_pulse_005        for insert with check (true);
create policy "anyone updates vote 005"    on public.ai4ntp_pulse_005        for update using (true) with check (true);
create policy "anyone reads options 005"   on public.ai4ntp_pulse_005_options for select using (true);
create policy "anyone reads state 005"     on public.ai4ntp_pulse_005_state   for select using (true);

-- realtime (idempotent: ignore if already added)
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_005;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_005_options;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.ai4ntp_pulse_005_state;
exception when duplicate_object then null; end $$;

-- Beehiiv sync: reuse the existing public.beehiiv_sync_row() trigger function
-- (created for 001/002) so emails captured on the assess page land in Beehiiv.
-- NOTE: add "ai4ntp_pulse_005" to SOURCE_BY_TABLE in api/beehiiv-sync.js before
-- relying on this, otherwise these rows fall through to the default source.
drop trigger if exists beehiiv_sync_pulse005 on public.ai4ntp_pulse_005;
create trigger beehiiv_sync_pulse005
  after insert on public.ai4ntp_pulse_005
  for each row execute function public.beehiiv_sync_row();
