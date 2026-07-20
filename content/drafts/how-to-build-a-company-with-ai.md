# How to Build a Company With AI in Under an Hour (The Live Playbook)

> **DRAFT for review.** Target query: "build a company with AI" / "build a startup with AI" / "how to build a business with AI." Intent: informational how-to (TOFU/MOFU). Suggested URL: `/blog/build-a-company-with-ai` (or `/field-notes/...`). ~1,300 words. Built from the real Episode 002 record (the GotoBuild build). Internal links point at `/ai-tools/*`, `/sessions/002`, `/register`. When approved, I'll build it as an HTML page with `Article` + `HowTo` schema and deploy.

---

"Build a company with AI" sounds like a hook. So we did it on stage, in real time, in front of a live audience, with no script and no pre-built brief.

On [AI4NTP Episode 002](https://ai4ntp.com/sessions/002), the audience picked the idea live. At minute six, the room voted and the brief locked: **GotoBuild**, an AI workout planner with a yellow banana-barbell mascot. The company did not exist a minute earlier. Fifty-some minutes later it had a brand, a website on a real domain, and a working go-to-market motion.

Here is the exact playbook, in the order we ran it, so you can repeat it yourself. It breaks into three 15-minute phases.

## Phase 1: A brand identity in 15 minutes

Brand is where most non-technical founders freeze. It is also the fastest thing to build with AI now.

Ian Kilpatrick ran it in four moves:

1. **Moodboard for direction.** Start on [Behance](https://ai4ntp.com/ai-tools/behance) to read what good looks like in your space, then generate visual directions in [Midjourney](https://ai4ntp.com/ai-tools/midjourney). Free and about $29 a month, respectively.
2. **Generate the logo.** Take the Midjourney reference into [ChatGPT](https://ai4ntp.com/ai-tools/chatgpt) and iterate to a final mark. (The audience chose the banana; the barbell made it a workout brand.)
3. **Produce the full kit.** Ian handed the brief to his self-hosted AI agent, [OpenClaw](https://ai4ntp.com/ai-tools/openclaw), which published a complete brand kit, logo, palette, type system grounded in a font from [Google Fonts](https://ai4ntp.com/ai-tools/google-fonts), photo direction from [Pexels](https://ai4ntp.com/ai-tools/pexels), to a live URL.
4. **Buy the domain, live.** A quick check on [Instant Domain Search](https://ai4ntp.com/ai-tools/instant-domain-search), then he bought gotobuild.pro on [Namecheap](https://ai4ntp.com/ai-tools/namecheap) on stage for **one cent.**

Total recurring cost of that brand stack: **about $50 a month.** Time: about 15 minutes.

## Phase 2: A real website on a real domain in 15 minutes

A pretty page is easy. A page that *does something* is where most no-code stops. Alec Saluga showed both, at once.

He built the marketing site **two ways in parallel** to settle a common question: [Lovable](https://ai4ntp.com/ai-tools/lovable) versus [Claude Code](https://ai4ntp.com/ai-tools/claude-code). Both were fed the same two inputs:

- Ian's brand kit URL, so the site matched the brand.
- A full-page screenshot of a reference site, captured with [Fireshot](https://ai4ntp.com/ai-tools/fireshot), pasted in as context.

He prompted the whole thing by voice using [Wispr Flow](https://ai4ntp.com/ai-tools/wispr-flow), then wired in a **working AI workout-plan generator** with an API key and deployed live to the domain Ian had just bought.

The room voted on which build looked better, and it split. Alec's rule of thumb is the takeaway worth keeping:

> **Lovable for a fast site. Claude Code for real functionality.**

If you only need a clean landing page, start with Lovable. The moment you need a feature that actually runs, like an app that returns a result, reach for Claude Code (and a backend like [Supabase](https://ai4ntp.com/ai-tools/supabase) when you need data, auth, or APIs).

## Phase 3: A go-to-market motion in 15 minutes

A product nobody hears about is a hobby. The third phase is the one most teams skip, and the one that decides whether the first two mattered.

Justin Novak stood the launch up in a content engine:

1. **Set the brand voice** from Ian's kit, so everything sounds like one company.
2. **Pull in sources** worth writing about.
3. **Draft a full newsletter** in that voice, for about **20 cents** in AI cost, and ship it to [Beehiiv](https://ai4ntp.com/ai-tools/beehiiv), the platform where you own the audience instead of renting reach.
4. **Waterfall it.** From that one newsletter, generate on-brand blog posts (about 30 cents for three) and social cards (about 5 cents each).

The frame Justin gave the room: "build it and they will come" is a fallacy. The middle of the funnel, the nurture, is where most teams lose. A newsletter plus AI is how you actually run it every week without a content team.

## What it cost, all in

The point of the live was not the workout app. It was the price tag.

| Piece | Cost |
|---|---|
| Brand stack (Midjourney, ChatGPT; Behance, Pexels, Google Fonts free) | ~$50 / month |
| Domain (gotobuild.pro, promo) | one cent |
| Newsletter draft | ~20 cents |
| Three blog posts | ~30 cents |
| One social post | ~5 cents |

A complete company, built in under an hour, for roughly the cost of a coffee plus a $50 monthly stack you mostly already have.

## The repeatable order of operations

If you take one thing, take the sequence. It works because each phase feeds the next:

1. **Brand first** (moodboard, logo, kit, domain). It becomes the input for everything else.
2. **Site second** (fed the brand kit and a screenshot, built fast, then made functional).
3. **Go-to-market third** (voice set from the brand, newsletter shipped, waterfalled to blog and social).

None of it required an engineer, a designer, or a growth team. It required knowing which tool to reach for at each step, and a willingness to ship the same day.

## See it yourself

Reading the playbook is one thing. Watching three operators build it live, with the audience picking the brief, is another.

- **[Watch the Episode 002 replay](https://ai4ntp.com/sessions/002)** to see the whole build, with timestamps.
- **[Browse every tool we used](https://ai4ntp.com/ai-tools)**, with who used it and what it cost.
- **[Save a seat for the next live session](https://ai4ntp.com/register).** AI4NTP runs free, every week. The next one builds an AI employee from scratch.

The line we closed Episode 002 on still holds: the only limitation is your imagination.
