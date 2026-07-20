// POST /api/beehiiv-sync
// Receives a Supabase pg_net trigger payload (on INSERT to any email-capturing table)
// and creates the subscriber in Beehiiv. Near-real-time, no polling.
//
// Security: the trigger must send header `x-webhook-secret: <BEEHIIV_SYNC_SECRET>`.
//
// Required Vercel env vars (Production):
//   BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID (pub_...), BEEHIIV_SYNC_SECRET
//
// Beehiiv create-subscription does NOT accept tags on create, so we tag via a
// "Source" custom field, set per originating table. "Source", "First Name", and
// "Last Name" custom fields must exist in Beehiiv or their values are discarded.

// Map each source table to the Beehiiv "Source" value (the de-facto tag).
const SOURCE_BY_TABLE = {
  signups: 'Website Submission',
  ai4ntp_signups: 'Website Submission',
  ai4ntp_partner_apps: 'Partner Application',
  ai4ntp_affiliates: 'Referral Program',
  ai4ntp_pulse_001: 'Live Session 001',
  ai4ntp_pulse_002: 'Live Session 002',
  ai4ntp_pulse_003: 'Live Session 003',
  ai4ntp_pulse_005: 'Live Session 005',
};

// Normalize a Supabase row (+ table) into the fields Beehiiv wants.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function mapRecord(table, record = {}) {
  const raw = (record.email || '').trim().toLowerCase();
  const email = EMAIL_RE.test(raw) ? raw : ''; // skip malformed entries (e.g. someone typed "justin")
  const sourceLabel = SOURCE_BY_TABLE[table] || 'Website Submission';

  let firstName = (record.first_name || '').trim() || null;
  let lastName = (record.last_name || '').trim() || null;
  // Most tables store a single `name` field; split it when first_name isn't present.
  if (!firstName && record.name) {
    const parts = String(record.name).trim().split(/\s+/);
    firstName = parts[0] || null;
    if (!lastName && parts.length > 1) lastName = parts.slice(1).join(' ');
  }

  const referringSite = record.source ? `ai4ntp.com (${record.source})` : 'ai4ntp.com';
  return { email, firstName, lastName, sourceLabel, referringSite };
}

export async function addToBeehiiv(email, opts = {}) {
  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) throw new Error('BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID not set');

  const { firstName, lastName, sourceLabel = 'Website Submission', referringSite = 'ai4ntp.com' } = opts;
  const custom_fields = [{ name: 'Source', value: sourceLabel }];
  if (firstName) custom_fields.push({ name: 'First Name', value: firstName });
  if (lastName) custom_fields.push({ name: 'Last Name', value: lastName });

  const res = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: false,
      utm_source: 'website',
      utm_medium: 'ai4ntp-site',
      referring_site: referringSite,
      custom_fields,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    // Existing subscribers 422 on custom_fields ("already been taken") or 409 on duplicate.
    // Either way they're on the list, so treat as success (idempotent).
    const lower = text.toLowerCase();
    if (res.status === 409 || (res.status === 422 && lower.includes('already'))) {
      return 'already-subscribed';
    }
    throw new Error(`Beehiiv ${res.status}: ${text}`);
  }
  return text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.BEEHIIV_SYNC_SECRET;
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

    const fields = mapRecord(body.table, body.record || {});
    if (!fields.email) {
      // e.g. a pulse vote row with no email
      res.status(200).json({ ok: true, skipped: 'no email' });
      return;
    }

    await addToBeehiiv(fields.email, fields);
    res.status(200).json({ ok: true, email: fields.email, source: fields.sourceLabel });
  } catch (err) {
    console.error('beehiiv-sync failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
