// POST /api/state
// Body:
//   - { phase: 'submitting'|'voting'|'locked', winner_id?: uuid|null }  (set phase + winner)
//   - { reset: true }                                                    (truncate all pulse data, reset phase to 'submitting')
// No auth: this is a host-only page, kept private by URL obscurity.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const VALID_PHASES = new Set(['submitting', 'voting', 'locked']);

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
  // Order matters: clear winner_id FK first, then options, then submissions, then phase.
  await supabaseFetch('/ai4ntp_pulse_002_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ winner_id: null, phase: 'submitting', updated_at: new Date().toISOString() }),
  });
  await supabaseFetch('/ai4ntp_pulse_002_options?id=neq.00000000-0000-0000-0000-000000000000', {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
  await supabaseFetch('/ai4ntp_pulse_002?id=neq.00000000-0000-0000-0000-000000000000', {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
}

async function setState(phase, winnerId) {
  const patch = { updated_at: new Date().toISOString() };
  if (phase != null) patch.phase = phase;
  if (winnerId !== undefined) patch.winner_id = winnerId;
  await supabaseFetch('/ai4ntp_pulse_002_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
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

    const phase = body.phase;
    if (!phase || !VALID_PHASES.has(phase)) {
      res.status(400).json({ error: 'phase must be one of submitting | voting | locked' });
      return;
    }

    let winnerId;
    if (Object.prototype.hasOwnProperty.call(body, 'winner_id')) {
      winnerId = body.winner_id; // may be null
    }

    await setState(phase, winnerId);
    res.status(200).json({ ok: true, phase, winner_id: winnerId ?? null });
  } catch (err) {
    console.error('state failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
