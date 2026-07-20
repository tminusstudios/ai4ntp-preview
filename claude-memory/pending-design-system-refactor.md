---
name: pending-design-system-refactor
description: A visual-only design-system refactor is queued but blocked on 3 decisions; full handoff in content/
metadata: 
  node_type: memory
  type: project
  originSessionId: bafb1b4c-7a0d-41a6-962d-c08f85739905
---

A site-wide **visual-only** design-system refactor (replace per-page inline CSS with
`/system/tokens.css` + `/system/base.css`) is queued from a "Claude Design" handoff prompt but
**not started**. It's blocked on repo realities the prompt didn't know:

- **No git repo / no GitHub** → "one PR per phase" is impossible; pick a versioning mechanism.
- **26 of 42 deployable pages are generated** (`/ai-tools/**` via `tools/directory/generate.mjs`) —
  must edit the generator's CSS constant, never the HTML (hand-edits get wiped on sync).
- ~~Homepage has its own inline header~~ — RESOLVED June 9, 2026: homepage now uses the shared
  `nav.js` (single global header everywhere; `nav.js` = Contact + Save your seat only).
- **Hanken Grotesk** body font would be a real sitewide change (a 4th webfont, not in the current
  brand stack) — confirm against `AI4NTP-Brand-Guidelines.docx`.

Three decisions to unblock (my recs): **git init + branch per phase**; **do ai-tools via the
generator**; **keep system-sans this round** (don't ride a font swap inside a structural refactor).

Full writeup + today's shipped changes + open copy options: `content/handoff-2026-06-09.md`
(gitignored). See [[ai4ntp-deploy-and-preview]].
