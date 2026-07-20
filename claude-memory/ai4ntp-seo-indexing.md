---
name: ai4ntp-seo-indexing
description: "Why /ai-tools pages sit in GSC \"Discovered - not indexed\", the internal-linking + sitemap fixes shipped, and the manual GSC follow-up still owed"
metadata: 
  node_type: memory
  type: project
  originSessionId: df513076-3781-4b01-ba71-3337851165d8
---

Investigated (July 13, 2026) why ~40 `/ai-tools/*` pages sit in Google Search Console as "Discovered - currently not indexed / last crawled: N/A" (16 indexed vs 49 not).

**Diagnosis: no technical blocker.** All pages return 200, `robots: index,follow`, self-referencing canonical, valid multi-block JSON-LD, are in the sitemap, and are fast (~120ms TTFB). Root cause is crawl-budget rationing on a young domain (first indexed ~June 2, 2026) that dumped 52 near-templated URLs into the sitemap at once, with those pages buried behind a footer-only link path (near-zero internal PageRank). This is the normal fate of programmatic SEO on new/low-authority domains, not a bug. Part of the "49 not indexed" is intentional (`/portal`, `/sessions/*/assess/live`, `/internal` are correctly noindex).

**Fixes shipped July 13, 2026** (deployed): (1) added Sessions + AI Tools links to the main nav (`nav.js` had zero nav links before); (2) new "The stack" tools section on the homepage (`index.html`, `.tools-home`/`.tool-chip`) linking 12 marquee tool pages + the hub; (3) generator now emits a "More AI tools we use" cross-link module per tool page (`moreToolsFor()` in `tools/directory/generate.mjs`), so each tool page links to ~10-12 siblings instead of ~3; (4) sitemap fixed: static pages omit `<lastmod>` and tool pages carry their real per-tool `updated` date (was stamping TODAY on every URL every build, which trains Google to ignore lastmod); added `/sessions/006`, `/agents`, `/build`, `/refer` (were missing).

**The AI-readiness scanner Justin used gives false negatives:** it does NOT render JS and cannot parse `@graph`-wrapped JSON-LD, so its "Schema Markup 0/100 (could not parse)", "FAQ 50/100 (no FAQPage schema)", and "Testimonials 0/100" are wrong (all present + valid). "PageSpeed 0/100 HTTP 429" was just Google's PSI API rate-limiting the scanner. Trust GSC + Google Rich Results Test over it.

**Manual follow-up Justin still owes (not in code):** in GSC, use URL Inspection -> Request Indexing on the ~10 highest-value tool pages (chatgpt, claude, claude-code, gemini, perplexity, etc.) to jump the crawl queue. Do the priority ones, not all 40. Beyond that it's a domain-authority waiting game (backlinks, real traffic). Related: [[ai4ntp-deploy-and-preview]], and the generator/directory system documented in CLAUDE.md.
