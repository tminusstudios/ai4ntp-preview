# AI4NTP Partner Deck — Master Brief

The reusable prompt/context we reference every time we build or edit a slide.
Lives with the deck so the brand rules and the source-of-truth facts stay
consistent across sessions. Read this first when picking up a page.

---

## The job

Build a one-month partner update deck for AI4NTP. Primary audience: the partners
(Alec Saluga, Ian Kilpatrick, Brett Haralson). Secondary, and it must hold up for
them too: potential investors and potential sponsors. The deck must be radically
transparent and lead with traction. Traction is the most important thing.

It drives partners toward four outcomes at once:
1. Align on the big decisions (branding direction + roles/responsibilities).
2. Invite deeper commitment, possibly a raise.
3. Serve as a transparent "here is where we are after one month" update.
4. Surface the hiring gaps so we can divide and conquer.

## How we work on it

One page at a time. Justin gives context for a slide, we fill only that
`<section>`, rebuild, screenshot-verify, and (on his go) redeploy. Build the bones
first, iterate after. The skeleton is already in `deck/index.html`.

## Format and tech

- reveal.js 5.1.0 via CDN (same as the episode decks at `/sessions/00X/slides/`).
- Files: `deck/index.html` (slides), `deck/deck.css` (brand styles), `deck/BRIEF.md` (this).
- Deploy with the site: `vercel --prod --yes` from `/Users/justinnovak/Desktop/ai4ntp/ai4ntp`.
  Lives at the unlisted URL `ai4ntp.com/deck`. Page is `noindex,nofollow`.
- Slides are 1600x1000. Speaker notes go in `<aside class="notes">` (press `S`).

## Brand rules (non-negotiable)

- **Never use em dashes (—).** Commas, periods, parentheses, or restructure. Applies everywhere.
- Voice: direct, declarative, slightly understated. No hype, no hedging. Specific over generic. Brand line: "Translators, not oracles."
- Palette: Ink `#0F1113`, Cream `#FAF7F0`, Paper `#F4F1EA`, Signal lime `#D4FF3A`, Rust `#C4471C`, Fog (muted). Signal is the single pop, on ONE thing per slide.
- Type: Fraunces (display headlines, weight 300), Instrument Serif italic (the one highlighted word, via `<em>` or `.highlight`), JetBrains Mono (uppercase eyebrows/labels). System sans for body.
- Signature headline: a Fraunces line with exactly one word in lime italic. Use `<em>word</em>` (lime italic) or `<span class="highlight">word</span>` (lime box).
- Deck is dark (Ink) by default to match the episode decks. Add `class="paper"` to a `<section>` for a warm light slide if a page needs contrast.
- Logos: `/logo-primary-light.svg` on dark, `/logo-primary-dark.svg` on light, `/logo-monogram.svg` for the mark. Wordmark is `ai` + lime-boxed italic `4` + `ntp`, never recolored or stretched.
- Headshots render grayscale + slight contrast (already styled in `.host .pic img`). Real ones at `/sessions/001/images/{justin-novak,alec-saluga,ian-kilpatrick}.jpg`.

## Reusable components (in deck.css)

`.kpi-grid` / `.kpi` (big-number stats) · `.timeline` / `.tl-row` (episode rows) ·
`.tm-wall` / `.tm-card` (testimonial grid) · `.compare` / `.compare-col` (base vs
bull, monetization; add `.featured` to highlight one) · `.road` / `.road-col`
(roadmap columns) · `.roles-grid` / `.role-card` (add `.hire` for open roles) ·
`.opt-grid` / `.opt-card` (decision options; `.pro` and `.con` rows; add `.lean`
to mark the recommendation) · `.ask-grid` / `.ask-card` · `.pillar-grid`
(`.three` / `.four`) · `.callout` (`.signal` for lime) · `.eyebrow` (`.slash` for
the `//` motif) · `.stat-number` · `.signoff`.

