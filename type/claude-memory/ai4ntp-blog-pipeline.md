---
name: ai4ntp-blog-pipeline
description: "/blog + session-to-blog skill shipped Jul 15 2026; the moat is machine-verified transcript citations, and catchup.md timestamps are on a DIFFERENT CLOCK than transcript.md"
metadata: 
  node_type: memory
  type: project
  originSessionId: cc74d5c7-88d1-4d79-8cec-6601201d7b78
---

AI4NTP now has a programmatic blog at `ai4ntp.com/blog` ("Field notes") plus a
`.claude/skills/session-to-blog` skill that mines session transcripts into posts. Shipped
July 15, 2026. Architecture and schema are documented in `tools/blog/README.md` and
`CLAUDE.md`; do not duplicate them here.

**The load-bearing trap, which cost real debugging to find:** `sessions/<id>/catchup.md` and
`faqs.md` carry timestamps on the **trimmed replay clock**, which runs minutes ahead of
`transcript.md`, and **the offset is not constant** (006: catchup `[0:05]` = transcript
`[2:16]`; catchup `[42:25]` = transcript `[49:19]`). `catchup.md`'s "Best moments" is a
pre-curated list of exactly the evidence a writer wants, so it is the most tempting shortcut
in the repo, and using it produces citations that are 100% wrong while looking immaculate.
`transcript.md` is the only valid timestamp source. `tools/blog/verify-citations.mjs` gates
the build on this and names the real timestamp when it catches one.

**Why:** the whole reason these posts can outrank higher-authority sites is that every claim
traces to a recording we own (LLMs cite sources of facts, not commentary about public facts).
It is also the scaled-content-abuse compliance story. Wrong citations do not just weaken the
posts, they invert the only advantage they have.

**How to apply:** trust nothing in `catchup.md`/`faqs.md`/`tools.md` except ideas and
language. `tools.md` also goes stale on directory status (006's says Instantly and Miro have
no pages; both do). Verify against `transcript.md` and `tools.json`, which are the
authorities.

Calibration on how easy fabrication is here: the first pass on two already-written drafts
produced an unsourced number, a paraphrase presented as a verbatim pull quote, a
misattributed speaker, and **12 unmarked splices in 24 citations**. The skill's own example
file cited a timestamp that did not exist. Assume the same rate on every first pass; that is
why the check is a script and not a checklist item.

Related: [[ai4ntp-seo-indexing]], [[ai4ntp-deploy-and-preview]], [[ai4ntp-talk-tracks]]
