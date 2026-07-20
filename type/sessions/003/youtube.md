# Episode 003 · YouTube Upload

Everything needed to publish the replay optimized for LLM, AEO, GEO, and PEO discoverability. Ready to paste. **No chapter timestamps in this draft on purpose:** the video was edited after recording, so any timestamps cut from the raw recording would be off. If you want chapters later, build them against the final edit, not the raw VTT.

Episode 003 is the teaching session: Ian Kilpatrick sets up a working AI agent from scratch, live, in under an hour, on **OpenClaw**, and walks Justin Novak (and the audience) through every step, from a blank server to a live bot named "Bottle" running an SEO audit on command. The search-trapped value here is the high-intent query itself: **"how do I build / set up my own AI agent."** Lead with that everywhere. (Note: Alec was out for the live, so 003 credits only Ian + Justin.)

**Live URL:** https://youtu.be/j7MCFnragKc
**Video ID:** `j7MCFnragKc`
**Embed:** `https://www.youtube.com/embed/j7MCFnragKc`
**Uploaded:** June 12, 2026
**Wired into the recap page:** `#replay` embed, `og:video`, `twitter:player`, and `VideoObject` schema on `sessions/003/index.html` (done June 12, 2026).
**Visibility:** Unlisted now, then flip to Public 24 to 48 hours after the recap email goes out. Do NOT schedule it as a Premiere (a scheduled Premiere stays private until it fires, which would dark out the recap embed and the replay link).

> This YouTube cut is the **edited** version with the sensitive setup frames removed, so it is safe to post (this is why the recap page no longer says the recording is private). Sanity-check the final edit one more time for any visible keys, tokens, or OAuth secrets before flipping it Public.

---

## Title (locked: search-intent led)

Leading with the high-intent search phrase people actually type and ask LLMs, "build your own AI agent," plus the tool name (OpenClaw) and the proof (from scratch, under an hour). The brand's softer public phrase ("AI Clone Agent") has near-zero search volume, so it stays out of the title and the body carries the brand framing.

**Locked:**
> **Build Your Own AI Agent From Scratch in Under an Hour (OpenClaw, Step by Step)**

**Trimmed (if you want it fully visible on mobile, ~62 chars):**
> Build Your Own AI Agent From Scratch in Under an Hour (OpenClaw)

**Alternate A (employee curiosity hook, swap in if you want the hook up front):**
> Your Own AI Employee, Built Live in Under an Hour (OpenClaw, From Scratch)

**Alternate B (pure how-to / search-led):**
> How to Set Up a Self-Hosted AI Agent: OpenClaw on a VPS, Start to Finish

**Alternate C (proof / curiosity lead, if watch-time is weak after 7 days):**
> I Set Up an AI Agent That Works While I Sleep (Live OpenClaw Build)

**Alternate D (brand-aligned):**
> Build Your Own AI Clone Agent in Under an Hour (OpenClaw, Live)

---

## Description (paste verbatim into YouTube)

