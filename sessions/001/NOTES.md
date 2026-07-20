# Episode 001 · Production Notes

**Companion docs (read alongside this file):**
- [CLAUDE.md](./CLAUDE.md) — Project memory for future Claude sessions (file structure, Supabase setup, change history, voice and tone rules, live-session playbook, open todos).
- [audience-brief.md](./audience-brief.md) — Registrant analysis (67 signups, firmographics, seniority, function mix). Drives the slide deck and any session-of-record content. Generated May 20, 2026.
- [cold-email.md](./cold-email.md) — The winning Eventbrite cold-email copy (both the "fast-growing" version and the "200+ person company" reframe), the conversion patterns to reuse, and Justin's hard copy preferences.
- [practice-session-transcript.md](./practice-session-transcript.md) — May 20 dry-run brainstorm with Alec and Ian. Drove the final deck rework, the bonus-mechanic change, and Topic 01 + Topic 02 headlines.
- [slides/index.html](./slides/index.html) — The reveal.js deck for the live session (live at `https://ai4ntp.com/sessions/001/slides`).
- [run-of-show.md](./run-of-show.md) — Justin's single-page live-ops doc for the day-of presentation.

Live URL: https://ai4ntp.com/sessions/001
Event: May 21, 2026 · 1:00 PM EST · Live on Zoom
Speakers: Justin Novak (host), Alec Saluga (guest), Ian Kilpatrick (guest)

---

## Project Pages

| URL | Purpose |
|---|---|
| https://ai4ntp.com/sessions/001 | Public landing page (this file's index.html) |
| https://ai4ntp.com/register | Global registration / lead-capture form (Supabase-wired) |
| https://ai4ntp.com/sessions/001/assess | Attendee pulse form (run live during the call to steer content) |
| https://ai4ntp.com/sessions/001/assess/live | Host live dashboard (unlisted, `noindex`, Supabase Realtime) |

Form submissions on `/register` and `/assess` write to Supabase tables `ai4ntp_signups` and `ai4ntp_pulse_001`. See [CLAUDE.md → Supabase resources](./CLAUDE.md) for table schemas + RLS policies.

---

## Audience Targeting

**Marketers running marketing at 10-to-200 person companies.** Job titles: CMO, marketing director, growth lead, marketing manager.

The landing page headline, Zoom event description, and Instagram post are all calibrated to this persona. Pre-pivot history: original copy targeted "operators" (warm traffic); a brief "everyday people" frame was tested before settling on "marketers" for cold-email reach.

---

## Landing Page Copy

### Current headline
**H1:** "How marketers are actually using AI to *grow*."
**Highlight word:** `grow` (lime `--signal` background, italic)

Also synced across `<title>`, `og:title`, `twitter:title`, and JSON-LD `name`.

### Headline evolution
1. Original (warm-traffic): "How operators are actually using AI"
2. Cold-email v1: "How everyday people are actually using AI to grow their income"
3. Cold-email v2: "How marketers are actually using AI to grow their income"
4. Current trimmed: "How marketers are actually using AI to grow"

Audience targeting shifted to **marketers running marketing at 10–200 person companies** (titles: CMO, marketing director, growth lead, marketing manager).

### "Three stories. Three playbooks." section

**Story 1 (Alec):** "Alec walks through quitting his 9-5 and 3xing his income with the help of Ai. The exact tools he uses, the workflow, and how you can do the same."

**Story 2 (Ian):** unchanged

**Story 3 (tools/tips):** "Learn the best tools, tips, and tricks you can implement immediately."

**Topic 4 (bonus):** Deliberately ambiguous to drive show rate. Uses `<li class="bonus">` with a ✦ glyph in place of "04". Copy: "A surprise for everyone who joins live and stays through to the end. That's all we'll say."

### Subhead (unchanged)
"Alec quit his 9-5 and tripled his income in < 30 days. Ian runs a portfolio of companies with Ai. Three tricks anyone can use Monday morning. Bonus prize for everyone who stays until the end."

### Speakers (current title lines)

- **Justin Novak (Host)** · Founder, AI4NTP · T-Minus Studios
- **Alec Saluga (Guest)** · Founder, Aero AI
- **Ian Kilpatrick (Guest)** · Founder, BrandSauce.io

