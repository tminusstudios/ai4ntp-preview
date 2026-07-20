---
name: ai4ntp-talk-tracks
description: "Convention — every AI4NTP presentation gets a talk-track.md; a voice corpus for writing/training on Justin's spoken tone"
metadata: 
  node_type: memory
  type: project
  originSessionId: 24debf51-cf63-42eb-a11b-0d4389cb130d
---

Every AI4NTP session/presentation gets a talk track saved at `sessions/<id>/talk-track.md` (co-located with the session). Together they form a corpus Justin wants to use to train the model on his spoken voice and tone. Started July 12, 2026 with Session 006.

**System files (in `sessions/_template/`):**
- `voice-and-tone.md` — Justin's spoken-voice guide (principles, hard rules, his reusable moves) + the corpus index. Load this + the two most recent talk tracks before drafting any new talk track or spoken copy.
- `talk-track-TEMPLATE.md` — blank skeleton for each new session.

**Justin's per-agent structure:** Headline → Problem → (Credibility) → Solution walked step by step → Big idea that zooms out. Hard rule: no em dashes (sitewide). Direct, specific, outcomes over adjectives, one memorable analogy per big idea.

**Living source of truth** for 006 is a Google Doc (link inside `sessions/006/talk-track.md`); the repo copy is the training snapshot. Offer to pull latest from the Doc if he keeps editing there.

**Privacy:** talk tracks are internal. Excluded from deploy via `.vercelignore` (`sessions/**/talk-track.md`, `/sessions/_template`). Note the broader pre-existing leak: ALL session `.md` files are currently served publicly (e.g. `sessions/001/run-of-show.md`, `CLAUDE.md` return 200); sealing that fully would need a `sessions/**/*.md` ignore rule + a redeploy. Related: [[ai4ntp-deploy-and-preview]], [[ai4ntp-session-006-landing]].
