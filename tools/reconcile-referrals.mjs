#!/usr/bin/env node
// reconcile-referrals.mjs — mark referrals as "attended" from a Zoom attendee report.
//
// Part of the post-webinar playbook. Flips matching referrals from 'pending' -> 'attended',
// which activates a referrer's reward (the live counter is signup-based; the reward CLAIM is
// attendance-gated). Idempotent and re-runnable (only pending -> attended).
//
// AUTOMATED USAGE (the common case — no key pasting, no CSV cleaning):
//   1. Once: put your Supabase service-role key in a local .env at the repo root:
//        SUPABASE_SERVICE_ROLE_KEY=eyJ...   (copy .env.example -> .env; never commits/deploys)
//   2. Every session: export the Zoom attendee report and drop it in ~/Downloads or
//        revops/attendees/, then run:
//        node tools/reconcile-referrals.mjs                 # auto-finds newest CSV, auto-loads .env
//
// The script auto-loads .env, auto-discovers the newest attendee CSV if you do not pass one,
// and reads the RAW Zoom multi-section report directly (it finds the "Attendee Details"
// section on its own — no manual cleaning). You can still pass an explicit path.
//
// ZERO-CSV mode (--zoom): pull attendance straight from the Zoom Report API instead of a CSV,
// using the same S2S OAuth app as api/zoom-register.js. Add ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID /
// ZOOM_CLIENT_SECRET / ZOOM_WEBINAR_ID to .env, and give the S2S app the "report:read:admin" scope.
//   node tools/reconcile-referrals.mjs --zoom                 # uses ZOOM_WEBINAR_ID from .env
//   node tools/reconcile-referrals.mjs --zoom --webinar=123   # override the webinar id
//
// Flags:
//   --check            Parse/pull + report the attendee count and exit. No Supabase key, nothing written.
//   --dry-run          Look up referral matches but write nothing. (Needs the key.)
//   --min-minutes=5    Only credit attendees who watched >= N minutes (drops fly-bys).
//   --zoom             Pull attendance from the Zoom API instead of a CSV.
//   --webinar=<id>     With --zoom, report on this webinar id (default: ZOOM_WEBINAR_ID, else newest past).
//
// Column detection: finds the header row containing an "Attended" (Yes/No) column and an
// "Email" column anywhere in the file, then reads the section under it. Also honors
// "Time in Session (minutes)". Unmatched attendees are reported for manual review.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const THRESHOLDS = [3, 5, 10, 20, 50]; // Insider / VIP / Inner Circle / Vanguard / Legend
const CHUNK = 80;
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ---- tiny .env loader (no dependency). Repo-root .env wins for unset vars. ----
function loadEnv() {
  const envPath = join(REPO_ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnv();

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
let csvPath = args.find((a) => !a.startsWith('--'));
const dryRun = !!flags['dry-run'];
const checkOnly = !!flags['check'];
const minMinutes = flags['min-minutes'] ? Number(flags['min-minutes']) : 0;

// ---- auto-discover the newest attendee CSV if none was passed ----
function discoverCsv() {
  const dirs = [join(REPO_ROOT, 'revops', 'attendees'), join(homedir(), 'Downloads')];
  // Prefer a Zoom attendee export; fall back to our *-leads.csv archives.
  const re = /(attendee.*\.csv|.*attendee.*\.csv|.*-leads\.csv)$/i;
  const cands = [];
  for (const d of dirs) {
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d)) {
      if (!re.test(f)) continue;
      // skip our already-cleaned derivative so we always start from the source of truth
      if (/-attendees-clean\.csv$/i.test(f)) continue;
      const p = join(d, f);
      try { cands.push({ p, m: statSync(p).mtimeMs }); } catch {}
    }
  }
  cands.sort((a, b) => b.m - a.m);
  return cands.length ? cands[0].p : null;
}
if (!flags.zoom && !csvPath) {
  csvPath = discoverCsv();
  if (!csvPath) {
    console.error('No attendee CSV passed and none found in revops/attendees/ or ~/Downloads.');
    console.error('Export the Zoom attendee report and drop it there, pass a path, or use --zoom to pull from the Zoom API.');
    process.exit(1);
  }
  console.log('Auto-selected newest attendee CSV: ' + csvPath);
}