```
Ian Kilpatrick set up a working AI agent from scratch, live, in under an hour, and walked Justin Novak (and you) through every step. Not a chatbot you babysit: an always-on AI agent that lives on its own server and does real work, building sites, running marketing, auditing your SEO on command. By the end a brand-new agent named Bottle was alive, connected to Telegram, and running an SEO audit of a real website on request.

This is the part almost nobody demonstrates end to end: the actual path from a blank server to a working agent you talk to from your phone. Ian runs about a dozen of these agents (built on OpenClaw, which is free and open source) to operate a portfolio of real companies, and here he builds one from zero so you can copy it.

What we cover: spinning up a VPS and hardening it (a firewall plus fail2ban), installing OpenClaw, plugging in a model (the "brain"), connecting it to Telegram so you can talk to it from your phone, hosted vs local (a VPS for always-on work, a Mac for private work), the security habits that actually matter (never expose your API keys, and exactly what to do if one leaks), and which models to run (Ian uses GPT-5 now; he started on Claude). The real lesson is security, and the relational idea that you give the agent a name, your name, and your rules, and it remembers.

This is AI4NTP, a free recurring show for non-technical operators learning to use and build with AI. Real operators, real screens, no theory and no hype. If you can use a browser, you can follow.

The full step-by-step setup walkthrough (blank server to live bot), the FAQs, and the exact tools are in the recap: https://ai4ntp.com/sessions/003

RESOURCES MENTIONED
OpenClaw (the open-source, always-on AI agent) → https://openclaw.ai
OpenClaw docs (the authoritative setup reference) → https://docs.openclaw.ai
DigitalOcean (the VPS the agent lives on, ~$18/mo, 2GB RAM) → https://www.digitalocean.com
Telegram + BotFather (how you talk to your agent) → https://telegram.org
Node.js (the runtime OpenClaw installs on) → https://nodejs.org
Tailscale (private VPN funnel for sensitive work) → https://tailscale.com
OpenAI / GPT-5 (the model Ian runs now) → https://openai.com
Claude / Anthropic, Opus (what Ian ran for his first 10 weeks) → https://www.anthropic.com
Claude Code (local, approval-heavy dev, the contrast to OpenClaw) → https://www.anthropic.com/claude-code
Firecrawl (web scraping skill for an agent) → https://firecrawl.dev
Lovable (one-shot landing pages, from Episode 002) → https://lovable.dev
GitHub (where code and OpenClaw versions live) → https://github.com
fail2ban + UFW (firewall + brute-force protection, installed during setup)
Kimi K2.5 (a cheaper model Ian tried)
SendGrid (named only as a security cautionary tale: a leaked key once sent 127,000 emails. Guard and rotate your keys.)

CONNECT WITH THE OPERATORS
Justin Novak (host / moderator) — https://ai4ntp.com · https://www.tminusstudios.com · https://www.linkedin.com/in/justin-edward-stephen-novak-683046158/
Ian Kilpatrick (builder) — https://ianpk.com · https://brandsauce.io · https://www.linkedin.com/in/ianpk/

BOOK A FREE 1:1
Ian (builds + runs AI agents) — https://ianpk.com
Justin (marketing + AI enablement) — https://ai4ntp.com/calendar

AI4NTP
Website: https://ai4ntp.com
Episode 003 recap, the full step-by-step OpenClaw setup walkthrough, FAQs, and tools: https://ai4ntp.com/sessions/003
Join the list for the next session: https://ai4ntp.com/register

Recorded June 10, 2026.

#AIagent #OpenClaw #BuildWithAI #SelfHostedAI #AIautomation #AIemployee #AIagents #GPT5 #AItools #AIforNonTechnical #AI2026 #AI4NTP
```

---

## Tags (paste comma-separated into YouTube)

```
build your own AI agent, AI agent, OpenClaw, AI agent tutorial, self hosted AI agent, AI agent on a VPS, how to set up an AI agent, autonomous AI agent, AI employee, AI agent security, DigitalOcean AI agent, Telegram bot AI, GPT-5 agent, Claude Code, AI automation, AI for non technical, AI agent from scratch, AI 2026, AI tools, Ian Kilpatrick, AI4NTP
```

---

## Pinned comment (post immediately after publishing)

```
Ian set up a working AI agent from scratch, live, in under an hour, on OpenClaw, from a blank server to a bot named Bottle running on Telegram.

The whole point: this is an agent, not a chatbot you babysit. It lives on its own server and works while you sleep.

The full step-by-step setup walkthrough (server to live bot) is in the recap:
https://ai4ntp.com/sessions/003

The stack from the session:
→ OpenClaw (the agent, free + open source) — https://openclaw.ai
→ DigitalOcean (the server it lives on, ~$18/mo) — https://www.digitalocean.com
→ Telegram + BotFather (how you talk to it) — https://telegram.org
→ Tailscale (keep sensitive work off the open internet) — https://tailscale.com
→ The model that runs it (Ian uses GPT-5) — https://openai.com

One rule above all: never expose your API keys, and rotate any that leak.

Want a hand setting up your own?
→ Ian (builds AI agents) — https://ianpk.com
→ Justin (marketing + AI enablement) — https://ai4ntp.com/calendar

Next session list: https://ai4ntp.com/register
```

