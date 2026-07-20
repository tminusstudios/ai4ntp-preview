---
name: session-to-blog
description: Mine an AI4NTP session transcript for SEO/LLM-optimized blog posts at /blog/<slug>. Two-phase: reads sessions/<id>/transcript.md, proposes a ranked slate of post candidates, and STOPS for approval; only on approval does it write content/posts.json records and generate the pages. Use when asked to write a blog post, mine a session or transcript for content, turn a session into posts, or publish to /blog.
user-invocable: true
---

# Session to blog

Turns a recorded session into durable, ranking, LLM-citable posts at `/blog/<slug>`. Same
model as `/ai-tools`: one JSON source of truth, one generator, zero hand-written HTML.

**The moat is that every claim traces to a timestamp in a recording we own.** LLMs cite
sources of facts. Commentary about public facts has no citation surface, because the model
already has the public fact. The transcripts are a proprietary primary source, and that is
the only reason these posts can outrank sites with far more domain authority. Protect it or
this whole pipeline is just another AI content farm.

## The bright line

**One tool = `/ai-tools/<slug>`. Many tools, or a job-to-be-done = `/blog/<slug>`.**

`/ai-tools/chatgpt` owns "chatgpt pricing", "what is chatgpt", "chatgpt alternatives",
permanently. The blog may only target multi-tool or job-shaped queries. Two of our own pages
competing for one query is the worst possible outcome, and it gets harder to see with every
post added. This is a hard gate, not a guideline.

## STOP GATE

**Phases 1 to 3 write NOTHING.** You mine, you screen, you propose a ranked slate, and you
stop. Do not create `posts.json` records, files, or pages until the user names which
candidates to draft. This is not optional, and "the candidates are obviously good" is not a
reason to skip it. A weak post that ranks is worse than no post.

---

## Phase 0 · Orient

- [ ] Read `tools/blog/README.md`. It is the schema authority. Do not re-derive field specs from here.
- [ ] Read `references/archetypes.md` (evidence bars per archetype) and `references/geo-rules.md` (what actually drives LLM citation).
- [ ] Read `content/posts.json` (what already exists = what you may not cannibalize).
- [ ] **Voice authority for written prose is `CLAUDE.md`'s "Voice and tone" section** (direct, declarative, slightly understated; specific over generic; no hype, no hedging). `sessions/_template/voice-and-tone.md` is **Justin's spoken voice for talk tracks**: its register ("guys", "you're in the right room", fragments for punch) is wrong for a blog post. Take exactly one rule from it, the sitewide one it states best: **never use em dashes.**

**Inputs, in priority order:**

| File | Why | Timestamps? |
|---|---|---|
| `sessions/<id>/transcript.md` | Primary. Every claim addressable by timestamp. | **THE ONLY VALID SOURCE** |
| `sessions/<id>/tools.md` | Clusters tools by job, with attribution. A head start on Pass 2. | Never cite |
| `sessions/<id>/faqs.md` | Real audience questions. **Pre-validated H2 language.** Use it verbatim. | Never cite |
| `sessions/<id>/catchup.md` | The editorial spine someone already found. | **NEVER CITE. See below.** |
| `sessions/<id>/index.html` | What the recap already claims, so you do not duplicate it. | Never cite |

### RULE: `transcript.md` is the ONLY valid timestamp source.

**`catchup.md` and `faqs.md` timestamps are on the trimmed REPLAY clock, and they are
wrong relative to the recording.** Verified on 006: catchup `[0:05]` is transcript `[2:16]`;
catchup `[42:25]` is transcript `[49:19]`. **The offset is not constant**, so you cannot
correct for it.

This matters more than it looks. `catchup.md`'s "Best moments" section is a pre-curated list
of exactly the signals Pass 1 asks for, each with a timestamp. It is the single most tempting
shortcut in the input set, and harvesting from it produces a slate where **every citation is
wrong** while looking immaculate. Use those files for *ideas and language*. Get every
timestamp and every quote from `transcript.md` itself.

This is enforced: `node tools/blog/verify-citations.mjs` runs inside the build and hard-fails
on a timestamp that does not exist or a quote that is not verbatim. You cannot ship past it.

### RULE: `tools.json` is the authority on which tools have pages, not `tools.md`.

`sessions/<id>/tools.md` goes stale. As of July 2026, 006's copy says Instantly and Miro are
"not yet in the directory" when both have pages **and** 006 episode entries. Believing it
would drop a real internal link. Check `tools/directory/tools.json`.

