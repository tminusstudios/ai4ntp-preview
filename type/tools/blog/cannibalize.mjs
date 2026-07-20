#!/usr/bin/env node
/* Cannibalization screen for a candidate blog keyword.
     node tools/blog/cannibalize.mjs "how to build a company with ai"

   Checks the three surfaces that have data. The fourth (vs the rest of your slate) has no
   data source and is on you.

   THIS IS A PROMPT FOR JUDGMENT, NOT A VERDICT. The tools.json screen is noisy in BOTH
   directions: it false-positives on job-shaped queries containing a tool name ("how to get
   recommended by chatgpt" is legitimate) and false-negatives on single-tool queries with no
   modifier ("openclaw strategy" should die by the bright line but has no modifier to catch).
   Read the output, then apply the bright line yourself:

     One tool = /ai-tools/<slug>. Many tools, or a job-to-be-done = /blog/<slug>. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { REPO, EP } from '../lib/site.mjs';

const kw = process.argv.slice(2).join(' ').toLowerCase().trim();
if (!kw) { console.error('usage: node tools/blog/cannibalize.mjs "<keyword>"'); process.exit(2); }

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const K = norm(kw);
const MODIFIERS = ['pricing', 'price', 'cost', 'review', 'alternatives', 'alternative', 'what is', 'vs', 'versus'];
let verdict = 'CLEAR';

console.log(`\nKeyword: "${kw}"\n`);

// 1. vs existing posts (mechanical, trustworthy)
const posts = JSON.parse(readFileSync(resolve(REPO, 'content/posts.json'), 'utf8')).posts;
const postHits = [];
for (const p of posts) {
  const fields = [p.keyword?.primary, ...(p.keyword?.secondary || []), p.title].filter(Boolean).map(norm);
  for (const f of fields) {
    if (f === K || f.includes(K) || K.includes(f)) postHits.push({ slug: p.slug, field: f, status: p.status });
  }
}
if (postHits.length) {
  verdict = 'REJECT';
  console.log('1. vs content/posts.json   REJECT');
  for (const h of postHits) console.log(`     "${h.field}" already claimed by /blog/${h.slug} (${h.status})`);
  console.log('     -> Reject, OR propose "update existing post" instead. The update is usually right.');
} else {
  console.log(`1. vs content/posts.json   clear (${posts.length} posts checked)`);
}

// 2. vs the tools directory (noisy, advisory only)
const tools = JSON.parse(readFileSync(resolve(REPO, 'tools/directory/tools.json'), 'utf8')).tools;
const named = tools.filter(t => K.includes(norm(t.name)) && norm(t.name).length > 2);
if (named.length) {
  const mod = MODIFIERS.find(m => K.includes(m));
  if (mod && named.length === 1) {
    verdict = 'REJECT';
    console.log(`2. vs tools.json           REJECT  (single-tool query: "${named[0].name}" + "${mod}")`);
    console.log(`     -> /ai-tools/${named[0].slug} owns this permanently. Add a session episode entry there instead.`);
  } else {
    console.log(`2. vs tools.json           REVIEW  (names ${named.length} tool(s): ${named.map(t => t.name).join(', ')})`);
    console.log('     -> Not an automatic reject. Apply the bright line: is this a JOB-shaped query');
    console.log('        (fine, keep) or a SINGLE-TOOL query (reject, the tool page owns it)?');
    if (verdict === 'CLEAR') verdict = 'REVIEW';
  }
} else {
  console.log('2. vs tools.json           clear (names no tool)');
}

// 3. vs session titles (mechanical)
const epHits = Object.entries(EP).filter(([, e]) => {
  const t = norm(e.title);
  return t === K || t.includes(K) || K.includes(t);
});
if (epHits.length) {
  verdict = 'REJECT';
  console.log('3. vs sessions (EP)        REJECT');
  for (const [id, e] of epHits) console.log(`     matches ${e.num} "${e.title}" -> /sessions/${id} owns it`);
} else {
  console.log(`3. vs sessions (EP)        clear (${Object.keys(EP).length} sessions checked)`);
}

// 4. no data source
console.log('4. vs the rest of your slate   NOT CHECKED. Do this by hand.');
console.log('     RULE: one cluster yields at most ONE post. If a cluster supports two');
console.log('     archetypes, take the one carrying the numbers; the other becomes an H2.');

console.log(`\nVERDICT: ${verdict}${verdict === 'REVIEW' ? ' (your judgment required)' : ''}\n`);
process.exit(verdict === 'REJECT' ? 1 : 0);
