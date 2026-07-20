---
name: ai4ntp-partner-titles
description: "Sitewide bio convention: Justin, Ian, and Alec are all titled 'Partner at AI4NTP'; Alec's 'Aero AI' branding was scrubbed everywhere"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5f91f829-0804-4950-9bb4-2baf88a76369
---

As of July 13, 2026, all three principals use the single title **"Partner at AI4NTP"** in every user-facing bio sitewide (host/speaker/booking cards, tool-directory pages, JSON-LD `jobTitle`, `llms.txt`). This replaced the old per-person titles: Justin "Founder & Host, AI4NTP / T-Minus Studios", Ian "Founder, BrandSauce(.io)", Alec "Founder, Aero AI".

**Alec Saluga's "Aero AI" was removed everywhere** (title, bio prose, OG/meta descriptions, JSON-LD `worksFor`, and his `workwithaero.com` booking link, which now points to `/calendar`). His bio now reads "builds and deploys AI-driven marketing and websites." Do NOT reintroduce Aero AI. Ian keeps BrandSauce and Justin keeps T-Minus Studios in their BIO PROSE (only their TITLE line changed); only Alec lost his company mention.

**Where the data lives:** the 50+ tool pages get bios from the `PEOPLE` map in `tools/directory/generate.mjs` (edit there + `node tools/directory/generate.mjs`, never the generated HTML). Session/about/deck pages are hand-authored. Session 005 shows the three by build-project + session function only (no company title line). Applied via a sitewide sweep; see [[ai4ntp-session-006-landing]]. When building any NEW session/bio page, title them "Partner at AI4NTP".
