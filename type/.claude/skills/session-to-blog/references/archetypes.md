# The four archetypes

Evidence decides the archetype, not preference. If a cluster fits two, pick the one carrying
the numbers. If it clears no bar below, **it is not a post.**

Field shapes live in `tools/blog/README.md`. This file is about *when* each archetype is
legitimate and what it must contain.

---

## `listicle` · commercial-investigation

**Query shape:** "best AI tools for X", "AI tools for X in 2026"
**Reader:** shopping for a solution. Highest commercial intent. This is the money archetype.
**Extension:** `itemlist` · **Schema:** `ItemList` (Unordered)

### Evidence bar
- **>=4 distinct named tools**, each actually demonstrated on camera
- Each groups under a **job to be done**, not a feature category
- Per tool: who used it, what they did with it, what it cost

### Rules
- **Group by job, never rank.** People search by job ("prospecting"), and we have not run a
  methodology that would justify a ranking. The schema says `ItemListUnordered` because that
  is the truth.
- Each group name becomes a question-shaped H2 and earns a TOC entry.
- **Every item must link to `/ai-tools/<slug>`.** If a tool has no directory page, add the
  page first. That is the playbook rule, and it is what makes the internal-link graph work.
- Free/paid must match the tool's real `pricing.free_tier`. Do not guess.

### Trap
This is the archetype most likely to cannibalize the directory. It is legitimate **only**
because it targets the multi-tool query. The moment a listicle's keyword narrows to one tool,
the tool page owns it.

---

## `howto` · process teardown

**Query shape:** "how to X with AI", "how do I build X"
**Reader:** upskilling. Wants the sequence.
**Extension:** `howto` · **Schema:** `HowTo` + `HowToStep` + `HowToTool`

### Evidence bar
- **One sequential process** with **>=4 ordered steps**
- A **stated outcome** (what existed at the end that did not exist at the start)
- The steps were performed on camera, not described

### Rules
- Steps must be **ordered and causal**: each one feeds the next. If the order does not
  matter, it is a listicle wearing a howto costume.
- `total_time` is ISO 8601 (`PT1H`) and must reflect what actually happened.
- `howto.steps` renders as the "repeatable order of operations" and feeds the schema. Keep it
  to the load-bearing phases; the detail belongs in `sections`.
- Each step names the tool to start with, linked to the directory.

---

## `explainer` · definitional

**Query shape:** "what is X", "X vs Y"
**Reader:** AI-curious. Lowest commercial intent, **highest citation rate.**
**Extension:** `definition` · **Schema:** `DefinedTerm`

### Evidence bar
- A **plain-English definition** given on camera by an operator
- A **real worked example** from the session (not a hypothetical)
- A **named common confusion** ("an agent is not a chatbot")

### Rules
- Exactly one **"X is a Y that Z"** sentence near the top. That is the sentence that gets
  lifted verbatim. Put it in `definition.text` and in the prose.
- **Define our jargon, target their words.** "AEO" is our language; "how do I show up in
  ChatGPT" is theirs. The keyword is theirs, the definition covers ours.
- The worked example is what separates this from the thousand other "what is an AI agent"
  posts. It is the only part a model cannot get elsewhere.

### Trap
Easiest archetype to write without evidence, and therefore the easiest to turn into slop. If
the session merely *mentions* the term, there is no post. The bar is a definition **plus** a
worked example.

---

## `case-study` · proof piece

**Query shape:** long-tail, or no query at all (this one earns links and citations)
**Reader:** evaluating whether any of this actually works.
**Extension:** `results` · **Schema:** `about` -> the session
**Strongest E-E-A-T signal and the most defensible content, because nobody else has the data.**

### Evidence bar
- **One named entity** (a company, a build, a campaign). "A client" is **not** a named
  entity. Inferring one from context ("a legal services client") is fabrication, and it is
  tempting precisely because it upgrades a howto into a case-study.
- A **before/after number**
- A **timeframe**
- **Who did it**, by name
- **The operator states, on tape, that the thing caused the number.**

### The causation trap (read this one twice)

The first four items are satisfiable by facts that have **nothing to do with each other**.
Session 006 contains: BrandSauce grew 5 to 30 employees (named entity, before/after,
timeframe, Ian). That clears the first four bars completely. And a post titled "BrandSauce
Went From 5 to 30 Employees With AI Agents" would be **a lie**: at `[56:22]` that growth is
given as the reason he *built* the agent. The agent did not exist yet.

The checklist will green-light this. The fifth bar is the only thing that stops it.

**And when the operator hedges, the post hedges.** At `[37:34]` Ian says of the Saints
Classical enrollment jump: "I don't know if that's normal. I mean, she's done a great job on
the school itself. But I will say AI has helped quite a bit." A post that drops that hedge is
reporting a causal claim the operator explicitly declined to make. Put the hedge in the prose.

### Rules
- Every row of `results` carries `evidence_ts`. No exceptions. This archetype is nothing but
  numbers, so an uncited number is the whole post collapsing.
- `as_of` dates every figure. A metric without a date rots silently.
- **A real, timestamped, undated number is not usable.** Screen-read dashboard figures
  ("671 visitors" narrated off a live chart with no date spoken) pass every mechanical check
  and still rot, because nobody can ever say what they were as-of. Cut them, or cite them as
  "as of the session date" only if the operator says so.
- `before: null` renders as "Not stated". **Use it.** Do not invent a baseline to make the
  delta look better. That is the single most tempting fabrication in this archetype.
- Report the number the operator said, not the number that would be more impressive.

---

## Cross-archetype

**Never force an archetype the evidence does not support.** A cluster with 4 tools and no
process is a listicle, even if a "playbook" would be a better headline. The evidence is what
you have; the headline is what you want. The evidence wins.

**When a cluster fits two, pick the one carrying the numbers.** Numbers are what get cited.
