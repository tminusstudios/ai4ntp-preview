# Session 001 · Run of Show

**Date:** May 21, 2026 · 1:00 PM EST
**Format:** Live on Zoom, recorded
**Target run time:** 45 min content + 5 min Q&A buffer
**Host:** Justin · **Guests:** Alec, Ian

Keep this open in a tab during the call. Everything you need is here.

---

## Pre-call checklist (T-30 min)

- [ ] Clear smoke-test data in pulse dashboard:
      ```sql
      delete from public.ai4ntp_pulse_001 where name = 'Smoke Test';
      ```
      (Or `truncate public.ai4ntp_pulse_001;` for a fully empty board.)
- [ ] Open in tabs, ready to share:
  - Slides: **https://ai4ntp.com/sessions/001/slides** (in presenter mode — press `S` to open speaker view)
  - Pulse dashboard: **https://ai4ntp.com/sessions/001/assess/live**
  - Pulse form (for Zoom chat paste): **https://ai4ntp.com/sessions/001/assess**
  - Register page (backup): **https://ai4ntp.com/register**
- [ ] PDF backup of slides downloaded locally (append `?print-pdf` to slides URL, Cmd+P → Save as PDF)
- [ ] Calendar links ready to paste in chat for the bonus offer:
  - Justin: _[your link]_
  - Alec: _[Alec's link]_
  - Ian: _[Ian's link]_
- [ ] QR codes on slide 17 are filled (not dashed placeholders)
- [ ] Wi-Fi: speed-test and ethernet backup
- [ ] Quiet room, water nearby
- [ ] Alec and Ian briefed: stay silent until introduced; speak ~2-3 min at a time

---

## Timing (45 min target)

| Time | Slide | What's happening | Who |
|---|---|---|---|
| 0:00 | 1 | Welcome, name people in chat by location | Justin |
| 2:00 | 2 | Genie wish — drop assess link in chat, watch dashboard | Justin |
| 5:00 | 3 | Meet the panel — Justin intros all three | Justin |
| 8:00 | 4 | Topic 01 title — hand to Alec | Justin → Alec |
| 8:30 | 5–8 | Alec's segment: 4 pillars + case study + result | Alec |
| 20:00 | 9 | Topic 02 title — hand to Ian | Justin → Ian |
| 20:30 | 10–13 | Ian's segment: news beat, Echo Check, playbook, school | Ian |
| 32:00 | 14 | Fireside — bring both back, jobs question | Justin + Alec + Ian |
| 36:00 | 15 | Two-up answers (Sandy + tractor) | Alec + Ian |
| 38:00 | 16 | Rapid Three | Justin + Alec + Ian |
| 42:00 | 17 | Bonus offer + connection cards | Justin |
| 44:00 | 18 | Sign-off · "translators not oracles" | Justin |
| 45:00 | — | Open Q&A (chat-driven, soft close) | All |

Aim to land slide 18 at the 44-minute mark. If running long, cut Rapid Three Q3 or trim Topic C-style detours from Alec/Ian (gently).

---

## Verbatim transition lines (use these — don't improvise under pressure)

**Slide 2 (genie):** "Close your eyes. Imagine you have one genie. One wish. Maybe specific — rank #1 in LLM answers, get a promotion, sell your business. Or general — just learn something new, more PTO. Whatever it is, drop it in here. Your name won't be on the screen."

**Slide 3 (panel intro — Justin's self-intro):** "I sold my first company from my college dorm room to the founder of Take-Two Interactive. As a fractional CMO I helped scale businesses that went on to raise $50M+. Now I host these sessions with operators who are actually shipping with AI. I'm not the smartest person in this room — Alec and Ian are. I'm the one asking the questions you'd ask."

**Slide 4 (hand to Alec):** "Alec, before you start — what's the one thing you hope this room walks away with by the end?" [Alec answers]. "Stage is yours."

**Slide 9 (hand to Ian):** "Alec, that's a hell of a 12 minutes. Ian — same question. What's the one thing you want this room to walk away with?" [Ian answers]. "Take it."

**Slide 14 (fireside opener):** "Alright, both of you back on stage. We've gone deep. Now zoom out. First question — the one everyone's afraid to ask out loud: Is AI gonna take everyone's job?"

**Slide 16 (Rapid Three):** "Three questions, thirty seconds each, each operator. Go."

**Slide 16 bonus question:** "Alec — favorite movie?" [Alec: Dark Knight]. "Great movie. Seen it ten times."

**Slide 17 (bonus offer):** "Everyone who's still here gets 30 minutes one-on-one with one of us. Self-select. If someone resonated more, book with them. We're not gatekeeping. Pick your person."

**Slide 18 (close):** "We're the translators, not the oracles. Thank you for showing up. Book your 30 with one of us. See you in Session 002."

---

## Speaker hand-off rhythm

Per Justin's plan from the practice session:
- Justin holds the room for the first 8 minutes (intro + genie + panel intro)
- Each operator gets ~12 minutes uninterrupted (Justin chimes in briefly to keep momentum, but it's their stage)
- Fireside is back-and-forth; Justin moderates
- Justin closes

**Justin chime-in cues** (don't disappear during Alec/Ian segments):
- After a stat: "Wait, say that again — [number]?"
- After a tool name: "And what does [tool] do for someone who's never used it?"
- After a concept: "Double-click on that. What's a concrete example?"

---

## Bonus mechanic — exact play

After slide 17 displays:
1. Verbally: "Drop your top operator in the chat. Just write 'Alec', 'Ian', or 'Justin'."
2. Paste all three calendar links in Zoom chat (have them pre-loaded in a notepad):
   - Justin: _[link]_
   - Alec: _[link]_
   - Ian: _[link]_
3. "If you want all three of us, fine — book all three. No limit."
4. The drawing logic doesn't matter — anyone who books gets it. Self-service.

---

## Tough-question playbook (Justin plays devil's advocate)

You teed these up in the practice. Use them if energy needs a jolt:

- **For Ian, after slide 12 or 13:** "Ian, isn't this just AI slop? Three blog posts a day, automated — isn't that what's killing the web?"
  - Ian's defense: Google itself just announced they'll prefer AI answers (slide 10 callout). Plus the guardrail is human value — if it doesn't help a reader, it doesn't ship.

- **For Alec, mid-segment:** "Alec, what about the people whose jobs this actually does take?"
  - Alec's frame: "The Sandys. Anyone using AI heavily is the safest in their org, not the most at-risk." Sets up the fireside slide.

---

## If something breaks

| Problem | Move |
|---|---|
| Wi-Fi dies | Switch to phone hotspot. Slides are PDF-exported locally. |
| Screenshare won't work | Slides have placeholders that read fine from the PDF. Talk through. |
| Pulse dashboard won't load | Skip the dashboard reveal on slide 2. Just read 2-3 wishes verbally from the assess form responses (open it in another tab). |
| Echo Check screenshots missing | Ian talks to the slide title and uses Pulse Check / wife's school case study as the proof. |
| Zoom chat is dead | Read genie wishes aloud yourself. Skip the bonus self-select voting and just say "all three of us are open — book any of us." |
| Someone asks something nobody knows | "Great question. We're going to follow up after the session." Drop the assess link in chat for them to write it down. |

---

## Post-call (T+30 min)

- [ ] Stop Zoom recording, confirm it's uploading to cloud
- [ ] Export attendee list from Zoom for follow-up
- [ ] Pull pulse responses for follow-up:
      ```sql
      select created_at, name, email, goal, tool, vision
      from public.ai4ntp_pulse_001
      order by created_at desc;
      ```
- [ ] Email all attendees within 24h with: replay link, calendar links for all three operators, Session 002 tease
- [ ] Uncomment the replay block in `sessions/001/index.html` (bottom of file) and add YouTube ID when recording is up
- [ ] Update OG image / meta description if anything notable came out of the session worth indexing

---

## Reminders

- **Voice:** No em dashes on stage either if you can help it. (Per CLAUDE.md — you've been training the brand voice; keep it consistent on the mic.)
- **Energy:** First 30 seconds set the room. Don't undersell. Don't oversell.
- **Pace:** 2–3 min per voice rotation, max. Even when the operators are crushing it.
- **The bonus is the show-rate driver.** Mention it on slide 1 ("there's a real reason to stay to the end") and again at slide 17. Don't bury it.
- **You're the translator, not the oracle.** Hold space. Ask the dumb question. Win the room.

Good luck. Go ship it.
