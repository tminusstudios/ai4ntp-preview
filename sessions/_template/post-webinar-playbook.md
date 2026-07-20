# Post-Webinar Playbook

The system AI4NTP runs after every live session. Goal: a no-show catches up in under 5 minutes, an attendee finds every resource in one place, and the episode keeps earning attention for months via search.

The deliverable is **one canonical URL per episode**: `/sessions/<id>`. Pre-event it sells the live. Post-event the same URL becomes the durable hub. We do not create separate "recap" URLs. Link equity stays consolidated and the URL pattern is dead simple to remember.

Run this checklist top-to-bottom after every session. Skip nothing. The whole thing should be live within 48 hours of the event ending.

---

## Phase 1 — Gather (T+0 to T+2 hours after the call)

While the call is still warm in your head, collect everything you need. Most of this happens inside Zoom's post-meeting flow.

- [ ] **Stop the recording.** Confirm Zoom Cloud upload completed (Zoom emails you).
- [ ] **Download the recording MP4** from Zoom Cloud Recordings.
- [ ] **Download the Zoom auto-transcript** (VTT or TXT). This is the seed for the on-page transcript.
- [ ] **Export the Zoom Q&A** (Reports → Webinar → Q&A Report). CSV.
- [ ] **Export the Zoom chat log** (Reports → Webinar → Chat Report, or download from the cloud recording page).
- [ ] **Export the Zoom attendee + registration report** for the email send list.
- [ ] **Export pulse responses** from Supabase:
      ```sql
      select created_at, name, email, goal, tool, vision
      from public.ai4ntp_pulse_<id>
      order by created_at desc;
      ```
      Save as CSV for the email follow-up and as input for the on-page pulse viz.
- [ ] **Save the final slide deck state.** The deck is already at `/sessions/<id>/slides`; capture a screenshot of each slide for use in social/email cuts.
- [ ] **Confirm all three booking links are live and unbroken.** Click each one. Paste them into a notepad ready for the recap.

Drop everything into `sessions/<id>/raw/` for archival. We don't publish from this folder; it's the source of truth for everything else.

---

## Phase 2 — Process (T+2 to T+24 hours)

Turn raw artifacts into publishable content. Most of this work happens in Claude with the transcript + chat + Q&A in context.

### Transcript cleanup

- [ ] Open the Zoom VTT/TXT in Claude. Ask for: speaker labels normalized, obvious transcription errors fixed (tool names, proper nouns), no editorial rewriting.
- [ ] Save the cleaned transcript to `sessions/<id>/transcript.md`. This file goes inline into the recap page via collapsible section.

### FAQ extraction

- [ ] Feed Q&A export + chat log + cleaned transcript into Claude. Ask for: 5 to 10 questions that came up live (with attribution to "from a live attendee"), each with a 2 to 3 sentence answer in the AI4NTP voice.
- [ ] Save to `sessions/<id>/faqs.md` and inline into the page.

### Tools + resources

