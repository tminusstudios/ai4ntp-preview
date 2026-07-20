# Session 006: tools and resources mentioned

"7 AI agents we built to save time, save money, and make more," aired July 12, 2026. Hosts Justin Novak, Ian Kilpatrick, and Alec Saluga.

Grouped by how each tool was actually used across the seven agents, not just who named it.

## Agent runtimes and orchestration

**[OpenClaw](/ai-tools/openclaw)** - The agent runtime behind most of the session. Ian runs named OpenClaws for real work: Atlas (the "king" on his Mac Studio that manages the others and built Echo Check), Saint (on the Saints Classical server), and Saucy plus the Sauce Boss (running BrandSauce). Alec cited NVIDIA's Jensen Huang saying every CEO needs an OpenClaw strategy. *Demoed by Ian, framed by Alec.*

**[Telegram](/ai-tools/telegram)** - How BrandSauce provisions a personal agent for each employee. The SaucyBot flow walks a new user through Telegram's BotFather to create the bot, then pairs it with an API token and a pairing token. *Demoed by Ian.*

## AI visibility (AEO, GEO, SEO)

**[Echo Check](/ai-tools/echo-check)** - Ian's own AEO/GEO/SEO tool, live at [echocheck.app](https://echocheck.app). Plug in a URL for a free "echo score," see how LLMs are citing or mentioning you, map your competitors, and view your site the way an LLM reads it (schema and text, not images or JavaScript). Built with Atlas; started as a private tool called Pulse Check. *Demoed by Ian.*

**Google Search Console** - Ian showed BrandSauce's indexing climb, from roughly 26 pages to over 14,500, as proof the AEO/GEO/SEO work compounds. *Referenced by Ian.*

**AEO / GEO explained** - Answer Engine Optimization (AEO) is putting clear FAQs on your site so AIs can find and reuse the answers. Generative Engine Optimization (GEO) is optimizing for the AI summary at the top of a search result. Ian's plain-English framing during the Echo Check demo. *Explained by Ian.*

## Building the software

**[Claude](/ai-tools/claude)** and **[Claude Code](/ai-tools/claude-code)** - Ian's starting point for the first version of the Saints Classical LMS, brainstorming the design and then building it. *Mentioned by Ian.*

**[Codex](/ai-tools/codex)** - Alec pulled up Codex to show how an agent takes an Apify scraper (a scraper ID plus an API key) and uses it to pull and enrich prospect data. *Demoed by Alec.*

## Data and outbound

**[Apify](/ai-tools/apify)** - A store of off-the-shelf scrapers Alec uses to feed the cold-email agent. He showed a lawyer/attorney lead scraper (he sells to attorneys) and noted you can scrape Facebook pages, TikTok accounts, or Google search results for raw data. Data is the usual bottleneck; Apify removes it. *Demoed by Alec.*

**Instantly** - The cold-email sending software behind Alec's screenshot: about 1,700 prospects, roughly 3,500 emails, 112 opportunities in seven days. It lets you send at scale without burning your personal inbox. *Demoed by Alec.* (Not yet in the AI4NTP tools directory; candidate to add.)

## Visuals, boards, and presentation

**[Higgsfield](/ai-tools/higgsfield)** - Alec generated a quick explainer graphic in Higgsfield about five minutes before going live, as a bonus example of using AI for any presentation or document. *Demoed by Alec.*

**[Figma](/ai-tools/figma)** - Justin's canvas for mapping the content-engine system (the board with the agent icons). *Shown by Justin.*

**Miro** - Alec's board for the iMessage agent walkthrough. *Shown by Alec.* (Not in the directory.)

## LLMs referenced for AI visibility

**[ChatGPT](/ai-tools/chatgpt)**, **[Claude](/ai-tools/claude)**, and **[Perplexity](/ai-tools/perplexity)** - The answer engines Echo Check optimizes for. Ian's point: BrandSauce went from zero demos via these engines to five in a week, all of which became clients. Alec's point: people now ask ChatGPT for a "roofer near me" instead of Googling it, so being the AI's recommended pick is the new opportunity. *Discussed by Ian and Alec.*

## Referenced in passing

**Asana, Slack, Google Docs** - Named as the disconnected tools Justin's Mission Control replaced (Slack is also built directly into Ian's LMS). **Google Classroom, Blackboard, Blackbaud** - The existing LMS products Ian compared against while designing Saints Classical. **NVIDIA** - Jensen Huang's "every CEO needs an OpenClaw strategy" quote. **Mac Studio / Mac Mini** - The hardware Ian runs Atlas on. *All referenced, not demoed.*

## Companies and builds shown

**[Brand Sauce](/ai-tools/brand-sauce)** - Ian's promotional-products company (company stores with no minimums), the proving ground for Echo Check, SaucyBot, and the AI-visibility results. **Saints Classical** - The Middle Tennessee classical tutorial Ian's LMS runs. **Aero AI** - Alec's consultancy behind the iMessage and cold-email agents. *Operator builds.*

## AI4NTP resources

**[AI4NTP tools directory](/ai-tools)** - The running directory of every tool covered across sessions, with a full write-up on each.

**[Book a 15-minute call](/calendar)** - The optional close from the session: a fit call to build a custom agent with Justin, Ian, and Alec. Bring your hardest challenge.
