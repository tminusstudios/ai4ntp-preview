---
name: ai4ntp-zoom-funnel-leak
description: "Why AI4NTP session registrations drop at the Zoom step, and the fixes (Zoom copy stack + kill the double form)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 75df2d27-b58b-461f-82f1-30842a45a0d4
---

Diagnosed June 17, 2026 for Episode 004 ("7 AI tools you've never heard of," June 18). Symptom: clicks fine, but **Zoom completed registrations** down vs 001-003. The email copy was NOT the problem.

Two structural leaks in the funnel (site form captures email to Supabase, then redirects to Zoom's OWN registration form):

1. **The double-entry.** People type their email on the site, then Zoom asks for name + email again. A chunk abandons the second form. Fix ladder: trim the Zoom form to email+name, approval OFF, no custom questions (10-min fix); the permanent fix is **Zoom registration API auto-registration** so the site form registers them directly and shows the join link, no second form. Tagged as the 005 backlog item.

2. **The Zoom registration-page description copy.** This is the last copy a fence-sitter reads before committing, and 004's had degraded to a 30-word reminder ("show you a demo... see you there"), written as if for someone already registered. 001-003 all ran the same persuasion stack and converted; 004 dropped every element.

**The winning Zoom-copy skeleton (001-003 all had it, reuse for every session):**
hook with concrete outcome + time box ("in under an hour") -> what you'll walk out able to DO -> who it's for ("this is for you if") -> quick operator proof -> a **live-only incentive** (001 = free 30-min session, 002 = live giveaways, 003 = OpenClaw Starter Kit; the single biggest lever and the one copy can't fake) -> replay risk-reversal ("replay to all registrants next morning") -> notepad/beverage + warm close. 001 (~260 words) is the gold-standard template.

**Final-push play (highest ROI):** the warm-bailer recovery email. People who captured on the site but never finished Zoom are warm leads sitting in Beehiiv; email them a direct one-form Zoom link. Segment = Supabase `signups` minus Zoom registrants. Then re-hit the 001 ICP segment in `revops/` (converted ~80%) before any cold outreach.

Related: [[ai4ntp-deploy-and-preview]].
