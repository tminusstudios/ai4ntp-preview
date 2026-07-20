---
name: ai4ntp-internal-hosting
description: Password-gated internal hosting of the partner deck + revenue model + growth engine on ai4ntp.com
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3eedde69-c626-458e-8aaa-7c9a36e7f091
---

The partner brief, revenue model, and growth engine are hosted **password-protected** on the live site:
- Deck: **https://ai4ntp.com/internal** (or /internal/brief)
- Revenue model: **https://ai4ntp.com/internal/model**
- Growth engine (GTM subscriber-growth model): **https://ai4ntp.com/internal/growth**
- Growth engine written notes (rendered from markdown): **https://ai4ntp.com/internal/growth-notes**
- Password (shared phrase, any username): **[REDACTED — rotate INTERNAL_PW; value lives in Vercel env only]**

Mechanism (server-side, real gate, not client-side theater): serverless function `api/internal.js` in the ai4ntp project does HTTP Basic Auth and only sends the HTML after the password matches. All docs are embedded as **base64** inside the function so they never exist as public static files (selected via `?doc=brief|model|growth|growth-notes`). The `growth-notes` doc is a **markdown reading page**: `build-internal.js` has a small MD-to-HTML converter that renders `revops/growth-engine.md` into an on-brand styled page. `vercel.json` has scoped `rewrites` mapping `/internal`, `/internal/brief`, `/internal/model`, `/internal/growth`, `/internal/growth-notes` to the function. Responses carry `X-Robots-Tag: noindex`. Public pages are unaffected.

To change the password: set Vercel env var `INTERNAL_PW` (then redeploy) or edit `FALLBACK_PW` in `api/internal.js`.

**THE EPHEMERAL-SCRATCHPAD GOTCHA IS FIXED (July 15, 2026).** The source HTML for all four docs now lives durably in the repo at **`revops/internal-src/`** (`brief.html`, `model.html`, `growth.html`, `growth-notes.html`) with **`revops/internal-src/build.mjs`** + a README. `revops/` is `.vercelignore`'d so none of it deploys. No more decoding base64 out of `api/internal.js` to make an edit. The loop is now:

```bash
# edit revops/internal-src/brief.html, then:
node revops/internal-src/build.mjs && vercel --prod --yes
```

`build.mjs` rewrites only the four `const <NAME> = '...'` base64 lines and round-trip verifies each; the auth handler is never touched (verified byte-identical against the deployed file). Written companion docs live in `revops/` (PRIVATE): `partner-deck.md`, `revenue-model.md`, `growth-engine.md`, indexed in `revops/README.md`. See [[ai4ntp-partner-deck]].

**Security note (July 2, 2026):** root `.md` files were being served publicly (`ai4ntp.com/CLAUDE.md`, `/growth-plan-Y1.md` returned 200). Added them to `.vercelignore`; now 404. `brand-kit.md` was also public (200) and, at Justin's direction, was hidden too (now 404). `.vercelignore`'d folders (`revops`, `content`, `tools`, `.claude`) were already correctly hidden.

The **growth engine** is a 52-week weekly multi-channel audience-growth simulation with a real viral-coefficient (K-factor) loop. Core math is `scratchpad/growth-core.js`, validated by `scratchpad/growth-test.js` (32 assertions: preset landing bands, conservation, monotonicity, viral identities, edge/TAM cases, sensitivity). The exact same core is embedded in the HTML. Five scenario presets land: base ~11k, safest ~75k, realistic ~110k, efficient ~225k, full send ~498k. Channels: organic (cadence + compounding back-catalog), paid (diminishing returns), referral (g = activeShare x K / cycle, applied to base so it compounds), direct. Every channel throttled by a logistic brake vs a reachable-market TAM. Cross-linked from the base-vs-bull deck slide (#s5) and the thank-you resources.
