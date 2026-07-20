# Episode 003 — Tools and resources

Everything named on the call, what it is, and why it came up. This is the stack for setting up your own OpenClaw.

## The core stack

**OpenClaw** (openclaw.ai) — The star of the session. An open-source, always-on AI agent (a "harness" you wrap around a model) that lives on a server and does real work for you: building sites, running marketing, managing accounts. Agentic and deterministic, it figures out how to get a job done and fetches what it needs on its own. Free, MIT-licensed. Ian runs about 12 of them.

**DigitalOcean** (digitalocean.com) — The VPS (virtual private server) the agent lives on. Think of it as renting a small piece of always-on real estate on the internet. We used an 18-dollar-a-month server with 2GB of RAM (the recommended minimum). Ian's pick out of habit, not a sponsorship, any comparable VPS works.

**Telegram + BotFather** (telegram.org) — How you talk to your agent. Inside Telegram you message BotFather, run `/newbot`, name it, and get a bot token that pairs your agent to a chat. Ian's favorite channel because it is the easiest. WhatsApp, Slack, and Messages also work.

**A model (the "brain")** — OpenClaw is just the harness; it needs a model to think. Options discussed below.

## Securing the server

**fail2ban** — Watches for repeated failed logins (crypto and spam bots start pinging any new server immediately) and bans the offending IP for about 24 hours. One of the first things to install.

**UFW (Uncomplicated Firewall)** — The server firewall. Set it to deny incoming and allow outgoing, a wall of protection against low-level bot spam.

**Tailscale** (tailscale.com) — A private VPN "funnel" between your computer and your server, so only your IP can reach it. Use it for competitive or financial data you do not want on the open internet. Ian runs it on his phone too.

**Node.js and npm** (nodejs.org) — The runtime OpenClaw installs and runs on. Installed once during setup.

## The models (brains) discussed

**OpenAI GPT-5 / ChatGPT 5.5** (openai.com) — What Ian uses now. Included in his OpenAI subscription, so it does not burn extra tokens. He spends about 100 dollars a month and stays well under the usage limit.

**Claude / Anthropic, Opus 4.6** (anthropic.com) — What Ian ran for his first 10 weeks and loved. On April 4, Anthropic blocked OpenClaw from using subscription OAuth tokens, which pushed him to pay-per-token (expensive) and then to switch models.

**Kimi K2.5** — A cheaper alternative model he tried. Good for a bit, then got inconsistent.

## Adjacent tools that came up

**Claude Code** (claude.com/claude-code) — Justin's daily driver for building apps, RevOps, and marketing. Runs locally and asks for more approvals. The contrast that explains when to reach for OpenClaw (always-on, server-side, near-zero approvals) instead.

**Lovable** (lovable.dev) — One-shot landing pages, fast and clean. Alec used it to build a site in about 10 minutes in Episode 002. Good when you do not need fine control.

**Figma + Claude (Figma MCP)** (figma.com) — For designers who want more control over the dials than a one-shot tool gives. Ian, a classical designer, prefers hands-on tools like this.

**Firecrawl** (firecrawl.dev) — Web scraping at scale, a great skill to give an agent that needs to read a lot of pages.

**Whisper** — A speech skill (text-to-speech and speech-to-text) you can add to an agent. Alec used it on a prior call.

**SendGrid** (sendgrid.com) — Bulk email sending. Came up as a security cautionary tale: a leaked SendGrid key once sent 127,000 emails from Ian's address. Lesson, not a recommendation: guard and rotate your keys.

## For building and shipping apps

**GitHub** (github.com) — Where code and OpenClaw versions live. A server-based agent pushes code here; a local agent can build and run it directly.

**TestFlight, Xcode, Android Studio** — If you install OpenClaw locally on your Mac, it can build an app and push it straight to your phone (TestFlight for Apple).

## Built with OpenClaw (Ian's examples)

MiniMatch (minimatch.app), Another One (anotherone.app), Echo Check (LLM SEO), Pedal Map, Solo Mio (a QuickBooks alternative), and his global company BrandSauce (brandsauce.io). Ten businesses in ten weeks.
