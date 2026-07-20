/* Fetch an OBJECTIVE description for each tool from its own website
   (og:description, else meta description). Writes `what_is` into tools.json.
   Nothing fabricated: failures are left blank (the generator falls back to the
   factual tagline). Run:  node tools/directory/fetch-descriptions.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const jsonPath = resolve(dir, 'tools.json');
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
}
function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"|([a-zA-Z:-]+)\s*=\s*'([^']*)'/g))
    out[(m[1] || m[3]).toLowerCase()] = m[2] ?? m[4];
  return out;
}
function extractDesc(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
  const og = metas.find(a => (a.property || '').toLowerCase() === 'og:description' && a.content);
  if (og) return decode(og.content);
  const d = metas.find(a => (a.name || '').toLowerCase() === 'description' && a.content);
  if (d) return decode(d.content);
  return '';
}
async function fetchDesc(url) {
  try {
    const ctl = AbortSignal.timeout(12000);
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'text/html' }, redirect: 'follow', signal: ctl });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const html = await res.text();
    const desc = extractDesc(html);
    return desc ? { ok: true, desc } : { ok: false, reason: 'no meta description found' };
  } catch (e) { return { ok: false, reason: e.name === 'TimeoutError' ? 'timeout' : e.message }; }
}

const results = [];
for (const t of data.tools) {
  if (!t.website) { results.push([t.slug, 'SKIP (private/no url)']); continue; }
  const r = await fetchDesc(t.website);
  if (r.ok) { t.what_is = r.desc; results.push([t.slug, 'OK: ' + r.desc.slice(0, 90)]); }
  else { results.push([t.slug, 'FAIL (' + r.reason + ') -> will fall back to tagline']); }
}

writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
console.log('\n=== fetch results ===');
for (const [s, m] of results) console.log(`${s.padEnd(22)} ${m}`);
const ok = results.filter(r => r[1].startsWith('OK')).length;
console.log(`\n${ok}/${data.tools.length} got a sourced description; rest fall back to tagline.`);
