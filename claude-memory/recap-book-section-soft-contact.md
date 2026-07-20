---
name: recap-book-section-soft-contact
description: Recap page
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 302ee0c3-2af4-467b-9862-4370bec71b74
---

On post-webinar recap pages, the `#book` section should NOT hard-pitch "Book a 30-minute call." Instead, per presenter, use a soft "Get in touch with Justin" / "Get in touch with Alec" card that links that person's LinkedIn, the shared `/calendar` booking link, and their email.

**Why:** Justin wants the recap to feel like a low-pressure relationship open, not a sales push. The hard 30-min CTA (as written in the post-webinar-playbook.md `#book` step and used on the 002 recap) reads as too aggressive.

**How to apply:** When transforming `sessions/<id>/index.html` into a recap, build per-operator soft contact cards in `#book`. Keep the `data-book-cta="<operator-slug>"` analytics attribute on the primary link so `book_30_min_click` still fires. This overrides the playbook's "Speaker cards gain a 'Book 30 min →' button" / compact booking-card wording. See [[ai4ntp-deploy-and-preview]].
