// GET /r/<code>  (via vercel.json rewrite -> /api/r?code=<code>)
//
// The referral short link. Logs a click, sets a first-party attribution cookie,
// and 302-redirects the visitor to the CURRENT session registration page with the
// referrer's code attached (?ref=<code>). The destination page's form then folds
// ref_code onto its Supabase signup, which is what mints the referral.
//
// No auth (public link). Uses the service-role key to log the click server-side.
//
// EDIT POINT (rotation rule): CURRENT_SESSION is the single knob for where every
// /r/<code> link sends people. When the site rotates to the next session, update it
// here IN THE SAME PASS as nav.js / homepage / register / sessions hub. See CLAUDE.md
// "Registration / signup behavior" -> the rotation RULE. Keep it in sync with nav.js's
// current session; existing links auto-follow, so referrers never need a new link.

import { createHash } from 'node:crypto';

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const CURRENT_SESSION = '/ai4ntp-preview/sessions/006';
const IP_SALT = 'ai4ntp-referral-v1'; // just to avoid storing raw IPs; not a secret boundary
const REF_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function supabaseFetch(path, init = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${res.status} on ${path}: ${text}`);
  }
  return res;
}

function sanitizeCode(raw) {
  return String(raw || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
}

const BOT_UA_RE = /bot|crawl|spider|slackbot|facebookexternalhit|whatsapp|telegrambot|discordbot|twitterbot|linkedinbot|embedly|quora link preview|bitlybot|preview|headless|python-requests|curl|wget|http-client|go-http|okhttp/i;

function looksLikeBot(req) {
  const h = req.headers || {};
  const purpose = (h['sec-purpose'] || h['purpose'] || h['x-purpose'] || h['x-moz'] || '').toString().toLowerCase();
  if (purpose.includes('prefetch') || purpose.includes('preview') || purpose.includes('prerender')) return true;
  const ua = (h['user-agent'] || '').toString();
  if (!ua) return true; // no UA is almost always automation
  return BOT_UA_RE.test(ua);
}

function ipHash(req) {
  const fwd = (req.headers['x-forwarded-for'] || '').toString();
  const ip = fwd.split(',')[0].trim() || (req.headers['x-real-ip'] || '').toString();
  if (!ip) return null;
  return createHash('sha256').update(ip + IP_SALT).digest('hex');
}

function hasRefCookie(req) {
  const cookie = (req.headers.cookie || '').toString();
  return /(?:^|;\s*)a4ref=/.test(cookie);
}

function redirect(res, location, setCookie) {
  if (setCookie) res.setHeader('Set-Cookie', setCookie);
  res.setHeader('Location', location);
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.end();
}

export default async function handler(req, res) {
  const code = sanitizeCode(req.query && req.query.code);

  // Unknown/empty code: never 404, but attach no attribution.
  if (!code) {
    redirect(res, CURRENT_SESSION);
    return;
  }

  let affiliateId = null;
  try {
    const r = await supabaseFetch(`/ai4ntp_affiliates?code=eq.${encodeURIComponent(code)}&select=id`);
    const rows = await r.json();
    affiliateId = rows[0] ? rows[0].id : null;
  } catch (err) {
    console.error('r.js affiliate lookup failed', err);
    // fall through: still redirect, just possibly without attribution
  }

  // Log the click (best effort; never block the redirect on a logging failure).
  try {
    await supabaseFetch('/ai4ntp_referral_clicks', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        code,
        affiliate_id: affiliateId,
        ip_hash: ipHash(req),
        user_agent: (req.headers['user-agent'] || '').toString().slice(0, 500) || null,
        referer: (req.headers.referer || req.headers.referrer || '').toString().slice(0, 500) || null,
        is_bot: looksLikeBot(req),
      }),
    });
  } catch (err) {
    console.error('r.js click log failed', err);
  }

  // Unknown code -> redirect without ref/cookie (no bogus attribution).
  if (!affiliateId) {
    redirect(res, CURRENT_SESSION);
    return;
  }

  const target = `${CURRENT_SESSION}?ref=${encodeURIComponent(code)}`;
  // First-touch: only set the attribution cookie if the visitor has none yet.
  const setCookie = hasRefCookie(req)
    ? null
    : `a4ref=${encodeURIComponent(code)}; Max-Age=${REF_MAX_AGE}; Path=/; SameSite=Lax; Secure`;

  redirect(res, target, setCookie);
}
