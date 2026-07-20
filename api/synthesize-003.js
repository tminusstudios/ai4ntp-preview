// POST /api/synthesize-003
// Body: {} (the route reads every submission server-side)
// No auth: this is a host-only page, kept private by URL obscurity.
//
// Reads all Episode 003 task submissions, asks Claude to cluster the room into a
// handful of themes with counts, writes the result to the state row's `synthesis`
// jsonb, and flips the stage to 'themes' so the screen-share view reveals it.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `Episode 003 of AI4NTP is about building your own AI agent. As people joined, each named one task they'd hand to an agent. You read the whole room and cluster it into a few clear themes, so the host can say out loud what this room actually wants AI to do for them.

Rules:
- Produce 4 to 6 themes. Cover the bulk of submissions; do not invent themes nobody asked for.
- Each theme groups genuinely similar tasks (e.g. inbox and email triage, content and writing, research and summarizing, scheduling and admin, data and reporting, customer or lead follow-up).
- count: how many of the submissions fall into that theme (your best grouping). The counts should roughly add up to the total, but overlap a little is fine.
- label: 2 to 5 words, Title Case, concrete. Name the work, not a vibe.
- blurb: one short line, 6 to 14 words, in a direct, declarative, slightly understated voice. What the agent would take off their plate.
- Order themes from most submissions to fewest.
- headline: one short line (max 12 words) that reads the room out loud, e.g. "This room wants its time back."
- Never use em dashes. Use commas, periods, or parentheses.
- Output strictly valid JSON. No markdown fences. No commentary.

Output schema:
{
  "headline": "...",
  "themes": [
    { "label": "...", "count": 0, "blurb": "..." }
  ]
}`;

function buildUserPrompt(tasks) {
  const cleaned = (tasks || [])
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .slice(0, 400);
  const body = cleaned.length
    ? cleaned.map((s, i) => `${i + 1}. ${s}`).join('\n')
    : '(no submissions yet)';
  return `${cleaned.length} people told us the one task they'd hand an AI agent:\n\n${body}\n\nCluster the room into themes. Return JSON.`;
}

async function callClaude(tasks) {
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
      messages: [{ role: 'user', content: buildUserPrompt(tasks) }],
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

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Claude did not return valid JSON: ${cleaned.slice(0, 200)}`);
  }
  const themes = Array.isArray(parsed.themes) ? parsed.themes : [];
  return {
    headline: String(parsed.headline || '').slice(0, 120).replace(/—/g, ', ').trim() || 'What the room wants its agents to do.',
    themes: themes
      .map(t => ({
        label: String(t.label || '').slice(0, 60).replace(/—/g, ', ').trim(),
        count: Math.max(0, parseInt(t.count, 10) || 0),
        blurb: String(t.blurb || '').slice(0, 160).replace(/—/g, ', ').trim(),
      }))
      .filter(t => t.label)
      .slice(0, 6),
  };
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

async function loadTasks() {
  const res = await supabaseFetch('/ai4ntp_pulse_003?select=task&order=created_at.asc&limit=600');
  const rows = await res.json();
  return (rows || []).map(r => r.task).filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const tasks = await loadTasks();
    const synthesis = await callClaude(tasks);
    synthesis.total = tasks.length;

    await supabaseFetch('/ai4ntp_pulse_003_state?id=eq.1', {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ synthesis, mode: 'themes', updated_at: new Date().toISOString() }),
    });

    res.status(200).json({ ok: true, synthesis });
  } catch (err) {
    console.error('synthesize-003 failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