- [ ] List every tool, link, company, or technical term mentioned on the call. Cross-check transcript against chat log (people drop URLs in chat).
- [ ] For each: one-sentence "what it is" written in our voice, the link, and who mentioned it.
- [ ] Save to `sessions/<id>/tools.md` and inline into the page.
- [ ] **Internal-link every tool mention.** When a tool that has a directory page is named on the recap page, link it to `/ai-tools/<slug>`, NOT to the tool's external site. This passes link equity to our directory pages, builds topical authority, and keeps readers on-site (the tool page links out and has the CTAs). The tool page's slug is in `tools/directory/tools.json`. Exceptions that stay external: operator bio/attribution links (e.g. an operator's own company), built-artifact links (a live site we shipped), YouTube replays, LinkedIn, and the functional install/docs links inside a how-to walkthrough (the reader needs the real site there). Watch domain collisions: ChatGPT vs Codex both live on `chatgpt.com`, and the Claude model (`claude.ai`) vs Claude Code (`anthropic.com/claude-code`) are different slugs, so map by the tool actually named, not just the domain.
- [ ] **RULE: every tool named in the session gets a directory page (this is required, not optional).** For each tool from the session:
    - **Already in the directory?** Add a session episode entry to its `episodes` array in `tools/directory/tools.json`: `{ "id": "<id>", "operator": "<who demoed it>", "used_for": "<what they did with it>" }`. This credits the new session on the tool's page and links it back to the recap.
    - **Not in the directory yet?** Create a full record (see `tools/directory/README.md` "Adding a tool"): `slug, name, category` (must match an existing category so alternatives resolve), `tagline`, `website`, objective `what_is` (the tool's own meta description, or run `fetch-descriptions.mjs`), first-party `ai4ntp_take` (how/why WE used it, required, the moat), `episodes`, `pricing` (verify or attribute to the live), curated `alternatives` (genuine substitutes only), `g2: null` (never fabricate), `who_for`, `updated`.
    - **Register the session** in the `EP` map at the top of `tools/directory/generate.mjs` (`'<id>': { num, title, recap: '/sessions/<id>', replay: <youtube-url-or-null> }`) or the generator drops the new episode as "unknown". Set `replay` to the YouTube URL once uploaded.
    - Then regenerate + deploy: `node tools/directory/generate.mjs` (rewrites `/ai-tools/**`, `sitemap.xml`, `robots.txt`, `llms.txt`), then `vercel --prod --yes`. Verify the new pages return 200 and appear in the hub + sitemap + llms.txt.
    - **Sheet sync caveat:** if you also maintain the Google Sheet (Tools + Episodes tabs), mirror these additions there, or the next `node tools/directory/sync.mjs` rebuilds `tools.json` from the Sheet and wipes direct JSON edits. After direct JSON edits, run `node tools/directory/export-seed-csv.mjs` to keep the committed seed CSVs consistent.

### 5-minute catch-up

- [ ] Write three short editorial paragraphs (one per topic), 2 to 3 sentences each. Goal: someone who missed the live knows what was discussed and why it matters.
- [ ] Add a "Best moments" sub-list of 3 to 5 timestamped highlights (these become YouTube chapter anchors too).
- [ ] Save to `sessions/<id>/catchup.md` and inline into the page.

### Pulse data viz

- [ ] The recap page queries `public.ai4ntp_pulse_<id>` directly via Supabase REST and renders aggregated word clouds + counts client-side. No manual export needed if the table stays accessible.
- [ ] Confirm RLS allows anon SELECT (it does by default per our table setup).
- [ ] If you want a fixed snapshot instead of live data: export to JSON and embed.

---

## Phase 3 — Publish (T+24 to T+48 hours)

Get it live, get it on YouTube, send the emails.

### Transform `/sessions/<id>` page

The page lives at `sessions/<id>/index.html`. Apply these edits, in order:

- [ ] **Hero**: flip primary CTA to `Watch the replay →` (anchors to `#replay`) and secondary to `Book your 30-min` (anchors to `#book`).
- [ ] **Hero subtitle**: rewrite to past tense.
- [ ] **Hero meta**: change `Live on Zoom` pill to `Recorded May <date>` (or similar past-tense marker).
- [ ] **Schema.org** (`<script type="application/ld+json">`): update `eventStatus` to `EventCompleted`, update `description` to match the live page.
- [ ] **Topics + Speakers sections** stay. They still describe the episode accurately.
- [ ] **Speaker cards** gain a "Book 30 min →" button alongside the LinkedIn link.
- [ ] **Logistics section** demoted to a small `About this session` footer block.
- [ ] **Net-new sections inserted** in this order, between Speakers and Logistics:
    1. `#replay` — YouTube embed.
    2. `#catchup` — 5-minute catch-up.
    3. `#book` — Three booking cards (compact, action-focused).
    4. `#tools` — Tools + resources mentioned.
    5. `#pulse` — Audience pulse visualization (Supabase-fed).
    6. `#deck` — Slide deck iframe.
    7. `#faqs` — Collapsible FAQ accordion.
    8. `#transcript` — Collapsible transcript.
    9. `#next` — Next session CTA.

### Generate the OG image

Every session page needs a custom OpenGraph image for LinkedIn, Twitter, iMessage previews. We standardized the layout in Episode 001 and refined the renderer in Episode 002. The canonical generator lives at [`sessions/_template/generate-og-image.py`](./generate-og-image.py).

- [ ] Copy `sessions/_template/generate-og-image.py` to `sessions/<id>/generate-og-image.py`.
- [ ] Edit the `SESSION_CONFIG` block at the top:
    - `session_id` (e.g. `"003"`)
    - `status` (`"LIVE"` before the event, `"REPLAY"` after)
    - `date` (all-caps, e.g. `"JULY 15, 2026"`)
    - `time` (e.g. `"1:00 PM EST"`)
    - Headline: split as `headline_line1` + `headline_pre` + `headline_highlight` + `headline_post`. The highlight is the one italic-yellow word in the headline.
    - `operators`: list of (filename, display_name) tuples in segment order. Each headshot must exist at `sessions/<id>/images/<filename>.jpg`.
    - `tagline`: short ALL-CAPS phrase below the operator names.
- [ ] Run: `cd sessions/<id> && python3 generate-og-image.py`
- [ ] Output is `og-image.jpg` (2400x1260, retina-quality, around 200-300 KB).
- [ ] Verify the meta tags in `sessions/<id>/index.html` point to `https://ai4ntp.com/sessions/<id>/og-image.jpg` (og:image, twitter:image, schema.org image).
- [ ] After the event, regenerate with `status="REPLAY"` so the social previews stop saying LIVE.

### Instrument analytics on the new page

Each new session page needs the same tracking the existing recap page has. Without it, you can't see who's clicking booking links, opening FAQs, watching the replay, or completing the pulse form. Copy the patterns from `/sessions/001/index.html`.

**Page-level tags (head, every new page):**
- [ ] GA4 gtag.js snippet (id `G-4YY783506Y`). Copy from `/sessions/001/index.html` immediately after the opening `<head>` tag.
- [ ] Vercel Web Analytics: `<script defer src="/_vercel/insights/script.js"></script>` right after the GA snippet.

**Custom events block (bottom of body, recap pages only):**
- [ ] Copy the `<!-- ANALYTICS EVENTS -->` `<script>` block from `/sessions/001/index.html` (just before `</body>`). It auto-binds to:
    - `[data-book-cta]` attributes on booking buttons → fires `book_30_min_click` with `operator`.
    - YouTube external links → fires `youtube_external_click`.
    - `a.deck-cta` → fires `deck_open_click`.
    - `details.faq-item` → fires `faq_open` with the question text.
    - `details.transcript-toggle` → fires `transcript_open`.
    - `.tool-name a` → fires `tool_click` with `tool_name`.
- [ ] When you build the booking cards for the new session's operators, give each booking link a `data-book-cta="<operator-slug>"` attribute. The event will capture which operator was clicked.

**UTM-tag every outbound link for this session:**
- [ ] Email body links (Eventbrite follow-up, Gmail/Apps Script send, Mailchimp blasts): append `?utm_source=<channel>&utm_medium=<medium>&utm_campaign=session-<id>-followup`.
- [ ] LinkedIn / X / social posts pointing to the recap page: same UTM convention with `utm_source=linkedin`, `twitter`, etc.
- [ ] Pinned YouTube comment links: tag with `utm_source=youtube&utm_medium=pinned-comment`.
- [ ] Channel-medium-campaign vocabulary should stay consistent across sessions so historical comparisons work in GA4.

**Verify before declaring the page done:**
- [ ] Open the new session page in an incognito window.
- [ ] In GA4 → Reports → Realtime, confirm you appear within ~30 seconds.
- [ ] Click each booking button (or its test variant) and confirm `book_30_min_click` events appear with the correct `operator`.
- [ ] Open one FAQ and confirm `faq_open` fires with the question text.
- [ ] Confirm the new page appears under Pages in the Vercel Analytics dashboard within ~5 minutes of the first real visit.

**For Session 002 specifically (when planning):**
- [ ] Flag UTM tagging on the planning brief so it's not forgotten.
- [ ] Flag analytics custom-event wiring on the build brief so the page launches with full instrumentation.
- [ ] If new event types are needed (e.g. video chapter jumps, downloadable resources), mark them as conversion events in GA4 once they start firing.

---

### YouTube upload

- [ ] **Title**: lead with high-intent search query, then value, then proof. See `sessions/<id>/youtube.md` for per-episode draft.
- [ ] **Description**: 200-word SEO-optimized opener (target terms in body, not stuffed), then chapter timestamps, then resource link block, then speaker socials, then hashtags. Full template lives in `sessions/<id>/youtube.md`.
- [ ] **Chapters**: build from run-of-show, refined against actual recording. Minimum 6 chapters, 30+ seconds each (YouTube auto-chapter requirement).
- [ ] **Thumbnail**: reuse the OG-image style (paper texture, yellow highlighted word, three headshots, live dot). 1280x720.
- [ ] **Tags**: 8 to 15. Mix of broad (AI marketing, marketing 2026) and specific (PEO, AEO, GEO, Claude Code, LLM SEO).
- [ ] **Category**: Education or Science & Technology.
- [ ] **Visibility**: Unlisted first. Send the unlisted URL inside the page + email. Flip to Public 24 to 48 hours later once everyone's seen it.
- [ ] **End screen**: link to `/register` and a session N+1 placeholder.
- [ ] **Pinned comment**: top-3 tools mentioned + booking links. Drives comment engagement.

### Deploy

- [ ] `cd /Users/justinnovak/Desktop/ai4ntp/ai4ntp && vercel --prod --yes`
- [ ] Click every link on the live page. Especially the three booking links.
- [ ] Open in mobile Safari. Verify the YouTube embed and transcript collapsible work.

### Send emails

Email copy lives in `sessions/<id>/post-event-emails.md`. Default is a single unified email to the whole registration list (no segmentation), with the bonus offer framed as a personal extension to "you" so live attendees and no-shows both see it as theirs.

**Sending mechanism:** the Apps Script mailer at `/mailer/code.gs`. Compose the email as a Gmail draft, drop the recipient list into a Google Sheet, run `dryRun` then `sendBatch`. See `/mailer/README.md` for the full workflow.

**Critical: rate-limit the send.** Google Workspace's burst-detection heuristic flags senders above roughly 20-30 emails per minute, especially on newer domains. The mailer defaults to `RATE_LIMIT_MS = 10000` (10 seconds between sends, 6/min) for that reason. **Do not lower this below 3000 ms** unless `ai4ntp.com` has months of established clean sending history. Lesson learned from Episode 001: the original 1.5s default triggered a 24-hour outbound block from Google about 60 emails into a 65-recipient batch.

Symptoms of hitting the limit:
- Bounce notification in your inbox: "You have reached a limit for sending mail."
- Subsequent sends from the same Workspace account (even one-line emails to friends) get blocked.
- Block clears on a 24-hour rolling window — do not keep trying to send during the cooldown, as that resets the timer.

If you hit the limit anyway: stop sending, use a different account for urgent messages, wait 24 hours. The bounces you got are gone — do not retry to those addresses from the same domain in the same batch.

### List and CRM sync (every registrant)

Goal: every person who registered lands in Beehiiv (the newsletter) and in the CRM, not just the ones who came through a site form.

What already happens automatically: anyone who submitted a site form or the kickoff poll is synced to Beehiiv in real time by the `pg_net` trigger on those Supabase tables (see `api/beehiiv-sync.js`, tagged `Source = "Live Session <id>"`). Those people are already in.

What you must do by hand after the event, because Zoom-direct registrants never touched a site form:

- [ ] Export the Zoom registration + attendee report (from Phase 1) as CSV.
- [ ] **Add every registrant to Beehiiv.** Either import the CSV in Beehiiv (set the `Source` custom field to `Live Session <id>`, welcome email off), or drop the rows into the synced Supabase pulse table so the trigger picks them up. The `api/beehiiv-backfill.js` route also covers any synced table. Treat already-subscribed as success, the sync is idempotent.
- [ ] **Add every registrant to the CRM (HighLevel).** Upsert each contact by email with first and last name, company if known, and a `session-<id>-registrant` tag. The HighLevel contacts upsert dedupes on email, so re-running is safe.
- [ ] **Reconcile referral attendance.** Referrals are minted at signup (the live portal counter), but rewards unlock only when the invited friend actually attends. The reconciler flips `pending` referrals for real attendees to `attended`. As of July 2026 it is **automated**: it auto-loads the Supabase key from a local `.env` (one-time setup: `cp .env.example .env`, paste the `service_role` key; `.env` never deploys), auto-discovers the newest attendee CSV in `revops/attendees/` or `~/Downloads`, and reads the **raw Zoom report directly** (finds the "Attendee Details" section itself, ignoring the Host/Panelist sections, so no manual CSV cleaning). So every session it is just:
  - `node tools/reconcile-referrals.mjs`  (add `--dry-run` to preview, `--min-minutes=5` to drop fly-bys, `--check` to verify parsing without the key, or pass a CSV path to override auto-discovery).
  - **Zero-CSV option:** `node tools/reconcile-referrals.mjs --zoom` pulls attendance straight from the Zoom Report API (`tools/zoom-report.mjs`, same S2S OAuth app as `api/zoom-register.js`), so no export is needed at all. Requires `ZOOM_ACCOUNT_ID/CLIENT_ID/CLIENT_SECRET/WEBINAR_ID` in `.env` and the **`report:read:admin`** scope on the S2S app (paid Zoom plan). `--webinar=<id>` overrides.
  - It matches on the Zoom registration email (`Attended = Yes`), is idempotent (only `pending` -> `attended`), and prints which referrer codes crossed 3 / 10 / 20 attended plus any attendees with no matching referral.
  - Fulfill any newly unlocked rewards (at 3, the referrer's portal reveals the free `/build` session claim). See CLAUDE.md "Referral / affiliate tracker" for the full system.
- [ ] Spot-check: pick five registrants, confirm each shows in Beehiiv with the right Source and in the CRM with the registrant tag.

### LinkedIn connection and outreach (every registrant)

Goal: connect with every registrant on LinkedIn and send a real, personal note. This is the highest-leverage relationship step we have, and it is manual on purpose. Do not use LinkedIn automation tools, they get accounts restricted.

- [ ] Build the working list from the Zoom registration + attendee export (name, company, email). The revops high-value-contacts tracker is the master, log everyone there.
- [ ] Prioritize by ICP first (use the revops ICP scoring), then everyone else. Connect from Justin's account, the host they registered to see.
- [ ] Send a connection request with a short personal note: name Episode <id>, reference one specific thing from the session, and a soft open ("happy to share the replay or the starter kit"). No pitch in the first touch.
- [ ] Log connection status (sent, accepted, replied) in the revops outreach tracker so we never double-touch.
- [ ] For accepted ICP connections, follow up once with the booking link (`/calendar`), framed as a working session, not a sales call.
- [ ] Pace it: keep connection requests under roughly 20 per day per account to stay under LinkedIn's invite limits, especially without Premium.

### Social distribution

- [ ] One LinkedIn post per speaker, tagging the other two. Each posts a different best-moment clip (90 seconds max) + link to the recap.
- [ ] One X/Twitter thread from the AI4NTP account: hook → top 3 insights → CTA to recap.
- [ ] Surface the recap from `/register` (small "Watch session 001" link in the nav or hero).

### Index update

- [ ] Update the project root `index.html` (or wherever your session index lives) to surface the new replay-style card.
- [ ] Update `sessions/<id>/CLAUDE.md` "Open todos" section: tick off the replay block, note the YouTube ID, archive any pre-event open todos.

---

## Reusable templates per session

These files should exist for every session by the end of Phase 2:

```
sessions/<id>/
├── raw/                        # Zoom downloads, exports — not published
├── transcript.md               # Cleaned, speaker-labeled
├── faqs.md                     # 5 to 10 Q&As pulled live
├── tools.md                    # Tools, links, what they are, who mentioned
├── catchup.md                  # 5-min editorial summary + best moments
├── youtube.md                  # Title, description, chapters, tags, thumbnail brief
├── post-event-emails.md        # Attendee + no-show email drafts
└── index.html                  # The canonical episode page (transformed in place)
```

---

## SLA

- **T+24h**: page live with replay embedded (YouTube can still be Unlisted).
- **T+48h**: emails sent, social posted, YouTube flipped Public.

Anything that slips past T+48h costs us audience momentum. Treat the SLA as load-bearing.

---

## Voice and tone

Inherit from root `/CLAUDE.md`. The non-negotiables:

- Never use em dashes. Use commas, periods, parentheses, or restructure.
- Direct, declarative, slightly understated. No hype.
- Specific over generic. Names, numbers, links.
- "Translators, not oracles." This is the brand line. Use it in the close of every email.
