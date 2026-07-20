// GET /api/zoom-drip — paced ("trickle") backfill of the whole email list onto the webinar.
//
// Invoked by a Vercel cron every minute. Registers people onto the current webinar at an
// organic, randomized cadence: a random 1-5 minute gap between registrations (derived from the
// last registration time, so it is stable between ticks) plus a sub-minute jitter, so Zoom never
// sees a burst. When the list is exhausted it no-ops. Runs server-side (reuses the same env vars).
//
// Scope: ALL unique emails ever collected across every email-capturing Supabase table
// (signups + ai4ntp_signups + partner apps + live-session pulse tables). Emails are lowercased
// and de-duplicated, and anyone already in ai4ntp_zoom_registrations is skipped, so each person
// is registered / emailed exactly once no matter how many times or where they signed up.
//
// Auth: Vercel cron sends `Authorization: Bearer <CRON_SECRET>`. Manual calls pass
// `?secret=<ZOOM_SYNC_SECRET>`. `?status=1` reports progress with no side effects.
// `?n=K` (manual only) registers up to K immediately, bypassing the pacing gate (to finish faster).

import { deriveName, addWebinarRegistrant, getCurrentWebinar } from './zoom-register.js';

export const config = { maxDuration: 60 };

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';

// Every email-capturing table. Only ai4ntp_signups has first_name; elsewhere the name is
// derived from the email. Missing tables/columns are skipped, not fatal.
const SIGNUP_TABLES = [
  { table: 'ai4ntp_signups', select: 'email,first_name' },
  { table: 'signups', select: 'email' },
  { table: 'ai4ntp_partner_apps', select: 'email' },
  { table: 'ai4ntp_pulse_001', select: 'email' },
  { table: 'ai4ntp_pulse_002', select: 'email' },
  { table: 'ai4ntp_pulse_003', select: 'email' },
  { table: 'ai4ntp_pulse_005', select: 'email' },
];

