# OG card renderer

World-class OpenGraph / social share cards for AI4NTP, rendered by **headless
Google Chrome** using the real **Fraunces** variable font and the actual brand
CSS. This replaced the old Python/Pillow scripts, which fell back to Georgia and
could not do real web typography, gradients, or blend modes.

## How it works

`render.mjs` builds an HTML card from a JSON config, loads it in headless Chrome
(via `puppeteer-core`, pointed at the installed `/Applications/Google Chrome`),
waits for web fonts, auto-fits the headline so it never overflows or wraps, and
screenshots the `.card` element at `deviceScaleFactor: 2` to a **2400x1260** JPEG.

## Usage

```bash
# Render one card from its config
node tools/og/render.mjs sessions/003/og.json

# Render every og.json in the repo (homepage + all sessions)
node tools/og/render.mjs --all

# No args = re-render Episode 003
node tools/og/render.mjs
```

## Configs

Each card has an `og.json` co-located with the page it belongs to. Image paths
inside it are relative to that file; `output` defaults to `og-image.jpg`.

- `/og.json` -> `/og-image.jpg` (homepage, **brand** card)
- `/sessions/001/og.json` -> `/sessions/001/og-image.jpg`
- `/sessions/002/og.json` -> `/sessions/002/og-image.jpg`
- `/sessions/003/og.json` -> `/sessions/003/og-image.jpg`

Two card modes (auto-detected from the fields present):

- **Episode card** — has `session_id` + `status` (`"LIVE"` rust dot / `"REPLAY"`
  ink dot) + `date` + `time` + `operators` (headshots, auto-joined "A, B & C") +
  `tagline`. Renders the `EPISODE 00X` label and the operator credit row.
- **Brand card** — no `session_id`/`operators`. Uses `kicker` (top-right label,
  no status dot), an optional `subtitle` under the headline, and a `footer_note`.

Headline is `headline_line1` (plain) + line 2 = `headline_pre` +
`headline_highlight` (signal box, italic) + `headline_post`. `headline_size` is
the max px before auto-fit kicks in.

### Dimensions and square-safe (centered) mode

- `card_w` / `card_h` set the logical canvas (default 1200x630); `scale` is the
  device pixel ratio (default 2). The output is `card_w*scale` x `card_h*scale`.
  Example: Eventbrite wants exactly **1880x940**, so `og-eventbrite.json` uses
  `card_w:1200, card_h:600, scale:1.566666667`.
- `centered: true` switches to a **square-safe** layout: everything (logo,
  headline, a single centered status/episode/date line, operators) is stacked
  and centered inside the center 1:1 crop, so the SAME image reads correctly as
  both a 2:1 rectangle AND a 1:1 square (Eventbrite shows both; IG/avatars crop
  square too). `safe_w` overrides the safe content width (default
  `min(card_w, card_h) - 80`). The default OG/social cards stay left-aligned
  because they are always shown full-bleed.

## Adding a new session card

1. Create `sessions/00X/og.json` (copy an existing one, edit the fields).
2. Make sure the operator headshots exist at the relative `img` paths.
3. `node tools/og/render.mjs sessions/00X/og.json`
4. Point the page's `og:image` + `twitter:image` at `/sessions/00X/og-image.jpg`
   and add `og:image:width` 2400 / `og:image:height` 1260.

## Dependencies

`puppeteer-core` only (no bundled Chromium download); it drives the Google Chrome
already installed on the machine. `package.json` + `node_modules` live in this
folder and are excluded from deploys via `.vercelignore`.
