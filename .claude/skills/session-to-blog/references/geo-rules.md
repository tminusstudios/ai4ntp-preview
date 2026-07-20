# GEO rules: what actually drives LLM citation

Each rule carries its mechanism. A rule without a mechanism is cargo cult, and you should be
able to tell the difference.

**Read the confidence note at the bottom before treating any of this as settled science.**

---

## 1. Answer-first, and no paragraph opens with a pronoun

The `answer` field renders as the first prose block: 40-60 words, self-contained, opening
with the question's noun phrase.

**Mechanism:** retrieval chunks on paragraph boundaries. A chunk that reads "It does this
by..." is unquotable, because the referent lives in a different chunk that the retriever did
not fetch. A chunk that reads "An AI agent is a program that..." is quotable standing alone.

This is the highest-leverage rule here and it costs nothing. It applies to **every**
paragraph, not just the answer.

- Bad: "It cost about $50 a month for the whole stack."
- Good: "The brand stack cost about $50 a month."

## 2. Question-shaped H2s, at least half

Phrase H2s as the exact question a person types or says aloud.

**Mechanism:** heading text is retained in chunk metadata and embeds near the query. "How do
you build a brand identity with AI?" embeds near the query. "Phase 1: Brand" does not.

`sessions/<id>/faqs.md` is question language **harvested from a live audience**. It is
pre-validated. Use it verbatim rather than inventing your own phrasing.

## 3. Numbers with owners and dates

Every claim gets a number, a named person, and a date or timeframe. "112 opportunities in
seven days (Alec, Session 006)." "26 to 14,500 indexed pages." "One cent for the domain."

**Mechanism:** models reproduce specific attributable figures and drop unsourced adjectives.
"Incredibly cheap" is unquotable. "One cent on a three-year term" is a fact with an owner.

Both migrated drafts already do this well. It is why they are good.

## 4. Self-contained paragraphs

<=80 words, one idea, subject re-nouned rather than pronouned. See rule 1: same mechanism,
applied to length.

## 5. Definitional clarity

Every explainer contains exactly one sentence of the form **"X is a Y that Z"** near the top.
That is the sentence that gets lifted verbatim. Put it in `definition.text` and make sure it
appears in the prose too.

## 6. Entity string consistency

First mention is always **"AI4NTP (AI for Non-Techy People)"**, matching
`Organization.name` / `alternateName` in `site.mjs` and `llms.txt` byte for byte.

**Mechanism:** entity resolution is string-sensitive. Three variants ("AI4NTP", "AI for
Non-Techy People", "AI4NTP Media") make three weak entities instead of one strong one.

## 7. Tables get extracted disproportionately

Cost tables and comparison tables are lifted and reproduced far more often than the prose
around them. If a post has a cost story, it gets a `table`.

## 8. Real dateModified, never TODAY-stamped

**Mechanism:** stamping every build with today's date trains Google to ignore the signal.
This inherits the deliberate policy already in `sitemap()`: only pages with a real tracked
edit date get a `<lastmod>`.

## 9. At least 3 original facts per post that exist nowhere else

**Mechanism:** LLMs cite *sources of facts*. Commentary about a public fact has no citation
surface, because the model already has the public fact. It cannot cite you for something it
knows. It can only cite you for what only you know.

This is the actual reason this pipeline exists, and it doubles as the defense against
Google's scaled-content-abuse policy (March 2024): transcript-derived posts are fine
*precisely because* of the first-party evidence, and become exactly what that policy targets
the moment the evidence floor drops. **The floor is the compliance.**

## 10. llms.txt registration

Automatic. `generate.mjs` writes the `## Blog` section from `POSTS`, using the first sentence
of each `answer`. This is another reason the `answer` field has to be self-contained: it is
the only thing an answer engine reading `llms.txt` sees.

---

## Honest confidence

- **Rules 1-4** follow from how retrieval and chunking observably work. Safe.
- **Rules 5-7** are consensus practice with good anecdotal support and **no vendor
  confirmation**. Nobody outside the labs knows the actual citation-selection mechanics, and
  any source claiming otherwise is guessing.
- **Rules 8-10** are mechanical or policy-driven, not behavioral guesses.

The plan is robust to this uncertainty because **every rule above independently improves the
page for a human reader.** None of it is a bet. If GEO turns out to be entirely folklore, the
posts are still better posts.

## What this does NOT buy you

Google restricted **FAQ rich results** to authoritative gov/health sites in August 2023 and
**dropped HowTo rich results** entirely. The `FAQPage` and `HowTo` markup here earns LLM
extraction and graph coherence. It will **not** produce SERP features. Do not let anyone plan
around rich snippets that no longer exist.
