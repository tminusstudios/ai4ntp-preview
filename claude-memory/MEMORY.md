# Memory index

- [Partner titles](ai4ntp-partner-titles.md) — Justin/Ian/Alec all "Partner at AI4NTP" sitewide; Alec's Aero AI scrubbed everywhere

- [Pending design-system refactor](pending-design-system-refactor.md) — queued visual-only refactor, blocked on 3 decisions; details in content/handoff-2026-06-09.md
- [Blog + session-to-blog skill](ai4ntp-blog-pipeline.md) — /blog shipped Jul 15 2026; citations are machine-verified against transcript.md, and catchup.md timestamps are on the replay clock (wrong, non-constant offset)
- [SEO / GSC indexing](ai4ntp-seo-indexing.md) — /ai-tools "Discovered not indexed" = crawl budget not a bug; internal-linking + sitemap fixes shipped Jul 13; Justin still owes GSC "Request Indexing" on top pages; AI-readiness scanner gives false negatives
- [AI4NTP deploy & preview](ai4ntp-deploy-and-preview.md) — `vercel --prod --yes`; screenshot-verify with headless Chrome before shipping; no em dashes
- [AI4NTP dark theme system](ai4ntp-dark-theme-system.md) — opt-in dark via `/theme/base.css` + `/theme/dark.css` + `body class="v6 dark"`; default light; `.vercelignore` /design deploy gotcha
- [AI4NTP Zoom funnel leak](ai4ntp-zoom-funnel-leak.md) — registrations drop at Zoom's second form + weak Zoom-page copy; the winning Zoom-copy stack + kill-the-double-form fixes
- [Recap #book = soft contact cards](recap-book-section-soft-contact.md) — recap booking section is "Get in touch with <name>" (LinkedIn + /calendar + email), not a hard 30-min pitch
- [AI4NTP partner deck](ai4ntp-partner-deck.md) — Ian & Alec partner brief: audience-first thesis, dynamic AI-scored equity w/ seed+freeze, agents-as-a-service = Revenue Test 01, Echo Check backend thesis
- [AI4NTP internal hosting](ai4ntp-internal-hosting.md) — deck + revenue model live password-gated at ai4ntp.com/internal (Basic Auth via api/internal.js); pw ntp-goldrush-26
- [/agents sales page](anvil-agents-landing.md) — Agents-as-a-Service Grand Slam page at ai4ntp.com/agents; REBRANDED off "Anvil" to pure AI4NTP "Your AI Department" (Jul 8 2026); "Apply" form → Supabase → /calendar; $5k/mo founding; OG card regenerated to AI4NTP brand
- [Session 006 landing](ai4ntp-session-006-landing.md) — "7 AI agents / trifecta" pre-event page at /sessions/006 (July 12, 2PM ET); built, capture-only, 7 agents are placeholders, funnel not yet wired
- [/build lead magnet](ai4ntp-build-lead-magnet.md) — evergreen free 30-min live build session at ai4ntp.com/build (for prizes + referral flywheel); form→Supabase→redirect /calendar; ?src/?ref tracking; needs 30-min calendar switch
- [Talk tracks convention](ai4ntp-talk-tracks.md) — every session gets `sessions/<id>/talk-track.md` (voice corpus for Justin's tone); guide+template in `sessions/_template/`; internal, .vercelignore'd
