---
name: ai4ntp-dark-theme-system
description: "AI4NTP opt-in dark theme — load /theme/base.css + /theme/dark.css and add body class=\"v6 dark\"; default is light"
metadata: 
  node_type: memory
  type: project
  originSessionId: c3930ee6-3750-4965-b6d1-bef450c71876
---

The site has a reusable, opt-in dark theme (added June 15, 2026). Default is light; a page is dark
ONLY when it opts in. Shared files live at the top-level **`/theme/`** folder:

- `/theme/base.css` — design-system base: tokens (`:root`), reset, body, `.container`, buttons. Light by default. (Was `register.css` in the design handoff; still carries dormant `/register` proof-build classes, harmless.)
- `/theme/dark.css` — dark skin, every rule scoped to `body.v6.dark`. Also re-skins the shared `nav.js` header to dark (higher-specificity `body.v6.dark .ai4nav-*` overrides; `footer.js` is already dark). Loading it does nothing without the class.
- `/theme/README.md` — usage doc.

To make any page dark: in `<head>` after the fonts link, load `base.css` then `dark.css` (absolute paths, required by cleanUrls), add `class="v6 dark"` to `<body>`, keep the real `nav.js`/`footer.js`, and put page-specific styles in a page-local file loaded last. Fonts expected: Fraunces, Instrument Serif, JetBrains Mono, **Hanken Grotesk** (body). Reference implementation: `sessions/004/index.html` (+ its `sessions/004/session-004-dark.css`), the first/only dark page so far.

**Deploy gotcha (why it lives at `/theme/`, not `/design/system/`):** a `.vercelignore` entry for a child folder (`/design/handoff-session-004`) caused Vercel to drop the **entire `/design/` tree** from the deploy (prefix-matched), so CSS under `/design/system/` 404'd in production. Lesson: don't host deployable assets in a directory that also has an ignored subfolder. The design handoff source stays in `design/handoff-session-004/` (ignored, not deployed). See [[ai4ntp-deploy-and-preview]].
