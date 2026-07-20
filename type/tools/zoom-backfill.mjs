#!/usr/bin/env node
// zoom-backfill.mjs — register existing site signups onto the current Zoom webinar.
//
// Solves "they signed up a week ago, before the webinar existed" and also catches any
// real-time misses (the pg_net trigger is fire-and-forget with no retry). Idempotent:
// skips anyone already in ai4ntp_zoom_registrations, and Zoom itself dedupes by email.
// Zoom emails each newly-registered person their unique join link + calendar invite,
// exactly reproducing the manual "type their name + email into Zoom" step.
//
// Self-contained (like tools/reconcile-referrals.mjs) so it runs with plain `node`,
// no package.json / build step. The Zoom helpers below mirror api/zoom-register.js.
//
// Env (export or use `node --env-file=.env`):
//   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET   (Server-to-Server OAuth app)
//   ZOOM_WEBINAR_ID       numeric webinar id (or pass --webinar=<id>)
//   ZOOM_SOURCE_PREFIX    e.g. episode-006 (or pass --prefix=episode-006)
//   SUPABASE_SERVICE_ROLE_KEY
//
// Usage:
//   node tools/zoom-backfill.mjs --discover [WN_token]     # find the numeric webinar id
//   node tools/zoom-backfill.mjs --dry-run                 # show who would be registered
//   node tools/zoom-backfill.mjs                           # register them for real

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v === undefined ? true : v];
  })
);
const positional = args.filter((a) => !a.startsWith('--'));

const dryRun = !!flags['dry-run'];
const prefix = flags.prefix || process.env.ZOOM_SOURCE_PREFIX || '';
const webinarId = flags.webinar || process.env.ZOOM_WEBINAR_ID || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function sb(path, init = {}) {
  if (!KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

// ---- Zoom helpers (mirror api/zoom-register.js) ----
let _token = null;
async function getZoomToken() {
  const now = Date.now();
  if (_token && _token.expiresAt - now > 120000) return _token.value;
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  if (!accountId || !clientId || !clientSecret) {
    throw new Error('ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET not set');
  }
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    { method: 'POST', headers: { Authorization: `Basic ${basic}` } }
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`Zoom OAuth ${res.status}: ${text}`);
  const data = JSON.parse(text);
  _token = { value: data.access_token, expiresAt: now + (Number(data.expires_in) || 3600) * 1000 };
  return _token.value;
}

function titleCase(s) {
  const clean = String(s || '').replace(/\d+$/, '').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : '';
}

function deriveName(email, firstName, lastName) {
  let first = (firstName || '').trim();
  let last = (lastName || '').trim();
  if (!first) {
    const local = String(email || '').split('@')[0] || '';
    const parts = local.split(/[._+-]+/).filter(Boolean);
    first = titleCase(parts[0]);
    if (!last && parts.length > 1) last = titleCase(parts[1]);
  }
  if (!first) first = 'Friend';
  return { first_name: first, last_name: last };
}

async function addWebinarRegistrant(id, { email, first_name, last_name }) {
  const token = await getZoomToken();
  const res = await fetch(`https://api.zoom.us/v2/webinars/${id}/registrants`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name, last_name: last_name || '' }),
  });
  const text = await res.text();
  if (res.ok) {
    const data = text ? JSON.parse(text) : {};
    return { registrant_id: data.registrant_id || null, join_url: data.join_url || null, status: 'registered' };
  }
  const lower = text.toLowerCase();
  if (res.status === 400 && (lower.includes('already') || text.includes('3027'))) {
    return { registrant_id: null, join_url: null, status: 'already-registered' };
  }
  throw new Error(`Zoom registrant ${res.status}: ${text}`);
}