// Minimal RFC-4180 CSV parser (handles quoted fields with embedded commas/newlines).
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* ignore */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// A header row has both an "Attended" and an "Email" column.
const isHeaderRow = (row) => {
  const h = row.map((c) => String(c).trim());
  return h.some((c) => /^attended$/i.test(c)) && h.some((c) => /^email$/i.test(c));
};
const nonEmpty = (row) => row.filter((c) => String(c).trim()).length;

// Where a data section ends: a section-title row (one non-empty cell), a blank row, or the
// start of another header. Zoom separates Host/Panelist/Attendee sections with single-cell
// title rows, not blanks.
function sectionEnd(rows, start) {
  let end = start;
  while (end < rows.length && nonEmpty(rows[end]) > 1 && !isHeaderRow(rows[end])) end++;
  return end;
}

// Find the header for the ATTENDEE section specifically. The Zoom report also has Host and
// Panelist sections that share the same "Attended/Email/Time in Session" columns, so we must
// not pick those (they would credit the hosts, not the audience).
function findHeader(rows) {
  // 1) The header directly under an "Attendee Details" section title (unambiguous).
  for (let i = 0; i < rows.length - 1; i++) {
    if (/^attendee details$/i.test((rows[i][0] || '').trim())) {
      for (let j = i + 1; j < rows.length; j++) {
        if (nonEmpty(rows[j]) <= 1) break;
        if (isHeaderRow(rows[j])) return j;
      }
    }
  }
  // 2) Fallback (e.g. an already-cleaned single-section CSV): the header whose data
  //    section is largest. Attendee Details dwarfs Host (1) and Panelist (2).
  let bestIdx = -1, bestSize = -1;
  for (let i = 0; i < rows.length; i++) {
    if (!isHeaderRow(rows[i])) continue;
    const size = sectionEnd(rows, i + 1) - (i + 1);
    if (size > bestSize) { bestSize = size; bestIdx = i; }
  }
  return bestIdx;
}

