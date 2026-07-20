// POST /api/refer-link  { email, first_name?, source? }
//
// Idempotent: creates an affiliate for this email, or returns the existing one.
// Same email always yields the same code + portal_token (+ the same framing variant),
// so auto-issue (on signup success screens) and the /refer page converge on one link per
// person and a stable A/B bucket.
//
// Framing A/B test: a new affiliate is assigned the next copy variant in rotation
// (blend -> status -> generosity -> gamified, by affiliate count), stored on the row, and
// returned as `variant`. refer-block.js renders that variant's copy. Resilient: if the
// `variant` column does not exist yet, it falls back to creating the row without it
// (variant = null -> refer-block defaults to blend), so this is safe to deploy before the
// `alter table ... add column variant` runs.
//
// No auth (public opt-in). Uses the service-role key.

import { randomBytes } from 'node:crypto';

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const SITE = 'https://ai4ntp.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VARIANTS = ['blend', 'status', 'generosity', 'gamified'];

const B36 = '0123456789abcdefghijklmnopqrstuvwxyz';

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

function suffix(len) {
  const bytes = randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i++) out += B36[bytes[i] % 36];
  return out;
}

function slugName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16);
}

// Friendly, shareable code: "justin-7q3k", falling back to a random slug.
function genCode(firstName) {
  const base = slugName(firstName);
  return base ? `${base}-${suffix(4)}` : suffix(8);
}

function genToken() {
  return randomBytes(24).toString('base64url');
}

function shape(row) {
  return {
    code: row.code,
    portal_token: row.portal_token,
    variant: row.variant || null,
    share_link: `${SITE}/r/${row.code}`,
    portal_link: `${SITE}/portal?t=${row.portal_token}`,
  };
}

// How many affiliates exist (for round-robin variant assignment).
async function affiliateCount() {
  const res = await sb('/ai4ntp_affiliates?select=id', { headers: { Prefer: 'count=exact', Range: '0-0' } });
  const range = res.headers.get('content-range') || '';
  const n = parseInt(range.split('/')[1], 10);
  return Number.isFinite(n) ? n : 0;
}

async function findByEmail(email) {
  const base = `/ai4ntp_affiliates?email=eq.${encodeURIComponent(email)}&limit=1`;
  let res = await sb(`${base}&select=code,portal_token,variant`);
  if (res.status === 400) {
    const t = await res.text();
    if (/variant/i.test(t)) res = await sb(`${base}&select=code,portal_token`); // column not added yet
    else throw new Error(`lookup 400: ${t}`);
  }
  if (!res.ok) throw new Error(`lookup ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || null;
}

// Insert an affiliate; if the `variant` column does not exist yet, retry without it.
async function insertAffiliate(row) {
  let res = await sb('/ai4ntp_affiliates', {
    method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row),
  });
  if (res.status === 400 && row.variant !== undefined) {
    const t = await res.text();
    if (/variant/i.test(t)) {
      const rest = { ...row };
      delete rest.variant;
      res = await sb('/ai4ntp_affiliates', {
        method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(rest),
      });
    } else {
      throw new Error(`insert 400: ${t}`);
    }
  }
  return res;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') body = JSON.parse(body);

    const email = (body.email || '').trim().toLowerCase();
    const firstName = (body.first_name || '').trim() || null;
    const source = (body.source || 'refer-link').toString().slice(0, 60);

    if (!EMAIL_RE.test(email)) {
      res.status(400).json({ error: 'A valid email is required.' });
      return;
    }

    // Idempotency: return the existing affiliate (+ its stable variant) if this email has one.
    const existing = await findByEmail(email);
    if (existing) {
      res.status(200).json(shape(existing));
      return;
    }

    // New affiliate: assign the next variant in rotation (blend -> status -> ...).
    const variant = VARIANTS[(await affiliateCount()) % VARIANTS.length];

    // Create, retrying on unique-constraint collisions.
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = { email, first_name: firstName, code: genCode(firstName), portal_token: genToken(), source, variant };
      const ins = await insertAffiliate(row);

      if (ins.ok) {
        const created = (await ins.json())[0];
        res.status(201).json(shape(created));
        return;
      }

      if (ins.status === 409) {
        // Either an email race (another request just created it) or a code collision.
        const now = await findByEmail(email);
        if (now) {
          res.status(200).json(shape(now));
          return;
        }
        continue; // code collision: regenerate and retry
      }

      throw new Error(`insert ${ins.status}: ${await ins.text()}`);
    }

    throw new Error('could not allocate a unique code after retries');
  } catch (err) {
    console.error('refer-link failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
