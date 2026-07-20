# Episode 002 · Concept

The build-in-public format, the brief, the giveaways, the risks.

---

## The headline

**Learn how to build a company with AI in under an hour.**

Three founders. One brief picked live by the audience. Under an hour. By the end of the session, the audience watches a complete startup come to life: a brand identity, a marketing website, a full go-to-market launch package, all built live, all shareable. The catch: it's all done with AI, and the company itself didn't exist 60 minutes earlier.

---

## Why this format wins

### It is differentiated

99% of AI webinars are talking heads explaining what is possible. AI4NTP 002 is the rare format where people ship in front of you. That is a memorable distinction, and the recording becomes a permanent reference clip in the AI4NTP catalog.

### It demonstrates the brand promise viscerally

The AI4NTP brand promise is "AI for Non-Techy People." Watching three operators design, build, and launch a complete startup in under an hour is the most credible possible proof of that promise. No amount of slides matches it.

### The audience picks the brief, live

The audience drops business ideas into a form in the first two minutes. AI synthesizes those raw submissions into five funny, meme-leaning candidate businesses. The audience votes. The winner is what gets built. This is the magic-trick mechanic: there is no way for the operators to have pre-built anything, because the brief did not exist until minute six. The "you chose this" investment hook is now total, not partial.

### The arc resolves at "launched," not "deployed"

The arc ends at a full launch: brand, site, and the GTM motion to take the company to market. That is the entire startup lifecycle in under an hour, not just the technical build. More relatable to the marketer-heavy audience.

---

## The brief (audience-driven)

There is no pre-baked brief. The brief is picked live in the first six minutes of the show.

### How the brief gets picked

1. **Minute 2 to 4:** the audience visits `ai4ntp.com/sessions/002/assess` and answers two prompts (fun fake-business framing, finalized June 1): **"What should we build?"** (required) and **"What should we call it?"** (optional). Examples nudge them weird: a dating app for houseplants, Uber but for borrowing dogs, a subscription box for single socks. Realtime submissions stream to the host dashboard.
2. **Minute 4:30:** the host triggers an AI synthesis pass. The submissions feed into a Claude prompt that returns five buildable, funny, meme-leaning candidate businesses. Each gets a name, a one-liner, and a vibe tag.
3. **Minute 5 to 6:** the audience votes on the five candidates from the same form. Live tally bar.
4. **Minute 6:30:** the host locks the winner. The locked business is the brief for the next 53 minutes.

### Why this beats pre-baked options

Considered and rejected on the May 27 prep call. Ian: "if we tell them 'pick one of these four cards,' the magic is gone." The pre-baked path gave the operators a 100% pre-prepped advantage but cost the format its credibility hook. The improv path puts every operator on the same footing as the audience and turns the show into something genuinely live.

### Why funny, not useful

Also decided on the prep call. A "useful" B2B brief (originally we considered Pipeline, a B2B lead enrichment tool) makes for a credible product demo and a boring show. A funny brief is meme-worthy, shareable, and more likely to spin out into a viral artifact. The technical lift to ship a brand, site, and launch motion is the same either way. Lean into the entertainment value.

---

## The boiler-room build

There are no clean 15-minute segments. After the brief locks at minute 6:30, all three operators go on mic together and stay there for the next 45 minutes. They work in parallel, narrate aloud, jump into each other's screens, and hand off artifacts in real time via a shared backchannel.

The audience does not watch one operator at a time. They watch a real boiler room: three founders building three pieces of the same company simultaneously, talking to each other, asking each other questions, problem-solving live.

### The compounding chain (still holds, just in parallel)

```
Ian (brand identity + design)
  → outputs: logo, palette, type system, voice rules, visual design mockups, one-page brand kit hosted at a URL Alec can ingest

Alec (website + custom development)
  → takes: the brand kit URL as it lands
  → outputs: a live marketing site deployed to a real domain (purchased live in the show), plus a custom interactive element that pure no-code can't deliver

Justin (marketing + GTM launch)
  → takes: the brand and the site as they emerge
  → outputs: a content engine demo that ingests the brand, scores industry sources, ships a real newsletter to Beehiiv, and posts to the AI4NTP social accounts live
```

