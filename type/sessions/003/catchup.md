# Episode 003 — 5-minute catch-up

**What it was:** Justin Novak moderated while Ian Kilpatrick walked him through setting up his first AI agent, an OpenClaw, live and from scratch. By the end, a brand-new agent named "Bottle" was alive, connected to Telegram, and running an SEO audit of ai4ntp.com on command.

**Why it matters:** Most people use AI to rewrite emails. Ian runs around a dozen agents that build and operate real businesses. This session showed the actual path from zero to a working agent, the part almost nobody demonstrates end to end.

## The three things that happened

**1. An agent is a "mech suit," not an "employee."** Ian reframed it: OpenClaw is not a robot you micromanage, it is an extension of you. You give it a name, give it your name, give it your rules, and it commits all of that to long-term memory. You talk to it like a person and it acts like one. That relationship is the whole point.

**2. The setup is a one-time sequence, not magic.** Buy a small server (a DigitalOcean VPS, about 18 dollars a month, 2GB of RAM). Harden it (fail2ban to block brute-force bots, a firewall to deny incoming traffic). Install Node and OpenClaw. Plug in a model (the "brain"). Connect it to Telegram so you can talk to it from your phone. You do this once. After that, the agent stays on and works for you, and it can even set up the next agent itself.

**3. Security is the real lesson.** The whole reason this recording stays private is that real API keys and tokens were on screen. Ian's rule: never expose API keys, passwords, or OAuth tokens, and if you ever do, rotate them (expire the old one, issue a new one). His cautionary tale: a leaked SendGrid key once sent 127,000 emails from his address to people in France. Tools like Tailscale (a private VPN funnel) keep sensitive work off the open internet.

## Worth knowing

- **The brain matters.** Ian started on Claude (Opus 4.6) and loved it, but Anthropic blocked OpenClaw from using subscription OAuth tokens on April 4, which got expensive fast. He tried Kimi K2.5 (cheap, but got inconsistent), and now runs ChatGPT 5.5 (GPT-5), which is included in his OpenAI subscription. OpenClaw itself is free and open source (MIT license).
- **Why OpenClaw over Claude Code.** OpenClaw is agentic and deterministic: give it a goal and it finds any way to get there, including fetching what it needs on its own ("let me download headless Chrome first"). It lives on an always-on server, so it can push things live to the internet. Claude Code runs on your local machine and asks for more approvals.
- **Hosted vs local.** A VPS (like we used) is always on, good for websites, marketing engines, and anything that lives online. A local install (on a Mac) is better for private work and for building apps you push straight to your phone with TestFlight.
- **You do not need 12 agents.** One will do. Two is better, because if one goes down (and it will), the other can bring it back to life.
- **Where to start if you are non-technical.** Talk to your bot about what you want to build, and follow the curiosity. It will teach you. Ian has never hand-coded an app, and he has shipped many.

## What Ian has built with it

Ten businesses in ten weeks (January 24 to April 4), including MiniMatch (minimatch.app, a paint tracker for Warhammer players, launched to the App Store), Echo Check (being found by AI / LLM SEO), Another One (anotherone.app, a workout app he rebuilt after canceling a 5-dollar-a-month one), and ongoing builds like Solo Mio (a QuickBooks alternative) and Pedal Map (for guitarists). His main global company, BrandSauce, is heavily built with AI.

## The promised follow-up

Because the video stays private, every registrant gets the **step-by-step OpenClaw setup walkthrough** so you can do this from home on your own time. Justin and Ian are also reviewing every kickoff-poll submission and sending each person a tailored nudge toward their goal.
