# Episode 002

> **SHIPPED — June 2, 2026.** This episode is live and over. The audience voted to build **GotoBuild**, an AI workout planner (logo: a yellow banana barbell). Live site: https://www.gotobuild.pro · brand kit: https://ianpk.com/gotobuild · YouTube replay ID `AdylF0tNIbY`.
>
> `index.html` is now the **published recap page** (replay, 5-min catch-up, booking, tools, the brief-picker vote snapshot, "what we built", bios, FAQ, transcript, Episode 003 CTA). Post-event working files: [youtube.md](./youtube.md), [transcript.md](./transcript.md), [faqs.md](./faqs.md), [tools.md](./tools.md), [catchup.md](./catchup.md), [post-event-emails.md](./post-event-emails.md), plus `thumbnail.jpg` / `generate-thumbnail.py` and the `REPLAY` `og-image.jpg`. Raw Zoom transcript + chat are in `raw/`.
>
> **Everything below is the pre-event planning record (kept for history).** The brief-picker pages (`/assess`, `/assess/live`) and `api/` routes are dormant. The real vote tally was GotoBuild 10, Yeskia 8, KartPass 4, Watchdog 3, NOBALDIES 0.

Working record for the AI4NTP Episode 002 webinar pages and assets.

**Companion docs:**
- [concept.md](./concept.md) — The build-in-public format, the brief, the giveaway structure, and the risk plan.
- [run-of-show.md](./run-of-show.md) — Minute-by-minute timing, transition lines, and fallback plans.
- [operator-briefs.md](./operator-briefs.md) — What Ian, Alec, and Justin each prep for their 15-minute segments.
- [sponsor-outreach.md](./sponsor-outreach.md) — Target sponsor list, value props, and DM template.
- [promo-copy.md](./promo-copy.md) — Cold email, LinkedIn announcement, Eventbrite event description, FAQs, agenda.
- [attendee-emails.md](./attendee-emails.md) — Post-registration confirmation + 5-touch reminder cadence for show-rate lift.

Cross-check all of these before making messaging or format changes.

## Event

- **Title (working):** Learn how to build a company with AI in under an hour.
- **Date:** Tuesday, June 2, 2026
- **Time:** 1:00 PM EST
- **Format:** Live on Zoom, recorded. Audience-picked brief in the first 6 minutes, then 53 minutes of boiler-room build with all three operators on mic in parallel.
- **The four on stage (3 builders + 2 co-moderators; Justin is both):**
  - **Ian Kilpatrick** — Founder, BrandSauce.io. Segment 1, brand operator: identity, design system, mockups, live domain purchase. Builds with OpenClaw (confirmed by Justin; supersedes the earlier Figma plan, see operator-briefs).
  - **Alec Saluga** — Founder, Aero AI. Segment 2, build operator: marketing website (Lovable + Claude Code), custom development, deploy to the bought domain.
  - **Justin Novak** — Founder, AI4NTP · T Minus Studios. Segment 3 (GTM build) + co-moderator: content engine demo, newsletter to Beehiiv, real social posts, runs the brief-picking flow and the giveaways.
  - **Brett Haralson** — Co-founder, Quetzal Labs (quetzals.ai). Co-moderator only (no build segment). Award-winning partner-ecosystem and community builder. Added June 1, 2026.

## The brief (audience-driven)

There is no pre-baked brief. The brief is picked live at minutes 2 to 6:30.

1. Audience answers two prompts at `ai4ntp.com/sessions/002/assess`: **"What should we build?"** (required) and **"What should we call it?"** (optional). The fun fake-business framing replaced the earlier "drop a business idea" and the short-lived "name a problem" framing (see change history, June 1).
2. Justin triggers AI synthesis from the dashboard. Claude remixes the submissions into 5 buildable, funny, meme-leaning candidate businesses (and reuses audience name ideas when good).
3. Audience votes on the 5.
4. Justin locks the winner. That is the brief for the next 53 minutes.

Lean funny over useful. See [concept.md](./concept.md) for the full reasoning and the alternates we rejected (Pipeline, four pre-baked options).

## The boiler-room build

After the brief locks at 6:30, all three operators work in parallel for 53 minutes. No internal walls. Mics open. Handoffs flow via a shared iMessage backchannel; Justin moderates verbally based on backchannel signals.

