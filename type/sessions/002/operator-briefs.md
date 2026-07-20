# Session 002 · Operator Briefs

What Ian, Alec, and Justin each prep for the boiler-room build.

Dress rehearsal is **Monday June 1, 7 PM EST**. All three operators on Zoom for 90 minutes.

---

## Live event links

- **Eventbrite event (public):** https://www.eventbrite.com/e/build-a-company-with-ai-in-under-an-hour-ai4ntp-episode-002-tickets-1990371208865
- **Zoom registration (attendee-facing):** https://us06web.zoom.us/webinar/register/WN_bFbbn0VqRxW47hR5hZVZTQ
- **Panelist Zoom join link:** Justin will send a separate panelist invite via Zoom (do not use the attendee link to join as a panelist)
- **Backchannel:** iMessage thread (Justin, Ian, Alec). Justin will set up before the call.

Each operator should share to their own networks. Use `?aff=ian` or `?aff=alec` on the Eventbrite URL for clean attribution tracking.

---

## Shared context (all three operators)

### The format (updated May 27)

Session 002 is a **boiler-room build**. There are no clean 15-minute solo segments anymore. After the audience picks the brief at minute 6:30, all three operators go on mic together and stay there for the next 53 minutes. We work in parallel, talk to each other, jump into each other's screens, and hand off artifacts in real time via the backchannel.

The audience watches a real boiler room: three founders building three pieces of the same company simultaneously.

### How the brief gets picked (updated May 27)

The brief is picked live in the first 6 minutes via the AI quiz at `ai4ntp.com/sessions/002/assess`. The audience submits open-ended business ideas. Claude synthesizes 5 buildable, funny, meme-leaning candidates. The audience votes. The winner is what we build.

There is no pre-baked brief. None of us knows what we're building until minute 6:30. This is the magic-trick mechanic.

### The compounding chain (still holds, just in parallel)

```
Ian (brand)
  → outputs: logo, palette, type, voice rules, mockups, brand kit hosted at empk.com/ai4ntp-002/

Alec (build)
  → takes: brand kit URL as it lands
  → outputs: live deployed site on the domain Ian bought live in the show

Justin (launch)
  → takes: brand + site as they emerge
  → outputs: newsletter shipped to Beehiiv, social posts live on AI4NTP accounts
```

### Hard rules for all operators (updated May 27)

- **60 minutes total, fluid handoffs.** No internal walls. If you can ship in 8 minutes, ship. If you need 22, take them. Communicate in the backchannel.
- **All mics open from minute 7.** No mute-button choreography. Talk when you have something. Justin moderates if two of you try to talk at once.
- **Use the backchannel for handoff signals.** "Coming up for air." "Got something to show." "Need 3 minutes heads down." Justin watches the channel and times verbal handoffs.
- **Narrate.** Audience needs to hear what you're doing. Justin will also narrate every 90 seconds, but each operator's own voice on their own work is the show.
- **No em dashes** in any output (brand voice, copy, anything that ends up on screen). Use commas, periods, parentheses, or restructure.
- **Fallback video.** Every operator records a 90-second "here is what it should have looked like" video before the live.
- **One mid-build audience hook each.** Around minute 27 (Ian), 36 (Alec), 42 (Justin). See run-of-show for verbatim hooks.

### Timeline for each operator's prep

- **Day -5 (Thu May 28):** record fallback video. Confirm tools work end-to-end.
- **Day -4 (Fri May 29):** solo run-through against the clock with a self-generated brief. Identify timing problems.
- **Day -3 (Sat May 30):** final solo run-through. Cut anything that doesn't fit.
- **Day -1 (Mon Jun 1, 7 PM EST):** dress rehearsal as a full group on Zoom (90 min, Justin will send invite). Tests the AI quiz, the boiler-room overlap, the brand-kit handoff, the live domain purchase, the backchannel.
- **Day 0 (Tue Jun 2):** SHIP IT, 1 PM EST. Soundcheck at 12:45 PM EST.

