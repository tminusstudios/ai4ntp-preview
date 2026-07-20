# Episode 003 — raw exports (not published)

Source of truth for the post-event recap build. We publish FROM here, never publish this folder.

## Drop your Zoom exports here

- `transcript.vtt` (or `.txt`) — Zoom auto-transcript
- `qa-report.csv` — Zoom Webinar Q&A report
- `chat-log.txt` (or `.csv`) — Zoom chat log
- `registrants.csv` — Zoom registration + attendee report (for email, Beehiiv, CRM, LinkedIn)

## Already pulled (by Claude, from Supabase)

- `poll-submissions.json` — all 26 kickoff-poll answers + each AI reply
- `poll-synthesis.json` — the 6 synthesized themes + counts

## Episode 003 post-event decisions (confirmed by Justin, June 11, 2026)

1. **No video.** The recording stays PRIVATE. It exposed sensitive detail (API keys revealed on screen). The `#replay` slot is replaced by a **step-by-step OpenClaw setup walkthrough** (Justin is providing the instructions).
2. **No slides** were used in this session.
3. **Booking cards: Ian Kilpatrick and Justin Novak only** (Alec was out for the live).
4. **Pulse section title: "What the room wanted its AI agent to do."** Show the synthesized themes AND **all 26 individual answers** (Justin wants every answer shown, it's a strong artifact).
5. **OG image: flip to `REPLAY`** status and regenerate via `tools/og/render.mjs`.