// --- Discover the numeric webinar id (the WN_ registration link hides it) ---
async function discover(wnToken) {
  const token = await getZoomToken();
  const zoom = (path) =>
    fetch(`https://api.zoom.us/v2${path}`, { headers: { Authorization: `Bearer ${token}` } });

  const res = await zoom('/users/me/webinars?page_size=300');
  if (!res.ok) throw new Error(`list webinars ${res.status}: ${await res.text()}`);
  const { webinars = [] } = await res.json();
  if (!webinars.length) {
    console.log('No webinars found on this account (check the S2S app scopes / owner).');
    return;
  }

  console.log(`Webinars on this account (${webinars.length}):`);
  for (const w of webinars) {
    console.log(`  id=${w.id}  ${w.start_time || '(no start)'}  ${w.topic || ''}`);
  }

  if (wnToken) {
    console.log(`\nMatching registration link token "${wnToken}" ...`);
    for (const w of webinars) {
      const d = await zoom(`/webinars/${w.id}`);
      if (!d.ok) continue;
      const detail = await d.json();
      if ((detail.registration_url || '').includes(wnToken)) {
        console.log(`\n>>> MATCH: ZOOM_WEBINAR_ID=${w.id}  (${w.topic})`);
        console.log(`    ${detail.registration_url}`);
        return;
      }
    }
    console.log('No webinar matched that token. Pick the id above by topic/date instead.');
  } else {
    console.log('\nSet ZOOM_WEBINAR_ID to the id whose topic/date matches your session.');
  }
}

async function backfill() {
  if (!prefix) { console.error('Missing source prefix. Set ZOOM_SOURCE_PREFIX or pass --prefix=episode-006.'); process.exit(1); }
  if (!webinarId) { console.error('Missing webinar id. Set ZOOM_WEBINAR_ID or pass --webinar=<id>. Use --discover to find it.'); process.exit(1); }

  // 1. Signups for this session.
  const sres = await sb(`/ai4ntp_signups?source=ilike.${encodeURIComponent(prefix + '*')}&select=email,first_name,last_name,source&order=created_at.asc&limit=5000`);
  if (!sres.ok) throw new Error(`signups lookup ${sres.status}: ${await sres.text()}`);
  const signups = await sres.json();

  // Dedupe by lowercased email, keep the first (earliest) occurrence.
  const byEmail = new Map();
  for (const r of signups) {
    const e = (r.email || '').trim().toLowerCase();
    if (e && e.includes('@') && !byEmail.has(e)) byEmail.set(e, r);
  }

  // 2. Who is already registered.
  const rres = await sb('/ai4ntp_zoom_registrations?select=email&limit=10000');
  if (!rres.ok) throw new Error(`registrations lookup ${rres.status}: ${await rres.text()}`);
  const already = new Set((await rres.json()).map((r) => (r.email || '').trim().toLowerCase()));

  const todo = [...byEmail.entries()].filter(([e]) => !already.has(e));
  console.log(`Signups for "${prefix}*": ${byEmail.size} unique | already registered: ${already.size} | to register: ${todo.length}`);

  if (!todo.length) { console.log('Nothing to do.'); return; }
  if (dryRun) {
    console.log('\n[dry-run] Would register:');
    todo.slice(0, 50).forEach(([e]) => console.log('  - ' + e));
    if (todo.length > 50) console.log(`  ... and ${todo.length - 50} more`);
    return;
  }

  let ok = 0, dup = 0, failed = 0;
  for (const [email, r] of todo) {
    const { first_name, last_name } = deriveName(email, r.first_name, r.last_name);
    try {
      const result = await addWebinarRegistrant(webinarId, { email, first_name, last_name });
      if (result.status === 'already-registered') dup++; else ok++;
      const rec = await sb('/ai4ntp_zoom_registrations?on_conflict=email', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({
          email, session: prefix, webinar_id: String(webinarId),
          registrant_id: result.registrant_id, join_url: result.join_url,
        }),
      });
      if (!rec.ok && rec.status !== 409) console.error(`  ledger ${rec.status} for ${email}`);
      await sleep(400); // stay well under Zoom's rate limit
    } catch (e) {
      const msg = String(e.message || e);
      if (msg.includes('429')) { console.error(`  rate-limited on ${email}, backing off 5s`); await sleep(5000); }
      else { failed++; console.error(`  FAILED ${email}: ${msg}`); }
    }
  }
  console.log(`\nDone. Registered: ${ok} | already-registered: ${dup} | failed: ${failed}`);
}

async function main() {
  if (flags.discover) return discover(positional[0]);
  return backfill();
}

main().catch((err) => { console.error('zoom-backfill failed:', err); process.exit(1); });
