# Episode 001

Working record for the AI4NTP Episode 001 webinar pages and assets.

**Companion docs:**
- [NOTES.md](./NOTES.md) — Detailed production notes (marketing asset specs, headline A/B history, Zoom webinar description copy, audience targeting).
- [audience-brief.md](./audience-brief.md) — Registrant analysis driving the slide deck (firmographics, seniority, function mix from 67 signups, May 20).
- [cold-email.md](./cold-email.md) — Winning Eventbrite cold-email copy + conversion patterns + Justin's copy preferences.
- [practice-session-transcript.md](./practice-session-transcript.md) — May 20 dry-run brainstorm with Alec and Ian. Drove the final deck rework + bonus mechanic change + Topic 01/02 headlines.
- [slides/index.html](./slides/index.html) — reveal.js deck. Live at `https://ai4ntp.com/sessions/001/slides`.
- [run-of-show.md](./run-of-show.md) — Justin's day-of live-ops doc.

Cross-check all of these before making large changes to messaging or deck content.

**Audience targeting**: marketers running marketing at 10-to-200 person companies (CMO, marketing director, growth lead, marketing manager). See NOTES.md for the targeting + Zoom description copy.

## Event

- **Title**: How marketers are actually using AI to grow
- **Date**: May 21, 2026
- **Time**: 1:00 PM EST
- **Format**: Live on Zoom, recorded for replay
- **Speakers**:
  - Justin Novak (Host) · Founder, AI4NTP · T-Minus Studios
  - Alec Saluga (Guest) · Founder, Aero AI
  - Ian Kilpatrick (Guest) · Founder, BrandSauce.io

## URLs

- Public landing: https://ai4ntp.com/sessions/001
- Attendee pulse form: https://ai4ntp.com/sessions/001/assess
- Host live dashboard (unlisted): https://ai4ntp.com/sessions/001/assess/live
- Global register / CTA page: https://ai4ntp.com/register

## File structure

```
sessions/001/
├── CLAUDE.md                       This file (project memory)
├── NOTES.md                        Production notes (assets, webinar copy, A/B history)
├── audience-brief.md               Registrant firmographic analysis + deck guidance
├── cold-email.md                   Winning cold-email copy + conversion patterns
├── practice-session-transcript.md  May 20 dry-run with Alec + Ian
├── run-of-show.md                  Day-of live-ops doc
├── index.html                      Public landing page
├── og-image.jpg                    OpenGraph share image (1200x630)
├── images/
│   ├── justin-novak.jpg
│   ├── alec-saluga.jpg
│   └── ian-kilpatrick.jpg
├── slides/
│   └── index.html                  reveal.js deck for the live session
├── assets/                         Marketing distribution assets
│   ├── hero-1880x940.png            Landing-page parity hero
│   ├── hero-ig-1080x1350.png        Instagram 4:5 portrait
│   ├── hero-ig-1080x1350-test.png   Leftover from first IG pass (safe to delete)
│   ├── zoom-banner-1280x400.png     Zoom event banner (2x of 640x200)
│   └── zoom-logo-600x600.png        Zoom event logo (under 300 KB cap)
└── assess/
    ├── index.html                  Attendee pulse form
    └── live/
        └── index.html              Host real-time dashboard
```

## Supabase resources

Project: `qytiyechjtkrejhhczcg` (T Minus Studios / Ai4ntp).

### Tables

- `public.ai4ntp_signups`: signups from /register. Columns: email (required), first_name, interests (text[]), goal, source. RLS: anon can INSERT.
- `public.ai4ntp_pulse_001`: live pulse responses for this episode. Columns: name, email, goal (required), tool, vision. RLS: anon can INSERT + SELECT (so host dashboard streams via anon key). Realtime enabled.

### Pulse table SQL (already run)

```sql
create table public.ai4ntp_pulse_001 (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  email       text,
  goal        text not null,
  tool        text,
  vision      text
);

alter table public.ai4ntp_pulse_001 enable row level security;

create policy "anyone can insert pulse"
  on public.ai4ntp_pulse_001
  for insert
  with check (true);

create policy "anyone can read pulse"
  on public.ai4ntp_pulse_001
  for select
  using (true);

alter publication supabase_realtime add table public.ai4ntp_pulse_001;
```

## Page anatomy (sessions/001/index.html)

Top to bottom:
1. **Hero**: h1 ("How marketers are actually using AI to **grow**" with yellow highlight on "grow"), subtitle, speaker thumbnail row (192px circles), CTAs ("Reserve your spot" links to /register, "What we'll cover" anchors to topics).
2. **Topics** (`id="what-well-cover"`): "Three stories. *Three playbooks.*" with 4 list items. Topic 4 uses `<li class="bonus">` with a four-pointed star (✦) glyph instead of "04".
3. **Speakers** (`id="speakers"`): 3-up card grid (280px circular headshots), bios + LinkedIn links.
4. **Logistics** (`id="register"`): date / time / where / format grid, register CTA, "can't make it live" line.