```
Ian (brand)
  → outputs: logo, palette, type system, voice rules, mockups, brand kit hosted at empk.com/ai4ntp-002/
  → also: buys the live domain on Namecheap around minute 18, points A record at Alec's Vercel project

Alec (build)
  → takes: brand kit URL as it lands, hex codes from the backchannel earlier
  → outputs: live deployed marketing site on the bought domain, plus a custom-dev element picked at improv time

Justin (launch + moderator)
  → takes: brand + site as they emerge
  → outputs: live newsletter shipped to Beehiiv, social posts on real AI4NTP accounts, "first 5 likes win X" engagement hook
  → also moderates: narrates every 90 seconds, watches the backchannel, breaks ties, runs giveaways
```

The audience watches a real boiler room: three founders building three pieces of one company simultaneously.

## Audience targeting

Same primary audience as 001: marketers and operators at lean B2B SaaS companies, 50 to 1,000 employees. The cold-email theme is "build a company with AI in under an hour," with the angle that any operator with the right stack can do this end to end without engineering, design agency, or growth team.

Secondary expansion: solopreneurs, indie hackers, and "non-technical founders" who've been hearing about vibe coding and AI marketing but haven't seen it actually demonstrated end to end in real time.

## URLs (LIVE as of May 26)

### Registration funnel

Single funnel through Eventbrite. EB handles registration, then triggers a transactional email with the Zoom registration link. Attendee registers on Zoom and receives a unique join link. EB's auto-reminders carry show rate.

- **Eventbrite event (public):** https://www.eventbrite.com/e/build-a-company-with-ai-in-under-an-hour-ai4ntp-episode-002-tickets-1990371208865
- **Eventbrite creator share:** https://www.eventbrite.com/e/build-a-company-with-ai-in-under-an-hour-ai4ntp-episode-002-tickets-1990371208865?aff=oddtdtcreator
- **Zoom webinar registration (attendee-facing):** https://us06web.zoom.us/webinar/register/WN_bFbbn0VqRxW47hR5hZVZTQ

