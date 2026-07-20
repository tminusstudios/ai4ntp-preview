-- Episode 003 kickoff poll: "If you had an AI agent, what's one task you'd have it do?"
-- Audience submits a task (+ optional name/email). Claude writes each person an
-- instant "here's how your agent would actually do that" reply (stored in ai_reply,
-- filled by /api/agent-003 via service role). The host can synthesize the whole
-- room into themes (/api/synthesize-003), stored on the single state row.
--
-- Run this in the Supabase SQL editor (project qytiyechjtkrejhhczcg). Not deployed.

-- ---------------------------------------------------------------------------
-- Submissions
-- ---------------------------------------------------------------------------
create table if not exists public.ai4ntp_pulse_003 (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  email       text,
  task        text not null,
  ai_reply    text            -- Claude's per-person reply; null until /api/agent-003 fills it
);

-- ---------------------------------------------------------------------------
-- Single-row state: what the screen-share stage is showing + the synthesized room
-- ---------------------------------------------------------------------------
create table if not exists public.ai4ntp_pulse_003_state (
  id         int primary key default 1 check (id = 1),
  mode       text not null default 'wall' check (mode in ('wall','themes')),
  synthesis  jsonb,          -- { headline, total, themes: [{label, count, blurb}] }
  updated_at timestamptz not null default now()
);
insert into public.ai4ntp_pulse_003_state (id, mode) values (1, 'wall')
  on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS: anyone can read everything and submit a task. ai_reply, synthesis, and
-- mode are written only by the service role (the /api routes).
-- ---------------------------------------------------------------------------
alter table public.ai4ntp_pulse_003 enable row level security;
alter table public.ai4ntp_pulse_003_state enable row level security;

create policy "anyone reads pulse 003"     on public.ai4ntp_pulse_003       for select using (true);
create policy "anyone inserts pulse 003"   on public.ai4ntp_pulse_003       for insert with check (true);
create policy "anyone reads state 003"     on public.ai4ntp_pulse_003_state for select using (true);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.ai4ntp_pulse_003;
alter publication supabase_realtime add table public.ai4ntp_pulse_003_state;

-- ---------------------------------------------------------------------------
-- Beehiiv sync: reuse the existing public.beehiiv_sync_row() trigger function
-- (created for 001/002). Fires the pg_net POST to /api/beehiiv-sync on insert.
-- ---------------------------------------------------------------------------
drop trigger if exists beehiiv_sync_pulse003 on public.ai4ntp_pulse_003;
create trigger beehiiv_sync_pulse003
  after insert on public.ai4ntp_pulse_003
  for each row execute function public.beehiiv_sync_row();
