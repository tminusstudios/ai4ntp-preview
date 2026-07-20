/**
 * AI4NTP Post-Webinar Mailer
 *
 * Sends personalized recap emails to a list of recipients from your own
 * Gmail account. The email body is pulled from a Gmail draft you compose
 * in the normal Gmail UI. Recipients live in a Google Sheet.
 *
 * The script bridges the two: it reads each row of the sheet, replaces
 * {{first_name}} in the draft body, and sends one email per recipient.
 *
 * Setup and usage: see ./README.md
 *
 * Limits: 500 sends/day on personal Gmail, 1,500/day on Workspace.
 */

// ============================================================================
// CONFIG — update before each send
// ============================================================================

/**
 * A unique phrase that appears in the subject of the Gmail draft you want
 * to send. Used to find the right draft when multiple drafts exist.
 */
const DRAFT_SUBJECT_MATCH = 'AI4NTP Webinar Recap';

/** Display name on the From line. Most clients show this. */
const FROM_NAME = 'Justin Novak';

/**
 * Send-as address. Leave blank to use your default Gmail address.
 * If you have multiple send-as aliases (e.g. justin@ai4ntp.com vs
 * justin@tminusstudios.com), put the one you want here.
 */
const FROM_EMAIL = '';

/**
 * Pause between sends, in milliseconds.
 *
 * Google Workspace enforces an undocumented burst-detection heuristic
 * that flags senders above roughly 20-30 emails per minute, especially
 * newer domains without established sending history.
 *
 * 10,000 ms (10 seconds) puts you at 6 sends/minute, safely below any
 * threshold. A 65-recipient batch then takes ~11 minutes instead of ~2,
 * which is fine — the alternative is a 24-hour outbound block.
 *
 * If you have an established sending domain (months of clean traffic),
 * you can lower this to 5000 (12/min) or 3000 (20/min). Do not go below
 * 3000 unless you want to risk a temporary throttle.
 */
const RATE_LIMIT_MS = 10000;

// ============================================================================
// MAIN FUNCTIONS — run these from the Apps Script editor
// ============================================================================

/**
 * Log what would be sent without actually sending anything.
 * Run this first to verify the draft is found and the recipient list looks right.
 */
function dryRun() {
  const draft = findDraft();
  const message = draft.getMessage();
  const subject = message.getSubject();
  const recipients = getRecipients();

  const toSend = recipients.filter(r => !r.alreadySent);
  const alreadySent = recipients.filter(r => r.alreadySent);

  Logger.log('=== DRY RUN ===');
  Logger.log('Subject: "' + subject + '"');
  Logger.log('Total rows: ' + recipients.length);
  Logger.log('Already sent (will skip): ' + alreadySent.length);
  Logger.log('Will send: ' + toSend.length);
  Logger.log('');

  for (const r of recipients) {
    const tag = r.alreadySent ? '[SKIP, already sent]' : '[WILL SEND]';
    Logger.log(tag + ' ' + r.email + ' (' + r.firstName + ')');
  }

  Logger.log('');
  Logger.log('No emails were sent. To actually send, run sendBatch().');

  try {
    SpreadsheetApp.getUi().alert(
      'Dry run complete.\n\n' +
      'Will send: ' + toSend.length + '\n' +
      'Will skip (already sent): ' + alreadySent.length + '\n\n' +
      'See View → Logs in the script editor for the per-row list.'
    );
  } catch (e) {
    // No UI available (e.g. running from triggers). Logger output is enough.
  }
}

/**
 * Send the actual emails. Personalizes {{first_name}} per row and marks
 * each row with a timestamp in column C so re-runs don't duplicate.
 */
function sendBatch() {
  const draft = findDraft();
  const message = draft.getMessage();
  const subject = message.getSubject();
  const htmlBody = message.getBody();
  const plainBody = message.getPlainBody();

  const sheet = SpreadsheetApp.getActiveSheet();
  const recipients = getRecipients();

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const r of recipients) {
    if (r.alreadySent) {
      skipped++;
      continue;
    }

    const personalizedHtml = personalize(htmlBody, r.firstName);
    const personalizedPlain = personalize(plainBody, r.firstName);

    try {
      const opts = {
        htmlBody: personalizedHtml,
        name: FROM_NAME
      };
      if (FROM_EMAIL) opts.from = FROM_EMAIL;

      GmailApp.sendEmail(r.email, subject, personalizedPlain, opts);

      // Stamp sent_at in column C
      sheet.getRange(r.row, 3).setValue(new Date());
      sent++;

      Utilities.sleep(RATE_LIMIT_MS);
    } catch (err) {
      Logger.log('FAILED: ' + r.email + ' — ' + err.toString());
      failed++;
      failures.push(r.email);
    }
  }

  const summary =
    'Done.\n' +
    'Sent: ' + sent + '\n' +
    'Skipped (already sent): ' + skipped + '\n' +
    'Failed: ' + failed +
    (failures.length ? '\n\nFailed addresses:\n' + failures.join('\n') : '');

  Logger.log(summary);
  try {
    SpreadsheetApp.getUi().alert(summary);
  } catch (e) {
    // No UI — log is enough.
  }
}

/**
 * Reset the sent_at column to empty, so you can re-send if you really want to.
 * Use carefully — this does NOT un-send the emails Gmail already sent.
 */
function resetSentStatus() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  sheet.getRange(2, 3, lastRow - 1, 1).clearContent();
  Logger.log('Cleared sent_at for rows 2 through ' + lastRow + '.');
  try {
    SpreadsheetApp.getUi().alert('Cleared sent_at column. The next sendBatch() will send to all rows again.');
  } catch (e) {}
}

// ============================================================================
// INTERNALS
// ============================================================================

/** Find the Gmail draft whose subject contains DRAFT_SUBJECT_MATCH. */
function findDraft() {
  const drafts = GmailApp.getDrafts();
  for (const draft of drafts) {
    if (draft.getMessage().getSubject().indexOf(DRAFT_SUBJECT_MATCH) !== -1) {
      return draft;
    }
  }
  throw new Error(
    'No Gmail draft found with subject containing: "' + DRAFT_SUBJECT_MATCH + '". ' +
    'Either fix DRAFT_SUBJECT_MATCH at the top of this script, or save your draft with that phrase in the subject.'
  );
}

/** Read all recipient rows from the active sheet. */
function getRecipients() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const recipients = [];

  // Row 1 is the header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const email = row[0];
    const firstName = row[1];
    const sentAt = row[2];

    if (!email) continue;
    const emailStr = String(email).trim();
    if (emailStr.indexOf('@') === -1) continue;

    recipients.push({
      row: i + 1, // 1-indexed for sheet ranges
      email: emailStr,
      firstName: (firstName ? String(firstName).trim() : '') || 'there',
      alreadySent: !!sentAt
    });
  }

  return recipients;
}

/** Substitute {{first_name}} (case-insensitive) in the body. */
function personalize(body, firstName) {
  return body.replace(/\{\{\s*first_name\s*\}\}/gi, firstName);
}
