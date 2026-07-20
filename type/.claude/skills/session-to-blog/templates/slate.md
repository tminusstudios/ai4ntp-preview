# Slate template (Phase 3 output)

Copy this **shape**. Do not copy its content.

The point of the format is that the user judges the **payload**, not the pitch, which is why
the real draft answer and the real evidence lines are mandatory rather than summaries of them.

> **Why the example below is a post that already exists.** The worked example is drawn from
> Session 002, which is already published at `/blog/build-a-company-with-ai`. That is
> deliberate: an example drawn from an unmined session is a set of pre-filled answers, and
> pre-filled answers get copied instead of earned. Every citation below is one of the 24 that
> `tools/blog/verify-citations.mjs` proves verbatim against `sessions/002/transcript.md`.
>
> The first draft of this template used Session 006 and cited `[12:04]`, **a timestamp that
> does not exist**, for a number that was wrong (14,500; the transcript says 14,530). It was
> written by someone who had just written the rule against fabricating. That is how easy this
> is. Get your timestamps from `transcript.md` and let the verifier check them.

---

## Post candidates from Session <ID>

| # | Proposed title | Archetype | Primary keyword | Score | Cites | Verdict |
|---|---|---|---|---|---|---|
| 1 | How to Build a Company With AI in Under an Hour | howto | how to build a company with ai | 25/30 | 12 | propose |
| 2 | ... | ... | ... | 21/30 | 6 | propose |
| 3 | ... | ... | ... | 18/30 | 4 | propose (weak) |

Search-demand and winnability scores are **my estimate**, not measured data. There is no
keyword volume source in this repo.

---

### 1. How to Build a Company With AI in Under an Hour

- **URL:** `/blog/build-a-company-with-ai`
- **Archetype:** howto (three ordered phases, 6:50 to 69:18, each performed on camera, stated outcome: a live site on a purchased domain)
- **Question:** How do you build a company with AI?
- **Draft answer (57 words):**
  > Building a company with AI breaks into three phases: brand identity, website, then
  > go-to-market. AI4NTP (AI for Non-Techy People) ran all three live on Episode 002 in under
  > an hour, building a brand kit in about 15 minutes, a working site on a real domain in 15
  > more, and a newsletter motion in the last 15. Total recurring cost: about $50 a month.
- **Evidence (12 entries, all verbatim from `sessions/002/transcript.md`):**
  - `[16:13] Ian` "GoToBuild.pro is available for one cent on a three-year term."
  - `[25:02] Justin` "Ian: Midjourney is about $29, ChatGPT is $20, and Behance, Pexels, and Google Fonts are free, so around $50." *(inline attribution: Ian's words inside Justin's line)*
  - `[44:27] Alec` "Lovable is strong for a quick site, Claude Code for back-end functionality. If you're starting out, start with Lovable."
  - `[54:46] Justin` "Then I click \"draft issue.\" It costs 20 cents, scrapes the articles, and rewrites them in our voice, with credit to the sources."
  - `[69:18] Alec` "The domain is hooked up and the site is live at gotobuild.pro, and the plan-building functionality works now too."
  - ... (3-6 lines is normal; this one is unusually dense)
- **H2 outline:**
  1. Can you really build a company with AI in an hour?
  2. How do you build a brand identity with AI?
  3. Should you use Lovable or Claude Code to build the site?
  4. What does a go-to-market motion look like?
  5. What did it cost, all in?
- **Internal links:** `/ai-tools/midjourney`, `/ai-tools/lovable`, `/ai-tools/claude-code`, `/ai-tools/beehiiv`, `/sessions/002` (15 tools total)
- **CTA:** `/register`
- **Scores:** evidence 5 · winnability 4 (long-tail how-to, no major publisher owns it) · demand 4 (est.) · citability 5 · business fit 4 · distinctiveness 3 = **25/30**
- **Cannibalization:** `node tools/blog/cannibalize.mjs "how to build a company with ai"` -> clear on all three surfaces at proposal time. Within-slate: this cluster yields one post; the cost story is an H2, not a second post.

### 2. ...

(same shape)

---

### Considered and rejected

Every rejection gets a reason. These are often the most useful lines in the slate.

- **"Echo Check review"** · rejected: `/ai-tools/echo-check` owns single-tool queries (the bright line). **Better move:** add a session episode entry to its `tools.json` record.
- **"AEO vs GEO"** · rejected: 2 evidence entries, below the 3-entry floor. It is an H2 inside candidate 1, not a post.
- **"<Company> grew 5x with AI agents"** · rejected: clears all four surface bars (named entity, before/after, timeframe, who) and is still a **fabrication**. The growth is stated as the reason the agent was built. The agent did not exist yet. No causation on tape, no case-study.
- **"AI cold email results"** · rejected as a case-study, kept as a howto: the operator says "a client" and never names them. Inferring "a legal services client" from the scraper demo would be fabricating an entity to upgrade the archetype.
- **"The future of AI agents"** · rejected: pure opinion, zero citable moments. Would need facts we do not have on tape. **This skill does not write research posts.**
- **"<Episode title>"** · rejected: `/sessions/<id>` owns it.

---

**Reply with the numbers to draft (e.g. `1, 3`), or `all`. Nothing is written until you do.**
