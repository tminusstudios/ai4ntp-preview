# Session 004 — Dark theme · VS Code handoff

Restyle ONLY the `/sessions/004` page to the dark theme. Visual change only —
preserve all existing functionality. Option A: keep the shared nav.js/footer.js;
the dark styles are scoped to `body.v6.dark` so they only affect this page.

## Files in this folder
- `Session 004 (dark).html` — the visual target (static reference; backend is stubbed)
- `register.css` — design tokens + header/footer/buttons (load 1st)
- `v6-dark.css` — dark-theme skin (load 2nd)
- `session-004-dark.css` — session-004-specific dark styles (load 3rd)

Headshots already exist live at `/sessions/004/images/` — no need to copy them.

## Steps
1. Copy the three CSS files into the repo (e.g. `/sessions/004/` or a shared `/design/`).
2. In the real `/sessions/004` page `<head>`, after the Google Fonts link, add the
   four fonts (Fraunces, Instrument Serif, JetBrains Mono, Hanken Grotesk) and the
   three stylesheets IN THIS ORDER: register.css → v6-dark.css → session-004-dark.css.
3. Add `class="v6 dark"` to the `<body>`.
4. Map the existing 004 content onto the mockup's classes (.s4-hero, .s4-h1, .s4-reg,
   .s4-list, .s4-expect, .s4-hosts, .s4-details, .s4-faq, .s4-final, …).

## DO NOT TOUCH (preserve unchanged)
- gtag / Google Analytics, Vercel Insights, all meta/OG tags, schema.org JSON-LD
- the real nav.js / footer.js includes (apply the dark styles to them; don't replace
  them with the mockup's hardcoded header/footer)
- the Supabase email-capture POST and the Zoom registration hand-off URL/flow
- all existing live copy/content

## Scope guard
The dark theme is scoped to `body.v6.dark`. Only this page gets that class, so no
other route is affected. Show the diff for /sessions/004 before committing; change
no other route.
