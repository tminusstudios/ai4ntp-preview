# Session 002 · Attendee Emails

The post-registration sequence sent through Eventbrite and Zoom. This is where show rate is won or lost. Five touches before the call, plus optional SMS at T-1h.

001 baseline: 50% show rate. Target for 002: 60%. The T-24h and T-2h reminders are the biggest levers.

---

## Send architecture

| Email | Channel | Mechanism | Trigger |
|---|---|---|---|
| A. Confirmation | Eventbrite | Custom EB confirmation message | Instant on registration |
| B. T-7 days | Eventbrite | Manual send via EB dashboard ("Email attendees") | Tue May 26 (today) or as soon as published |
| C. T-24 hours | Eventbrite | Manual send via EB dashboard | Mon Jun 1, ~1 PM EST |
| D. T-2 hours | Eventbrite | Manual send via EB dashboard | Tue Jun 2, 11 AM EST |
| E. T-15 min go-live | Eventbrite | Manual send via EB dashboard | Tue Jun 2, 12:45 PM EST |

Zoom also auto-sends a registration confirmation with the unique join link when an attendee registers via Zoom. Do not overwrite that. Configure Zoom's confirmation under Webinar Settings → Email Settings → Confirmation Email to Registrants → keep default join link block, add a short branded paragraph above it (see "Zoom confirmation block" below).

---

## A. Eventbrite confirmation email

**Fires:** Instant on registration
**Configure in:** Eventbrite dashboard → Manage Events → Episode 002 → Order Options → Order Confirmation → "Message to attendees"

**Subject:** `You're in. Episode 002, June 2 at 1 PM EST.`

**Body:**

```
You're registered for AI4NTP Episode 002.

Tuesday, June 2, 2026
1:00 PM EST (60 minutes)
Live on Zoom

The Zoom registration link is in your Eventbrite confirmation. Complete the Zoom registration to get your unique join link. We'll resend it the morning of.

ADD TO CALENDAR
Click here to drop this on your calendar so you don't lose it: [CALENDAR_LINK]

WHAT YOU'RE WALKING INTO

Three founders, three screens, 15 minutes each. You vote on the company name and the vertical at minute 2. Whatever you pick is what gets built. By the top of the hour, the brand, website, and full marketing motion are live.

ONE FAVOR

Forward this to one person who would actually use it. A marketer, an operator, a founder who's still on the fence about AI. The format works better with a full room.

See you Tuesday.

Justin
AI4NTP

P.S. Three live-only giveaways and a grand prize. You have to be on the call to win. Block the hour now.
```

---

## B. T-7 days reminder

**Fires:** As soon as event is published (May 26) for registrants already in; then to all subsequent registrants in a wave on Tue May 26 evening
**Configure in:** Eventbrite dashboard → Manage Events → Episode 002 → Email Attendees → "Send Now"
**Audience:** All registrants

**Subject:** `One week out · Episode 002`

**Body:**

```
Quick heads up. Episode 002 is one week from today.

Tuesday, June 2 at 1 PM EST. 60 minutes. Live build. You vote on the brief.

We're capping live attendance at 500, and we're already past 50% of that.

If you want a seat in the live room (and the giveaways that come with it), make sure the calendar block is in. Add to calendar: [CALENDAR_LINK]

Justin
```

---

## C. T-24 hours reminder (HIGHEST LEVERAGE FOR SHOW RATE)

**Fires:** Mon Jun 1, ~1 PM EST (24h before live)
**Configure in:** Eventbrite dashboard → Manage Events → Episode 002 → Email Attendees → "Schedule"
**Audience:** All registrants

**Subject:** `Tomorrow at 1 PM EST · live build`

**Body:**

```
Tomorrow.

1 PM EST. 60 minutes. Three founders building a complete company live with AI.

THREE THINGS BEFORE YOU JOIN

1. Add the calendar block now if you haven't: [CALENDAR_LINK]
2. Test your Zoom: [ZOOM_LINK]
3. Have the chat open. You vote on the company name and vertical at minute 2. The whole session compounds on what you pick.

WHAT YOU'RE GETTING

- Live brand build by Ian (Disney, AMAs, Dove Award)
- Live website build by Alec (Lovable + Claude Code, deployed in 15)
- Live launch build by Justin (the full GTM motion in 15)
- Three giveaways drawn live, one per segment
- Grand prize starter pack at minute 56
- A free 30-min one-on-one with any of us, just for showing up

REPLAY POLICY
Replay goes to every registrant the next morning. Giveaways and the 30-min one-on-one go to live attendees only. Be there if you can.

Justin
```

