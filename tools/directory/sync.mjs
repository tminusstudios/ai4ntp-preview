#!/usr/bin/env node
/* Sync the /ai-tools directory from a Google Sheet.
   Fetches the two published-as-CSV tabs (Tools + Episodes), rebuilds tools.json
   (the committed cache), then regenerates all pages by importing generate.mjs.

   Setup once (see README): create a Google Sheet with a "Tools" tab and an
   "Episodes" tab (import seed-tools.csv / seed-episodes.csv), File -> Share ->
   Publish to web -> publish EACH tab as CSV, and paste the two URLs into
   sheet.config.json. Then:  node tools/directory/sync.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const cfgPath = resolve(dir, 'sheet.config.json');
const jsonPath = resolve(dir, 'tools.json');

// GUARD (July 2026): tools.json is the source of truth for the /ai-tools directory.
// The Google Sheet path is retired because it silently overwrites direct tools.json
// edits (the post-webinar flow adds each session's tools straight to tools.json).
// This script now no-ops unless you explicitly pass --force to rebuild FROM the Sheet.
if (!process.argv.includes('--force')) {
  console.error('\n[sync] Disabled. tools.json is the source of truth (see README).');
  console.error('[sync] To edit the directory: change tools/directory/tools.json, then');
  console.error('       node tools/directory/generate.mjs  &&  vercel --prod --yes');
  console.error('[sync] Re-run with --force ONLY to deliberately rebuild tools.json from the');
  console.error('       Google Sheet. That OVERWRITES any direct JSON edits (e.g. new tools).\n');
  process.exit(0);
}

let cfg;
try { cfg = JSON.parse(readFileSync(cfgPath, 'utf8')); }
catch { fail(`Missing or invalid ${cfgPath}. Copy the placeholders and add your two published-CSV URLs.`); }
if (!cfg.tools_csv_url || /PASTE_/.test(cfg.tools_csv_url) || !cfg.episodes_csv_url || /PASTE_/.test(cfg.episodes_csv_url))
  fail('sheet.config.json still has placeholder URLs. Publish each tab to the web as CSV and paste the URLs. See README.');

function fail(msg) { console.error('\n[sync] ' + msg + '\n'); process.exit(1); }

// ---- minimal RFC-4180 CSV parser ----
function parseCSV(text) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}
function toObjects(text) {
  const rows = parseCSV(text).filter(r => r.some(c => c.trim() !== ''));
  if (!rows.length) return [];
  const hdr = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => Object.fromEntries(hdr.map((h, i) => [h, (r[i] ?? '').trim()])));
}
function normalizeCsvUrl(u) {
  u = u.replace('/pubhtml', '/pub');                       // HTML publish -> data publish
  if (!/[?&]output=csv/.test(u)) u += (u.includes('?') ? '&' : '?') + 'output=csv';
  return u;
}
async function fetchCSV(url, label) {
  const res = await fetch(normalizeCsvUrl(url));
  if (!res.ok) fail(`Could not fetch ${label} CSV (HTTP ${res.status}). Is the tab published to the web as CSV and the URL correct?`);
  const text = await res.text();
  if (/^\s*</.test(text)) fail(`${label} URL returned HTML, not CSV. Use the "Publish to web -> CSV" link, not the share link.`);
  return toObjects(text);
}

const bool = (v) => { v = (v || '').toLowerCase(); return ['true', 'yes', 'y', '1'].includes(v) ? true : ['false', 'no', 'n', '0'].includes(v) ? false : null; };
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : undefined; };

console.log('[sync] fetching Sheet tabs...');
const [toolRows, epRows] = await Promise.all([
  fetchCSV(cfg.tools_csv_url, 'Tools'),
  fetchCSV(cfg.episodes_csv_url, 'Episodes'),
]);

// group episodes by slug
const epBySlug = {};
for (const e of epRows) {
  if (!e.slug) continue;
  (epBySlug[e.slug] ||= []).push({ id: String(e.episode || '').trim().padStart(3, '0'), operator: e.operator, used_for: e.used_for });
}

// Safety: if the Sheet has no `what_is` column yet, preserve any existing value
// from tools.json so the objective descriptions aren't wiped on sync.
const existing = (() => { try { return Object.fromEntries((JSON.parse(readFileSync(jsonPath, 'utf8')).tools || []).map(t => [t.slug, t])); } catch { return {}; } })();

const tools = toolRows.filter(r => r.slug).map(r => {
  const rec = { slug: r.slug, name: r.name, category: r.category, tagline: r.tagline };
  const wi = r.what_is || (existing[r.slug] && existing[r.slug].what_is) || '';
  if (wi) rec.what_is = wi;
  // who_for is newer than the Sheet; if the column is absent/empty, preserve the
  // value already in tools.json so a sync can't silently wipe the enriched copy.
  const wf = r.who_for || (existing[r.slug] && existing[r.slug].who_for) || '';
  if (wf) rec.who_for = wf;
  if (r.website) rec.website = r.website; else rec.website = null;
  if (bool(r.is_private)) rec.is_private = true;
  if (bool(r.is_network)) rec.is_network = true;
  if (r.affiliate_url) rec.affiliate_url = r.affiliate_url;
  rec.ai4ntp_take = r.ai4ntp_take || (existing[r.slug] && existing[r.slug].ai4ntp_take) || '';
  rec.episodes = epBySlug[r.slug] || [];
  rec.pricing = { summary: r.pricing_summary || '', free_tier: bool(r.free_tier) };
  rec.g2 = r.g2_score
    ? { score: num(r.g2_score), reviews: num(r.g2_reviews), as_of: r.g2_as_of || null, source_url: r.g2_source || null }
    : null;
  const alts = (r.alternatives || '').split(',').map(s => s.trim()).filter(Boolean);
  if (alts.length) rec.alternatives = alts;
  rec.updated = r.updated || new Date().toISOString().slice(0, 10);
  return rec;
});

if (!tools.length) fail('Parsed 0 tools from the Sheet. Check the Tools tab has a header row and data.');

// sanity: warn on episodes with unknown slug, and alt slugs that don't exist
const slugs = new Set(tools.map(t => t.slug));
for (const s of Object.keys(epBySlug)) if (!slugs.has(s)) console.warn(`[sync] warning: Episodes tab references unknown tool slug "${s}"`);
for (const t of tools) for (const a of (t.alternatives || [])) if (!slugs.has(a)) console.warn(`[sync] warning: ${t.slug} lists alternative "${a}" not in the Tools tab`);

const _note = (() => { try { return JSON.parse(readFileSync(jsonPath, 'utf8'))._note; } catch { return undefined; } })();
writeFileSync(jsonPath, JSON.stringify({ ...(_note ? { _note } : {}), tools }, null, 2) + '\n');
console.log(`[sync] wrote tools.json (${tools.length} tools). Regenerating pages...`);

await import('./generate.mjs'); // regenerates /ai-tools/**, sitemap, robots
console.log('[sync] done. Review the diff, then deploy: vercel --prod --yes');
