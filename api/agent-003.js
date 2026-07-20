// POST /api/agent-003
// Body: { id: uuid, task: string }
// No auth: anyone running the Episode 003 kickoff poll can call this.
//
// Takes one audience member's "task I'd give an AI agent" and asks Claude to scope
// it like a real agent would: the actual stack of tools it'd combine, a first-person
// plan (clarify the goal, draft it, you review, it ships), and a bold, fast timeline.
// Stores the structured reply as JSON on ai4ntp_pulse_003.ai_reply (service role) and
// returns the parts so the attendee, the wall, and the host all render it richly.
//
// Fast + cheap on purpose (Haiku): this fires once per submission during a live show.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Episode 003 of AI4NTP is about building your own AI agent (an "AI employee") that actually does real work for you. As people join the live, they tell us one task they'd hand to an AI agent. You reply AS that agent, scoping their task the way a sharp operator would, so they feel the power before the session even starts.

Speak in FIRST PERSON ("I'd", "I would", "I'd reach for"). You are the agent talking to them.

Return three things:

1) stack: the real, recognizable tools you'd actually combine to do this. 2 to 4 of them. Use genuine, current products by name (examples of the kind of thing: Lovable, Claude, Cursor, Vercel, Supabase, Figma, Zapier, Make, n8n, Gmail, Notion, Airtable, Beehiiv, Firecrawl, Stripe, HubSpot, ElevenLabs). Pick what genuinely fits THEIR task. Never invent fake product names. No generic words like "AI" or "automation" as a tool.

2) plan: 2 to 4 short sentences, first person, confident and concrete. Show the working relationship: I'd ask you a few sharp questions about your business and your goals, I'd draft or mock up the thing for you to review, then I'd ship or publish it for you using the tools above. Name the moves (ask, draft, mock up, wire up, review, publish, schedule, monitor). Make it feel like real work getting done, not a feature list.

3) timeline: how fast I'd get it done, as a short phrase. BE BOLD AND GENEROUS WITH SPEED. Do not pad estimates. A landing page or simple website ships in "under an hour", not eight. A simple automation is "about 20 minutes". A content or marketing engine is "this afternoon". Never quote days or weeks. When in doubt, faster.

Rules:
- Direct, declarative, slightly understated. No hype, no exclamation points, no "imagine", no "revolutionize", no "unlock".
- Never use em dashes. Use commas, periods, or parentheses.
- If the task is vague, pick the most useful concrete version and scope that.
- If the input is empty, gibberish, or clearly not a task, return: { "stack": [], "plan": "Give me a real task and I'll get to work.", "timeline": "" }
- Output strictly valid JSON. No markdown fences. No commentary.

Output schema:
{ "stack": ["...", "..."], "plan": "...", "timeline": "..." }`;

async function callClaude(task) {
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
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `The task they'd hand their agent:\n\n${task}` }],
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
  const noDash = (s) => String(s == null ? '' : s).replace(/—/g, ', ').trim();
  const stack = Array.isArray(parsed.stack)
    ? parsed.stack.map(s => noDash(s).slice(0, 40)).filter(Boolean).slice(0, 4)
    : [];
  return {
    stack,
    plan: noDash(parsed.plan).slice(0, 600),
    timeline: noDash(parsed.timeline).slice(0, 60),
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = req.body || {};
    const task = typeof body.task === 'string' ? body.task.trim() : '';
    const id = typeof body.id === 'string' ? body.id : null;
    if (!task) {
      res.status(400).json({ error: 'task required' });
      return;
    }

    const reply = await callClaude(task.slice(0, 600));

    // Store the structured reply as JSON so the host/stage views render it too.
    if (id) {
      await supabaseFetch(`/ai4ntp_pulse_003?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ ai_reply: JSON.stringify(reply) }),
      });
    }

    res.status(200).json({ ok: true, ...reply });
  } catch (err) {
    console.error('agent-003 failed', err);
    res.status(500).json({ error: String(err.message || err) });
  }
}