The post-webinar replay section is commented out at the bottom of the file; uncomment it to add the recording.

## Brand and voice

Inherits from root /CLAUDE.md. Key rules:

- Never use em dashes. Use commas, periods, or parentheses.
- Direct, declarative, slightly understated. No hype.
- Image paths in sub-routes must be absolute (e.g. `/sessions/001/images/...`) because of Vercel `cleanUrls`.

## Live session playbook

**Before the call:**
1. Clear smoke-test data: `delete from public.ai4ntp_pulse_001 where name = 'Smoke Test';` (or `truncate public.ai4ntp_pulse_001;` for a fully empty board).
2. Open https://ai4ntp.com/sessions/001/assess/live in a browser tab on the screen you'll share.
3. Have https://ai4ntp.com/sessions/001/assess ready to paste in the Zoom chat right after the genie prompt.

**Genie script (Justin, intro of call):**
> "Close your eyes and imagine you have one genie. One wish. Maybe it's specific (rank #1 in LLM answers, get a promotion, sell your business) or general (just learn something new, more PTO). Whatever it is, drop it in here. Alec and Ian have 18 hours of content; we'll get to 30 to 45 minutes. Your answers steer the next 45 minutes."

**During:**
- Watch the dashboard. New responses slide in with a yellow flash; word clouds resize live.
- Cherry-pick interesting wishes to share on screen.

**After:**
- Pull responses for follow-up via Table Editor or SQL: `select created_at, name, email, goal, tool, vision from public.ai4ntp_pulse_001 order by created_at desc;`

## Change history (this build cycle, May 2026)

### Hero + headline
- Headline iterated: "How operators are actually using AI." → "How everyday people are actually using AI to grow their income" → "How marketers are actually using AI to grow their income." → "How marketers are actually using AI to **grow**" (final, "grow" highlighted yellow). See NOTES.md for the full A/B history and audience-targeting rationale.
- Page title and og:title / twitter:title / schema.org name updated to match.
- Subtitle (current, with "Ai" not "Claude Code"): "Alec quit his 9-5 and tripled his income in < 30 days. Ian runs a portfolio of companies with Ai. Three tricks anyone can use Monday morning. Bonus prize for everyone who stays until the end."

### Section order
- "Three stories. Three playbooks." (Topics) moved above "Three operators, showing their work" (Speakers). Topics now sits right below the hero.

### Topics (current state)
- **Topic 1.** H3: "How Alec quit his 9-5 and tripled income in 30 days." Desc: "Alec walks through quitting his 9-5 and 3xing his income with the help of Ai. The exact tools he uses, the workflow, and how you can do the same."
- **Topic 2.** H3: "Running a portfolio with Ai + Ranking on LLMs." Desc features Brand Sauce as a global software company, AI consultancy, private school, "1 man team" framing with Ai; teaser for Ian's LLM ranking playbook.
- **Topic 3.** H3: "Three tricks anyone can use Monday morning." Desc: "Learn the best tools, tips, and tricks you can implement immediately."
- **Topic 4** (bonus). H3: "Bonus for joining live." Desc: deliberately ambiguous ("A surprise for everyone who joins live and stays through to the end. That's all we'll say."). Uses `<li class="bonus">` with a ✦ glyph in place of "04".

### Speakers
- Title-lines: Alec = "Founder, Aero AI", Ian = "Founder, BrandSauce.io", Justin unchanged ("Founder, AI4NTP · T-Minus Studios").
- Bios rewritten (multiple iterations, current state below):
  - Alec: Aero AI founding story, former B2B salesman, self-taught AI builder, 15k+ social following.
  - Ian: Software since 1985 (first code at age 10), worked with Golden Globes / Disney / Nokia / AMAs, won a Dove Award, helped a company go public; currently operates BrandSauce.io, builds AI products, advises on AI strategy.
  - Justin: NASDAQ:TTWO dorm-room sale, fractional CMO scaling businesses past $50M+ ARR, now finding world-class AI innovators to connect with.
- Headshot circles 2x larger (192px hero thumb, 280px card). Card grid min width bumped to 344px to fit.
- New headshot photos: Alec on blue background, Ian against a red-rock painting backdrop. Source files also synced to /Episode 1 folder.
- Object-position and transform: scale values tuned for new portraits.

