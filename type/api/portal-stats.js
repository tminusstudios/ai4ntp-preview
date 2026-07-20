// GET /api/portal-stats?t=<portal_token>
//
// Returns one affiliate's referral stats, keyed by their secret portal token.
// The token is the bearer; never exposes any other affiliate's data. Service-role.
//
// Live counter (referred_count) is signup-based per the locked product decision.
// The reward CLAIM is gated on attendance (attended_count), which the post-webinar
// reconcile step flips from 'pending' to 'attended'.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const SITE = 'https://ai4ntp.com';
// Mysterious, prestige-named tiers. Reward contents stay hidden until unlocked.
// Keep in sync with the ladder on /refer and portal/index.html.
const TIERS = [
  { n: 3, name: 'Insider' },
  { n: 5, name: 'VIP' },
  { n: 10, name: 'Inner Circle' },
  { n: 20, name: 'Vanguard' },
  { n: 50, name: 'Legend' },
];

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

// Total row count via PostgREST's Content-Range header (Prefer: count=exact).
async function countRows(path) {
  const res = await sb(path, { headers: { Prefer: 'count=exact', Range: '0-0' } });
  if (!res.ok && res.status !== 206) throw new Error(`count ${res.status}: ${await res.text()}`);
  const range = res.headers.get('content-range') || '';
  const total = parseInt(range.split('/')[1], 10);
  return Number.isFinite(total) ? total : 0;
}

export default async function handler(req, res) {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  const token = (req.query && req.query.t ? String(req.query.t) : '').trim();
  if (!token) {
    res.status(400).json({ error: 'Missing portal token.' });
    return;
  }

  try {
    const affRes = await sb(
      `/ai4ntp_affiliates?portal_token=eq.${encodeURIComponent(token)}&select=id,first_name,code&limit=1`
    );
    if (!affRes.ok) throw new Error(`affiliate ${affRes.status}: ${await affRes.text()}`);
    const aff = (await affRes.json())[0];
    if (!aff) {
      res.status(404).json({ error: 'Portal not found.' });
      return;
    }

    const [clicks, refRes] = await Promise.all([
      countRows(`/ai4ntp_referral_clicks?code=eq.${encodeURIComponent(aff.code)}&is_bot=eq.false&select=id`),
      sb(`/ai4ntp_referrals?affiliate_id=eq.${aff.id}&select=referred_first_name,referred_email,created_at,status&order=created_at.desc`),
    ]);
    if (!refRes.ok) throw new Error(`referrals ${refRes.status}: ${await refRes.text()}`);
    const rows = await refRes.json();

    const referred_count = rows.length;
    const attended_count = rows.filter((r) => r.status === 'attended' || r.status === 'rewarded').length;
    const nextTier = TIERS.find((t) => referred_count < t.n) || null;

    res.status(200).json({
      first_name: aff.first_name || null,
      code: aff.code,
      share_link: `${SITE}/r/${aff.code}`,
      portal_link: `${SITE}/portal?t=${token}`,
      clicks,
      referred_count,
      attended_count,
      referrals: rows.map((r) => ({
        first_name: r.referred_first_name || null,
        email: r.referred_email || null,
        date: r.created_at,
        status: r.status,
      })),
      milestones: {
        next: nextTier ? nextTier.n : null,
        next_name: nextTier ? nextTier.name : null,
        remaining: nextTier ? nextTier.n - referred_count : 0,
        tiers: TIERS.map((t) => ({
          threshold: t.n,
          name: t.name,
          signups_reached: referred_count >= t.n,   // hit the count (live)
          unlocked: attended_count >= t.n,          // confirmed via attendance
        })),
      },
    });
  } catch (err) {
    console.error('portal-stats failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
