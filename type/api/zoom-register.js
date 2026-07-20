// POST /api/zoom-register
// Receives a Supabase pg_net trigger payload on INSERT to ai4ntp_signups and
// registers the person on the current session's Zoom webinar. Zoom then emails
// them their unique join link + calendar invite automatically (same result as
// adding them by hand in the Zoom dashboard). Near-real-time, no polling.
//
// Security: the trigger must send header `x-webhook-secret: <ZOOM_SYNC_SECRET>`.
//
// Required Vercel env vars (Production):
//   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET  (Server-to-Server OAuth app)
//   ZOOM_WEBINAR_ID     numeric webinar id for the current session
//   ZOOM_SOURCE_PREFIX  e.g. 'episode-006' — only signups whose `source` starts with
//                       this get registered (keeps newsletter / other sessions out)
//   ZOOM_SYNC_SECRET    shared secret for the x-webhook-secret header
//   SUPABASE_SERVICE_ROLE_KEY  (for the ai4ntp_zoom_registrations idempotency record)
//
// Rotating to a new session: update ZOOM_WEBINAR_ID + ZOOM_SOURCE_PREFIX and redeploy
// (mirrors the CURRENT_SESSION rule in api/r.js).

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- Supabase service-role helper (idempotency ledger only) ----
function sb(path, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

// ---- Zoom Server-to-Server OAuth token (cached across warm invocations) ----
let _token = null; // { value, expiresAt }

export async function getZoomToken() {
  const now = Date.now();
  if (_token && _token.expiresAt - now > 120000) return _token.value; // >2 min headroom

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
  _token = {
    value: data.access_token,
    expiresAt: now + (Number(data.expires_in) || 3600) * 1000,
  };
  return _token.value;
}

// Session register-page signups look like `episode-<n>-register-page` / `-final`. Only those
// belong on the webinar (not /build, /agents, newsletter, etc.). Pattern-based so it auto-follows
// session rotation with no per-session config.
export const SESSION_SOURCE_RE = /^episode-\d+-register/i;

// ---- Auto-detect the current session's webinar: the soonest upcoming one on the account.
// Cached ~5 min. Falls back to the ZOOM_WEBINAR_ID env var so registration never silently breaks.
let _webinar = null; // { id, topic, start_time, source, fetchedAt }

export async function getCurrentWebinar() {
  const now = Date.now();
  if (_webinar && now - _webinar.fetchedAt < 300000) return _webinar;
  try {
    const token = await getZoomToken();
    const r = await fetch('https://api.zoom.us/v2/users/me/webinars?page_size=100', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.ok) {
      const { webinars = [] } = await r.json();
      const cand = webinars
        .filter((w) => w.start_time)
        .map((w) => ({ id: String(w.id), topic: w.topic || '', start_time: w.start_time, t: new Date(w.start_time).getTime() }))
        .filter((w) => w.t > now - 4 * 3600 * 1000) // future, or started within the last 4h (live window)
        .sort((a, b) => a.t - b.t);
      if (cand.length) {
        _webinar = { id: cand[0].id, topic: cand[0].topic, start_time: cand[0].start_time, source: 'auto', fetchedAt: now };
        return _webinar;
      }
    } else {
      console.error('getCurrentWebinar list', r.status, await r.text());
    }
  } catch (e) {
    console.error('getCurrentWebinar failed', e);
  }
  const envId = process.env.ZOOM_WEBINAR_ID;
  if (envId) { _webinar = { id: String(envId), topic: '(env fallback)', start_time: null, source: 'env', fetchedAt: now }; return _webinar; }
  return null;
}

// ---- Name derivation: the site form is email-only, but Zoom requires a first name.
// Derive a presentable first/last from the email local-part (e.g. justin.novak@ -> Justin Novak).
function titleCase(s) {
  const clean = String(s || '').replace(/\d+$/, '').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase() : '';
}

export function deriveName(email, firstName, lastName) {
  let first = (firstName || '').trim();
  let last = (lastName || '').trim();
  if (!first) {
    const local = String(email || '').split('@')[0] || '';
    const parts = local.split(/[._+-]+/).filter(Boolean);
    first = titleCase(parts[0]);
    if (!last && parts.length > 1) last = titleCase(parts[1]);
  }
  if (!first) first = 'Friend'; // Zoom requires a non-empty first_name
  return { first_name: first, last_name: last };
}

// ---- Add a registrant to a webinar. Idempotent: an already-registered email is success. ----
export async function addWebinarRegistrant(webinarId, { email, first_name, last_name }) {
  if (!webinarId) throw new Error('ZOOM_WEBINAR_ID not set');
  const token = await getZoomToken();
  const res = await fetch(`https://api.zoom.us/v2/webinars/${webinarId}/registrants`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, first_name, last_name: last_name || '' }),
  });
  const text = await res.text();

  if (res.ok) {
    const data = text ? JSON.parse(text) : {};
    return { registrant_id: data.registrant_id || null, join_url: data.join_url || null, status: 'registered' };
  }
  // Zoom returns 400 (code 3027 / "already registered") for a duplicate email. Treat as success.
  const lower = text.toLowerCase();
  if (res.status === 400 && (lower.includes('already') || text.includes('3027'))) {
    return { registrant_id: null, join_url: null, status: 'already-registered' };
  }
  // 429 (rate limit) and everything else surface so the caller can back off / retry.
  throw new Error(`Zoom registrant ${res.status}: ${text}`);
}

