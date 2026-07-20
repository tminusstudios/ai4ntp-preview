# AI4NTP Brand Kit (agent-ready)

A single reference for an AI agent (e.g. OpenClaw) to design on-brand assets, especially thumbnails. Everything here is the canonical AI4NTP system pulled straight from the live site. Public assets are linked by URL so an agent on a server can fetch them directly.

AI4NTP = "AI for Non-Techy People." Site: https://ai4ntp.com

---

## 1. The look in one sentence

Warm off-white "paper" backgrounds with a fine film-grain texture, a serif (Fraunces) display headline where **exactly one word is set in italic and highlighted in lime green**, the `ai4ntp` wordmark with its `4` sitting in a lime box, and mono-type labels. Editorial, confident, slightly understated. Not a typical bright-SaaS look.

---

## 2. Logos

All logos are public SVGs at the site root. Pick by background:

| File | URL | Use on | What it is |
|---|---|---|---|
| `logo-primary-dark.svg` | https://ai4ntp.com/logo-primary-dark.svg | **light** backgrounds | ink (`#0F1113`) `ai4ntp` wordmark |
| `logo-primary-light.svg` | https://ai4ntp.com/logo-primary-light.svg | **dark** backgrounds | cream (`#FAF7F0`) `ai4ntp` wordmark |
| `logo-stacked.svg` | https://ai4ntp.com/logo-stacked.svg | light, tight spaces | vertical lockup, `4` in a lime box |
| `logo-monogram.svg` | https://ai4ntp.com/logo-monogram.svg | icons, avatars, favicons | just the `4` in a lime (`#D4FF3A`) box |
| `logo-expressive.svg` | https://ai4ntp.com/logo-expressive.svg | bold/expressive moments | lime-forward variant |

**Wordmark rule:** it is always `ai` + `4` + `ntp` set in Fraunces (700). The `4` sits inside a lime `#D4FF3A` rounded box and is italic. Never recolor the wordmark, restretch it, or remove the lime `4` box.

Other brand imagery (public): app icons `https://ai4ntp.com/icon-192.png`, `/icon-32.png`, `/apple-touch-icon.png`; social avatars `/ai4ntp-x-avatar.png`, `/ai4ntp-x-avatar-yellow.png`; share image `/og-image.jpg`.

---

## 3. Color palette

| Name | Hex | Role |
|---|---|---|
| Ink | `#0F1113` | near-black; primary text, dark backgrounds |
| Ink Soft | `#1C1F23` | secondary dark surfaces |
| Paper | `#F4F1EA` | warm off-white; the default background |
| Paper Warm | `#EDE7DA` | muted secondary background |
| Cream | `#FAF7F0` | cards and panels on paper |
| **Signal** | `#D4FF3A` | the lime highlight; the signature pop. Use sparingly, on ONE thing at a time |
| Signal Deep | `#A8D000` | darker lime for small accents, bars, links |
| Rust | `#C4471C` | orange-red accent; live dots, sparing emphasis |

Default combo: **Ink text on Paper**, with **Signal** as the single highlight. For dark layouts: **Cream/Paper text on Ink**, Signal still the highlight. Rust is an accent only, never a background.

---

## 4. Typography

Load from Google Fonts (all free):
`https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap`

| Font | Role | Notes |
|---|---|---|
| **Fraunces** (serif) | Headlines, display | Weight 300 for big light headlines, up to 700 for the wordmark. Optical sizing on. Tight letter-spacing (about -0.025em). |
| **Instrument Serif** (italic) | The highlighted word | This is the font used for the single lime-highlighted italic word inside a Fraunces headline. |
| **JetBrains Mono** | Eyebrows, labels, tags, metadata | UPPERCASE, wide letter-spacing (~0.16em), 10 to 12px. |
| System sans | Body copy | -apple-system / Helvetica Neue / Arial. Fraunces and the mono carry the brand; body stays neutral. |

