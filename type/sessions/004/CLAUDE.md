# Episode 004

> **AIRED — June 18, 2026, 6 PM EST.** "7 AI tools you've never heard of, that you need to be using." Hosts **Alec Saluga** + **Justin Novak**, with guest **James Biernesser** (Founder, Dartee Golf, darteegolf.com) brought on stage for a live agentic-CRM demo. Small, invite-only room (~17 live attendees, near-total retention).
>
> **Post-webinar transform run June 19, 2026** per `sessions/_template/post-webinar-playbook.md`. `index.html` is now the **published recap page**. Working files below.

## Tools demoed (session order)

1. **Codex** (Alec) — pulled a prospect list via the SpyFu API in ~10 min.
2. **Hermes** (Justin) — desktop AI agent (Nous Research, https://hermes-agent.nousresearch.com): persistent memory, model-switching, cron jobs, skills. The centerpiece. Directory page: `/ai-tools/hermes`.
3. **Apify** (Alec) — library of web scrapers.
4. **n8n** (Alec) — visual workflow builder; live-creator-stats client build.
5. **Midjourney** (Justin) — creative ideation + the MRI-replacement news tangent.
6. **Wispr Flow** (Justin, introduced to him by Alec) — dictation.
7. **PLAUD Note** (Alec) — hardware recorder, Zapier → Drive → Claude.
8. **Claude Design** (Justin) — Slow Hand Remodeling + the AI4NTP site.
9. **Higgsfield** (Alec, honorable mention) — image/video model aggregator.
10. **GoHighLevel** (Justin + James) — agentic CRM finale.

Also referenced: SpyFu, Zapier, Make.com, ChatGPT, Claude Code, Figma, Canva, Behance, Lovable, OpenClaw, Super Whisper, Kimi, plus models (Fable 5, Opus, Sonnet, Haiku, GPT 5.5, NanoBanana, Seed Dance).

## Post-event files

```
sessions/004/
├── index.html              PUBLISHED RECAP (replay, catchup, tools, deck, get-in-touch, faqs, transcript, next)
├── session-004-dark.css    s4-* styles + recap additions (replay embed, tools, contact, deck, transcript)
├── transcript.md           Cleaned, speaker-labeled
├── faqs.md                 8 Q&As from chat + live Q&A
├── tools.md                Every tool, internal-linked to /ai-tools/<slug> where a page exists
├── catchup.md              3-paragraph 5-min catch-up + 8 best-moments timestamps
├── youtube.md              Upload metadata DRAFT (video ID pending from Justin)
├── post-event-emails.md    Single unified Beehiiv send draft (bonus offer + soft contact)
├── og-image.jpg            Regenerated with status=REPLAY (og.json status flipped)
├── slides/index.html       Deck: Alec's 5 tool slides woven into Justin's deck (18 slides total)
└── raw/                    chat.txt + (transcript original). GITIGNORED (in .vercelignore).
```

PII attendee CSV lives at **`revops/attendees/session-004-leads.csv`** (gitignored), not in `raw/`.

## Decisions baked in (per Justin, June 19)

- **No `#pulse` section** — no live pulse ran this session.
- **`#book` is soft "Get in touch" cards**, NOT a hard 30-min pitch. Justin/Alec/James cards link LinkedIn + /calendar + email (James = darteegolf.com only). Keeps the `data-book-cta` analytics attribute so `book_30_min_click` still fires.
- **Deck:** Alec's tools (Codex, Apify, n8n, PLAUD, Higgsfield) added to Justin's deck in spoken order.

## Open todos (post-event)

- [x] Phase 1 archive · Phase 2 content · email draft · recap page · OG REPLAY · analytics wiring · deck slides · index cards flipped (homepage + sessions/index)
- [x] **Replay embedded** (June 19, 2026). YouTube video ID `I1D_RD-kMhg` wired into `#replay` (iframe + "Watch on YouTube" `youtu.be` link), og:video + twitter:player meta, VideoObject schema, and the directory EP map.
- [ ] **Deploy** `vercel --prod --yes`, then incognito link-check + GA4 realtime + mobile Safari check.
- [ ] **Send the post-event email** (Beehiiv broadcast preferred; confirm the bonus offer first, it commits operator time).
- [ ] **List + CRM sync:** every registrant → Beehiiv (Source "Live Session 004") + HighLevel (`session-004-registrant` tag). Source: `revops/attendees/session-004-leads.csv`.
- [ ] **LinkedIn outreach** to registrants (manual, ICP-first). Log in the revops tracker.
- [ ] YouTube upload (Justin) → flip Public 24-48h after the email.

## Known site-level flags (not 004-specific, need a product call)

- **`nav.js` countdown still targets Episode 003** (June 10, now past), so the sticky bar reads "Episode 003 has wrapped" above the 004 recap. Needs the next event date or a neutral fallback.
- **Homepage + `/register` signup forms are now CAPTURE-ONLY** (June 19, 2026: Zoom redirect removed since 004 aired; leads still sync to Beehiiv). Re-add the Zoom hand-off when the next session is dated. No Episode 005 is dated yet.
- **Alec LinkedIn discrepancy (resolved):** old page schema used `linkedin.com/in/alecsaluga`; Alec dropped `linkedin.com/in/alec-saluga-4295521a6` in the live chat. The 004 recap uses the chat (canonical) URL. Other pages may still use the old one.