Per-channel attribution variants documented in [promo-copy.md](./promo-copy.md#live-urls).

### Site pages

- **Public landing:** https://ai4ntp.com/sessions/002
- **Attendee idea form (primary brief mechanism):** https://ai4ntp.com/sessions/002/assess
- **Host live dashboard:** https://ai4ntp.com/sessions/002/assess/live — **now fully public, no token.** As of June 1, 2026 all host-auth (the `HOST_SECRET` gate, the unlock overlay, the token on `/api/state` and `/api/synthesize`) was removed at Justin's request. The page is protected only by URL obscurity + `noindex`. Anyone with the link can run synthesis, change phase, and **reset all data**, so do not share the dashboard URL.
- **Global register:** https://ai4ntp.com/register (as of May 29, 2026 captures the lead to Supabase `ai4ntp_signups`, then redirects to the Zoom registration URL. No longer hops through Eventbrite. EB remains the funnel for cold-email / external traffic.)

## File structure (planned)

```
sessions/002/
├── CLAUDE.md                      This file (project memory)
├── concept.md                     Build-in-public format + brief + giveaways
├── run-of-show.md                 Day-of timing + transitions + fallback plans
├── operator-briefs.md             What each operator preps
├── sponsor-outreach.md            Sponsor target list + DM template
├── promo-copy.md                  Cold email + LinkedIn + Eventbrite copy
├── index.html                     Public landing page (deployed)
├── og-image.jpg                   OpenGraph share image (TODO: design)
├── images/
│   ├── ian-kilpatrick.jpg
│   ├── alec-saluga.jpg
│   └── justin-novak.jpg
├── slides/
│   └── index.html                 reveal.js deck for the live (intro, transitions, close)
├── assets/                        Marketing distribution
└── assess/
    ├── index.html                 Live pulse form (votes brief name + vertical)
    └── live/
        └── index.html             Host real-time dashboard
```

## Supabase resources

Project: `qytiyechjtkrejhhczcg` (same as 001).

### Tables for the AI-quiz brief picker

- `public.ai4ntp_pulse_002`: audience submissions + votes. Columns: name, email, idea (free-text), vote_for_id (nullable until voting phase). RLS: anon can INSERT + SELECT + UPDATE.
- `public.ai4ntp_pulse_002_options`: AI-synthesized candidate businesses (5 of them). Columns: name, one_liner, vibe. RLS: anon can SELECT only. Inserts happen via service-role from `/api/synthesize`.
- `public.ai4ntp_pulse_002_state`: single-row phase + winner table. Columns: phase ('submitting' | 'voting' | 'locked'), winner_id. RLS: anon can SELECT only. Updates happen via service-role from `/api/synthesize` and from the host dashboard via a service-role helper route.

All three tables added to the realtime publication.

### SQL (run before the live)

```sql
-- submissions (open-ended audience ideas, votes appended on update)
create table public.ai4ntp_pulse_002 (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  email         text,
  idea          text,
  vote_for_id   uuid
);

-- AI-synthesized candidate businesses
create table public.ai4ntp_pulse_002_options (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  one_liner   text not null,
  vibe        text
);

-- single-row state (phase + winner)
create table public.ai4ntp_pulse_002_state (
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

create policy "anyone reads pulse"     on public.ai4ntp_pulse_002        for select using (true);
create policy "anyone inserts pulse"   on public.ai4ntp_pulse_002        for insert with check (true);
create policy "anyone updates vote"    on public.ai4ntp_pulse_002        for update using (true) with check (true);
create policy "anyone reads options"   on public.ai4ntp_pulse_002_options for select using (true);
create policy "anyone reads state"     on public.ai4ntp_pulse_002_state   for select using (true);

-- realtime
alter publication supabase_realtime add table public.ai4ntp_pulse_002;
alter publication supabase_realtime add table public.ai4ntp_pulse_002_options;
alter publication supabase_realtime add table public.ai4ntp_pulse_002_state;
```

The `/api/synthesize` route uses the service-role key to write to `ai4ntp_pulse_002_options` and update `ai4ntp_pulse_002_state`. Anon cannot write to those tables.

Existing `ai4ntp_signups` table from 001 is reused for the register page (no changes needed).

## Brand and voice

Inherits from root `/CLAUDE.md`. Non-negotiables:
- Never use em dashes. Use commas, periods, parentheses, or restructure.
- Direct, declarative, slightly understated. No hype.
- Specific over generic.
- Image paths in sub-routes must be absolute (e.g. `/sessions/002/images/...`).

## Critical path (May 22 to June 2)

Eleven days from update to live. Three risks: AI quiz reliability, boiler-room rehearsal time, audience build.

- **Day 0 (Friday May 22):** scaffold complete; operator briefs sent; cold-email + LinkedIn live; Eventbrite event published.
- **Day 1 to Day 4 (Sat May 23 to Tue May 27):** prep. May 27 prep call resolved brief mechanism (audience-driven AI quiz), format (boiler-room), and rehearsal date (Mon Jun 1).
- **Day 5 (Wednesday May 28):** AI quiz + dashboard + synthesize route shipped to staging. Sponsor follow-ups; cold-email round 2.
- **Day 6 (Thursday May 29):** AI quiz smoke-tested end-to-end against live Supabase. Fallback videos recorded.
- **Day 7-8 (Fri May 30, Sat May 31):** operator solo run-throughs against the clock with a self-generated brief.
- **Day 9 (Sun May 31):** final-day push (sponsor confirmations, social).
- **Day 10 (Mon Jun 1, 7 PM EST):** **dress rehearsal**, all three operators on Zoom for 90 min. Tests AI quiz, boiler-room overlap, brand-kit handoff, live domain purchase, backchannel, fallback paths.
- **Day 11 (Tue Jun 2):** SHIP IT. 1 PM EST live. Soundcheck at 12:45 PM EST.

Slippage past Mon Jun 1 dress rehearsal is the biggest risk. Block calendars for it now.

## Live session playbook

**Before the call:**
1. Truncate pulse data:
   ```sql
   truncate ai4ntp_pulse_002, ai4ntp_pulse_002_options;
   update ai4ntp_pulse_002_state set phase = 'submitting', winner_id = null where id = 1;
   ```
2. Open in tabs: host dashboard at `/sessions/002/assess/live`, attendee form at `/sessions/002/assess` (to paste in chat), each operator's build tools pre-loaded.
3. Backchannel iMessage thread (Justin + Ian + Alec) pinned on a second screen.
4. Each operator has fallback video ready to share.

**During:**
- Minutes 2:00 to 6:30: brief-picking flow. Justin reads funny submissions aloud, triggers synthesis at 4:30, opens voting at 5:00, locks winner at 6:30.
- Minutes 7 to ~50: boiler-room. All three operators on mic, building in parallel. Justin narrates every 90 seconds, watches the backchannel, breaks ties.
- Artifacts drop in chat as they ship: brand-kit URL around minute 30, live site URL around minute 48, launch-kit URL around minute 51.

**After:**
- Push the recap page live (same playbook as 001).
- Each operator's artifact (brand kit, website code, launch kit) shareable as a giveaway link.
- Live site stays on the bought domain forever as a "living monument."

## Change history

### Pre-live build session (June 1, 2026)
A working session the day before the live. Several things that had never actually shipped got finished, and some decisions reversed.
- **Supabase tables finally created.** `ai4ntp_pulse_002`, `_options`, and `_state` did not exist in the database, which was silently breaking the assess page (every insert 404'd). Justin ran the schema SQL in the dashboard. SQL is saved at [`supabase/ai4ntp_pulse_002.sql`](../../supabase/ai4ntp_pulse_002.sql).
- **Vercel env vars added.** `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` were never set, so `/api/state` and `/api/synthesize` had always 500'd. Added to Production June 1. The whole host dashboard had effectively never worked before this.
- **Assess question framing pivoted twice, landed on fake-business.** Started as "drop a business idea," briefly became "name a problem," final is **"What should we build?" (required) + "What should we call it?" (optional)**. Both compose into the single `idea` column the dashboard and synthesis read, so no schema change. `/api/synthesize` system + user prompts rewritten to remix audience pitches (and reuse suggested names) into 5 funny buildable businesses.
- **Host-auth removed entirely.** At Justin's request the `HOST_SECRET` gate was dropped from the dashboard and from `/api/state` + `/api/synthesize`. The unlock overlay and all token plumbing were deleted; `HOST_SECRET` env var removed. Dashboard is now public, protected only by URL obscurity + `noindex`. (Interim step that was later removed: a "#t=token" bookmark, then a public-dashboard-with-reset-still-gated design.)
- **Reset now self-heals the audience page.** The assess page verifies its saved submission against the DB on load and on realtime state changes; if a host reset wiped the row, the page clears its local flags and returns to a fresh form instead of being stuck on "Idea locked in."
- **Assess form labels enlarged/darkened** for big-screen readability (titles 13px/0.92 opacity, notes 17px/0.8).
- **Brett Haralson added as a 4th person, co-moderator only.** Co-founder of Quetzal Labs (quetzals.ai). Added to the 002 page (speaker strip + bio cards + schema performer), and as a 4th avatar on the homepage Episode 002 promo card. Photo at `images/Brett-Haralson.jpeg` (cropped square + downsized 800x800; original kept as a deploy-ignored `.bak`).
- **Role hierarchy on the 002 page reworked with rust accents.** Neutral "Segment 1/2/3" tags mark the builders (Ian, Alec, Justin); rust "Co-moderator" marks the moderation layer (Justin + Brett). Justin shows both; Brett shows only co-moderator (no segment, no build line). "Who" speaker-card grid changed to a 4-across row.
- **Ian's brand tool corrected to OpenClaw.** Justin confirmed Ian is building the brand with **OpenClaw** (the newsletter says "OpenClaw companion"), not Figma as operator-briefs.md still describes. operator-briefs.md flagged but not fully rewritten (the Figma-specific pre-work steps need Ian's own revision).
- **Homepage copy overhaul** (see root `/CLAUDE.md` change note): hero emphasis line → "Become the most AI-capable person in the room."; subline → "Most AI content stops at theory. At AI4NTP, real operators show exactly how they use & build with AI, holding nothing back, so you walk away ready to apply it the same day."; testimonials eyebrow "What attendees said" → "What the room is saying"; "Who this is for" rebuilt as a connected skill-spectrum and "Why AI4NTP" rebuilt as an editorial row-list so the two sections stop mirroring.

### Homepage funnel redesign + on-site register to Zoom (May 29, 2026)
- Homepage (`/index.html`) rebuilt from a quiet editorial page into a registration funnel: sticky countdown bar ticking to `EVENT_START`, nav CTAs (`Apply to be a Guest` yellow button, `Save your seat`), hero with tagline-above-wordmark + community-positioning copy + inline email capture, sessions (002 first, then 001 replay), "Who this is for" skill-level cards, evergreen FAQ, closing CTA (`Your AI edge starts here.`). Full structure documented in root `/CLAUDE.md`.
- **On-site registration now captures to Supabase, then redirects to Zoom.** Homepage hero + closing forms (table `signups`) and `/register` (table `ai4ntp_signups`) POST the lead first (HTTP 201 and 409 both treated as success), then send the visitor to the Zoom webinar registration URL. A failed capture shows an error and does not redirect, so no lead is sent onward uncaptured. This is the on-site path; Eventbrite still fronts cold-email / external traffic.
- Zoom URL wired into the site redirect (user-supplied): `https://us06web.zoom.us/webinar/register/1217800792642/WN_bFbbn0VqRxW47hR5hZVZTQ`. This is the canonical link the live site uses. It differs from the shorter form in the URLs section / May 26 entry (`.../register/WN_bFbbn0VqRxW47hR5hZVZTQ`) only by the extra `1217800792642` path segment, which Justin confirmed is a fine tracking variant (both resolve to the same Zoom registration). No action needed.

### Format + brief pivot from May 27 prep call (May 27, 2026)
- **Brief mechanism killed and rebuilt.** The pre-baked Pipeline brief is gone. New flow: audience submits free-text business ideas at minute 2, Claude synthesizes 5 funny/meme-leaning candidates from the raw submissions at minute 4:30, audience votes, Justin locks the winner at 6:30. No operator knows what we're building until the lock. Reasoning: Ian framed pre-baked options as breaking the "magic trick"; all three operators agreed the improv path is the credibility hook.
- **Format pivoted from sequential 15-minute solos to full boiler-room.** All three operators on mic from minute 7, building in parallel for 53 minutes, with a shared iMessage backchannel for handoff signals. Justin moderates verbally based on backchannel signals. No internal walls.
- **Justin's segment hard-spec'd.** Multi-tenant content engine demo: ingest brand kit + voice, Firecrawl industry sources, AI-score articles 0-100, compile newsletter, ship to Beehiiv, generate LinkedIn + X posts in brand voice, post live to real AI4NTP socials, "first 5 likes win X" engagement hook. Public copy stays vague; internal docs nail it down.
- **Dress rehearsal moved from Friday May 30 to Monday June 1, 7 PM EST.** Last chance to rehearse the new format and the new quiz before live.
- **Supabase schema rebuilt.** Old `ai4ntp_pulse_002` columns (`vote_name`, `vote_vertical`, `biggest_problem`) replaced with new three-table schema: `ai4ntp_pulse_002` (submissions + votes), `ai4ntp_pulse_002_options` (5 AI-synthesized candidates), `ai4ntp_pulse_002_state` (phase + winner).
- **Zoom Polls dropped entirely.** AI quiz at `/sessions/002/assess` is now the primary and only vote mechanism (Zoom Polls cannot do free-text submission or staged voting).
- **New build tasks:** `/sessions/002/assess` (phase-aware audience page), `/sessions/002/assess/live` (host dashboard with phase controller), `/api/synthesize` (Vercel serverless route calling Claude Sonnet 4.6).
- **Bio corrections from the call:** Ian's Dove Award is the Grady Nut Humor Award (a kids' website). Alec uses Claude Code, not Cursor.

