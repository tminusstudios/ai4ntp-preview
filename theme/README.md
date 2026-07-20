# AI4NTP shared theme (`/theme/`)

The shared design-system base plus an opt-in dark skin. **Light is the default.** A page is
dark only when you explicitly opt in. It's a top-level deploying folder, so pages reference it by
absolute URL (`/theme/...`).

## Files

- **`base.css`** — the foundation: design tokens (`:root`), reset, base `body`, `.container`,
  the three button styles, `::selection`. Light by default. (Also carries a few dormant
  `/register` proof-build classes from its origin as `register.css`; harmless, unused elsewhere.)
- **`dark.css`** — the dark skin. All rules are scoped to `body.v6.dark`, so loading this file does
  nothing until you add that class. It re-skins the v6 sections AND the shared **nav.js** header to
  dark (footer.js is already dark, so it needs no override).

Page-specific styles do **not** go here. Keep them next to the page (e.g.
`sessions/004/session-004-dark.css`) and load them last.

## Make any page dark

1. In `<head>`, after the Google Fonts link, load the two stylesheets **in this order** (absolute
   paths — required because of `cleanUrls`):
   ```html
   <link rel="stylesheet" href="/theme/base.css">
   <link rel="stylesheet" href="/theme/dark.css">
   <!-- optional, page-specific, loaded LAST: -->
   <link rel="stylesheet" href="/sessions/00X/your-page.css">
   ```
2. Add the class to `<body>`:
   ```html
   <body class="v6 dark">   <!-- omit "dark" to render light -->
   ```
3. Keep the real shared components: `<script src="/nav.js"></script>` at the top of `<body>` and
   `<script src="/footer.js"></script>` near the end. `dark.css` darkens the nav automatically.

That's it. To make the same page light again, drop `dark.css` and the `dark` class (keep `v6`).

## Fonts

Pages on this system expect these four families (load via one Google Fonts link):
**Fraunces** (display), **Instrument Serif** (italic accents), **JetBrains Mono** (mono/labels),
**Hanken Grotesk** (body).

## Tokens you'll use most

Defined in `base.css` `:root`; dark values come from `dark.css`.

- Color: `--ink` `--ink-soft` `--paper` `--cream` `--signal` (lime accent) `--rust`
- On dark: `--on-dark` (text) `--on-dark-fog` (muted) `--on-dark-line` (hairlines)
- Type: `--font-display` `--font-italic` `--font-mono` `--font-body`
- Spacing scale: `--s1`(4px) … `--s10`(128px) · layout `--container` (1200px) · `--radius` (0)

## Reference implementation

`sessions/004/index.html` is the first page built on this. It loads `base.css` → `dark.css` →
its own `session-004-dark.css`, uses `body class="v6 dark"`, and keeps the real nav.js/footer.js.
Copy its `<head>` wiring as the template for the next dark page.

## Source / lineage

These came from `design/handoff-session-004/` (the VS Code design handoff). `base.css` was
`register.css` there; `dark.css` is `v6-dark.css` plus the nav.js dark overrides folded in. The
handoff folder is kept for reference but is excluded from deploys.