// Pacing: register a few per cron tick, each after a random 15-35s gap, within a ~52s
// per-tick budget (under maxDuration). Averages ~2/min => ~80 people in ~40 min, still
// well spread out (never a burst) and comfortably under Zoom's rate limits.
const GAP_MIN_MS = 15 * 1000;
const GAP_MAX_MS = 35 * 1000;
const TICK_BUDGET_MS = 52 * 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sb(path, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

// All unique emails across every table (first occurrence keeps the name). Fail-open per table.
async function loadSignups() {
  const map = new Map(); // email -> first_name|null
  const report = [];
  for (const { table, select } of SIGNUP_TABLES) {
    let added = 0, error = null;
    try {
      let offset = 0;
      const limit = 1000;
      for (;;) {
        const r = await sb(`/${table}?select=${select}&order=created_at.asc&limit=${limit}&offset=${offset}`);
        if (!r.ok) { error = `${r.status}`; break; }
        const rows = await r.json();
        for (const row of rows) {
          const e = (row.email || '').trim().toLowerCase();
          if (e && e.includes('@') && !map.has(e)) { map.set(e, (row.first_name || '').trim() || null); added++; }
        }
        if (rows.length < limit) break;
        offset += limit;
      }
    } catch (e) { error = String(e.message || e); }
    report.push({ table, added, error });
  }
  return { map, report };
}

async function loadRegistered() {
  const set = new Set();
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const r = await sb(`/ai4ntp_zoom_registrations?select=email&limit=${limit}&offset=${offset}`);
    if (!r.ok) throw new Error(`ledger ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    rows.forEach((x) => set.add((x.email || '').trim().toLowerCase()));
    if (rows.length < limit) break;
    offset += limit;
  }
  return set;
}

async function registerOne(email, firstName, webinarId, sessionLabel) {
  const { first_name, last_name } = deriveName(email, firstName, null);
  const result = await addWebinarRegistrant(webinarId, { email, first_name, last_name });
  await sb('/ai4ntp_zoom_registrations?on_conflict=email', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      email, session: sessionLabel, webinar_id: String(webinarId),
      registrant_id: result.registrant_id, join_url: result.join_url,
    }),
  });
  return result.status;
}

// Record a terminal failure (panelist, per-registrant daily cap, invalid) as a skip row so it
// stops being retried every tick and stops blocking completion. Kept out of the "real" count
// by the `skip:` session prefix.
async function recordSkip(email, reason) {
  await sb('/ai4ntp_zoom_registrations?on_conflict=email', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ email, session: 'skip:' + reason, webinar_id: null, registrant_id: null, join_url: null }),
  });
}

// Skip permanent failures; back off (retry later) only on a transient/global rate limit.
async function handleRegError(email, err, errors) {
  const msg = String(err.message || err);
  errors.push({ email, error: msg });
  if (msg.includes('for the registrant') || /Zoom registrant 400/.test(msg)) {
    try { await recordSkip(email, msg.includes('for the registrant') ? 'reg-daily-cap' : 'rejected'); } catch { /* noop */ }
  } else if (msg.includes('429')) {
    await sleep(3000);
  }
}

async function nextRemaining() {
  const [{ map, report }, registered] = await Promise.all([loadSignups(), loadRegistered()]);
  const remaining = [...map.keys()].filter((e) => !registered.has(e));
  return { map, report, registeredCount: registered.size, remaining };
}

export default async function handler(req, res) {
  const cronOk = process.env.CRON_SECRET && req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;
  const manualOk = process.env.ZOOM_SYNC_SECRET && req.query.secret === process.env.ZOOM_SYNC_SECRET;
  if (!cronOk && !manualOk) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const sessionLabel = 'backfill';
  const webinar = await getCurrentWebinar();
  const webinarId = webinar?.id;
  if (!webinarId) { res.status(500).json({ error: 'no current webinar detected' }); return; }

  try {
    // Status: full picture, no side effects.
    if (req.query.status === '1') {
      const { map, report, registeredCount, remaining } = await nextRemaining();
      const skipRes = await sb('/ai4ntp_zoom_registrations?session=like.skip:*&select=email,session');
      const skips = skipRes.ok ? await skipRes.json() : [];
      res.status(200).json({
        ok: true, totalUnique: map.size,
        registered: registeredCount - skips.length, skipped: skips.length,
        skippedEmails: skips.map((s) => `${s.email} (${s.session})`),
        remaining: remaining.length,
        targetWebinar: { id: webinar.id, topic: webinar.topic, start_time: webinar.start_time, source: webinar.source }, tables: report,
      });
      return;
    }

    // Manual batch: register up to K now, bypassing the pacing gate.
    if (manualOk && req.query.n) {
      const batch = Math.min(parseInt(req.query.n, 10) || 1, 40);
      const { map, remaining } = await nextRemaining();
      const done = [], errors = [];
      for (let i = 0; i < batch && i < remaining.length; i++) {
        const email = remaining[i];
        try { done.push({ email, status: await registerOne(email, map.get(email), webinarId, sessionLabel) }); await sleep(400); }
        catch (err) { await handleRegError(email, err, errors); }
      }
      res.status(200).json({ ok: true, registeredThisRun: done.length, done, errorCount: errors.length, errors, remainingAfter: Math.max(0, remaining.length - done.length) });
      return;
    }

    // Cron tick: register a few people, each after a random 15-35s gap, within the tick budget.
    const { map, remaining } = await nextRemaining();
    if (!remaining.length) {
      res.status(200).json({ ok: true, done: true, remaining: 0 });
      return;
    }

    const start = Date.now();
    const done = [], errors = [];
    for (const email of remaining) {
      const gap = GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS);
      if (Date.now() - start + gap > TICK_BUDGET_MS) break; // no time for another this tick
      await sleep(gap);
      try {
        done.push({ email, status: await registerOne(email, map.get(email), webinarId, sessionLabel) });
      } catch (err) {
        await handleRegError(email, err, errors);
      }
    }
    res.status(200).json({ ok: true, registeredThisRun: done.length, done, errorCount: errors.length, errors, remainingAfter: Math.max(0, remaining.length - done.length) });
  } catch (err) {
    console.error('zoom-drip failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