### Eventbrite + Zoom go live (May 26, 2026)
- Eventbrite event published at https://www.eventbrite.com/e/build-a-company-with-ai-in-under-an-hour-ai4ntp-episode-002-tickets-1990371208865 with full long-form description, 8 FAQs, 8-slot agenda, tags optimized for AI / vibe coding / startup search.
- Zoom webinar registration live at https://us06web.zoom.us/webinar/register/WN_bFbbn0VqRxW47hR5hZVZTQ.
- Single-funnel architecture chosen: cold email and LinkedIn drive to EB, EB drives to Zoom, Zoom issues the unique join link. EB's built-in reminders handle show rate.
- New file [attendee-emails.md](./attendee-emails.md) contains the 5-touch confirmation + reminder cadence (confirmation, T-7d, T-24h, T-2h, T-15min).
- Brief vote mechanism switched from chat-based pulse form to **Zoom Polls** as primary (001 had reliability issues with attendee chat permissions). Pulse form retained as backup. See [run-of-show.md](./run-of-show.md).
- Promo copy [promo-copy.md](./promo-copy.md) updated with sharpened cold-email variants (short version for 10k cold scrape, long version for warm/001 list), live URLs, FAQs, agenda, distribution timing.
- Targets formalized: 250+ registrants, 150+ live attendees, 60% show rate. Highest-leverage gap: Ian and Alec amplification not yet locked.