function inFilter(col, values) {
  const list = '(' + values.map((v) => '"' + String(v).replace(/["\\]/g, '') + '"').join(',') + ')';
  return `${col}=in.${encodeURIComponent(list)}`;
}
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

let KEY;
function sb(path, init = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

// Read the attendee email set from a (raw or clean) Zoom CSV.
function getAttendedFromCsv() {
  const rows = parseCSV(readFileSync(csvPath, 'utf8'));
  if (!rows.length) { console.error('Empty CSV.'); process.exit(1); }
  const hIdx = findHeader(rows);
  if (hIdx < 0) {
    console.error('Could not find a header row with "Attended" and "Email" columns anywhere in the file.');
    console.error('Is this a Zoom attendee report? First row was:\n' + (rows[0] || []).join(' | '));
    process.exit(1);
  }
  const header = rows[hIdx].map((h) => h.trim());
  const iAttended = header.findIndex((h) => /^attended$/i.test(h));
  const iEmail = header.findIndex((h) => /^email$/i.test(h));
  const iMinutes = header.findIndex((h) => /time in session/i.test(h));
  if (hIdx > 0) console.log(`Detected Zoom report; using the "${header[0]}...Email" section at row ${hIdx + 1}.`);

  const dataEnd = sectionEnd(rows, hIdx + 1); // bound to the attendee section only
  const attended = new Set();
  for (let r = hIdx + 1; r < dataEnd; r++) {
    const cells = rows[r];
    if (!cells) continue;
    if (cells.length <= iEmail) continue;
    if (!/^yes$/i.test((cells[iAttended] || '').trim())) continue;
    if (minMinutes > 0 && iMinutes >= 0) {
      const m = Number((cells[iMinutes] || '').trim());
      if (Number.isFinite(m) && m < minMinutes) continue;
    }
    const email = (cells[iEmail] || '').trim().toLowerCase();
    if (email && email.includes('@')) attended.add(email);
  }
  console.log(`Attendees (Attended=Yes${minMinutes ? `, >=${minMinutes}min` : ''}): ${attended.size}`);
  return attended;
}

async function main() {
  let attended;
  if (flags.zoom) {
    // Pull attendance straight from the Zoom Report API (no CSV export needed).
    const { getWebinarAttendees } = await import('./zoom-report.mjs');
    const r = await getWebinarAttendees({ webinarId: flags.webinar, minMinutes });
    attended = r.emails;
    console.log(`Pulled from Zoom webinar ${r.webinarId} (${r.source}${r.topic ? ': ' + r.topic : ''}): ${attended.size} attendee(s)${minMinutes ? `, >=${minMinutes}min` : ''} across ${r.pages} page(s).`);
  } else {
    attended = getAttendedFromCsv();
  }

  if (!attended.size) { console.log('Nothing to reconcile.'); return; }

  if (checkOnly) {
    console.log('[--check] OK. No Supabase key used, nothing written.');
    [...attended].slice(0, 30).forEach((e) => console.log('  - ' + e));
    if (attended.size > 30) console.log(`  ...and ${attended.size - 30} more`);
    return;
  }

  KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!KEY || KEY === 'REPLACE_WITH_YOUR_SERVICE_ROLE_KEY') {
    console.error('\nSUPABASE_SERVICE_ROLE_KEY is not set.');
    console.error('Put it in a local .env at the repo root (one time):');
    console.error('  cp .env.example .env   then paste the key from');
    console.error('  Supabase dashboard -> Project Settings -> API -> service_role (secret).');
    console.error('Then re-run. (.env never commits or deploys.) Use --check to test parsing without a key.');
    process.exit(1);
  }

  const emails = [...attended];

  let pending = [];
  for (const c of chunk(emails, CHUNK)) {
    const res = await sb(`/ai4ntp_referrals?status=eq.pending&${inFilter('referred_email', c)}&select=id,code,referred_email`);
    if (!res.ok) throw new Error(`lookup ${res.status}: ${await res.text()}`);
    pending = pending.concat(await res.json());
  }

  let matchedEmails = new Set();
  for (const c of chunk(emails, CHUNK)) {
    const res = await sb(`/ai4ntp_referrals?${inFilter('referred_email', c)}&select=referred_email`);
    if (!res.ok) throw new Error(`match ${res.status}: ${await res.text()}`);
    (await res.json()).forEach((r) => matchedEmails.add(r.referred_email));
  }
  const unmatched = emails.filter((e) => !matchedEmails.has(e));

  if (!pending.length) {
    console.log('No pending referrals to promote (already reconciled, or none of these attendees were referred).');
    console.log(`Attendees with no matching referral: ${unmatched.length}`);
    return;
  }

  const codes = [...new Set(pending.map((p) => p.code))];
  const beforeByCode = {};
  for (const c of chunk(codes, CHUNK)) {
    const res = await sb(`/ai4ntp_referrals?${inFilter('code', c)}&status=in.(attended,rewarded)&select=code`);
    if (!res.ok) throw new Error(`before-count ${res.status}: ${await res.text()}`);
    (await res.json()).forEach((r) => { beforeByCode[r.code] = (beforeByCode[r.code] || 0) + 1; });
  }
  const promotedByCode = {};
  pending.forEach((p) => { promotedByCode[p.code] = (promotedByCode[p.code] || 0) + 1; });

  console.log(`\nPending referrals matched: ${pending.length} across ${codes.length} referrer(s).`);

  if (dryRun) {
    console.log('\n[dry-run] No changes written.');
  } else {
    const promoteEmails = pending.map((p) => p.referred_email);
    for (const c of chunk(promoteEmails, CHUNK)) {
      const res = await sb(`/ai4ntp_referrals?status=eq.pending&${inFilter('referred_email', c)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'attended', attended_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`promote ${res.status}: ${await res.text()}`);
    }
    console.log(`Promoted ${pending.length} referral(s) to 'attended'.`);
  }

  console.log('\nMilestone crossings:');
  let any = false;
  for (const code of codes) {
    const before = beforeByCode[code] || 0;
    const after = before + (promotedByCode[code] || 0);
    const crossed = THRESHOLDS.filter((t) => before < t && after >= t);
    if (crossed.length) { any = true; console.log(`  ${code}: ${before} -> ${after} attended  (crossed ${crossed.join(', ')})`); }
  }
  if (!any) console.log('  (none this run)');

  console.log(`\nAttendees with no matching referral: ${unmatched.length}` + (unmatched.length ? ' (review manually)' : ''));
  if (unmatched.length && unmatched.length <= 25) unmatched.forEach((e) => console.log('  - ' + e));
}

main().catch((err) => { console.error('reconcile failed:', err); process.exit(1); });
