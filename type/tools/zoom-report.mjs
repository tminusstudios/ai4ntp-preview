// zoom-report.mjs — pull a webinar's attendee list straight from the Zoom Report API,
// so the reconciler needs no manual CSV export. Reuses the same Server-to-Server OAuth
// app as api/zoom-register.js (ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET).
//
// Requires the S2S app to have the "report:read:admin" scope (or the granular
// report:read:list_webinar_participants:admin) and a paid Zoom plan (reports are not on free).
//
// Exported: getWebinarAttendees({ webinarId, minMinutes }) -> { webinarId, source, emails:Set, byEmail:Map, names:Map }
// Standalone (no imports from api/, which is ESM-in-Vercel and would not resolve as a local CJS .js).

import { Buffer } from 'node:buffer';

const OAUTH = 'https://zoom.us/oauth/token';
const API = 'https://api.zoom.us/v2';

// The participants report includes the hosts/panelists (operators), which the CSV "Attendee
// Details" section excludes. Drop them so both paths agree and operators are never processed
// as referred attendees. Override/extend via RECONCILE_EXCLUDE_EMAILS (comma-separated) in .env.
const EXCLUDE_EMAILS = new Set(
  (process.env.RECONCILE_EXCLUDE_EMAILS ||
    'justin@tminusstudios.com,ian@ianpk.com,alec@workwithaero.com,brett@ai4ntp.com')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
);

async function getToken() {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  if (!accountId || !clientId || !clientSecret) {
    throw new Error('Zoom creds missing. Set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET in .env (same values as Vercel).');
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(`${OAUTH}?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Zoom OAuth ${res.status}: ${text}`);
  return JSON.parse(text).access_token;
}

async function zoomGet(token, path) {
  const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` } });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data, text };
}

// Decide which webinar to report on: explicit flag > ZOOM_WEBINAR_ID env > most-recent past webinar.
async function resolveWebinarId(token, explicit) {
  if (explicit) return { id: String(explicit), source: 'flag' };
  if (process.env.ZOOM_WEBINAR_ID) return { id: String(process.env.ZOOM_WEBINAR_ID), source: 'env(ZOOM_WEBINAR_ID)' };
  // Best-effort auto-detect: the most recent webinar whose start time is in the past.
  const r = await zoomGet(token, '/users/me/webinars?type=past&page_size=100');
  if (r.ok && Array.isArray(r.data.webinars) && r.data.webinars.length) {
    const past = r.data.webinars
      .filter((w) => w.start_time)
      .map((w) => ({ id: String(w.id), t: new Date(w.start_time).getTime(), topic: w.topic || '' }))
      .sort((a, b) => b.t - a.t);
    if (past.length) return { id: past[0].id, source: 'auto-past', topic: past[0].topic };
  }
  throw new Error('No webinar id available. Set ZOOM_WEBINAR_ID in .env or pass --webinar=<id>.');
}

export async function getWebinarAttendees({ webinarId, minMinutes = 0 } = {}) {
  const token = await getToken();
  const resolved = await resolveWebinarId(token, webinarId);
  const id = resolved.id;

  const byEmail = new Map(); // email -> total seconds across rejoins
  const names = new Map();
  let next = '';
  let pages = 0;
  do {
    const q = `/report/webinars/${encodeURIComponent(id)}/participants?page_size=300`
      + (next ? `&next_page_token=${encodeURIComponent(next)}` : '');
    const r = await zoomGet(token, q);
    if (!r.ok) {
      if (r.status === 400 && /scope/i.test(r.text)) {
        throw new Error(`Zoom report scope missing. Add "report:read:admin" to the S2S OAuth app and reactivate it. (${r.text})`);
      }
      if (r.status === 404) {
        throw new Error(`Webinar ${id} has no participant report yet (wrong id, or the webinar has not finished / report not generated). (${r.text})`);
      }
      throw new Error(`Zoom report ${r.status}: ${r.text}`);
    }
    for (const p of (r.data.participants || [])) {
      const email = (p.user_email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) continue;
      if (EXCLUDE_EMAILS.has(email)) continue; // skip hosts/panelists (operators)
      byEmail.set(email, (byEmail.get(email) || 0) + (Number(p.duration) || 0));
      if (p.name && !names.has(email)) names.set(email, p.name);
    }
    next = r.data.next_page_token || '';
    pages++;
  } while (next && pages < 50);

  const emails = new Set();
  for (const [email, secs] of byEmail) {
    if (minMinutes > 0 && secs / 60 < minMinutes) continue;
    emails.add(email);
  }
  return { webinarId: id, source: resolved.source, topic: resolved.topic || '', emails, byEmail, names, pages };
}
