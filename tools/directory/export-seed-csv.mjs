/* One-off: export tools.json into two CSVs to seed the Google Sheet (Tools + Episodes tabs). */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const { tools } = JSON.parse(readFileSync(resolve(dir, 'tools.json'), 'utf8'));

const q = (v) => {
  v = v == null ? '' : String(v);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
};

// Rich copy fields (what_is, ai4ntp_take, who_for) may be arrays of paragraphs;
// flatten to a single cell with a blank line between paragraphs. The generator
// and sync split a string back on the blank line (\n\n), so this round-trips.
const paraCell = (v) => Array.isArray(v) ? v.join('\n\n') : (v || '');

const cols = ['slug', 'name', 'category', 'website', 'tagline', 'what_is', 'ai4ntp_take', 'who_for', 'pricing_summary',
  'free_tier', 'g2_score', 'g2_reviews', 'g2_as_of', 'g2_source', 'is_private', 'is_network',
  'affiliate_url', 'alternatives', 'updated'];

const toolRows = [cols.join(',')];
for (const t of tools) {
  const p = t.pricing || {};
  const g = t.g2 || {};
  toolRows.push([
    t.slug, t.name, t.category, t.website || '', t.tagline, paraCell(t.what_is), paraCell(t.ai4ntp_take), paraCell(t.who_for), p.summary || '',
    p.free_tier === true ? 'true' : p.free_tier === false ? 'false' : '',
    g.score || '', g.reviews || '', g.as_of || '', g.source_url || '',
    t.is_private ? 'true' : '', t.is_network ? 'true' : '', t.affiliate_url || '',
    (t.alternatives || []).join(', '), t.updated || '',
  ].map(q).join(','));
}
writeFileSync(resolve(dir, 'seed-tools.csv'), toolRows.join('\n') + '\n');

const epRows = ['slug,episode,operator,used_for'];
for (const t of tools) for (const e of (t.episodes || [])) epRows.push([t.slug, e.id, e.operator, e.used_for].map(q).join(','));
writeFileSync(resolve(dir, 'seed-episodes.csv'), epRows.join('\n') + '\n');

console.log(`seed-tools.csv: ${tools.length} tools | seed-episodes.csv: ${epRows.length - 1} episode rows`);