### Transcripts and their formats

**Transcripts exist for 002, 004, 005, and 006 only.** 001 has only a practice transcript;
003 has raw VTT but no cleaned transcript. **RULE: no transcript, no post.** Do not mine
`raw/*.vtt` and do not write a post from a recap page. If there is no cleaned transcript,
say so and stop.

**The format is not consistent.** Both are parsed by `parseTranscript()` in
`tools/blog/verify-citations.mjs`; reuse it rather than writing your own regex.
- 006: `**[5:03] Ian:** ...` and `**[1:03:47] Alec:** ...` (hours appear past the hour mark, so a naive `\d:\d\d` match breaks)
- 002: `**Ian · 08:29** — ...`

---

## Phase 1 · Mine

### Pass 1 · Inventory (exhaustive, no judgment)

Walk the transcript top to bottom. Log every instance of these seven signals, each with its
timestamp and speaker:

1. **A number** ("112 opportunities in seven days", "one cent", "26 to 14,500 pages")
2. **A named tool in actual use** (demonstrated, not name-dropped)
3. **A sequential process** with 3+ ordered steps
4. **An outcome** with a before/after and a timeframe
5. **A plain-English definition** of a term people search
6. **An objection answered** live
7. **A contrarian claim** ("build it and they will come is a fallacy")

**RULE: do not evaluate while inventorying.** Evaluating during collection is how you end up
with three posts about whatever was said in the first ten minutes.

### Pass 2 · Cluster

Group entries by topic. **A cluster with fewer than 3 entries is not a post.** It is a
paragraph in someone else's post.

**An "evidence entry" is one distinct claim traceable to one timestamp.** Two entries from
the same timestamp count as **one**. This definition exists because the floor is otherwise
trivially gamed: a single sentence usually contains a number, a named tool, and an outcome,
and slicing it three ways to clear the floor is self-deception, not evidence.

The stronger floor is geo-rule 9: **>=3 original facts that exist nowhere else on the
internet.** If the cluster clears the entry count but not that, it is still not a post.

### Pass 3 · Archetype fit

Evidence decides, not preference. Full bars in `references/archetypes.md`.

| Archetype | Required evidence in the cluster |
|---|---|
| `listicle` | >=4 distinct named tools, each demonstrated, groupable by job |
| `howto` | one sequential process, >=4 ordered steps, a stated outcome |
| `explainer` | a plain-English definition + a worked example + a named common confusion |
| `case-study` | one named entity + a before/after number + a timeframe + who did it |

**RULE: do not force an archetype the evidence does not support.** If a cluster fits two,
pick the one carrying the numbers.

### Pass 4 · Keyword

One primary keyword per cluster, plus its question form.

**RULE: the keyword must be a phrase a non-technical person would type or say aloud, not our
brand language.** "AEO" is our language. "how do I show up in ChatGPT" is theirs. Session 006
gives you both. Target theirs, and define ours inside the post.

---

## Phase 2 · Screen

### Pass 5 · Cannibalization (must run, results reported)

Run the screen for every candidate keyword:

```bash
node tools/blog/cannibalize.mjs "<keyword>"
```

It checks all four surfaces and prints a verdict per surface. **It is a prompt for judgment,
not a verdict machine.** Read what it says carefully:

- **vs `content/posts.json`** (mechanical, trustworthy): a hit means **reject, or propose
  "update existing post `<slug>`" instead.** The update is usually the right call and is
  where compounding actually comes from.
