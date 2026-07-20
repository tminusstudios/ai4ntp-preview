// POST /api/synthesize-005
// Body: { ideas: string[] }
// No auth: this is a host-only page, kept private by URL obscurity.
//
// Calls Claude Sonnet 4.6 with the audience submissions, asks for 5 real,
// buildable candidate companies for the Episode 005 build-off. Inserts the 5
// options into Supabase and flips the state row to 'voting'. Returns the options.
// The winning option is the single brief all three builders race to build.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You turn a live audience's submissions into five candidate companies for a head-to-head AI build-off. This is AI4NTP Episode 005: three builders (Ian, Justin, Alec) will each take the ONE winning option and race to build that same real company with AI in under an hour, screens shared the whole time. Your job is to remix the audience's pitches into five companies that are genuinely worth building.

Rules:
- These are real, buildable companies, not jokes. The public framing of the episode is "three real companies, built with AI in one hour." Lean grounded and credible. A little wit is fine, but the option has to read as something a real operator would actually want to exist and use.
- Ground every option in what the audience actually submitted. Pull from the spirit of their pitches, do not wander off on your own tangent.
- Each candidate must be realistic to design, build, and launch a brand plus a marketing site plus a launch motion for in under an hour. So: a clear product, a clear customer, a clear wedge. Not vaporware, not a whole platform.
- If several people pitched similar things (scheduling, dating, dogs, CRMs, newsletters), lean into that thread. If the pitches are scattered, pick the five strongest, most buildable, most distinct ones.
- When the audience suggested a name you love, use it or riff on it. Otherwise invent one that is short and brandable.
- Generate 5 options. Each has:
  - name: short, distinctive, ideally one or two words. Brandable. Made-up names are great.
  - one_liner: 8 to 16 words. What the product does and who it's for. Vivid, specific, no marketing fluff.
  - vibe: a 2-to-4-word tag for the brand vibe (e.g. "clean B2B", "warm consumer", "deadpan utility", "premium minimal", "playful prosumer").
- Output strictly valid JSON. No markdown fences. No commentary. Just the JSON array.
- Never use em dashes. Use commas or periods or restructure.

Output schema:
[
  { "name": "...", "one_liner": "...", "vibe": "..." },
  { "name": "...", "one_liner": "...", "vibe": "..." },
  ...
]
`;

function buildUserPrompt(ideas) {
  const cleaned = (ideas || [])
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .slice(0, 200); // safety cap
  const body = cleaned.length
    ? cleaned.map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '(no audience pitches arrived; invent five real, buildable companies in the spirit of an AI4NTP live build-off)';
  return `What the audience wants us to build (some included a name idea):\n\n${body}\n\nRemix these into 5 candidate companies our three builders could each build and launch in under an hour. Return JSON.`;
}

async function callClaude(ideas) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(ideas) }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic ${res.status}: ${text}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  // Strip any accidental fencing
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  let options;
  try {
    options = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Claude did not return valid JSON: ${cleaned.slice(0, 200)}`);
  }
  if (!Array.isArray(options)) throw new Error('Claude returned non-array');
  return options
    .map(o => ({
      name: String(o.name || '').slice(0, 80).trim(),
      one_liner: String(o.one_liner || '').slice(0, 240).trim(),
      vibe: o.vibe ? String(o.vibe).slice(0, 60).trim() : null,
    }))
    .filter(o => o.name && o.one_liner)
    .slice(0, 5);
}

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

async function clearExistingOptions() {
  // Delete all options before inserting new ones. The state.winner_id FK is set
  // to null first to avoid FK violations.
  await supabaseFetch('/ai4ntp_pulse_005_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ winner_id: null }),
  });
  await supabaseFetch('/ai4ntp_pulse_005_options?id=neq.00000000-0000-0000-0000-000000000000', {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  });
}

async function insertOptions(options) {
  const res = await supabaseFetch('/ai4ntp_pulse_005_options', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(options),
  });
  return res.json();
}

async function setPhase(phase) {
  await supabaseFetch('/ai4ntp_pulse_005_state?id=eq.1', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ phase, updated_at: new Date().toISOString() }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Synthesis is open (no host token). The only token-gated action is the
  // destructive reset in /api/state-005.

  try {
    const body = req.body || {};
    const ideas = Array.isArray(body.ideas) ? body.ideas : [];

    const options = await callClaude(ideas);
    if (options.length < 1) throw new Error('Claude returned zero usable options');

    await clearExistingOptions();
    const inserted = await insertOptions(options);
    await setPhase('voting');

    res.status(200).json({ ok: true, options: inserted });
  } catch (err) {
    console.error('synthesize-005 failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