---

## Ian · brand operator

### What you build (during minutes 7 to ~50)

A complete brand identity and design system for the audience-picked business:

- **Name treatment** (logo): the locked business name in a typographic mark, ideally with one symbolic accent
- **Color palette**: 5 colors (1 primary, 1 secondary, 2 accents, 1 neutral) with hex codes
- **Typography stack**: a headline font + body font + monospace font (Google Fonts, free to use)
- **Voice rules**: 3 to 5 declarative rules for how the business writes
- **Visual design mockups**: at least two, ideally three:
  - Mobile screen mockup showing the brand applied to a product surface
  - Social card template (1080x1350 or 1200x630) for the launch
  - Ad mock (Meta or LinkedIn ad-shaped)
- **Brand kit deliverable**: a one-page hosted page at `empk.com/ai4ntp-002/` (or similar URL pattern you confirm before the show). URL shared in Zoom chat at minute 30. Alec ingests the URL into a Lovable prompt.
- **Domain purchase**: you buy the live domain on Namecheap around minute 18, in front of the audience. Three name variations tested live; first available one wins. $50 cap. Point the A record at Alec's Vercel project (he'll have shared access before the show).

### Why you

You have 20+ years as a designer. Disney, the Golden Globes, the AMAs. Won the **Grady Nut Humor Award** (Dove humor award) for a website. Started with code at age 10. You are the only one of the three of us who can credibly do brand identity at this level live with a brief picked sixty seconds ago. The audience needs to see what brand design looks like when someone with real chops uses AI as a multiplier.

### Tool stack

- **OpenClaw** (primary brand-build tool). Confirmed by Justin on June 1, 2026 as what Ian is actually using ("OpenClaw companion"). This supersedes the Figma-first plan below. NOTE: the Figma-specific pre-work and template steps in this brief predate that switch and need Ian's own revision to match the OpenClaw workflow.
- **Figma** (fallback canvas). Pre-create a name-agnostic brand-kit template with empty slots.
- **AI plugins inside Figma** (your preference): Magician, Diagram, GenWP, whichever you're sharpest in.
- **ChatGPT or Claude** in a side window for name treatment options, voice rules, mockup copy.
- **Midjourney + Behance** for moodboarding and symbolic logo marks.
- **Google Fonts** for the type stack.
- **Namecheap** for the live domain purchase.
- **BrandSauce / EMPK hosting** for the brand-kit URL.

### Pre-work (by Sat May 30)

- [ ] Build the empty Figma brand-kit template (one page, slots for logo, palette, type, voice rules, mockup frames). Name-agnostic; you'll fill in the logo slot at minute 7+ once the brief is locked.
- [ ] Confirm the BrandSauce/EMPK URL pattern (`empk.com/ai4ntp-002/`) and test publishing a placeholder kit there. Confirm public access, copy-able hex codes, downloadable PNG/SVG assets.
- [ ] Vercel project access shared with Alec (so Ian can point the new domain's A record at Alec's project).
- [ ] Namecheap account logged in, payment method ready. Test the buy + DNS-edit flow on a throwaway domain so the muscle memory is there.
- [ ] Pre-stage two or three mockup templates (mobile, social card, ad) so the live work is "slot in the assets" not "design the frame from scratch."
- [ ] Prepared talking tracks (see below).
- [ ] 90-second fallback video recorded showing a polished version of the brand kit.

### Talking tracks (for AI generation pauses)

- **Four decades of brand work:** "I built brand systems back when every asset cost weeks of work. The change in the last two years is not the tools getting better, it is the tools letting a one-person team produce what used to need a five-person studio."
- **What enterprises get wrong:** "Most enterprise brand systems are policed instead of used. The rules become the product. A real brand system is the cheapest way to ship without losing identity."
- **Why mockups beat logos:** "A logo on a white background convinces nobody. A logo on a mobile screen, in a social card, in a banner ad, that is when the brand actually lives."
- **The Grady Nut story:** Grady Nut Humor Award (Dove humor award) for a kids' website. Earned credibility in 30 seconds if you need to fill a long pause.

