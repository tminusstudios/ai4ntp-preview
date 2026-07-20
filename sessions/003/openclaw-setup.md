# The OpenClaw Starter Kit

Set up your own AI agent, step by step, from a blank server to a live bot you talk to on Telegram. This is the exact path Ian walked Justin through on Episode 003, written so you can do it from home at your own pace.

A note before you start: OpenClaw moves fast and updates often, so a command or prompt may look a little different by the time you run it. When something does not match, the authoritative source is the official docs at [docs.openclaw.ai](https://docs.openclaw.ai), or you can ask your bot to check the GitHub repo. The server-setup commands below are standard and do not change.

**What you need**
- A DigitalOcean account (or any VPS provider)
- A model subscription or API key (OpenAI or Anthropic)
- Telegram installed on your phone
- About 30 to 60 minutes

**What it costs**
- The server: about 18 dollars a month (2GB of RAM is the recommended minimum)
- The model: your existing OpenAI or Anthropic subscription. Ian spends about 100 dollars a month on OpenAI and stays well under the limit.

**One rule above all:** never expose API keys, passwords, or OAuth tokens. If one ever leaks, rotate it immediately (expire the old one, issue a new one). This is the single most important habit, and it is the reason our live recording stays private.

---

## Step 1. Spin up the server

1. In DigitalOcean, click **Create**, then **Droplet**.
2. Choose **Ubuntu** as the image.
3. Pick a **Basic** plan with at least **2GB of RAM** (about 18 dollars a month). 2GB is the minimum; **4GB runs smoother** if you plan to do browser-based work like SEO audits or heavier automation.
4. Set a root password (DigitalOcean requires one). Create the droplet.
5. Open the droplet's **web console**. That is the in-browser terminal, the black window with straight code. Every command below runs there.

A server is just a small piece of always-on real estate on the internet. It is where your agent will live so it can keep working when your laptop is closed.

## Step 2. Update and harden the server

Paste this in, then run it. It updates everything and installs the basics plus fail2ban (which bans bots that try to brute-force their way in):

```bash
sudo apt update && sudo apt -y upgrade
sudo apt install -y ufw fail2ban unattended-upgrades curl git ca-certificates build-essential
sudo systemctl enable --now fail2ban
sudo dpkg-reconfigure -plow unattended-upgrades
```

Now set up the firewall, a wall of protection that denies incoming traffic while still letting you in over SSH:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw --force enable
sudo ufw status verbose
```

The moment a server goes online, spam and crypto bots start pinging it. fail2ban watches for repeated failed logins and bans the offending IP for about 24 hours. The firewall keeps everything else out.

## Step 3. Create a working user (recommended)

Running as root all the time is risky. Create a dedicated user and carry your SSH access over:

```bash
sudo adduser openclaw
sudo usermod -aG sudo openclaw
sudo rsync -a --chown=openclaw:openclaw ~/.ssh /home/openclaw/
```

## Step 4. Install Node, then OpenClaw

OpenClaw runs on Node.js (version 24 recommended, 22.19 or newer supported). Install it system-wide, still as root:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

Now **switch into the `openclaw` user** you created in Step 3, so OpenClaw installs and runs under the right home directory. Its config and workspace live in `~/.openclaw`, and you do not want that under root.

```bash
su - openclaw
```

Then install OpenClaw with the official one-liner and confirm it:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
openclaw --version
```

## Step 5. Onboard and plug in the brain

OpenClaw is just the harness. It needs a model to think. Run the guided setup:

```bash
openclaw onboard --install-daemon
```

The wizard walks you through choosing a provider (OpenAI, Anthropic, Google, or a local model), supplying your login or API key, and bringing up the Gateway. Two things to know:
- **Subscription login (OAuth)** uses your existing plan. **An API key** bills per token, what Ian calls "extra usage," and can add up fast. A ChatGPT or Claude subscription is not always the same as API access, so follow whichever option `openclaw onboard` actually offers you.
- At the session, Ian was running **ChatGPT 5.5 (GPT-5)** through his OpenAI subscription. He started on Claude (Opus 4.6), but Anthropic blocked OpenClaw from using subscription tokens, so he switched.

You will hit a disclaimer that OpenClaw can do almost anything once you give it access. That lack of guardrails is the whole point. You set the rules in Step 9.

## Step 6. Create your Telegram bot

Telegram is the easiest way to talk to your agent (WhatsApp, Slack, Discord, Signal, and iMessage also work).

1. In Telegram, search for **@BotFather** and press **Start**.
2. Send `/newbot`.
3. Give it a display name (for example, "Bottle").
4. Give it a unique username ending in `bot` (for example, `bottle_yourname_bot`). It has to be unique.
5. BotFather hands you a **bot token** that looks like `123456:ABC-...`. Copy it. Treat it like a house key, keep it off-screen and never paste it anywhere public.

## Step 7. Give OpenClaw the token

The durable way is to let the onboarding wizard prompt you for the bot token. It saves it to `~/.openclaw/openclaw.json` under `channels.telegram.botToken`, which survives restarts. If you skipped that, add it to the config file directly:

```json5
{ channels: { telegram: { enabled: true, botToken: "123:abc", dmPolicy: "pairing" } } }
```

You can set `TELEGRAM_BOT_TOKEN` in the shell for a quick test, but it only applies to the current shell and the default account, so it will not survive a daemon restart. See [docs.openclaw.ai/channels/telegram](https://docs.openclaw.ai/channels/telegram).

## Step 8. Start the gateway, then pair

Start the gateway (you installed it as a daemon during onboarding, so use the service command) and confirm it is up:

```bash
openclaw gateway start
openclaw gateway status
```

You should see it listening on port 18789. Now open your bot in Telegram and **send it a message** ("hi"). That message is what generates a pairing request. Back on the server, list it and approve it:

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

Pairing codes expire after one hour, so do this promptly. Once approved, your bot replies, it is alive.

To run the gateway in the foreground instead of as a daemon, use `openclaw gateway run`. If it ever dies (you closed the terminal, or got logged out), run `openclaw gateway restart`. You can even tell the bot, "do whatever you need to stay alive so I can close this window."

## Step 9. Give it a name, your name, and its rules

This is the part that makes it feel like an extension of you instead of a tool. Your first real message sets its identity and it commits this to long-term memory:

> Your name is Bottle. My name is Justin. You help me with revenue operations and content. Never touch anything on a production server without my approval first.

From then on it remembers, and for production work it will say "here is what I will do once you approve" instead of just doing it.

## Step 10. Put it to work

Try a few things to feel the power:
- "What does your server look like?" (it inspects the box and reports the specs)
- "Do an SEO audit of my website." (it will fetch what it needs, even downloading a headless browser on its own)
- "Brainstorm this app idea with me and write a build spec before you build anything."

---

## Nuances worth knowing (learned the hard way)

- It reads queued messages in order. If you fire off five "are you there?" messages, it answers each one. Tell it to batch them if you tend to do that.
- If you give a command and then say "wait, no," it usually finishes the action first, then rolls it back.
- You do not need 12 agents. One will do. Two is better, because if one goes down (and it will), the other can bring it back to life.
- Hosted vs local: the VPS in this guide is always on, best for websites, marketing engines, and monitoring. A local install on your Mac is better for private work and for building apps you push straight to your phone with TestFlight.

## Security recap

- Never expose API keys, passwords, or OAuth tokens. Rotate any that leak.
- Keep fail2ban and the firewall on.
- Use [Tailscale](https://tailscale.com) (a private VPN funnel between your computer and the server) for sensitive or competitive data you do not want on the open internet.

## If something's off

A few commands to diagnose: `openclaw status --deep` and `openclaw health` for an overall check, `openclaw logs --follow` to watch what it is doing in real time, and `openclaw doctor` to surface configuration problems.

## Official references

- OpenClaw: [openclaw.ai](https://openclaw.ai)
- Docs: [docs.openclaw.ai](https://docs.openclaw.ai)
- Telegram setup: [docs.openclaw.ai/channels/telegram](https://docs.openclaw.ai/channels/telegram)
- Getting started: [docs.openclaw.ai/start/getting-started](https://docs.openclaw.ai/start/getting-started)

Stuck? Email justin@ai4ntp.com and we will help you troubleshoot.