### Visuals and metadata
- Custom OG image generated at /sessions/001/og-image.jpg (1200x630): paper texture, yellow "4" in logo, big italic-serif headline with yellow "grow" highlight, three small stacked headshots, live dot, ai4ntp.com domain.
- Image paths inside sessions/001/index.html switched from relative (`images/...`) to absolute (`/sessions/001/images/...`) to avoid Vercel `cleanUrls` breakage.

### New pages built in this cycle
- **/register**: conversion-optimized signup page (name, email, interest checkboxes pre-checked for Episode 001 + future episodes + community, optional "what are you hoping to take away" textarea). Posts directly to Supabase `ai4ntp_signups` via REST + anon key. Inline success state. Movement copy iterated: hero sub now "AI is the great equalizer, if you know how to use it. **Join the movement.**" (yellow highlight). Movement card titles "Real operators, real work.", "Tools you'll use Monday.", "Join the Movement." Card 02 desc highlights "**act on now.**" in yellow.
- **/sessions/001/assess**: live pulse form. Required: name, email, "one thing you want from today". Optional: "one AI tool you want to learn more about", "in one sentence, you or your team's biggest AI goal for 2026". No placeholders on any field; goal field has autofocus. Posts to Supabase `ai4ntp_pulse_001`.
- **/sessions/001/assess/live**: real-time host dashboard. Loads existing rows + subscribes to Supabase Realtime INSERT events. Three columns (one per question) with editorial word clouds (Fraunces italic, top words on yellow signal background) and live answer feed cards that flash yellow on arrival. Counter top-right bumps with each new response. 30s polling fallback if realtime stalls. `noindex` + unlisted.

### Voice and tone documentation
- Root /CLAUDE.md created with the "never use em dashes" rule and project structure notes.

### Deploy
- All deploys via `cd /Users/justinnovak/Desktop/ai4ntp/ai4ntp && vercel --prod --yes`.

## Open todos / known sparse spots

- Schema.org event description (line 32 of index.html) still leads with "Alec Saluga quit corporate sales to go all-in on AI and tripled his revenue in 90 days." The rest of the page has moved to the "9-5 / under 30 days" framing. Update if SEO matters.
- Footer social links are still `#` placeholders on both /sessions/001 and /register.
- Post-webinar replay block exists as commented HTML at the bottom of sessions/001/index.html; uncomment and fill in YouTube ID after the recording.
- `assets/hero-ig-1080x1350-test.png` is a leftover from the first IG pass (per NOTES.md). Safe to delete.
- **Zoom event description** (Justin pastes into Zoom directly): needs to match the new bonus mechanic (everyone gets 30 min self-selected, not "one attendee picks"). NOTES.md "Zoom Webinar Description" section has the corrected copy.

---

## May 20 practice-session updates (post dry-run with Alec + Ian)

Captured from `practice-session-transcript.md`. The deck and copy were reworked to match:

- **Topic 01 (Alec) headline:** "Anything you can imagine, you can build." (yellow highlight on "imagine"). Alec's segment is now a 4-pillar rapid-fire (AI-first agency, what's possible NOW in marketing, personal AI tools, the unlock), not a single-workflow deep dive. Tool name-drops: WhisperFlow, Plaud Note, Claude Code, Loom.
- **Topic 02 (Ian) headline:** "Ranking with LLMs. SEO, GEO, AEO, & PEO." (yellow highlight on "PEO"). Ian's segment is now deep on LLM SEO: pre-frame (people search in ChatGPT now), the AEO/GEO/PEO/AIO landscape, Echo Check demo (`echocheck.app`, not .com), programmatic SEO, automated blog posts with guardrails. Case study: wife's school, 0 ad spend, 90 → 200+ students.
- **Topic C (demand gen) cut.** Audience brief had it; the room agreed to skip.
- **Fireside chat** opens with "Is AI gonna take everyone's job?" Alec has the "Sandy with the typewriter" callback. Ian has the tractor / electricity / phone-line analogy.
- **Rapid Three Q3** changed from "Series B company" → "marketing manager at a funded company." Q1 and Q2 unchanged. Movie callback (Alec → Dark Knight) folded in at close for warmth.
- **Bonus mechanic CHANGED.** Old: one attendee gets 30 min with one operator. New: every attendee who stays gets a 30-minute one-on-one with the operator they self-select. Plus connection-card slide with QR codes (Alec, Ian, Justin).
- **News beat to capture (May 19, 2026):** Google announced it will prioritize AI-generated answers in search results over human-written articles. Cited in Topic 02 (Why now).
- **Ian's coined term:** **PEO** = Public Engine Optimization. Alongside AEO/GEO/AIO. Featured in the Topic 02 headline.