### Mid-build audience hook (around minute 27)

> "Drop a one-word vibe for [WINNER] in chat. Bright. Dark. Serious. Fun. Weird. Best one steers the next round of design."

### Key handoffs

- **Minute ~18 (domain purchase):** Justin narrates the live buy. You read out the chosen domain. Drop the A-record target in the backchannel.
- **Minute ~30 (brand kit publishes):** Drop the URL in Zoom chat. Verbally call out font names so Alec can grab them from Google Fonts directly.
- **Continuous:** drop hex codes and palette directions in the backchannel as soon as they're locked. Don't make Alec wait for the full PDF.

### Fallback if everything breaks

You play your pre-recorded 90-second "here is what the brand kit looks like" video, share the polished version's URL in chat, and continue narrating. The handoff to Alec still happens at minute 30 with the same assets, just from the pre-staged version.

---

## Alec · build operator

### What you build (during minutes 7 to ~50)

A live marketing website for the audience-picked business, plus a custom development element:

- **Hero** (headline + subhead + CTA) using Ian's brand identity
- **Value proposition** (3 short bullets or a one-paragraph elevator pitch)
- **Pricing tease** (a single tier or "starts at $X/mo")
- **Email signup** (captures into Supabase or Lovable Cloud, fires a confirmation)
- **Custom development element**: picked at improv time based on what fits the brief. At least one of:
  - Hero animation (Framer Motion or similar via Claude Code)
  - Live AI-powered demo embedded in the page (calls Anthropic API, returns a preview enrichment for the business's use case)
  - Calendly-style booking integration
  - Stripe checkout snippet
  - Custom interactive UI component Lovable can't ship alone
- **Deployed live** to the real domain Ian bought live in the show

The "custom development" element is the differentiator from a pure no-code segment. It signals to the audience that vibe coding is the full stack, not just drag-and-drop landing pages.

### Tool stack

- **Lovable as primary scaffold.** Lovable Cloud (Supabase under the hood) for the email capture backend.
- **Claude Code in a second window** for the custom-dev portion. Hand off cleanly: Lovable scaffolds the site, then Claude Code edits the specific component that needs custom code.
- **Vercel** for deploy (project pre-created, access shared with Ian for DNS pointing).

### Pre-work (by Sat May 30)

- [ ] Lovable account ready, signed in, project pre-created with an empty workspace.
- [ ] Pre-write the master prompt you'll run live for the initial scaffold. Test it three times against three different brand directions to confirm it adapts.
- [ ] Vercel project pre-created. **Share access with Ian** so he can point DNS at it.
- [ ] Test the brand-kit-URL → Lovable ingestion flow. Verify Lovable can pull a hosted brand-kit URL, parse hex codes + fonts, and respect them in output.
- [ ] Test the email-capture flow end-to-end.
- [ ] Have three custom-dev component templates ready in your head (hero animation, live AI demo, Calendly integration). Pick at improv time based on what the locked brief needs.
- [ ] Prepared talking tracks (see below).
- [ ] 90-second fallback video.

### Talking tracks (for Lovable / Claude Code generation pauses)

- **Lovable to Claude Code handoff:** "Lovable gets me to 80% of a landing page in five minutes. Claude Code gets me the remaining 20% in seven. Together they ship something neither could alone."
- **Why Lovable beat my Vercel + GitHub workflow:** callback to 001 answer.
- **The three things I always change:** "Lovable always over-builds the hero. Cut it in half. Lovable always picks the wrong CTA. Rewrite it. Lovable always misses the trust block. Always add it."
- **The custom-dev moment:** "This is what people miss when they say 'AI just builds toy landing pages.' Watch the next 90 seconds."

### Mid-build audience hook (around minute 36, optional)

> "Hero copy: should it lead with [option A from brand voice] or [option B]? Quick vote in chat."

### Key handoffs

- **Minute ~22 (first deploy):** push to Vercel preview URL. Confirm Ian's A-record points there.
- **Minute ~30 (brand kit lands):** switch Lovable prompt to ingest Ian's brand-kit URL. Re-deploy with proper brand.
- **Minute ~48 (DNS propagates):** share the live URL on the bought domain in Zoom chat.

### Fallback if everything breaks

90s fallback video. Share the pre-deployed backup URL. The "deploy to bought domain" part is a great moment but not load-bearing; the Vercel preview URL is a valid backup.

---

## Justin · marketing operator and moderator

### What you build (during minutes 7 to ~50)

A live demo of the marketing-tech stack you've been building all year, applied to the audience-picked business as it comes into existence:

- **Multi-tenant content engine.** Spin up a new sub-brand for the audience-picked business. Ingest Ian's brand kit + voice rules (from the URL Ian publishes around minute 30, or via direct paste from the backchannel earlier).
- **Firecrawl industry sources.** While Ian is on brand and Alec is on the site, crawl 3 to 5 industry sources for the winning vertical. Score articles 0-100 against the new brand voice.
- **Compile a newsletter.** Pick the top articles live, in front of the audience. Show the AI scoring. Compile the newsletter draft, ship to Beehiiv as a real draft (your AI4NTP Beehiiv account, real domain).
- **Generate social posts.** LinkedIn post + X thread + 3 follow-up scheduled posts, all in the new brand voice. Download the social card as PNG. Post live to the AI4NTP socials (real accounts, real post).
- **Real-time engagement hook.** "First five likes or comments win the brand-kit PDF in your inbox." Ties the social post back to the live audience.

### Why you

As fractional CMO you have scaled multiple businesses past $50M+ ARR. You spent the last year building the marketing tech most teams pay an agency or hire 10 people to do. The demo is the punctuation mark of the show.

### Moderator duties

You also run the show. In the boiler-room format that means:

- **Narrate every 90 seconds.** "Ian is still on palette. Alec just deployed. I'm crawling industry sources." Without this, the audience can't follow three streams at once.
- **Watch the backchannel.** When Ian or Alec signals "ready to show," time a verbal handoff.
- **Break ties.** If two operators try to talk at once, you call it. "Alec, finish. Ian, hold thirty seconds."
- **Run the brief-picking flow at minutes 2 to 6:30.** Open the form, trigger synthesis, run the vote, lock the winner.
- **Run the giveaway draws** at minute 54 and the grand prize at 56.
- **Read funny submissions out loud** during the submissions phase.

### Tool stack

- **Multi-tenant content engine** (your stack, pre-loaded with the AI4NTP Beehiiv connection).
- **Firecrawl** for source ingestion.
- **Claude / Anthropic API** for scoring + voice + content generation.
- **Beehiiv** for newsletter distribution (real AI4NTP account).
- **LinkedIn + X** posting (real AI4NTP accounts).

### Pre-work (by Fri May 29)

- [ ] Confirm your content engine handles "create a new sub-brand from a URL" cleanly. Test with the AI4NTP brand kit as input.
- [ ] Pre-cache: open every tab and tool you'll touch in the show so nothing has a cold load.
- [ ] Test Firecrawl on 3 to 5 different industry source patterns (TechCrunch, niche industry blogs, Reddit subreddit, Hacker News). Confirm the article-scoring prompt produces sensible 0-100 scores.
- [ ] Confirm the Beehiiv draft API integration is working end-to-end with a real send capability.
- [ ] Confirm the LinkedIn + X posting integrations work and authenticate from your live machine.
- [ ] Pre-stage 5 backup business ideas in case the audience submits nothing usable.
- [ ] Prepared talking tracks (see below).
- [ ] 90-second fallback video showing the content engine flow if any tool fails.

### Talking tracks

- **The marketing-tech architecture:** "Most marketing teams have a content person, a social person, an email person, an ads person. AI flattens that org."
- **What fractional-CMO work looks like in 2026:** "Five years ago, I'd write a launch plan and hand it to a team. Now I write a launch plan and execute it the same week, alone."
- **The compounding nature of these artifacts:** "Ian's brand fed Alec's site. Ian's brand and Alec's site feed my newsletter. By the end of this you have a startup that exists publicly."
- **What the content engine actually does:** "Firecrawl pulls articles from any source. AI scores them against the brand voice. Top five go in the newsletter. Same flow does LinkedIn, X, blog, email."

### Mid-build audience hook (around minute 42)

> "What channel should I post the announcement on first? LinkedIn, X, Instagram. Drop it in chat. Whichever gets the most reactions, I'll demo live."

### Key handoffs

- **Minute ~30 (brand kit lands):** ingest Ian's brand-kit URL into your content engine. Voice rules flow in.
- **Minute ~45 (newsletter shipped):** Beehiiv draft visible on screen. Social posts generated. PNG downloaded.
- **Minute ~45 (social posts live):** real post on AI4NTP LinkedIn + X. Engagement hook tied to the live audience.

### Fallback if everything breaks

90s fallback video. Then narrate why each piece matters even if the live demo can't run.

---

## Brett · co-moderator (added June 1, 2026)

Brett Haralson, co-founder of Quetzal Labs (quetzals.ai). Award-winning partner-ecosystem and community builder. **Co-moderator only, no build segment.** He co-hosts the show alongside Justin so Justin can stay heads-down in the boiler room during his GTM build. Exact on-air split between Justin and Brett (intro, audience wrangling, narrating the build, running the brief vote, giveaways) is TBD and should be locked at the dress rehearsal. Public-page role label: "Co-moderator" (rust). Justin's label: "Segment 3 + Co-moderator."

---

## Rehearsal protocol (Mon Jun 1, 7 PM EST)

90-minute Zoom call, all three operators. Justin sends the invite.

### Goals

1. Test the AI quiz end-to-end with 3 of us submitting fake-audience ideas.
2. Run the boiler-room build against a real clock on the rehearsal-winning brief.
3. Test the brand-kit URL → Lovable ingestion handoff.
4. Test the live domain-purchase + A-record share flow with a real test domain.
5. Test the backchannel (notifications, delay, Justin's ability to verbally moderate from signals).
6. Run at least one fallback path (AI synthesis fails; or domain doesn't propagate).

### Schedule

- **0:00 to 5:00:** check-in, confirm tech, confirm backchannel works.
- **5:00 to 12:00:** AI quiz dry run. We three submit 6-10 fake-audience ideas. Justin triggers synthesis. We vote. We lock a winner.
- **12:00 to 65:00:** full 53-minute boiler-room build on the rehearsal winner. Real clock. Real artifacts.
- **65:00 to 80:00:** debrief. What overran, what was dead air, what handoffs felt clunky. Cut content if needed.
- **80:00 to 90:00:** confirm Jun 2 day-of logistics. Final tool checks. Sign off.

By the end of rehearsal, every operator should be able to land their stream of work and a sharp final-share moment. If anything is breaking on Jun 1, we cut content, not add time.

---

## Reminders

- The show is the building. Do not pre-build the audience-picked business offstage and pretend. The audience can tell, and the credibility is the whole format.
- The artifacts at the end are the trophies. Brand kit, website code, launch kit, all shared with everyone.
- If you go silent for more than 30 seconds during your stream of work, Justin will chime in as moderator. Use that. Don't fight it.
- Have water nearby. Be on time. We are live in front of 150+ marketers on a Tuesday at 1 PM EST.

Good luck. Block your calendars for Mon Jun 1, 7 PM EST. Confirm receipt of this brief by EOD Thu May 28.