Full bios are inline in `sessions/001/index.html`. The bios were rewritten in this build cycle (Alec's self-taught AI / former B2B sales arc; Ian's "software since 1985 / Golden Globes / Disney / Nokia" credentials; Justin's NASDAQ:TTWO dorm-room sale + $50M+ fractional CMO track record). See CLAUDE.md change-history for details.

**Speaker tools / terms (referenced in the deck):**
- **Echo Check** — Ian's LLM SEO scoring tool. URL: `echocheck.app` (not .com). Built for himself, commercialized ~April 2026. Used live in slide 12.
- **PEO** (Public Engine Optimization) — Ian's coined term alongside AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AIO. Featured prominently in Topic 02 headline.
- Alec's stack mentioned in Topic 01: WhisperFlow, Plaud Note, Claude Code, plus Loom as the one non-AI tool.

---

## Marketing Assets

All assets live in `sessions/001/assets/` (the OG share image lives directly in `sessions/001/`) and are deployed to production.

| Asset | Dimensions | File size | Live URL |
|---|---|---|---|
| Hero (landing-page parity) | 1880×940 | 1.26 MB | https://ai4ntp.com/sessions/001/assets/hero-1880x940.png |
| Instagram post (4:5 portrait) | 1080×1350 | 1.47 MB | https://ai4ntp.com/sessions/001/assets/hero-ig-1080x1350.png |
| Zoom event banner | 1280×400 (2× of suggested 640×200) | 364 KB | https://ai4ntp.com/sessions/001/assets/zoom-banner-1280x400.png |
| Zoom event logo | 600×600 (max allowed) | 15.5 KB | https://ai4ntp.com/sessions/001/assets/zoom-logo-600x600.png |
| OG share image (custom-built) | 1200×630 | 188 KB | https://ai4ntp.com/sessions/001/og-image.jpg |

### Asset design notes

**OG share image:** Paper texture, yellow "4" in logo, big italic-serif headline with yellow "grow" highlight, three small stacked headshots, live dot, ai4ntp.com domain. Regenerated when the headline was trimmed so link previews match the live H1.

**Instagram post (v2):** Rebalanced after first pass had a dead-space gap between subhead and headshots. Final layout uses ~96–100px rhythm between major blocks: brand → context → headline → subhead → cast → action. Headshots 312px, headline 80px (max for 2-line break at this width), subhead 38px italic, lime CTA with black border.

**Zoom banner:** Two-column layout. Brand stack (logo, meta, headline, CTA) on left; 3 speaker headshots with names on right. Headline drops to 50px with `text-wrap: balance` to land cleanly on 2 lines in the narrower left column.

**Zoom logo:** Stacked wordmark (`ai / 4 / ntp` with the "4" on a lime block). Grain texture removed to fit Zoom's 300 KB cap (the texture is invisible at 200×200 display size anyway).

---

## Brand Reference

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#0F1113` | Primary text |
| `--paper` | `#F4F1EA` | Page background |
| `--signal` | `#D4FF3A` | Lime accent (highlight, CTA, logo "4") |
| `--rust` | `#C4471C` | Live-on-Zoom dot |
| `--cream` | `#FAF7F0` | Headshot/circle backgrounds |

Fonts: **Fraunces** (headline, logo), **Instrument Serif italic** (subhead), **JetBrains Mono** (metadata, CTAs, labels).

Voice rule (per project CLAUDE.md): **no em dashes** in user-facing copy. No hype, no hedging. Direct, declarative, slightly understated.

---

## Zoom Webinar Description (copy to paste into Zoom)

```
If you run marketing at a 10-to-200 person company, this hour is for you.

You don't need to quit your job, become a prompt engineer, or burn Q3 on shiny tools. You just need to see what working marketers are doing with AI right now. So we're going to show you.

Your host, Justin Novak, sold his first company in college and has since helped scale businesses that went on to raise $50M+ as a fractional CMO. He's spent the last few years figuring out what AI changes for marketers, and he's here to share, not gatekeep.

Joining him: Alec Saluga, who quit his 9-to-5 and tripled his income in under 30 days using AI. He'll walk through the exact stack and the exact workflow.

And Ian Kilpatrick, who runs a portfolio of companies with AI as his one-person team. He'll show how he delegates across all of it by rethinking how he works with AI.

What you'll walk away with:

- Alec's exact stack and workflow (the tools, in order, with the prompts)
- Ian's portfolio playbook for doing more without hiring more
- Three moves you can run Monday morning, no technical background required
- A real answer to "what should I actually be doing with AI right now?"

The bonus, for staying to the end: every attendee gets a free one-on-one 30-minute session with the operator they pick (Alec, Ian, or me). Self-select who you want to meet. We'll workshop whatever you're stuck on, live.

This isn't a sales pitch and there's no upsell. We're marketers showing other marketers what we've figured out so far. Bring your questions, bring your stuck points. We'll do this together.

See you on the 21st.
```

### A/B tests to consider
- **Opener:** "If you run marketing at a 10-to-200 person company..." vs. job-title list ("CMOs, marketing directors, growth leads...")
- **CTA close:** "See you on the 21st" (warm) vs. "Save your seat above" (directive)
- (Bonus framing A/B retired — practice session locked in "everyone gets 30 min self-selected" mechanic.)

---

## Live Session Playbook

The host-side playbook (pre-call checklist, the "genie wish" intro script Justin reads to kick off the call, dashboard operation during the live session, post-event data-pull SQL) lives in [CLAUDE.md → Live session playbook](./CLAUDE.md). Read it before going live.

---

## Deploy

From `/Users/justinnovak/Desktop/ai4ntp/ai4ntp`:

```
vercel --prod --yes
```

Static site, instant aliasing to `ai4ntp.com`.

---

## Open Todos

- **Schema.org event description** (`sessions/001/index.html` line 32) still uses the old "Alec quit corporate sales to go all-in on AI and tripled his revenue in 90 days" framing. Update to the current "9-5 / under 30 days" framing for SEO consistency with the live page.
- **Footer social links** are `#` placeholders on both `/sessions/001` and `/register`. Wire up Twitter / LinkedIn / Email destinations.
- **Post-webinar replay block** exists as commented-out HTML at the bottom of `sessions/001/index.html`. Uncomment and add YouTube ID after the live recording.
- `assets/hero-ig-1080x1350-test.png` is a leftover test screenshot from the first IG pass (it was a screenshot of the live page at IG dimensions, not the dedicated template). Safe to delete.
