---
name: ai4ntp-deploy-and-preview
description: How to deploy AI4NTP and visually verify changes before shipping
metadata: 
  node_type: memory
  type: reference
  originSessionId: bafb1b4c-7a0d-41a6-962d-c08f85739905
---

AI4NTP is a static HTML site on Vercel (not a git repo). Deploy with `vercel --prod --yes` from
`/Users/justinnovak/Desktop/ai4ntp/ai4ntp` (aliases to ai4ntp.com).

**Verify visually before every deploy** (this caught real layout bugs): run
`python3 -m http.server 8000`, then screenshot the live DOM with headless Chrome via the already-
installed `tools/og/node_modules/puppeteer-core` (executablePath = `/Applications/Google Chrome.app
/Contents/MacOS/Google Chrome`). Check desktop (~1280–1440) and mobile (~390). Justin reacts well
to seeing rendered screenshots, not just diffs.

Site voice rule: **no em dashes** in user-facing copy. Related: [[pending-design-system-refactor]].