**The signature headline treatment:** a Fraunces headline in Ink, with one key word swapped to **Instrument Serif italic on a lime `#D4FF3A` highlight box**. Example: "The tools we actually used, *live.*" (where *live.* is the italic lime-highlighted word).

---

## 5. Texture (film grain)

Every surface carries a subtle fractal-noise grain at ~0.3 opacity, `mix-blend-mode: multiply`. To replicate, overlay this SVG:

```
data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E
```

Keep it subtle. It should read as paper texture, not visible noise.

---

## 6. Voice and tone

- **Never use em dashes (—).** Use commas, periods, parentheses, or restructure. This is non-negotiable in all copy.
- Direct, declarative, slightly understated. No hype, no hedging.
- Specific over generic. Names, numbers, real outcomes.
- Built for non-technical operators learning AI. Plain English, no jargon walls.
- Brand line: "Translators, not oracles."

---

## 7. Thumbnails (YouTube + social)

**Canvas:** 1280 x 720 (YouTube). For OG/social cards use 2400 x 1260. Design at 2x for crispness.

**Recipe (the AI4NTP thumbnail formula):**
1. **Background:** Paper `#F4F1EA` with the grain overlay. (Or Ink `#0F1113` for a dark variant.)
2. **Eyebrow (top):** a short JetBrains Mono line, UPPERCASE, wide tracking, low opacity. e.g. `EPISODE 003 · OPENCLAW` or `// AI FOR NON-TECHY PEOPLE`.
3. **Headline (the hero):** big Fraunces, weight 300 to 400, Ink. Keep it to a few words. Highlight **one** word in Instrument Serif italic on a lime `#D4FF3A` box.
4. **People (optional):** operator headshots as circular, **grayscale + slight contrast**, in a small row or overlapping stack. (Headshots live at `https://ai4ntp.com/sessions/001/images/<name>.jpg`, e.g. `ian-kilpatrick.jpg`, `justin-novak.jpg`, `alec-saluga.jpg`.)
5. **Wordmark:** the `ai4ntp` logo (dark on paper, light on ink) in a corner. Use `/logo-primary-dark.svg` or `/logo-primary-light.svg`.
6. **Status pill (optional):** a small mono tag like `LIVE` (with a Rust `#C4471C` dot) or `REPLAY` / `RECAP`.

**Do:** one lime highlight only; lots of breathing room; large readable headline; grayscale photos so the lime pops.
**Don't:** use em dashes; multiple highlight colors; gradients; stock-photo gloss; stretch or recolor the logo; crowd the canvas.

**Reference renders** (this exact system, already built): the live OG cards at `https://ai4ntp.com/og-image.jpg`, `https://ai4ntp.com/sessions/003/og-image.jpg`, and `/sessions/002/og-image.jpg`. Point the agent at these as visual examples of the headline + highlight + wordmark + headshot treatment.

---

## 8. Quick asset URL list (fetchable)

```
Logos:   https://ai4ntp.com/logo-primary-dark.svg
         https://ai4ntp.com/logo-primary-light.svg
         https://ai4ntp.com/logo-stacked.svg
         https://ai4ntp.com/logo-monogram.svg
         https://ai4ntp.com/logo-expressive.svg
Icons:   https://ai4ntp.com/icon-192.png  /icon-32.png  /apple-touch-icon.png
Avatars: https://ai4ntp.com/ai4ntp-x-avatar.png  /ai4ntp-x-avatar-yellow.png
Share:   https://ai4ntp.com/og-image.jpg
People:  https://ai4ntp.com/sessions/001/images/ian-kilpatrick.jpg
         https://ai4ntp.com/sessions/001/images/justin-novak.jpg
         https://ai4ntp.com/sessions/001/images/alec-saluga.jpg
Examples: https://ai4ntp.com/sessions/003/og-image.jpg  /sessions/002/og-image.jpg
```

This file lives at https://ai4ntp.com/brand-kit.md so an agent can pull it directly.
