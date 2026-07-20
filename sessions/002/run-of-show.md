# Session 002 · Run of Show

**Date:** Tuesday, June 2, 2026 · 1:00 PM EST
**Format:** Live on Zoom, recorded. Audience-picked brief, then 53 minutes of boiler-room build with all three operators on mic in parallel.
**Target run time:** 60 minutes total.
**Co-moderators:** Justin + Brett Haralson (Brett added June 1; on-air split TBD at rehearsal) · **Builders:** Ian (brand, Segment 1), Alec (site + dev, Segment 2), Justin (launch/GTM, Segment 3)
**Host dashboard** (`/sessions/002/assess/live`) is public/no-token as of June 1. Do not share the URL.
**Zoom registration (attendee-facing):** https://us06web.zoom.us/webinar/register/WN_bFbbn0VqRxW47hR5hZVZTQ

Keep this open in a tab during the call.

---

## Brief vote: AI quiz at /sessions/002/assess (primary, no backup)

The audience picks the brief live via the AI quiz at `ai4ntp.com/sessions/002/assess`. There is no Zoom Polls fallback because Zoom Polls cannot do free-text submission, AI synthesis, or staged voting.

The flow:

1. **Minute 2:00 to 4:00 — Submissions phase.** Audience drops free-text business ideas. Realtime feed on the host dashboard.
2. **Minute 4:30 — Synthesis.** Justin clicks "Run AI synthesis → 5 options" on the dashboard. Within 8 seconds, five candidate businesses render on the audience page.
3. **Minute 5:00 to 6:00 — Voting phase.** Audience clicks one of five cards. Live tally bar.
4. **Minute 6:30 — Lock winner.** Justin clicks "Lock winner." The locked business is the brief for the next 53 minutes.

**If the AI quiz fully fails** (the only real risk): Justin reads the raw submissions aloud, picks 5 favorites verbally, takes a Zoom Reactions vote (1-finger through 5-fingers, or color reactions if Zoom Reactions falls back). Justin pre-stages 5 generic backup ideas in his notes in case submissions don't arrive at all.

---

## Zoom chat lockdown (do this on Mon Jun 1 dress rehearsal AND day-of)

001 chat failed for attendees. Three places to verify before going live:

1. **Account-level** (Zoom web portal → Settings → In Meeting (Basic) → Webinar Chat):
   - Allow webinar attendees to chat: ON
   - Allow attendees to send messages to: **Everyone**
   - Auto-save chat to local: ON

2. **Webinar-specific** (Zoom portal → Webinars → Episode 002 → Edit → Webinar Options):
   - Q&A: ON
   - Chat: ON

3. **Day-of as host (5 min before doors open):**
   - Open Chat panel
   - Click three-dot menu → "Participants can chat with: **Everyone**"
   - Verify the dropdown attendees see also defaults to "Everyone"

**Verification (REQUIRED at dress rehearsal):** Have someone outside the panelist group join via the real attendee link from phone AND laptop. Post a test message. Confirm Ian and Alec both see it. Confirm a second tester can see the first tester's message. The panelist view is misleading; you must test as attendee.

---

## Pre-call checklist (T-60 min)

### Justin (host + marketing operator)

- [ ] Verify Zoom chat permissions per the lockdown checklist above (REQUIRED, do not skip)
- [ ] Truncate smoke-test data in pulse tables:
  ```sql
  truncate ai4ntp_pulse_002, ai4ntp_pulse_002_options;
  update ai4ntp_pulse_002_state set phase = 'submitting', winner_id = null where id = 1;
  ```
- [ ] Open in browser tabs:
  - Host dashboard: **https://ai4ntp.com/sessions/002/assess/live**
  - Attendee page (to paste in chat at minute 2): **https://ai4ntp.com/sessions/002/assess**
  - Eventbrite event (for attendee questions): **https://www.eventbrite.com/e/build-a-company-with-ai-in-under-an-hour-ai4ntp-episode-002-tickets-1990371208865**
  - Justin's marketing tech stack pre-loaded (multi-tenant content engine, Firecrawl, Beehiiv composer, social posting account)
  - Pre-staged 5 backup business ideas in a notes file (in case audience submits nothing)
