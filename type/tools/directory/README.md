# /ai-tools directory generator

Generates the programmatic-SEO **AI tools directory** at `https://ai4ntp.com/ai-tools`
from a single curated data file. White-hat: every tool here was demoed live on an
AI4NTP episode, and each page leads with first-party usage (which episode, which
operator, for what) plus pricing, alternatives, and an FAQ.

## How it works

- **Source of truth:** `tools.json` (this folder). One record per tool.
- **Generator:** `generate.mjs` (pure Node, no deps). Reads `tools.json` and writes
  static HTML to the repo root, reusing the site head boilerplate + `nav.js`/`footer.js`.
- This folder lives under `tools/`, which is in `.vercelignore`, so the source and
  generator never deploy. Only the generated `/ai-tools/**` HTML ships.

## Run

```bash
node tools/directory/generate.mjs
```

Writes (all at repo root, all deployed):
- `ai-tools/index.html` — the hub (grouped by category; CollectionPage + ItemList)
- `ai-tools/<slug>/index.html` — one page per tool (SoftwareApplication + FAQPage + BreadcrumbList)
- `sitemap.xml` — all site pages + every tool page
- `robots.txt` — allow all + sitemap reference
- `llms.txt` — markdown index of the directory for AI assistants / answer engines

Each tool page is built for LLM + SEO visibility: an answer-first summary line, a
key-facts table (category, pricing, free tier, episodes, operators, website,
rating-if-present), `SoftwareApplication` + `FAQPage` + `WebPage` + `BreadcrumbList`
schema, a `robots` rich-snippet directive, and a conversion **CTA card** (register /
book a 1:1 / email for resources) at the end of every page that doubles as a funnel.

Then deploy: `vercel --prod --yes` (from the repo root).

## Editing via Google Sheet (RETIRED, guarded)

> **`tools.json` is now the single source of truth.** The Sheet path is retired because
> it silently overwrites direct `tools.json` edits (the post-webinar flow adds each
> session's tools straight to `tools.json`). `sync.mjs` no-ops unless you pass `--force`.
> Standard workflow: edit `tools.json` (see "Adding a tool" below), then
> `node tools/directory/generate.mjs && vercel --prod --yes`. The section below is kept
> only for the rare case where you deliberately rebuild `tools.json` FROM the Sheet.

The Sheet is a human editing surface; `tools.json` is the committed cache the
generator reads. You edit in the Sheet, run one command, and deploy. The repo stays
buildable offline because `tools.json` is always committed.

**One-time setup (~5 min):**
1. Create a new Google Sheet with two tabs named exactly **`Tools`** and **`Episodes`**.
2. Seed them: File -> Import -> Upload, bring `seed-tools.csv` into the `Tools` tab
   and `seed-episodes.csv` into the `Episodes` tab ("Replace current sheet"). This
   pre-fills all 25 tools so you're not starting blank.
3. Publish each tab as CSV: File -> Share -> **Publish to web** -> select the tab ->
   **Comma-separated values (.csv)** -> Publish. Copy the URL. Do this for BOTH tabs.
   (URLs look like `https://docs.google.com/spreadsheets/d/e/<id>/pub?gid=<gid>&single=true&output=csv`.)
4. Paste the two URLs into `sheet.config.json`.

**Ongoing:**
```bash
# edit in the Google Sheet, then:
node tools/directory/sync.mjs       # pulls Sheet -> rebuilds tools.json -> regenerates pages
git diff                            # review what changed
vercel --prod --yes                # deploy
```

`sync.mjs` validates as it goes: it errors if the URLs are placeholders or return
HTML instead of CSV, and warns if the Episodes tab references an unknown tool slug or
a tool lists an alternative slug that doesn't exist.

**Sheet columns**

`Tools` tab: `slug, name, category, website, tagline, what_is, ai4ntp_take,
pricing_summary, free_tier, g2_score, g2_reviews, g2_as_of, g2_source, is_private,
is_network, affiliate_url, alternatives, updated`. (`alternatives` = comma-separated
slugs; `free_tier` = true/false/blank; leave `g2_*` blank until sourced.)

- **`what_is`** = the OBJECTIVE "What is X?" description, ideally the tool's own
  meta/og description (not our opinion). Populate it with
  `node tools/directory/fetch-descriptions.mjs` (pulls each site's meta description;
  bot-blocked/private tools fall back to `tagline`), or paste it manually. The sync
  preserves an existing `what_is` if the Sheet column is missing, so it is never
  wiped by accident.
- **`ai4ntp_take`** = our subjective POV; it renders under "How and why we use X at
  AI4NTP", separate from the objective "What is X?".

`Episodes` tab: `slug, episode, operator, used_for` — **one row per tool-per-episode**
(a tool used in both 001 and 002 has two rows).

Do NOT add a FAQ column: FAQs are auto-generated from the fields above.

To re-seed the CSVs from the current JSON (e.g., after manual JSON edits), run
`node tools/directory/export-seed-csv.mjs`.

## Adding a tool (direct JSON, the standard path)

Append a record to the `tools` array in `tools.json` and re-run the generator. Fields:

```jsonc
{
  "slug": "kebab-case",            // becomes /ai-tools/<slug>
  "name": "Tool Name",
  "category": "AI coding agents",  // groups it on the hub; also drives alternatives
  "tagline": "One factual sentence about what it is.",
  "website": "https://...",        // null if private/no public URL
  "is_private": true,              // optional: renders no Visit CTA, shows a private note
  "is_network": true,              // optional: marks an AI4NTP-network tool
  "affiliate_url": "https://...",  // optional: if set, used instead of website + rel="sponsored" + disclosure
  "ai4ntp_take": "First-party POV: how/why we used it. THE moat. Required.",
  "episodes": [
    { "id": "002", "operator": "Ian Kilpatrick", "used_for": "what they did with it" }
  ],
  "pricing": { "summary": "Short, sourced pricing line.", "free_tier": true },
  "g2": null,                      // see below
  "updated": "2026-06-05"
}
```

**Auto-derived (do NOT hand-write):** related/alternative tools (same category) and
the FAQ block are generated from the fields above.

## Rules (keep it white-hat)

- **Never fabricate ratings.** `g2` stays `null` until you have a real, sourced value:
  `{"score":4.7,"reviews":1240,"as_of":"2026-06","source_url":"https://www.g2.com/..."}`.
  (The page only shows a rating chip when `g2` is populated.)
- **Only add tools you can speak to from real use.** The first-party `ai4ntp_take`
  and `episodes` are required; without them the page is just another thin directory
  entry and shouldn't exist.
- **Verify pricing** before relying on it; attribute live-stated figures ("stated on
  the live").
- **Affiliate links** only where a real program exists; they get `rel="sponsored"`
  and a visible disclosure automatically.

## Episode map

Episode titles / replay / recap URLs are hardcoded in `EP` at the top of
`generate.mjs`. Add new episodes there as they air.
