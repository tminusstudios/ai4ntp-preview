---
name: ai4ntp-build-lead-magnet
description: "/build evergreen lead-magnet page — free 30-min live build session, capture form redirects to /calendar"
metadata: 
  node_type: memory
  type: project
  originSessionId: 84e7afab-e45b-4c94-86e5-8e882bcac971
---

Evergreen "interactive lead magnet" at **ai4ntp.com/build** (`build/index.html` + `build/build.css`): a free ~30-minute **live build session** where one of the builders behind AI4NTP builds the visitor's thing with them live (agent / workflow / unstick / learn-to-start). Built July 5, 2026.

Intent (why it's evergreen + generic): reused as a **prize/giveaway reward** and a **referral flywheel** unlock ("invite 3 who attend, get a session"). So copy is context-agnostic and host presence is kept **ambiguous** (one of us, sometimes two, sometimes all three — never promises all three).

Build facts:
- **Standalone dark chrome** (own slim `.bld-header`, NO nav.js/countdown), global `/footer.js`. House v6 system: `/theme/base.css` + `/theme/dark.css` + `body class="v6 dark"`, `.bld-*` prefix, mirrors sessions/006 look (// eyebrows, Fraunces-300 + italic-lime em, hairline ink-soft panels).
- **Form** captures name(opt) + email(req) + 1 of 4 radio buckets (`have-idea` / `improving` / `getting-started` / `other`) + free-text goal → POST Supabase `ai4ntp_signups` (anon key, 201/409=success) → auto-flows to Beehiiv via existing trigger. Payload: `interests:["build-session:<bucket>"]`, `goal`, `source`.
- **Source tracking for the flywheel:** reads `?src=` / `?ref=` and appends to `source` (e.g. `build-page:prize`, `build-page:alex_referral`); default `build-page`.
- On 201/409: branded success → `setTimeout(window.location.href='/calendar', 1400)`. GA4 `build_session_request` {source,bucket}.
- Reassurance is explicit and load-bearing: **private, one-on-one, never filmed/recorded/posted online.**

Pending follow-up (Justin, outside code): switch the **[[recap-book-section-soft-contact]]** /calendar Google scheduler from 15-min to **30-min** slots so booking length matches. OG currently reuses the brand card (`/og-image.jpg`); a co-located `/build/og.json`+`og-image.jpg` is a nice-to-have. Not yet deployed at time of build. Deploy: `vercel --prod --yes` per [[ai4ntp-deploy-and-preview]].