- [ ] Backchannel iMessage thread with Ian + Alec, pinned, on the same screen
- [ ] Calendar booking links ready to paste at minute 57:
  - Justin: https://ai4ntp.com/calendar
  - Alec: https://api.leadconnectorhq.com/widget/bookings/alec-saluga-personal-calendar-sa_ud70xj
  - Ian: https://calendly.com/ian-bsauce/30min-with-ianpk
- [ ] Wi-Fi: speed test, ethernet backup
- [ ] Launch-kit fallback video (90s) loaded and ready

### Ian (brand operator)

- [ ] Figma open with the empty brand-kit template (logo slot, palette grid, type samples, voice rules, mockup frames). Template is name-agnostic; logo slot is empty until minute 7.
- [ ] AI plugins inside Figma activated
- [ ] Midjourney and Behance tabs open for moodboarding
- [ ] Google Fonts open
- [ ] Namecheap account logged in, payment method ready, $50 budget cap in mind
- [ ] BrandSauce hosting URL pattern confirmed (e.g. `empk.com/ai4ntp-002/`). The brand kit goes here so Alec can ingest via URL.
- [ ] Vercel project access shared with Alec (so Ian can point the new domain's A record at it)
- [ ] Brand-kit fallback video (90s) loaded

### Alec (build operator)

- [ ] Lovable project pre-created, signed in, workspace empty
- [ ] Claude Code environment open in a second window
- [ ] Vercel project pre-created, access shared with Ian (so Ian can point DNS at it)
- [ ] Tested: pasting a brand-kit URL into a Lovable prompt and confirming the output respects the kit
- [ ] Tested: pushing a Lovable site to Vercel with a custom domain
- [ ] Website fallback video (90s) loaded

### All three

- [ ] Each operator joins Zoom 15 minutes early for a soundcheck
- [ ] Backchannel iMessage thread tested (everyone can send + receive)
- [ ] Phones on Do Not Disturb except for the backchannel thread
- [ ] All three on mic, all three sharing screens (Zoom multi-share enabled)

---

## Timing table

| Time | What is happening | Who |
|---|---|---|
| 0:00 | Cold open. Welcome, name people in chat by location. Frame the format: "Three founders, one company, sixty minutes. The audience picks what we build." | Justin |
| 2:00 | "The form is live at ai4ntp.com/sessions/002/assess. Drop any business idea. Industry, vibe, joke, anything. We need ideas in the next 90 seconds." Submissions phase opens. | Justin |
| 3:30 | Submissions feed visible on screen. Justin reads the funniest ones aloud as they arrive. | Justin |
| 4:30 | "Synthesizing now." Justin hits "Run AI synthesis → 5 options" on dashboard. ~8 second pause. | Justin |
| 4:45 | Five candidates render. Justin reads them aloud quickly. | Justin |
| 5:00 | "Vote now. Live tally on screen. We lock in 60 seconds." Voting phase opens. | Justin |
| 6:00 | Tally close. | Justin |
| 6:30 | Justin clicks "Lock winner." Winner announced on screen. "We are building [WINNER]. Ian, Alec, you have 53 minutes. Mics open." | Justin |
| 7:00 | **All three mics open. Boiler-room begins.** Ian opens Figma + Midjourney. Alec opens Lovable + Claude Code. Justin opens his content engine, starts Firecrawl on industry sources for the vertical. | All three |
| 12:00 | Ian shares first logo direction on screen briefly. Drops color palette in backchannel. Alec ingests palette into Lovable prompt. | Ian → Alec |
| 18:00 | Ian buys the domain live on Namecheap. Audience watches. Justin narrates the cost ($11), the Whois redaction, the propagation timer starting. Ian shares A-record info in backchannel. | Ian → Alec |
| 22:00 | Alec deploys first Lovable build to Vercel preview URL. Ian points the new domain at Alec's Vercel project. Justin demos Firecrawl finishing the industry source crawl, surfaces the top 10 scored articles. | All three |
| 27:00 | Mid-build audience hook: "Drop a one-word vibe for [WINNER] in chat. Bright, dark, serious, fun, weird. Best one steers Ian's next round." | Ian |
| 30:00 | Ian publishes the full brand kit at `empk.com/ai4ntp-002/`. URL drops in Zoom chat. Alec switches Lovable prompt to ingest the URL. Justin pulls voice rules from the brand kit into his content engine. | Ian → Alec + Justin |
| 35:00 | Alec ships the custom-dev element. Improv pick at runtime: hero animation, live AI demo widget, or Calendly integration. Whichever fits the brief and time best. | Alec |
| 40:00 | Justin's content engine compiles the newsletter. Live picks which articles to include. Ships to Beehiiv as a draft. Pulls up the draft on screen. | Justin |
| 42:00 | Mid-build audience hook: "What channel should I post the announcement on first? LinkedIn, X, Instagram. Drop it in chat." | Justin |
| 45:00 | Justin generates LinkedIn + X posts in the new brand voice. Downloads PNG of the social card. Posts live to AI4NTP socials. "First five likes or comments win the brand-kit PDF directly to your inbox." | Justin |
| 48:00 | Domain DNS has propagated. Alec shares the live URL on the bought domain. Audience visits. Alec narrates what they're looking at. | Alec |
| 51:00 | All three on camera together. Brand kit URL, live site URL, and launch-kit URL all dropped in Zoom chat. "Sixty minutes ago, none of this existed." | All three |
| 54:00 | Per-operator giveaway draws. Ian's winner. Alec's winner. Justin's winner. | Justin |
| 56:00 | Grand prize draw. | Justin |
| 57:00 | Bonus offer: "Every attendee gets a 30-minute one-on-one. Pick any of us." Calendar links drop in chat. | Justin |
| 59:00 | Close. | Justin |
| 60:00 | Recording stops. | — |

**Hard rules:**
- Justin narrates what each operator is doing every 90 seconds. This is the moderator's job in the boiler-room format.
- If two operators try to talk at once, Justin verbally breaks the tie ("Alec, finish your thought. Ian, hold thirty seconds.").
- Operators signal in the backchannel before pulling the screen-share focus. "Coming up for air" or "got something to show" or "need 3 minutes heads down."
- If anything overflows the 60 minutes, cut Justin's giveaway moment first, then Alec's custom-dev element. Never cut the brand kit, the site, or the newsletter.

---

## Verbatim transition lines (rehearsed)

### Cold open (Justin, 0:00)
> "Welcome to AI4NTP Episode 002. Sixty minutes from now, a company that doesn't exist will exist. Brand, website, real domain, full launch kit, live newsletter, posts on socials. The audience picks what we build. The audience picks it in the next four minutes. Drop your location in chat, then watch the link I'm about to drop."

### Open submissions (Justin, 2:00)
> "Link is in the chat: ai4ntp.com/sessions/002/assess. Drop any business idea. Pickleball league app. AI tutor for dogs. Weather forecast for plants. Anything. We need ideas in the next ninety seconds. The wilder, the better."

### Synthesis trigger (Justin, 4:30)
> "Submissions are in. Watch this. We're feeding everything you wrote into Claude and asking for five buildable, funny, meme-worthy candidates in the spirit of what you said. Synthesizing now."

### Reveal candidates (Justin, 4:45)
> "Five options on your screen. Read them. Pick your favorite. Vote opens in fifteen seconds."

### Voting opens (Justin, 5:00)
> "Vote now. Tally is live on screen. We lock in sixty seconds."

### Lock winner (Justin, 6:30)
> "Locked. We are building **[WINNER]**. Ian, Alec, you have fifty-three minutes. Mics open. Let's go."

### Mid-build narration (Justin, every 90 seconds)
> "Ian is still on the color palette. Alec just deployed the first version of the site to a preview URL. I just finished crawling industry sources. We'll have a newsletter draft in fifteen minutes."

### Domain purchase moment (Justin narrating, 18:00)
> "Ian is buying the domain live. Eleven bucks on Namecheap. A record is going at Alec's Vercel project. DNS propagation starts now. Sometime in the next twenty minutes the site will resolve at the real URL."

### Brand kit drops (Ian, 30:00)
> "Brand kit is live at empk.com/ai4ntp-002. Logo, palette, type, voice, mockups. Alec, the URL is yours. Justin, voice rules are on page two."

### Newsletter shipped (Justin, 45:00)
> "Newsletter is in Beehiiv as a draft. Social posts are generated. PNG downloaded. Posting to the AI4NTP LinkedIn and X now. First five people to like or comment get the brand-kit PDF in their inbox in the next ten minutes."

### Site goes live on real domain (Alec, 48:00)
> "DNS just propagated. The site is live at [DOMAIN]. Visit it right now. Tell me in chat if anything's broken."

### All three on camera (Justin, 51:00)
> "Three URLs in the chat. The brand. The site. The launch kit. Sixty minutes ago none of this existed."

### Per-operator giveaway draws (Justin, 54:00)
> "Three winners. Drawing now. [Name] gets Ian's brand session. [Name] gets Alec's free landing-page build. [Name] gets my fractional-CMO consult. Your prizes land in your inbox in the next hour."

### Bonus offer (Justin, 57:00)
> "Every single one of you who stayed gets a free thirty-minute one-on-one with any of us. Pick the operator that resonated. Calendar links are in the chat now."

### Close (Justin, 59:00)
> "We just designed, built, and launched a startup in under an hour with AI doing the heavy lifting. You can do the same thing this weekend. The replay, the code, the brand kit, the launch artifacts are all live at ai4ntp.com/sessions/002 by tomorrow morning. See you in Session 003."

---

## Talking tracks for boiler-room lulls

Every operator will have moments where their AI is generating and they're waiting. In the boiler-room format, those moments are when the operator narrates what they're doing or invites the other two operators to fill the air. Each operator has a prepared talking track.

### Ian's talking tracks
- **Four decades of brand work:** "I built brand systems for Disney and the AMAs back when every asset cost weeks of work. The change in the last two years is not the tools getting better, it is the tools letting a one-person team produce what used to need a five-person studio."
- **What enterprises get wrong about brand:** "Most enterprise brand systems are policed instead of used. The rules become the product. A real brand system is the cheapest way to ship without losing identity."
- **The mockup move:** "A logo on a white background convinces nobody. A logo on a mobile screen, in a social card, in a banner ad, that is when the brand actually lives."
- **The Grady Nut story:** if there is a long pause, the Grady Nut Humor Award (Dove humor award) story for the kids' website. Earned credibility in 30 seconds.

### Alec's talking tracks
- **Lovable to Claude Code handoff:** "Lovable gets me to 80 percent of a landing page in five minutes. Claude Code gets me the remaining 20 percent in seven. Together they ship something neither could alone."
- **Why Lovable beat my Vercel + GitHub workflow:** callback to 001. "Six months ago I said I'd never use Lovable. Today I use it daily. Here's what changed."
- **The three things I always change:** "Lovable always over-builds the hero. Cut it in half. Lovable always picks the wrong CTA. Rewrite it. Lovable always misses the trust block. Always add it."
- **Why this is full-stack vibe coding:** "Claude Code is doing the real engineering. Lovable is the scaffold. Anyone who tells you AI can only ship toy landing pages hasn't tried this combo."

### Justin's talking tracks
- **The marketing-tech architecture:** "Most marketing teams have a content person, a social person, an email person, an ads person. AI flattens that org. One operator with the right stack does the work of four."
- **What fractional-CMO work looks like in 2026:** "Five years ago, I'd write a launch plan and hand it to a team. Now I write a launch plan and execute it the same week, alone."
- **The compounding nature:** "Ian's brand fed Alec's site. Ian's brand and Alec's site fed my newsletter. By minute fifty-one we have a startup that exists publicly. That sequence used to take a quarter."
- **What the content engine actually does:** "Firecrawl pulls articles from any source I point it at. AI scores them zero to one hundred against the brand voice. I pick the top five. The newsletter compiles itself. Same flow does LinkedIn, X, blog, email."

---

## Mid-build audience hooks

Non-negotiable. These are what turn the format from "watching" into "participating."

### Around minute 27 (Ian's lane)
> "Drop a one-word vibe for [WINNER] in chat. Bright. Dark. Serious. Fun. Weird. Best one steers the next round of design."

### Around minute 42 (Justin's lane)
> "What channel should I post the announcement on first? LinkedIn, X, Instagram. Drop it in chat. Whichever gets the most reactions, I'll demo live."

### Around minute 36 (Alec's lane, optional)
> "Hero copy: should it lead with [option A from brand voice] or [option B]? Quick vote in chat."

---

## If something breaks

| Problem | Move |
|---|---|
| Audience submits fewer than 5 ideas by minute 4:00 | Justin throws out 3 seed prompts ("what about something for dogs," "something only AI could make work," "something that's basically a joke"). If still under 5, run synthesis with what's there + 3 host-added seeds. |
| AI synthesis returns unusable junk | Justin hand-picks 5 from raw submissions on the dashboard, edits them inline, flips to voting manually. |
| AI synthesis API call fails entirely | Justin reads top 5 raw submissions out loud, takes a Zoom Reactions vote (1-finger through 5-fingers). |
| Ian can't find an available domain in three tries | Buy a `.co` or `.app` variant. Worst case: pick a clever subdomain on a free domain Ian already owns. The "live domain purchase" moment is great, but the bought domain is not load-bearing. |
| Domain DNS doesn't propagate by minute 48 | Alec shares the Lovable preview URL. Domain catches up post-show; recap page uses the bought domain. |
| Ian's brand-kit URL doesn't load for Alec | Ian pastes hex codes + font names + logo PNG directly into Zoom chat as backup. Alec ingests from chat instead. |
| Lovable / Claude Code rate-limit | Alec plays the 90s fallback video, then narrates from a pre-deployed backup. |
| Wi-Fi dies for one operator | Switch to phone hotspot. The other two carry the show. |
| Justin's content engine fails | Justin demos the manual newsletter compilation flow using Claude in the Anthropic console + manual Beehiiv editor. Same outcome, more transparent. |
| Zoom chat dies for attendees mid-session | Operators pivot mid-build hooks to picking from three pre-staged options ("I'll go with bright" — Ian says it himself). Q&A panel stays available as fallback comms channel. |
| One operator drops off Zoom | Justin announces a 90-second pause, plays the affected operator's fallback video, then continues with the remaining two. |
| Recording fails | Local screen recording on each operator's machine as backup. Combine in post. |
| Boiler-room collisions (two operators talking at once) | Justin breaks the tie verbally. Pre-rehearsed: "Alec, finish. Ian, hold thirty seconds." |

---

## Dress rehearsal (Mon Jun 1, 7 PM EST)

90-minute Zoom call, all three operators. Justin sends the invite.

Goals:
1. **Test the AI quiz end-to-end with 3 of us as the "audience."** Submit 6-10 ideas, run synthesis, vote, lock a winner. Confirm the dashboard, the realtime updates, and the AI synthesis all work.
2. **Run the boiler-room build against a real clock on the rehearsal-winning brief.** All three operators build the rehearsal company for 53 minutes. Identify timing problems, collision points, dead-air moments.
3. **Test the brand-kit URL → Lovable ingestion handoff.** Confirm Alec can pull the kit cleanly. Identify any format friction.
4. **Test the live domain-purchase + A-record share flow.** Ian buys a real test domain, points it at Alec's Vercel project, starts the DNS propagation timer. Confirm propagation happens within the rehearsal window.
5. **Test the backchannel.** Confirm all three operators receive backchannel messages with no notification delay. Confirm Justin can verbally moderate handoffs based on backchannel signals.
6. **Test the fallback paths.** Run the "AI synthesis fails" branch. Run the "domain doesn't propagate" branch. Confirm operators have the muscle memory.

Schedule:
- **0:00 to 5:00:** check-in, confirm tech.
- **5:00 to 12:00:** AI quiz dry run with 3 of us submitting.
- **12:00 to 65:00:** full boiler-room build (53 minutes, simulating live).
- **65:00 to 80:00:** debrief, identify cuts, identify any backups to wire in.
- **80:00 to 90:00:** confirm Tue Jun 2 day-of logistics.

By the end of rehearsal, every operator should be able to land their stream of work and a sharp final-share moment. If anything is breaking, we cut content, not add time.

---

## Post-call (T+30 min)

- [ ] Stop Zoom recording, confirm cloud upload
- [ ] Export attendee list from Zoom and Eventbrite
- [ ] Each operator pushes their final artifact:
  - Brand kit PDF + Figma link (Ian) — also at `empk.com/ai4ntp-002/`
  - Website Lovable / GitHub link + live URL on the bought domain (Alec)
  - Launch kit (newsletter draft, social-post PNGs, content-engine snapshot) (Justin)
- [ ] Justin uploads YouTube as Unlisted; flip Public 24-48h later (per playbook)
- [ ] Trigger the post-webinar playbook for the recap page build at `/sessions/002/`

---

## Reminders

- **Voice:** no em dashes. Direct, declarative, specific.
- **Energy:** the format itself carries energy. Don't over-perform. Let the building be the show.
- **Time:** 60 minutes total. No internal walls, but the wrap at 60 is hard. Trust the rehearsal.
- **The point:** every attendee should leave able to say "I could do that this weekend." If the audience leaves intimidated, we failed.

Good luck. Ship it.
