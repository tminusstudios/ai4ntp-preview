// POST /api/state-003
// Body:
//   - { mode: 'wall' | 'themes' }   (flip what the screen-share stage shows)
//   - { reset: true }               (delete all submissions, clear synthesis, back to 'wall')
// No auth: this is a host-only page, kept private by URL obscurity.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const VALID_MODES = new Set(['wall', 'themes']);

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

async function resetAll() {
  await supabaseFetch('/ai4ntp_pulse_003_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ mode: 'wall', synthesis: null, updated_at: new Date().toISOString() }),
  });
  await supabaseFetch('/ai4ntp_pulse_003?id=neq.00000000-0000-0000-0000-000000000000', {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
}

async function setMode(mode) {
  await supabaseFetch('/ai4ntp_pulse_003_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ mode, updated_at: new Date().toISOString() }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || {};

    if (body.reset === true) {
      await resetAll();
      res.status(200).json({ ok: true, reset: true });
      return;
    }

    const mode = body.mode;
    if (!mode || !VALID_MODES.has(mode)) {
      res.status(400).json({ error: 'mode must be one of wall | themes' });
      return;
    }

    await setMode(mode);
    res.status(200).json({ ok: true, mode });
  } catch (err) {
    console.error('state-003 failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
