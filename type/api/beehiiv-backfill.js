// GET /api/beehiiv-backfill?secret=<BEEHIIV_SYNC_SECRET>&table=<table>&offset=0&limit=50
// One-time backfill: pushes existing Supabase rows (any email-capturing table) into
// Beehiiv. Paginated so it never times out. Run per table until { hasMore: false }.
//   tables: signups | ai4ntp_signups | ai4ntp_partner_apps | ai4ntp_pulse_001 | ai4ntp_pulse_002
// Idempotent: Beehiiv reactivate_existing means re-running is safe (no duplicates).

import { addToBeehiiv, mapRecord } from './beehiiv-sync.js';

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const TABLES = new Set([
  'signups', 'ai4ntp_signups', 'ai4ntp_partner_apps', 'ai4ntp_pulse_001', 'ai4ntp_pulse_002',
]);

export default async function handler(req, res) {
  const secret = process.env.BEEHIIV_SYNC_SECRET;
  const given = req.query.secret || req.headers['x-webhook-secret'];
  if (!secret || given !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const table = String(req.query.table || '');
  const offset = parseInt(req.query.offset || '0', 10);
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  if (!TABLES.has(table)) {
    res.status(400).json({ error: `table must be one of: ${[...TABLES].join(', ')}` });
    return;
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' });
    return;
  }

  try {
    // select=* so this works for any table's column set; mapRecord pulls what it needs.
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.asc&limit=${limit}&offset=${offset}`;
    const r = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
    const rows = await r.json();

    let processed = 0, skipped = 0;
    const errors = [];
    const queue = rows.slice();
    async function worker() {
      while (queue.length) {
        const row = queue.shift();
        const f = mapRecord(table, row);
        if (!f.email) { skipped++; continue; } // e.g. pulse vote rows with no email
        try { await addToBeehiiv(f.email, f); processed++; }
        catch (e) { errors.push({ email: f.email, error: String(e.message || e) }); }
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);

    res.status(200).json({
      ok: true, table, offset,
      fetched: rows.length, processed, skipped,
      errorCount: errors.length, errors: errors.slice(0, 10),
      hasMore: rows.length === limit, nextOffset: offset + limit,
    });
  } catch (err) {
    console.error('beehiiv-backfill failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
