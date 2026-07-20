# Episode 003 — FAQs

Pulled from questions asked live in the chat. Answers in the AI4NTP voice.

**Will this be recorded, and can I rewatch it?**
The recording is staying private this time. Real API keys and tokens were on screen during the live setup, and publishing that would put our accounts (and the method) at risk. Instead, every registrant gets the full step-by-step OpenClaw setup walkthrough in writing, so you can follow along from home at your own pace. (Asked by several attendees, including Jude, Tobe, Darion, and Rony.)

**Do I have to run all that code every time I use it?**
No. The server setup is a one-time thing. DigitalOcean is just a computer that stays on, so you harden it and install OpenClaw once. After that the agent is always there, and you can even have it install more agents for you. (From a live attendee, David.)

**Does this work with Microsoft or Windows? I work off a MacBook.**
The device you sit at does not really matter, because the agent lives on a Linux (Ubuntu) server, not on your laptop. Ian ran it from a MacBook through DigitalOcean. OpenClaw works best with Mac or Linux; a local Windows install was not covered on this call. (From live attendees Jean and Donald.)

**Can it connect to my Google email, Docs, and Calendar?**
Yes. Once you give it access (you set it up as a user), it can read and make changes across Gmail, Google Docs, and Google Calendar. Ian set one up for his daughter that worked inside her Google workspace. (From a live attendee, Mara.)

**Which model should I use, and what will it cost?**
Ian started on Claude (Opus 4.6) and loved it, but Anthropic blocked OpenClaw from using subscription tokens, so he switched. He now uses ChatGPT 5.5 (GPT-5), which is included in his OpenAI subscription, about 100 dollars a month and he stays well under the limit. Kimi K2.5 is a cheaper option but got inconsistent for him. The server itself is about 18 dollars a month. OpenClaw is free.

**Is it safe? What is the biggest risk?**
The biggest risk is exposing API keys, passwords, or OAuth tokens. Never share them, and if one leaks, rotate it (expire the old, issue a new one). Beyond that, harden the server with fail2ban and a firewall, and use Tailscale for anything sensitive. OpenClaw is powerful because it has almost no guardrails, which is exactly why you set the rules.

**How is this different from just using a Claude or ChatGPT app?**
A chat app is local and clunkier: you copy code, upload files, and babysit approvals. OpenClaw is unhinged by comparison (no guardrails) and lives on an always-on server, so it can build whole websites, charts, and tools and push them live. You can message it from the car and come home to a finished web platform. It is far more autonomous. (From live attendees Jamie and others.)

**OpenClaw or Claude Code, when do I use which?**
Claude Code (Justin's daily driver) is great for local building and asks for more approvals. OpenClaw is agentic, always on, and server-side, so reach for it when you want an agent that runs your work continuously and can act on the internet without hand-holding.

**Do I need 12 agents like Ian?**
No. One will do. Two is better, because if one goes down (and it will), the second can bring it back to life.

**Can an AI agent just set this whole thing up for me?**
Yes, if it has access to your server or computer. That is how Ian spins up new agents now: he tells an existing one to start OpenClaw on a server and it handles it. The first one is the hardest; after that it gets much easier.

**I am completely new and this looks daunting. How long to learn?**
The most technical part is the one-time Telegram pairing; the rest is mostly running setup steps. The best way to learn is to talk to your bot about what you want to build and follow the curiosity, it will teach you. Ian has never hand-coded an app and has shipped many. (From live attendees Darion and Jean Rebel.)

**Can it build me an app from an idea?**
Yes. Start by brainstorming with the bot, do not let it build yet. Have it help you write a build spec (audience, goals, even revenue targets), and once you are happy with the plan, tell it to build. A locally installed agent can even push the app straight to your phone. (From a live attendee, Jean Rebel.)
