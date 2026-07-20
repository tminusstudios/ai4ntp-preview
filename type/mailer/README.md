# AI4NTP Post-Webinar Mailer

Send personalized recap emails to your registration list, from your own Gmail, for free. Reusable for every future AI4NTP session. No extensions, no third-party services.

## How it works

You write the email in Gmail as a draft (where you can preview formatting, embed images, see the signature). You keep the recipient list in a Google Sheet (paste from your Zoom export). A short Apps Script bridges the two: it reads each row, replaces `{{first_name}}` in the draft body, and sends one email per recipient.

This is exactly what paid tools like GMass and YAMM do under the hood, just without the subscription.

---

## One-time setup (~15 minutes)

### 1. Create the recipient sheet

Open Google Sheets at https://sheets.new. Title it `AI4NTP Mailer`. Build the header row exactly like this:

| A: email | B: first_name | C: sent_at |
|---|---|---|

Leave column C blank for now. The script will fill it in automatically.

For Session 001, export your Zoom registration report as CSV, then paste the email and first-name columns into A and B. (If your CSV has more columns, just paste the two you need.)

### 2. Open the Apps Script editor

In the Sheet: **Extensions → Apps Script**. A new tab opens with an empty `Code.gs` file containing some default `function myFunction() {}` boilerplate. Delete all of it.

### 3. Paste the script

Open [`code.gs`](./code.gs) from this folder. Copy the entire contents. Paste into the Apps Script editor. Click the disk icon (or `Cmd+S`) to save.

Give the Apps Script project a name like `AI4NTP Mailer` when prompted.

### 4. Grant permissions

In the function dropdown at the top of the editor, select `dryRun`. Click the ▶ Run button.

Google will pop up an authorization screen. It needs access to:
- **Gmail** (read your drafts, send mail on your behalf)
- **Sheets** (read the active sheet)

Click through. You'll see "Google hasn't verified this app" — that's expected for personal Apps Script. Click "Advanced" → "Go to AI4NTP Mailer (unsafe)" → "Allow." You only do this once.

---

## Sending an email (per session, ~3 minutes)

### 1. Compose the email in Gmail

Open Gmail. Click Compose. Write the email exactly as you want recipients to see it:

- **To:** leave blank. The script fills this per row.
- **Subject:** the subject everyone will see. For Session 001, e.g. `AI4NTP Webinar Recap + Surprise Bonus`.
- **Body:** use `{{first_name}}` anywhere you want the recipient's first name to merge in. Example opening: `Hey {{first_name}},`
- **Signature:** your default Gmail signature is appended automatically. The on-brand signature you already installed will show on every send.

Do NOT click Send. Click the **X** at the top right of the compose window. Gmail auto-saves it to Drafts. Verify the draft exists by checking your Drafts folder.

### 2. Tell the script which draft to use

In the Apps Script editor, find this line near the top:

```js
const DRAFT_SUBJECT_MATCH = 'AI4NTP Webinar Recap';
```

Update the string to a unique phrase that appears in your draft's subject. The script searches all your drafts and picks the first one matching this phrase. Save with `Cmd+S`.

### 3. Dry-run first

In the editor's function dropdown, select `dryRun`. Click ▶ Run. A dialog will summarize what would be sent. Check the Execution log (`View → Executions` or `Ctrl+Enter`) for the per-row list.

If something looks wrong — wrong recipients, wrong subject — fix the Sheet or the draft, then dry-run again.

### 4. Send for real

Switch the function dropdown to `sendBatch`. Click ▶ Run.

The script sends one email per row, with a 1.5-second pause between sends. For 67 recipients, the whole batch takes about two minutes. When it finishes, a dialog summarizes how many sent, how many were skipped, how many failed.

Each row that got sent gets a timestamp in column C, so if you re-run later, already-sent rows are skipped automatically.

---

## Limits

- **Personal Gmail:** 500 emails per 24 hours.
- **Google Workspace:** 1,500 emails per 24 hours.

Well clear of any AI4NTP session in the foreseeable future.

---

## If something breaks

**"No Gmail draft found with subject containing..."**
The script can't find your draft. Either the draft was deleted, or the subject doesn't contain `DRAFT_SUBJECT_MATCH`. Fix the subject in Gmail or the match string in the script.

**"Service Spreadsheets failed while accessing document with id ..."**
You ran the script from the editor without an active Sheet bound. Open your Sheet first, then go to Extensions → Apps Script from the Sheet (don't open the script project standalone).

**Some recipients failed**
Check the Execution log. Most common cause is a malformed email in column A. Fix the row, then re-run `sendBatch` (it'll only retry the un-stamped rows).

**Hit the daily limit mid-send**
The script stops when Gmail refuses. Wait 24 hours and re-run `sendBatch` — it picks up where it left off.

---

## Adapting for Session 002

1. Open the same Sheet (or duplicate it for a fresh slate).
2. Clear or replace rows 2+ with the new session's recipient list. Wipe column C.
3. Compose the new Session 002 email in Gmail. Save as draft.
4. Update `DRAFT_SUBJECT_MATCH` to a unique phrase from the new draft's subject.
5. Run `dryRun`, then `sendBatch`.

Total time: about 3 minutes once the system is set up.

---

## Why this beats GMass / YAMM for your use case

- **Cost:** free forever vs $20+/mo (GMass) or $24+/yr (YAMM).
- **Data:** stays inside your Google account. No third-party service sees your list or your emails.
- **Deliverability:** sends literally from your Gmail via Google's servers. Same deliverability as a normal hand-sent email.
- **Customization:** the script is 100 lines, fully readable, easy to extend (custom merge fields, throttling, A/B subjects, scheduled sends).

The only thing you give up is the GMass-style open/click tracking dashboard. If that becomes important after a few sessions, we can add UTM links + a simple Sheet-backed tracker.
