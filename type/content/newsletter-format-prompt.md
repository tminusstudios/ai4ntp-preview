# Newsletter format prompt (reusable)

Paste the block below into a fresh chat whenever you want to design or refine the AI4NTP
newsletter format. It is self-contained: it carries the brand voice, the card system, and the
deliverable spec, so it works without any prior context.

---

You are my brand and editorial partner for **AI4NTP**, a free weekly live series and newsletter that teaches non-technical operators how to actually use and build with AI. Help me lock a repeatable weekly newsletter format with a named "section banner" for each part. I design the banner cards myself, so I need the structure, the names, and on-brand copy, NOT code.

**Who we are:** Audience is non-technical operators (marketers, founders, ops) trying to keep up with AI. Positioning: "AI for Non-Techy People." Real operators show exactly how they use and build with AI. Brand line: "Translators, not oracles." Ships weekly on Beehiiv to everyone who registers for a session.

**Voice (hard rules):** Never use em dashes (use commas, periods, parentheses, or restructure). Direct, declarative, slightly understated. No hype, no hedging. Specific over generic (names, numbers, real outcomes). Plain English a smart non-technical person gets instantly.

**Visual system (so your copy fits the cards I build):** Each section gets a card on ink (#0F1113) or paper (#F4F1EA) with subtle grain. A mono eyebrow in JetBrains Mono, UPPERCASE, wide tracking, prefixed with "//" (e.g. // PROMPT OF THE WEEK), in lime-deep #A8D000. A Fraunces serif headline with AT MOST ONE word highlighted in a lime (#D4FF3A) box. A small lime dot + "AI4NTP" wordmark in a corner. Lime is used sparingly, one highlight per card.

**Recurring signature cards we already have (keep these):** "AI Decoded" (jargon translator: eyebrow TRANSLATOR, a struck-through jargon term, then IN PLAIN ENGLISH with the simple meaning); "Prompt of the Week" (a copy-paste prompt in a little terminal mockup, plus one line on what it does); a quote card (a great line from the last session); a "get involved" CTA card.

**The format I'm leaning toward (refine it, push back if you have better):** 1) Intro/hello, 2) Headlines of the week, 3) Recap from last session, 4) Sponsor, 5) Something fun, 6) CTA get in touch. I want hybrid naming: clear functional sections PLUS the signature named cards slotted in. I also like an "AI for ___" series (AI for non-techies / techies / fun / science / sponsor) but I am not sure if that should be the whole skeleton or just one rotating slot. Help me decide.

**Deliver, in this order:**
1. A recommended weekly section lineup and order, with a one-line rationale for each, and where the signature cards live. Tell me whether "AI for ___" works better as a rotating spotlight slot or the whole system, and why.
2. For EACH banner: the "// MONO EYEBROW", the Fraunces headline (mark the one lime-highlight word), a one-line description of the body, and 2 alternate name options. Keep banners evergreen (no dates baked in).
3. A top-to-bottom wireframe of a sample issue (banner, then what sits under it).
4. A reusable per-issue production checklist (what I swap weekly vs what stays fixed) and a subject-line + preview-text formula.
5. Flag what will feel repetitive over 8 weeks and how to keep it fresh.

Constraints recap: no em dashes, one lime highlight per banner, plain English, evergreen banner copy. Use tables where they help me scan. Ask me up to 3 questions first if something material is unclear; otherwise give me your best version and I will react.

---

## How to use this

- Paste everything between the two `---` rules. Edit the "format I'm leaning toward" line if your
  thinking changes.
- A recommended starting format already exists at [`newsletter-format.md`](./newsletter-format.md);
  paste that in alongside this prompt if you want the model to refine a draft instead of starting fresh.
- Swap "weekly" for your real cadence if it changes.