### Date and segment update (May 22, 2026)
- Date moved from Thursday May 28 to **Tuesday June 2**, 1 PM EST.
- Segment assignments updated to better match each operator's actual professional strengths:
  - Segment 1 (brand identity + design): Justin → **Ian**. Ian has 30+ years of design experience (Disney, AMAs, Dove Award), genuinely the strongest fit.
  - Segment 2 (website + custom development): Alec stays, scope expanded from no-code-only to also include custom dev work (Cursor/Claude Code beyond Lovable).
  - Segment 3 (working app → marketing + GTM launch): Ian → **Justin**. Justin's fractional-CMO expertise and his year of building marketing tech (content engine, newsletter system, social/blog/email automation) is the right fit.
- The compounding chain now resolves at "launched startup" instead of "deployed app." The session arc is design → build → launch, which is a tighter narrative.
- Justin's segment is **intentionally flexible**. The public-facing description is broad ("marketing tech for content, newsletters, social, blog, email") to spark curiosity. The exact deliverable lands closer to game day.

### Format decision (May 21, 2026)
- Format pivot from "panel of operators" (001) to "build in public" (002). Each operator gets a 15-minute solo segment to ship something real.
- Single brief: Pipeline (B2B lead enrichment). Audience picks company name + vertical via pulse poll at minute 2.
- Each segment builds on the previous one.
- Giveaways per segment, plus one whole-session winner.