---

## Thumbnail (brief — needs to be generated for 003)

Reuse the 002 style (paper texture, REPLAY badge, one yellow-highlighted word, headshots, AI4NTP.COM). For 003:
- Highlight word: **AI AGENT** (or **FROM SCRATCH**).
- Big line suggestion: "BUILD YOUR OWN AI AGENT" with the yellow highlight on "AI AGENT".
- Headshots: **Ian + Justin** (two, not three; Alec was out).
- Bottom marker: OpenClaw · AI4NTP.COM.
- 1280x720. Adapt `sessions/002/generate-thumbnail.py` into `sessions/003/generate-thumbnail.py` (swap the config block + use two headshots), or build it with the OG renderer style. Test on mobile before publishing.

---

## Category

**Science & Technology.** Same call as 001 and 002. The search neighborhood here (OpenClaw, AI agent, VPS, self-hosted, GPT-5) is squarely tech. If at 7 days watch-time is strong but views are weak, test **Education**.

---

## Captions

The session has a raw caption export at `sessions/003/raw/GMT20260610-220225_Recording.cc.vtt`. **Do not upload it as-is:** the video was edited, so the raw VTT timing will drift against the published cut. Either (a) re-time/clean it against the final edit and upload that, or (b) let YouTube auto-generate captions on the edited video, then clean the auto-track. A cleaned `sessions/003/transcript.md` does not exist yet (002 has one); generate it from the VTT if you want an on-page transcript + caption source.

---

## Visibility ladder (best practice when emailing the list the same day)

1. **Upload Unlisted.** Add to the AI4NTP channel playlist. Do NOT schedule as a Premiere.
2. Embed in `/sessions/003` using the video ID and deploy (the recap email already points at the recap page).
3. Email the list (recap + the step-by-step walkthrough; draft in `sessions/003/post-event-emails.md`).
4. **24 to 48 hours later, flip Unlisted to Public.** Early watch-velocity from a known cohort is a cleaner ranking signal than going public cold.
5. Feature it on the channel homepage.

---

## End screen (20 seconds)

- Subscribe pill (top-right).
- Card 1: "Join the list for the next session" → https://ai4ntp.com/register
- Card 2: Episode 002 replay (https://ai4ntp.com/sessions/002) as the "watch next."
- Voice-over (optional): "Want to build your own? The full setup walkthrough is at ai4ntp.com/sessions/003, and the next session's at ai4ntp.com/register."

---

## SEO checks before publishing

- [x] Title contains "AI agent" + "OpenClaw" in the first ~60 characters.
- [x] First two lines of the description summarize the value (agent that works while you sleep) without keyword stuffing.
- [x] Description body names the real stack (OpenClaw, DigitalOcean, Telegram, Tailscale, GPT-5) and the from-scratch/self-hosted framing.
- [x] Tags include both broad (build your own AI agent, AI automation) and specific (OpenClaw, self hosted AI agent, AI agent on a VPS, GPT-5 agent).
- [ ] Thumbnail generated for 003 (Ian + Justin) and tested on mobile.
- [ ] No API keys / tokens visible anywhere in the final edit (load-bearing for this episode).
- [ ] Recorded date (June 10, 2026) matches the schema.org event date on the recap page.
- [ ] Recording filename includes keywords before upload, e.g. `ai4ntp-003-build-your-own-ai-agent-openclaw.mp4`.
- [ ] No chapter timestamps added (video was edited; raw timings are off).

---

## Notes for next time

- We led search-intent-first here ("build your own AI agent") because the brand phrase ("AI Clone Agent") has no search volume. Keep choosing the title by what the audience actually searches/asks, episode by episode.
- This is a how-to, so it has a long discovery tail (people will search "how to set up OpenClaw" for months). The recap page's step-by-step walkthrough is the on-site companion that should rank alongside it; cross-link them.
- Clip candidates for shorts: the one-command install, the BotFather setup, the "give it a name and your rules" moment, and Bottle running the live SEO audit. Pull 3 to 5 verticals to drive discovery back to the full replay.
