# /blog generator

Programmatic blog at `ai4ntp.com/blog`, built the same way as `/ai-tools`: one JSON source
of truth, one generator, zero hand-edited HTML.

**Generated. Do not hand-edit `blog/**/*.html`.** Your changes are wiped on the next build.

## The bright line

**One tool = `/ai-tools/<slug>`. Many tools, or a job-to-be-done = `/blog/<slug>`.**

This is what stops the blog cannibalizing a 55-page directory that already ranks.
`/ai-tools/chatgpt` owns "chatgpt pricing", "what is chatgpt", "chatgpt alternatives",
permanently. The blog may only target multi-tool or job-shaped queries ("best AI tools for
marketers", "how to build a company with AI"). If a post's keyword is `<tool name>` plus
pricing / review / alternatives / what is / vs, it does not get written. The tool page
already owns it, and two of our own pages competing for one query is the worst outcome.

## Files

| File | Role |
|---|---|
| `content/posts.json` | Source of truth. The only file you edit to publish. |
| `tools/blog/blog.mjs` | `POSTS` loader + validators + `BLOG_CSS` + `blogPage()` + `blogHub()`. Not an entrypoint. |
| `tools/lib/site.mjs` | Chrome shared with `/ai-tools`: `head()`, `CSS`, `EP`, `PEOPLE`, `personLd()`, `crumb()`, `write()`. |
| `tools/directory/generate.mjs` | **THE build entrypoint.** Emits tools + blog + sitemap + robots + llms.txt. |
| `tools/blog/verify-citations.mjs` | Proves every citation verbatim against the transcript. **Gates the build.** |
| `tools/blog/cannibalize.mjs` | `node tools/blog/cannibalize.mjs "<keyword>"`. Screens a candidate keyword against posts, tools, and sessions. |

`posts.json` lives in `content/` (not beside its generator, unlike `tools.json`) because
`content/` is where the drafts already live and is the natural home for editorial source.
Both `/content` and `/tools` are in `.vercelignore`, so neither the data nor the generator
ever deploys. Only the emitted `/blog/**` ships.

## Build

```bash
node tools/directory/generate.mjs      # tools + blog + sitemap + robots + llms.txt
node tools/og/render.mjs --all         # OG cards (auto-discovers blog/<slug>/og.json)
vercel --prod --yes
```

**There is only one entrypoint, on purpose.** `sitemap.xml`, `robots.txt`, and `llms.txt`
must cover tools, posts, and sessions in a single pass. A standalone blog build would either
omit itself from the sitemap or write a competing one that the next `generate.mjs` run
silently destroys. So `generate.mjs` imports `blog.mjs`, never the reverse.

## Adding a post

Add one record to `posts.json`, run the build. The generator hard-fails on anything it can
check, so a clean run means the internal links, the author, and the session all resolve.

### Required fields

| Field | Notes |
|---|---|
| `slug` | lowercase kebab-case. Becomes `/blog/<slug>`. **Renaming orphans the old URL** (see Stale directories). |
| `archetype` | `listicle` \| `howto` \| `explainer` \| `case-study`. Drives the JSON-LD node and the rendering. |
| `status` | `published` \| `draft`. Drafts never generate, never sitemap, never hit llms.txt. |
| `title` | The `<h1>`. |
| `seo_title` | The `<title>`. Front-load the keyword. |
| `dek` | One italic standfirst sentence under the h1. |
| `description` | Meta description, <=158 chars. |
| `keyword` | `{primary, secondary[], question, intent}`. `primary` must be a phrase a non-technical person would actually type. |
| `answer` | **40-60 words, self-contained.** Renders as the first prose block and feeds llms.txt. Must not open with a pronoun. This is the highest-leverage field on the page (see GEO). |
| `takeaways` | 3-5 extractable claims, each carrying a number or a name. |
| `author` | Must key into `PEOPLE` in `tools/lib/site.mjs`. Hard-fails otherwise. |
| `published` / `updated` | Real dates. Drives `<lastmod>` and `dateModified`. **Never TODAY-stamp.** |
| `source` | `{session, citations[]}`. The moat. See below. |
| `sections` | `[{h2, id, body, table, quote}]`. `body` takes a string or an array of paragraphs. |
| `faqs` | `[{q, a}]`. Mirrored 1:1 to visible `<details>`, never orphaned markup. |
| `links` | `{tools[], sessions[], posts[], cta}`. Tool/session/post refs all hard-fail if unknown. |
| `og` | OG card config, or `null` for the sitewide fallback. The generator writes it to `blog/<slug>/og.json`. |

### Archetype extensions

Exactly one may be non-null. Two is a hard fail: the JSON-LD would claim the post is two
things at once.

| Archetype | Field | Shape | Extra JSON-LD |
|---|---|---|---|
| `listicle` | `itemlist` | `[{group, name, tool_slug, body, price, evidence_ts}]` | `ItemList` (Unordered) |
| `howto` | `howto` | `{total_time, steps:[{name, body, tool_slug}]}` | `HowTo` + `HowToStep` + `HowToTool` |
| `explainer` | `definition` | `{term, text, also_known_as[]}` | `DefinedTerm` |
| `case-study` | `results` | `[{metric, before, after, timeframe, as_of, evidence_ts}]` | `about` -> the session |

Listicle items are bucketed by `group`, which is the job the reader wants done, and each
group becomes a question-shaped H2 with its own TOC entry. **The list is not ranked**, which
is why the schema says `ItemListUnordered`. People search by job, not by rank.

## Evidence: the whole point

**RULE: every numeric claim traces to a timestamp in `sessions/<id>/transcript.md`.**

`source.citations` is `[{ts, speaker, claim, quote}]`, and `quote` must be the speaker's
actual words. This is not bookkeeping. LLMs cite *sources of facts*; commentary about public
facts has no citation surface because the model already has the public fact. The transcripts
are a proprietary primary source, and that is the only reason these posts can rank against
sites with more domain authority.

It is also the compliance story. Google's scaled-content-abuse policy targets exactly what
this pipeline would become if the evidence floor slipped. The floor **is** the compliance.

### The audit is mechanical and gates the build

```bash
node tools/blog/verify-citations.mjs     # also runs inside generate.mjs
```

It parses `sessions/<id>/transcript.md` (both house formats) and hard-fails on a timestamp
that does not exist, a speaker who did not say it, or a quote that is not verbatim.
**`generate.mjs` refuses to build if any citation fails.** This was a checklist item ("spot-
check three by hand") until it became obvious that the moat cannot depend on diligence.

**`transcript.md` is the only valid timestamp source.** `catchup.md` and `faqs.md` are
clocked to the trimmed replay and run minutes ahead (006: catchup `[0:05]` is transcript
`[2:16]`; catchup `[42:25]` is transcript `[49:19]`, and the offset is not constant).
Harvesting evidence from `catchup.md`'s "Best moments", the most tempting shortcut available,
produces citations that are all wrong and look perfect. The verifier detects this specific
failure and tells you where the words actually are.

**Elision must be marked with `...`.** An unmarked splice presents words as consecutive that
the speaker never said that way, which is a fabricated quote. The verifier enforces it.

### What the script cannot check

That the quote **supports the claim it is attached to**, and that a **causal claim was
actually made on tape**. A case-study can clear every surface bar (named entity, before/after
number, timeframe, who did it) using facts that have nothing to do with each other. Session
006 contains a company that grew 5 to 30 employees and an agent built *because of* that
growth; a post connecting them would pass every automated check and still be a lie. Read
`.claude/skills/session-to-blog/references/archetypes.md` on the causation trap.

Track record, for calibration: the first pass over the two migrated drafts caught an
unsourced "5 cents per social post", a paraphrase presented as a verbatim pull quote, a
missing Pulsar credit, a misattributed speaker, and **12 unmarked splices in 24 citations**.
Assume your first pass is the same.

## Stale directories

Rename or unpublish a post and `blog/<old-slug>/` stays on disk and keeps deploying at the
old URL forever. `warnStaleBlogDirs()` prints a warning on every build. **Act on it:** delete
the directory. Nothing else catches this.

## CSS

The blog extends the shared `CSS` from `site.mjs` via `head({extraCss: BLOG_CSS})`. It does
**not** use `/theme/base.css`.

The reasoning: `theme/*` is used by 4 pages, all dark. The generator's `CSS` is used by 54.
The blog is a sibling of `/ai-tools`, not of `/sessions/006`, and adopting the minority fork
would make it look like nothing it sits next to. Inlining also keeps every page one request
with zero render-blocking CSS, which matters for crawlers that do not fetch subresources.
`base.css` additionally wants Hanken Grotesk, which `head()` does not load.

This does defer the two-CSS-worlds consolidation flagged in `CLAUDE.md`. That consolidation
should happen across all 55+ pages in one deliberate pass, not on the critical path of a
content pipeline.

## Schema notes

Every post emits `Organization` + `BlogPosting` + `WebPage` + `BreadcrumbList`, plus
`FAQPage` when there are FAQs and one archetype node.

`BlogPosting.mentions` points at the `#software` `@id` nodes that `toolPage()` already emits
(`/ai-tools/<slug>#software`). That is what makes the directory and the blog resolve as **one
graph** instead of two disconnected piles. Same for `author`, which reuses the canonical
`/about#<slug>` Person `@id`.

**Honest expectations:** Google restricted FAQ rich results to gov/health sites in Aug 2023
and dropped HowTo rich results entirely. This markup earns LLM extraction and graph
coherence. It will not produce SERP features. Do not plan around snippets that no longer
exist.

## GEO / LLM citation

Full rules, each with its mechanism: `.claude/skills/session-to-blog/references/geo-rules.md`.

The short version: answer-first in 40-60 words, no paragraph opening with a pronoun (chunks
break on paragraphs, and a chunk whose referent lives elsewhere is unquotable),
question-shaped H2s, numbers with owners and dates, self-contained paragraphs, and a
consistent entity string ("AI4NTP (AI for Non-Techy People)") matching `Organization.name`
byte for byte.

## Voice

`CLAUDE.md` and `sessions/_template/voice-and-tone.md` are the authority. The one rule broken
most often: **never use em dashes.** Lint before deploy:

```bash
grep -rn '—\|&mdash;' content/posts.json blog/    # must be empty
```