## Open todos

### Done
- [x] Eventbrite event setup (published May 26 with title, date, FAQs, agenda, tags, full description)
- [x] Zoom webinar registration live
- [x] Generate `/sessions/002/og-image.jpg`

### To do
- [x] Confirm Ian, Alec, Justin availability for Jun 2 live + Mon Jun 1 dress rehearsal (done on May 27 prep call)
- [ ] Lock Ian + Alec amplification commitment (one LinkedIn post + one list send each, by EOD May 27)
- [ ] Cold email send 1 to 5k (Wed May 27, subject variant A)
- [ ] Cold email send 2 to remaining 5k (Thu May 28, subject variant B)
- [ ] Cold email to 001 registrant list (Thu May 28, long variant with callbacks)
- [ ] LinkedIn DM campaign to top-tier 001 attendees who haven't booked a 30-min
- [ ] LinkedIn announcement published by Justin, Ian, Alec (Wed May 27 morning)
- [x] **Run the new three-table schema SQL in Supabase** (done June 1 by Justin in the dashboard; SQL saved at [`supabase/ai4ntp_pulse_002.sql`](../../supabase/ai4ntp_pulse_002.sql). The tables were missing until now, which was silently breaking the assess page.)
- [x] **Build /sessions/002/assess audience page** (live; question framing is now "What should we build? / What should we call it?")
- [x] **Build /sessions/002/assess/live host dashboard** (live; now public/no-token)
- [x] **Build /api/synthesize Vercel serverless route** (live; calls Claude Sonnet 4.6, prompt rewritten for the fake-business framing)
- [x] Add `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars (added June 1, Production. `HOST_SECRET` was added then removed when host-auth was dropped.)
- [x] End-to-end smoke test of AI quiz (passed June 1: submit → synthesize → vote → lock → reset all verified against live Supabase)
- [ ] Build /sessions/002/slides reveal.js intro deck (cold open + format frame)
- [ ] Configure Zoom chat permissions (Everyone, both account-level and webinar-specific)
- [ ] Sponsor outreach to Lovable, Anthropic, Vercel, Plaud, Supabase, Figma (status in [sponsor-outreach.md](./sponsor-outreach.md))
- [ ] Configure EB confirmation + reminder sequence (see [attendee-emails.md](./attendee-emails.md))
- [ ] Optional: SMS reminder at T-1h via Twilio/GHL off EB webhook (+8-12 pt show rate lift)

### Dropped (no longer applicable)
- ~~Pre-load Zoom Polls for brief vote~~ — Zoom Polls dropped, AI quiz is primary and only mechanism

## Attendance targets

- **Registrants:** 250+ (001 baseline: 110)
- **Live attendees:** 150+ (001 baseline: 55 at 50% show rate)
- **Show rate target:** 60% (001 baseline: 50%)

The 250 reg target requires ~150-200 reg from the 10k cold scrape at 1.5-2% conversion, plus at least one external amplifier (Ian's list, Alec's list, or sponsor push) layered on top.