**Placeholders:** wrap anything Justin still owes in `<span class="ph">[LABEL]</span>`.
It renders as a visible rust dashed chip and is greppable: `grep -n 'class="ph"' deck/index.html`.

## Slide order (14)

1. Cover · 2. Mission/Vision/Values · 3. Traction hero · 4. Episode timeline ·
5. Testimonials · 6. Monetization · 7. Growth base case · 8. Growth bull case ·
9. Vision · 10. Roadmap · 11. Roles & responsibilities · 12. Branding decision ·
13. The ask · 14. Sign-off / appendix.

## Source of truth (real facts, already in the repo)

- **Identity:** AI4NTP = "AI for Non-Techy People." Founder Justin Novak (T Minus Studios). Site ai4ntp.com.
- **Reach:** 450+ registrations across 001–003 from JPMorgan, Amazon, Carnegie Mellon, O'Reilly (real attendee affiliations). Ep004 narration cites "nearly a thousand" total signups in under a month. Confirm the exact total spend and cost-per-registrant with Justin (revops has the data).
- **Episodes:**
  - 001 (May 21) "How marketers are actually using AI to grow" — Justin, Alec, Ian. 110 reg, ~55 live (50%).
  - 002 (Jun 2) "We built a company with AI in under an hour" — Justin, Brett (co-mod), Ian, Alec. Built **GotoBuild** (AI workout planner), live at gotobuild.pro. Audience vote: GotoBuild 10, Yeskia 8, KartPass 4, Watchdog 3.
  - 003 (Jun 10) "Build your own AI Clone Agent in under an hour" — Justin, Ian. 250-seat Zoom cap.
  - 004 (Jun 18) "7 AI tools you've never heard of" — Alec, Justin + guest James Biernesser (Dartee Golf), live agentic-CRM demo. Invite-only, ~17 live, near-total retention.
- **Testimonials (verbatim, `/testimonials.js`):** Peggy Tsai (JPMorgan / Carnegie Mellon), Susan D'Elia (TECHMarket), Mark Yoldi (Innovate Labs), Farha Akhtar (iSoftStone), Johan Jimenez (Amazon / PLTFRM), Jennie Kimmel (O'Reilly), Sydney Kida Timmers (86 Repairs).
- **Monetization (`revops/README.md`):** cheap cold top-of-funnel is proven; revenue is the unbuilt bottleneck; next move is a paid offer + conversion step + 3 pilots, not more audience. ICP ≈ 72–88 of 315 unique people (B2B SMB marketing operators). No paid offer exists yet. `/partner` funnel exists for sponsors.
- **Growth model (`growth-plan-Y1.md`):** S1 baseline ~6,904 registrants, ~2,762 live, $49K–$421K Y1 revenue. S5 full-levers ~61,925 registrants, $257K–$1.7M. Compounding visible month 6+.
- **Team:** Justin (founder/host/GTM), Alec Saluga (Aero AI; build/demos), Ian Kilpatrick (BrandSauce.io; brand/agent builds), Brett Haralson (Quetzal Labs; ops/co-mod).
- **Channels:** YouTube @AI4NonTechyPeople, X @ai4ntp, Instagram @ai4ntp, newsletter ai4ntp.beehiiv.com.

## Open items Justin still owes (the placeholders)

Cover month/date · total spend + cost-per-registrant · live-attendee totals ·
monetization pricing (sponsor / affiliate / paid offer) · base + bull assumption
confirmation · Vision framing · roadmap specifics per column · the real roles
split + exact hires · branding lean · the funding ask (raise / reinvest / none).

## Verify before sharing

1. Open `deck/index.html`, arrow through all 14 sections. No console errors, fonts + lime + grain render, nothing overflows.
2. `grep -n 'class="ph"' deck/index.html` to see every remaining placeholder.
3. Headless-Chrome screenshot pass (the established AI4NTP habit). Check no em dashes, colors correct, logos load.
4. On Justin's go: `vercel --prod --yes`, confirm `ai4ntp.com/deck`, re-screenshot the live URL.