---

## D. T-2 hours reminder (SECOND-HIGHEST LEVERAGE)

**Fires:** Tue Jun 2, 11 AM EST (2h before live)
**Configure in:** Eventbrite dashboard → Manage Events → Episode 002 → Email Attendees → "Schedule"
**Audience:** All registrants

**Subject:** `Two hours · join link inside`

**Body:**

```
Two hours.

1 PM EST. Click this when it's time:
[ZOOM_LINK]

Pre-flight checklist:
- Zoom link tested
- Chat ready (you vote on the brief at minute 2)
- Notepad open (you'll want to grab tool names and prompts)

See you on the inside.

Justin
```

---

## E. T-15 min go-live

**Fires:** Tue Jun 2, 12:45 PM EST (15 min before live)
**Configure in:** Eventbrite dashboard → Manage Events → Episode 002 → Email Attendees → "Schedule"
**Audience:** All registrants

**Subject:** `Live in 15 · click here`

**Body:**

```
Live in 15 minutes.

Join now and we'll be ready when you are:
[ZOOM_LINK]

Justin
```

---

## Zoom confirmation block (added to default Zoom confirmation email)

**Configure in:** Zoom portal → Webinars → Episode 002 → Email Settings → Confirmation Email to Registrants → Customize

Add this paragraph above the auto-generated join-link block. Do not remove the join-link block.

```
AI4NTP Episode 002: Build a Company with AI in Under an Hour

Three founders. 15 minutes each. One compounding build. You vote on the brief at minute 2.

By the top of the hour, the brand, website, and full marketing motion are live in production.

Live-only giveaways drawn during the session. Replay goes to all registrants the next morning. Bring a notepad.

Your unique join link is below. Save it now.
```

---

## Optional: SMS reminder at T-1h (+8 to 12 pt show rate lift)

Not currently in plan. If you want to add it:

1. Add an optional phone number field to the Eventbrite registration form (Eventbrite → Custom Questions → Add → Phone, mark as Optional)
2. Set up a Zapier or GHL flow off the EB registration webhook to collect phone + email into a list
3. Trigger SMS send via Twilio or GHL at 12:00 PM EST Tue Jun 2

**SMS body (160 chars):**

```
AI4NTP Episode 002 starts in 1 hr. Click to join: [ZOOM_LINK_SHORT]

Three founders, one company, built live with AI. Be there for the giveaways. Reply STOP to opt out.
```

---

## Pre-send checklist

Before scheduling C, D, and E in EB:

- [ ] Replace `[CALENDAR_LINK]` with the .ics file URL or Google Calendar add-event URL
- [ ] Replace `[ZOOM_LINK]` with each attendee's unique Zoom join URL. **Note:** Eventbrite cannot inject per-attendee Zoom links automatically. Two options:
  - **Option A (recommended):** Use Zoom's auto-send confirmation as the place where the unique join link lives. In EB reminders, link to a static "join page" on ai4ntp.com that says "your unique link is in the email Zoom sent you, search your inbox for 'us06web.zoom.us'."
  - **Option B:** Include the generic Zoom registration URL (https://us06web.zoom.us/webinar/register/WN_bFbbn0VqRxW47hR5hZVZTQ) in reminders, and instruct attendees to look for the join link from their Zoom confirmation email if they've already registered.
- [ ] Test-send each email to your own address before scheduling to all
- [ ] Confirm time zone of scheduled sends (EB uses event time zone by default)

---

## Post-event email (covered separately)

The post-event email with replay link, transcript, tool list, and 30-min booking links is handled via the Apps Script mailer at `/mailer/` per the playbook lesson on rate-limiting. See `/sessions/_template/post-webinar-playbook.md`.