- **vs `tools/directory/tools.json`** (noisy, both directions): flags `<tool name>` +
  (pricing | review | alternatives | what is | vs). It **false-positives** on legitimate
  job-shaped queries that happen to contain a tool name ("how to get recommended by
  chatgpt" is fine) and **false-negatives** on single-tool queries with no modifier
  ("openclaw strategy" is a reject the script will clear). **Apply the bright line
  yourself.** The script cannot.
- **vs sessions** (mechanical): checks `EP` in `tools/lib/site.mjs`, which is where episode
  titles live. A keyword that is the episode title means reject; `/sessions/<id>` owns it.
- **vs the rest of this slate** (you must do this by hand): **one cluster yields at most one
  post.** This is the cannibalization most likely to actually happen and the only one with
  no external data to check against. A cluster that supports both a case-study and an
  explainer is not two posts. Apply the Pass 3 rule and take the one carrying the numbers;
  the other becomes an H2 inside it.

**RULE: report every rejection with its reason.** Silent dropping means the user cannot audit
your judgment, and the rejects are often the most interesting line in the slate.

### Pass 6 · Score and rank (6 axes, 1-5 each, out of 30)

| Axis | What it measures | Anchors |
|---|---|---|
| **Evidence density** | Distinct citable moments (Pass 2 definition). **The only unfakeable axis. Weight it.** | 5 = 7+, 3 = 4-5, 1 = 3 |
| **Winnability** | Can we plausibly rank? Who owns the current top 5? | 5 = long-tail, no major publisher competing. 3 = mixed. **1 = head term owned by IBM/AWS/Google.** |
| **Search demand** | Your honest estimate. **Label it an estimate, show your reasoning.** No keyword volume data exists in this repo. | 5 = obviously high-volume. 1 = niche. |
| **LLM citability** | A number or a definition a model would lift verbatim? | 5 = several sourced numbers or a clean "X is a Y that Z". 1 = neither. |
| **Business fit** | Reaches AI-curious / upskilling / solution-seeking readers, with a non-forced CTA? | 5 = natural CTA. 1 = the CTA would be bolted on. |
| **Distinctiveness** | Would this say something the top 5 do not? | 5 = >=3 facts that exist nowhere else. 1 = we would be restating public knowledge. |

**Winnability exists because demand alone promotes head terms we cannot win.** "What is an AI
agent" scores demand 5 and winnability 1: enormous volume, and the top 5 are IBM, AWS, and
Google, whom a 2-post blog does not outrank. Without this axis the unwinnable term sorts to
the top of every slate.

**Under 18 of 30 is not proposed.** It goes in the rejected list with its score.

**Tie-break, in order:** evidence density, then winnability, then distinctiveness. Never
vibes. If it is still tied, present both and say it is tied.

**RULE: score before you decide what to propose, not after.** Scoring six candidates and
finding all six above the floor means you reverse-engineered the numbers. The rubric is
worthless against a motivated scorer, and you are one.

**Good candidate:** >=3 numbers with timestamps, a real outcome, the operator did the thing
on camera, a natural `/ai-tools` or `/register` CTA, a job-shaped query, and >=3 facts that
exist nowhere else on the internet.

**Bad candidate:** pure opinion; the transcript *mentions* the topic but never demonstrates
it; it needs facts we would have to go look up (that is a research post, and **this skill does
not write it**); it duplicates a tool page; the "evidence" is one speaker asserting something
with no artifact shown.

---

## Phase 3 · Propose, then STOP

Output the slate using `templates/slate.md`. It must include, per candidate: the URL, the
question, **the actual 40-60 word draft answer** (so the user judges the payload, not the
pitch), 3-6 evidence lines with timestamps, the H2 outline, internal links, CTA, and the
cannibalization verdict. Then the rejected list with reasons.

End with: **"Reply with the numbers to draft (e.g. `1, 3`), or `all`. Nothing is written
until you do."**

Then stop. Do not proceed on your own judgment.

---
## ↑↑↑ APPROVAL BOUNDARY ↑↑↑
---

## Phase 4 · Draft

For each approved candidate, add one record to `content/posts.json`. **Field spec lives in
`tools/blog/README.md`.** Do not invent fields.

- [ ] Write `answer` first, 40-60 words. It is the highest-leverage field on the page. Self-contained, opens with the question's noun phrase, never a pronoun. See `references/geo-rules.md` rule 1.
- [ ] Question-shaped H2s, >=50%. Harvest `sessions/<id>/faqs.md` for real audience language.
- [ ] Every `takeaways` entry carries a number or a name.
- [ ] Fill `source.citations` as you write, not afterward. **RULE: if you cannot cite it, cut it.**
- [ ] `quote` fields must be the speaker's **actual words**, copied from `transcript.md`. A paraphrase in a blockquote is a fabricated quote.
- [ ] **Mark every elision with `...`.** Silently dropping a clause mid-quote is how quotes actually get distorted; it presents words as consecutive that the speaker never said that way. The verifier enforces this: unmarked splices hard-fail, `...` passes. (The first pass on the two migrated drafts had **12 unmarked splices in 24 citations**. Assume you have the same rate.)
- [ ] A number the operator states but never dates is not usable. See `references/archetypes.md`.
- [ ] `links.tools` gets every tool named. Link tool mentions to `/ai-tools/<slug>`, never the vendor site.
- [ ] Real `published` / `updated` dates. Never TODAY-stamp a date you did not verify.
- [ ] **No em dashes.** Commas, periods, parentheses, or restructure.

**RULE: never fabricate a number, a result, a quote, or a date.** If the transcript does not
support it, it does not ship. The first pass over the two migrated drafts caught an unsourced
"5 cents per social post", a paraphrase presented as a verbatim pull quote, and a missing tool
credit. All three would have shipped. Assume your draft has the same three problems.

## Phase 5 · Generate

```bash
cd /Users/justinnovak/Desktop/ai4ntp/ai4ntp
node tools/directory/generate.mjs
```

One entrypoint, on purpose: it builds tools + blog + `sitemap.xml` + `robots.txt` +
`llms.txt` together. A clean run means every tool slug, session, author, and post reference
resolved, because the generator hard-fails on all of them.

- [ ] Zero `[blog]` warnings. A fabrication-lint warning means a number has no citation. Fix the record, not the lint.
- [ ] Act on any `STALE` warning by deleting the orphaned directory.

## Phase 6 · OG card

```bash
node tools/og/render.mjs --all
```

The generator writes `blog/<slug>/og.json` from the record's `og` field, and the renderer
auto-discovers it. Nothing to wire.

## Phase 7 · Verify

- [ ] **Evidence audit: mechanical, and already ran.** `node tools/blog/verify-citations.mjs` runs inside the build and hard-fails on a timestamp that does not exist, a speaker who did not say it, or a quote that is not verbatim. A clean build means every citation is real. **This used to be "spot-check three by hand", which is the step that always gets skipped; it is a script now precisely because the moat cannot depend on diligence.**
- [ ] **Read what the citations do not check:** that the quote *supports the claim it is attached to*, and that a causal claim was actually made on tape. The script proves the words were said. It cannot prove they mean what your sentence says they mean.
- [ ] **Voice lint:** `grep -rn '—\|&mdash;' content/posts.json blog/` must be empty.
- [ ] **Schema:** paste the page into `validator.schema.org`. Confirm `#org`, `/about#<slug>`, `/ai-tools/<slug>#software`, and `/blog#blog` all resolve.
- [ ] **Render:** screenshot with headless Chrome (house practice). `cleanUrls` means a plain static server will not reproduce routing, so use a `vercel` preview or serve the directory and hit `/blog/<slug>/`.
- [ ] **Tool pages untouched:** `/ai-tools/**` must be byte-identical. Nothing you do here should change them.

## Phase 8 · Deploy and register

```bash
vercel --prod --yes
curl -s -o /dev/null -w '%{http_code}' https://ai4ntp.com/blog/<slug>
curl -s https://ai4ntp.com/llms.txt | grep -A3 '## Blog'
```

- [ ] Request indexing for the new URL in Google Search Console. (Standing gap: GSC "Request Indexing" on top pages is a manual step Justin owes.)
- [ ] If the post credits a tool's first appearance, add the session episode entry to that tool's record in `tools/directory/tools.json` too.

---

## RULES (the non-negotiables, collected)

1. **Phases 1-3 write nothing.** Propose, then stop.
2. **No transcript, no post.**
3. **`transcript.md` is the only valid timestamp source.** catchup.md and faqs.md are on the replay clock and are wrong.
4. **Fewer than 3 evidence entries is not a post**, where an entry is one distinct claim at one timestamp. Two claims at the same timestamp count once.
5. **At least 3 original facts that exist nowhere else**, or it is not a post regardless of the entry count.
6. **Every number traces to a timestamp.** If you cannot cite it, cut it. A number with no date is not usable.
7. **A `quote` is the speaker's actual words.** Never a paraphrase. **Mark every elision with `...`**; an unmarked splice is a fabricated quote.
8. **A case-study needs the operator to state the causation on tape.** Four bars cleared by unrelated facts is a lie waiting to happen. If they hedged, you hedge.
9. **One tool = a tool page.** The blog never targets a single-tool query. **One cluster = at most one post.**
10. **Report every rejection with its reason.**
11. **Search demand is an estimate. Say so.** Score before deciding, not after.
12. **Never fabricate a number, result, quote, date, or entity name.** "A client" is not a name.
13. **No em dashes.**

## Voice

Authority: `CLAUDE.md` and `sessions/_template/voice-and-tone.md`. Read them; do not rely on
this summary. Direct, declarative, slightly understated. Specific over generic. No hype, no
hedging. Show, do not claim. Built for non-technical operators learning AI.