// ---- Record the registration so backfill can skip it and we can diff signups vs registrants. ----
async function recordRegistration(row) {
  try {
    const res = await sb('/ai4ntp_zoom_registrations?on_conflict=email', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, // upsert on unique email
      body: JSON.stringify(row),
    });
    if (!res.ok && res.status !== 409) {
      console.error('zoom-register: ledger write', res.status, await res.text());
    }
  } catch (e) {
    console.error('zoom-register: ledger write failed', e);
  }
}

export default async function handler(req, res) {
  // GET ping: report the currently-detected webinar (sanity check). Secret-gated.
  if (req.method === 'GET') {
    if (req.query.secret !== process.env.ZOOM_SYNC_SECRET) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ ok: true, currentWebinar: await getCurrentWebinar() });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.ZOOM_SYNC_SECRET;
  if (!secret || req.headers['x-webhook-secret'] !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') body = JSON.parse(body);

    if (body.type && body.type !== 'INSERT') {
      res.status(200).json({ ok: true, skipped: `ignored ${body.type}` });
      return;
    }

    const record = body.record || {};
    const source = (record.source || '').toString();
    // Register: (a) any homepage signup (the legacy `signups` table is exclusively the homepage
    // "save your seat" funnel), or (b) an ai4ntp_signups row from a session register page
    // (episode-<n>-register...). This keeps /build, /agents, /partner, newsletter out.
    const isHomepage = body.table === 'signups';
    if (!isHomepage && !SESSION_SOURCE_RE.test(source)) {
      res.status(200).json({ ok: true, skipped: `source '${source}' is not a session registration` });
      return;
    }

    const email = (record.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      res.status(200).json({ ok: true, skipped: 'no valid email' });
      return;
    }

    const webinar = await getCurrentWebinar();
    if (!webinar) {
      res.status(200).json({ ok: true, skipped: 'no current webinar detected' });
      return;
    }

    const { first_name, last_name } = deriveName(email, record.first_name, record.last_name);
    const result = await addWebinarRegistrant(webinar.id, { email, first_name, last_name });

    const sessionLabel = (source.match(/^(episode-\d+)/i) || [])[1] || (isHomepage ? 'homepage' : 'session');
    await recordRegistration({
      email,
      session: sessionLabel,
      webinar_id: String(webinar.id),
      registrant_id: result.registrant_id,
      join_url: result.join_url,
    });

    res.status(200).json({ ok: true, email, webinar_id: webinar.id, status: result.status });
  } catch (err) {
    console.error('zoom-register failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