The compounding is preserved. What changes is that all three are happening at once. Ian's first logo draft arrives at minute 12; Alec is already ingesting brand directions from chat. Justin is crawling industry sources for the eventual newsletter in parallel. By minute 30, all three artifacts are converging.

### The roles

- **Ian** is the brand operator. He owns the visual identity from minute 7. He buys the domain live around minute 18. He publishes the brand kit to a hosted URL around minute 30 so Alec can ingest it cleanly.
- **Alec** is the build operator. He runs Lovable and Claude Code in parallel from minute 7. He stitches Ian's outputs into the site as they arrive. He picks the custom-dev element at improv time (animation, live AI demo, or integration). The site goes live on the real domain once DNS propagates.
- **Justin** is the marketing operator and the moderator. He runs his content engine in parallel from minute 7. He keeps the backchannel flowing, calls handoffs verbally when he sees signals from Ian or Alec, and surfaces audience questions in real time. His own demo lands in the back half of the show once there's brand and content to plug into.

### Backchannel

All three operators are in a shared iMessage thread (set up before the show). Used for "ready to share," "need a moment," "stuck on X." Justin watches the channel and times verbal handoffs to match. The backchannel is the operator-facing replacement for hard segment walls.

---

## The roles' deliverables

### Ian's deliverable
A one-page brand kit hosted at a public URL (`empk.com/ai4ntp-002/` or similar, confirmed with Ian pre-show). Contains: logo (PNG and SVG), 5-color palette with hex codes, typography stack (Google Fonts), voice rules, two or three visual mockups (mobile, social card, ad). URL shared in Zoom chat the moment it's live. Also: the live-purchased domain, A record passed to Alec via the backchannel.

### Alec's deliverable
A deployed marketing site at the real domain Ian bought, built on Lovable scaffold with a Claude Code custom-dev component layered on. The site uses Ian's brand kit (pulled in via URL prompt) and ships with: hero, value prop, pricing tease, email capture, and one improv-picked custom element.

### Justin's deliverable
A live marketing-tech demo. Multi-tenant content engine. Ingests the brand kit + voice. Firecrawl crawls industry sources for the winning business's vertical. AI scores articles 0-100. Compiles a newsletter, ships to Beehiiv. Generates LinkedIn and X posts in brand voice, downloads PNG, posts live to the AI4NTP social accounts. "First five likes win X" hook ties the social post to the audience in real time.

The public-facing description on the landing page stays vague ("the marketing tech I've been building all year") to spark curiosity. Internal docs (this file, the operator brief, the run-of-show) nail down the concrete demo so the segment lands.

---

## Giveaways

Giveaways are entertainment moments. They turn an action button into a scene. With the boiler-room format, "per-segment" is fuzzier; each operator runs their giveaway whenever the natural lull arrives in their stream of work.

### Per-operator (one each)

- **Ian's giveaway** (brand kit moment, roughly minute 30): everyone gets the brand kit PDF + Figma file. One live-drawn winner gets a free one-hour brand-and-design session with Ian on their own startup.
- **Alec's giveaway** (site live moment, roughly minute 48): everyone gets the Lovable project + Claude Code repo open-sourced. One live-drawn winner: Alec builds their landing page free, same format.
- **Justin's giveaway** (newsletter shipped moment, roughly minute 45): everyone gets the launch-kit artifacts (newsletter template, social-post templates). One live-drawn winner: Justin runs a fractional-CMO consult and produces a real launch kit for their business.

### Whole-session winner

Drawn at minute 56, before the close. A "starter pack" of every tool used on stage: Figma Pro, Lovable Pro, Claude Code Pro, Vercel Pro, Supabase Pro, plus a PLAUD Note hardware recorder (callback to 001). Sponsor-funded if possible. If we lock 3 of 7 sponsor commitments by Mon Jun 1 dress rehearsal, we can do the full prize. If not, we substitute Justin/Ian/Alec consulting hours and present it as the "AI4NTP starter pack from us directly."

### Future-episode giveaway (Alec's suggestion)

A "brand-kit-generator skill" — a packaged AI workflow that takes logo + colors + fonts as input and outputs a full brand kit. Not built for 002, but a candidate for 003 or 004.

See [sponsor-outreach.md](./sponsor-outreach.md) for the sponsor target list and DM template.

---

## Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| AI tool fails live (rate limit, API outage, bad gen) | Medium | Each operator records a 90-second fallback video of "here is what it would have looked like" before the live. Plays as a smooth segue, not an apology. |
| Audience submits fewer than 5 usable ideas in 90 seconds | Medium | Host throws out 3 seed prompts mid-stream ("what about something for parents," "something with dogs," "something only AI could make work") to prime submissions. Backup: host hand-picks 5 from raw submissions if AI synthesis returns junk. |
| AI synthesis returns junk options | Low | The synthesis prompt is tuned for buildable + funny. Backup: host edits the 5 options inline on the dashboard before flipping to voting. |
| Ian buys a domain that's parked, expensive, or unavailable | Medium | Ian pre-funds Namecheap account, has a $50 cap, and pre-tests three domain variations live on stage so the audience sees the fallback path. If all three are taken, Ian buys a `.co` or `.app` variation as a final fallback. |
| Boiler-room collisions / dead air | Medium | Justin moderates the backchannel actively. Each operator has prepared talking tracks for filler moments. If two operators try to talk at once, Justin breaks the tie verbally. |
| Domain DNS hasn't propagated by minute 51 | Medium | Alec shares the Lovable preview URL instead. Audience can still visit the site at a real URL, just not the bought domain. Domain catches up post-show; recap page uses the bought domain. |
| Ian's brand-kit URL doesn't load for Alec | Low | Ian pastes hex codes + font names + logo PNG directly into Zoom chat as backup. Alec can ingest from chat instead of URL. |
| 60 minutes is too tight for the boiler-room format | Medium | Mon Jun 1 dress rehearsal tests the full overlap end-to-end. If anything overflows, we cut Justin's giveaway moment first (least load-bearing), then Alec's custom-dev component (second least). Never cut the brand kit, the site, or the newsletter. |
| Audience gets confused watching three operators at once | Medium | Justin verbally narrates what each operator is doing every 90 seconds. "Ian is still on color palette. Alec just deployed v1 of the site. I'm pulling in industry sources for the newsletter." This is the moderator's main job in the new format. |
| Justin's launch kit demo feels unclear | Low | The demo is now hard-spec'd (see operator-briefs.md). Vagueness only in public-facing copy. |
| Operators not available | Eliminated as of May 27 | All three confirmed for Jun 2 + Mon Jun 1 rehearsal. |
| Sponsor outreach yields nothing in time | Medium | Build the giveaway plan assuming zero sponsors. Anything we land is upside, not load-bearing. |

---

## What success looks like

Three lagging indicators we will track post-event:

1. **45% live attend rate** (registrant to attendee). Beats the 001 benchmark.
2. **20% live-attendee booking rate.** If 60 people attend live, 12 book a 30-min with at least one operator.
3. **5,000 YouTube views in 30 days.** The boiler-room format has high clip potential. The "we built this company in 60 minutes and the audience picked it" hook drives sustained discovery.

Leading indicators on the day:

- **Submission volume in the first 90 seconds.** Target: 30+ unique ideas. High signal that the format is engaging.
- **Vote spread on the 5 candidates.** Even spread means the synthesis worked. A landslide on one option means the audience picked clearly; either outcome is fine, but >70% on one option signals the synthesis nailed the vibe.
- **Tools-mentioned engagement** (chat reactions when each tool is named). High signal for sponsor renewal interest.

---

## Why we are not doing this

Angles we considered and rejected on the May 27 prep call:

- **Pre-baked Pipeline brief with audience voting on company name + vertical.** Original plan. Killed because it gave away the magic. The pre-baked path made the operators look prepared at the cost of the format's credibility hook. The improv path is harder, less predictable, more honest, and more shareable.
- **Three operators in parallel, racing each other.** Considered as a high-energy alternative. Rejected because racing implies winners and losers; boiler-room implies collaboration. Better optics, same parallelism.
- **Four pre-baked business options the audience picks from.** Same problem as the Pipeline brief. Killed.
- **Pure audience-driven with no AI synthesis (just a vote on the top 5 raw submissions).** Considered. Rejected because raw submissions are noisy; AI synthesis is the value-add that makes the format feel like a show. The synthesis is also a chance to lean into the funny.
- **Lock down Justin's segment to a single specific deliverable for the public landing.** Rejected for the public copy (the curiosity hook is load-bearing). Accepted for the internal operator brief, which now spells out the content-engine demo concretely.
