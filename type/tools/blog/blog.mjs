/* AI4NTP /blog generator.
   Reads content/posts.json (source of truth) and emits:
     /blog/index.html          (hub, Blog + ItemList + FAQPage)
     /blog/<slug>/index.html   (one per post: BlogPosting + WebPage + BreadcrumbList
                                + FAQPage + an archetype node)
   Pure Node (no deps). Shares all chrome, CSS, and the JSON-LD @id graph with the
   /ai-tools directory via tools/lib/site.mjs.

   NOT an entrypoint: tools/directory/generate.mjs imports this and is the single build
   command, because sitemap.xml and llms.txt must cover tools + posts + sessions in one
   pass or the last writer silently wins.

   Docs + schema: tools/blog/README.md */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  EP, REPO, ORIGIN, TODAY, esc, jtxt, toParas, parasHtml, plainText, ORG_LD,
  PEOPLE, personLd, fmtMonthYear, initialsOf, head, FOOT, crumb, breadcrumbLd,
} from '../lib/site.mjs';

const BLOG_ID = ORIGIN + '/blog#blog';

// Archetype registry. `ext` is the posts.json field that carries this archetype's
// structured payload. RULE: exactly one ext field may be non-null per post.
const ARCHETYPES = {
  listicle: { label: 'Tool roundup', ext: 'itemlist' },
  howto: { label: 'Playbook', ext: 'howto' },
  explainer: { label: 'Explainer', ext: 'explainer_def' },
  'case-study': { label: 'Case study', ext: 'results' },
};
// posts.json spells the explainer payload `definition` (clearer to write by hand).
const EXT_FIELD = { listicle: 'itemlist', howto: 'howto', explainer: 'definition', 'case-study': 'results' };

// ---------- load + validate ----------
const raw = JSON.parse(readFileSync(resolve(REPO, 'content/posts.json'), 'utf8'));
const toolsData = JSON.parse(readFileSync(resolve(REPO, 'tools/directory/tools.json'), 'utf8'));
const TOOL_BY_SLUG = Object.fromEntries(toolsData.tools.map(t => [t.slug, t]));

const fail = (slug, msg) => { throw new Error(`[blog] ${slug}: ${msg}`); };

// Every slug, drafts included: links.posts may point at a post that is written but not
// yet published. Must be declared before POSTS, since validate() reads it.
export const ALL_POST_SLUGS = new Set(raw.posts.map(p => p.slug));

function validate(p) {
  const s = p.slug || '(no slug)';
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) fail(s, 'slug must be lowercase kebab-case');
  if (!ARCHETYPES[p.archetype]) fail(s, `unknown archetype "${p.archetype}" (expected: ${Object.keys(ARCHETYPES).join(', ')})`);
  if (!p.title || !p.answer) fail(s, 'title and answer are required');

  // Exactly one archetype extension may be populated. Two means the archetype is confused,
  // and the JSON-LD would claim the post is two things at once.
  const populated = Object.values(EXT_FIELD).filter(f => p[f] != null);
  if (populated.length > 1) fail(s, `${populated.length} archetype extensions are non-null (${populated.join(', ')}); exactly one is allowed`);
  const want = EXT_FIELD[p.archetype];
  if (p[want] == null) fail(s, `archetype "${p.archetype}" requires the "${want}" field`);

  // A broken internal link is worse than a dropped badge, so these are hard fails.
  if (!PEOPLE[p.author]) fail(s, `unknown author "${p.author}" (expected one of: ${Object.keys(PEOPLE).join(', ')})`);
  for (const r of (p.reviewers || [])) if (!PEOPLE[r]) fail(s, `unknown reviewer "${r}"`);
  for (const slug of (p.links?.tools || [])) if (!TOOL_BY_SLUG[slug]) fail(s, `links.tools references unknown tool slug "${slug}"`);
  for (const id of (p.links?.sessions || [])) if (!EP[id]) fail(s, `links.sessions references unknown session "${id}"`);
  for (const ps of (p.links?.posts || [])) if (!ALL_POST_SLUGS.has(ps)) fail(s, `links.posts references unknown post slug "${ps}"`);
  if (p.source?.session && !EP[p.source.session]) fail(s, `source.session references unknown session "${p.source.session}"`);

  // Fabrication lint: a number with no citation is the failure mode this whole
  // pipeline exists to prevent. Warn rather than fail, because a takeaway can
  // legitimately carry a year or a version number.
  const cites = p.source?.citations?.length || 0;
  if (!cites) {
    const numeric = (p.takeaways || []).filter(t => /\d/.test(t));
    if (numeric.length) console.warn(`[blog] ${s}: ${numeric.length} takeaway(s) contain numbers but source.citations is empty. Every number must trace to a timestamp.`);
  }
  if (String(p.answer).split(/\s+/).length > 90) console.warn(`[blog] ${s}: answer is long (>90 words). Aim for 40-60 so it stays quotable as one chunk.`);
  return p;
}

// Published posts only, newest first. Drafts never generate, never sitemap, never
// appear in llms.txt.
export const POSTS = raw.posts
  .filter(p => p.status === 'published')
  .map(validate)
  .sort((a, b) => String(b.published || '').localeCompare(String(a.published || '')));

// ---------- helpers ----------
const postUrl = p => `${ORIGIN}/blog/${p.slug}`;
const ogFor = p => (p.og ? `${ORIGIN}/blog/${p.slug}/${p.og.output || 'og-image.jpg'}` : ORIGIN + '/og-image.jpg');
const peopleOf = p => [p.author, ...(p.reviewers || [])].map(n => PEOPLE[n]).filter(Boolean);
const toolLink = slug => `<a href="/ai-tools/${slug}">${esc(TOOL_BY_SLUG[slug].name)}</a>`;

function wordCountOf(p) {
  const parts = [plainText(p.answer), ...(p.takeaways || [])];
  for (const s of (p.sections || [])) parts.push(plainText(s.body));
  for (const f of (p.faqs || [])) parts.push(f.q, f.a);
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

// ---------- blog-only CSS (appended to the shared design system, not a fork) ----------
export const BLOG_CSS = `
  /* ---- blog ---- */
  .post-head{padding:8px 0 30px;border-bottom:1px solid var(--line);}
  .post-dek{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:clamp(19px,2.4vw,25px);line-height:1.4;opacity:.9;max-width:720px;margin:0 0 24px;}
  .answer-box{background:var(--cream);border-left:3px solid var(--signal-deep);padding:22px 26px;margin:34px 0 30px;}
  .answer-box .al{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:9px;}
  .answer-box p{font-size:18px;line-height:1.6;margin:0;max-width:none;}
  .takeaways{border:1px solid var(--line);padding:24px 26px;margin:0 0 34px;}
  .takeaways h2{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:14px;font-weight:400;}
  .takeaways ul{margin:0;padding-left:18px;}
  .takeaways li{margin-bottom:10px;line-height:1.55;}
  .takeaways li:last-child{margin-bottom:0;}
  .toc{margin:0 0 8px;padding:20px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
  .toc .tl{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin-bottom:11px;}
  .toc ol{margin:0;padding-left:18px;}
  .toc li{margin-bottom:6px;}
  .toc a{text-decoration:none;border-bottom:1px solid var(--line);}
  .toc a:hover{border-color:var(--ink);}
  .post-body p{font-size:17px;line-height:1.68;}
  .pquote{border-left:3px solid var(--signal);padding:4px 0 4px 22px;margin:26px 0;}
  .pquote p{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:22px;line-height:1.4;margin:0 0 8px;}
  .pquote cite{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-style:normal;opacity:.6;}
  .dtable{width:100%;border-collapse:collapse;margin:22px 0 6px;}
  .dtable th,.dtable td{text-align:left;vertical-align:top;padding:11px 14px 11px 0;border-top:1px solid var(--line);font-size:15px;}
  .dtable thead th{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;font-weight:400;border-top:none;}
  .dtable tbody tr:last-child td{border-bottom:1px solid var(--line);}
  .steps{list-style:none;counter-reset:s;margin:0;}
  .steps li{counter-increment:s;position:relative;padding:0 0 22px 46px;margin-bottom:22px;border-bottom:1px solid var(--line);}
  .steps li:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
  .steps li::before{content:counter(s,decimal-leading-zero);position:absolute;left:0;top:1px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.08em;color:var(--rust);}
  .steps h3{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:19px;letter-spacing:-.01em;margin-bottom:7px;}
  .steps p{margin:0 0 8px;}
  .steps .st{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.06em;opacity:.7;}
  .ilist{list-style:none;margin:0;}
  .ilist li{padding:20px 0;border-top:1px solid var(--line);}
  .ilist li:last-child{border-bottom:1px solid var(--line);}
  .ilist h3{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:20px;letter-spacing:-.01em;margin-bottom:7px;}
  .ilist .price{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.06em;opacity:.6;margin-top:7px;}
  .cites{margin-top:8px;}
  .cites .ct{padding:13px 0;border-top:1px solid rgba(250,247,240,.16);font-size:14px;line-height:1.55;}
  .cites .ct:first-child{border-top:none;}
  .cites .cm{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--signal);margin-right:9px;}
  .cites q{font-style:italic;opacity:.9;}
  .post-card .pc-meta{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.5;margin-bottom:9px;}
  .post-card .cn{margin-bottom:9px;}
  @media(max-width:700px){.answer-box{padding:18px;}.takeaways{padding:18px;}.steps li{padding-left:34px;}}
`;

// ---------- JSON-LD ----------
function jsonldFor(p) {
  const url = postUrl(p);
  const author = PEOPLE[p.author];
  const reviewers = (p.reviewers || []).map(n => PEOPLE[n]).filter(Boolean);
  const trail = [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: p.title, url: `/blog/${p.slug}` }];

  const postLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': url + '#post',
    headline: jtxt(p.title).slice(0, 110),
    description: jtxt(p.description),
    datePublished: p.published,
    dateModified: p.updated || p.published || TODAY,
    author: personLd(author),
    ...(reviewers.length ? { contributor: reviewers.map(personLd) } : {}),
    publisher: { '@id': ORIGIN + '/#org' },
    mainEntityOfPage: { '@id': url + '#webpage' },
    isPartOf: { '@id': BLOG_ID },
    image: ogFor(p),
    articleSection: ARCHETYPES[p.archetype].label,
    keywords: [p.keyword?.primary, ...(p.keyword?.secondary || [])].filter(Boolean).join(', '),
    wordCount: wordCountOf(p),
    inLanguage: 'en-US',
    // Points at the #software @id nodes the tool pages already emit, so the directory
    // and the blog resolve as ONE graph instead of two disconnected piles.
    ...((p.links?.tools || []).length ? {
      mentions: p.links.tools.map(s => ({ '@type': 'SoftwareApplication', '@id': `${ORIGIN}/ai-tools/${s}#software`, name: TOOL_BY_SLUG[s].name })),
    } : {}),
    ...(p.source?.session ? {
      citation: { '@type': 'CreativeWork', name: EP[p.source.session].title, url: ORIGIN + EP[p.source.session].recap },
      isBasedOn: ORIGIN + EP[p.source.session].recap,
    } : {}),
  };

  const webpageLd = {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': url + '#webpage', url,
    name: `${p.title} · AI4NTP`,
    isPartOf: { '@id': BLOG_ID },
    primaryImageOfPage: ogFor(p),
    breadcrumb: { '@id': url + '#crumbs' },
    dateModified: p.updated || p.published || TODAY,
  };

  const crumbLd = { ...breadcrumbLd(trail), '@id': url + '#crumbs' };
  const out = [ORG_LD, postLd, webpageLd, crumbLd];

  if ((p.faqs || []).length) {
    out.push({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: p.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: jtxt(f.a) } })),
    });
  }

  // Archetype node, wired back into the BlogPosting via mainEntity / about.
  if (p.archetype === 'howto' && p.howto) {
    postLd.mainEntity = { '@id': url + '#howto' };
    out.push({
      '@context': 'https://schema.org', '@type': 'HowTo', '@id': url + '#howto',
      name: jtxt(p.title),
      description: jtxt(p.answer),
      ...(p.howto.total_time ? { totalTime: p.howto.total_time } : {}),
      step: p.howto.steps.map((s, i) => ({
        '@type': 'HowToStep', position: i + 1, name: jtxt(s.name),
        text: plainText(s.body), url: `${url}#step-${i + 1}`,
      })),
      ...(p.howto.steps.some(s => s.tool_slug) ? {
        tool: p.howto.steps.filter(s => s.tool_slug).map(s => ({
          '@type': 'HowToTool', name: TOOL_BY_SLUG[s.tool_slug].name, '@id': `${ORIGIN}/ai-tools/${s.tool_slug}#software`,
        })),
      } : {}),
    });
  }
  if (p.archetype === 'listicle' && p.itemlist) {
    postLd.mainEntity = { '@id': url + '#itemlist' };
    out.push({
      '@context': 'https://schema.org', '@type': 'ItemList', '@id': url + '#itemlist',
      name: jtxt(p.title),
      // Grouped by job, NOT ranked. Claiming an order we did not apply would be a lie
      // to the crawler, so this stays Unordered.
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: p.itemlist.length,
      itemListElement: p.itemlist.map((it, i) => ({
        '@type': 'ListItem', position: i + 1, name: it.name,
        ...(it.tool_slug ? { item: { '@type': 'SoftwareApplication', '@id': `${ORIGIN}/ai-tools/${it.tool_slug}#software`, name: it.name, url: `${ORIGIN}/ai-tools/${it.tool_slug}` } } : {}),
      })),
    });
  }
  if (p.archetype === 'explainer' && p.definition) {
    postLd.about = { '@id': url + '#term' };
    out.push({
      '@context': 'https://schema.org', '@type': 'DefinedTerm', '@id': url + '#term',
      name: p.definition.term,
      description: jtxt(p.definition.text),
      ...(p.definition.also_known_as?.length ? { alternateName: p.definition.also_known_as } : {}),
      inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': ORIGIN + '/blog#glossary', name: 'AI4NTP glossary' },
    });
  }
  if (p.archetype === 'case-study' && p.source?.session) {
    postLd.about = { '@type': 'CreativeWork', name: EP[p.source.session].title, url: ORIGIN + EP[p.source.session].recap };
  }
  return out;
}

// Listicle items bucketed by the job the reader is trying to get done, NOT ranked.
// People search by job ("prospecting"), so each group heading is a question-shaped H2
// and earns its own TOC entry.
function groupsOf(p) {
  const groups = [];
  for (const it of (p.itemlist || [])) {
    const name = it.group || 'The tools';
    let bucket = groups.find(x => x.name === name);
    if (!bucket) groups.push(bucket = { name, id: 'g-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), items: [] });
    bucket.items.push(it);
  }
  return groups;
}

// ---------- section rendering ----------
function tableHtml(t) {
  if (!t) return '';
  return `<table class="dtable">
    <thead><tr>${t.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}
function quoteHtml(q) {
  if (!q) return '';
  return `<blockquote class="pquote"><p>&ldquo;${esc(q.text)}&rdquo;</p><cite>${esc(q.speaker)}${q.ts ? ` &middot; ${esc(q.ts)}` : ''}</cite></blockquote>`;
}

function extHtml(p) {
  if (p.archetype === 'howto' && p.howto) {
    return `<section class="block">
      <h2>The repeatable order of operations</h2>
      <p>If you take one thing, take the sequence. It works because each phase feeds the next.</p>
      <ol class="steps">${p.howto.steps.map((s, i) => `<li id="step-${i + 1}">
        <h3>${esc(s.name)}</h3>
        ${parasHtml(s.body)}
        ${s.tool_slug ? `<div class="st">Start with ${toolLink(s.tool_slug)}</div>` : ''}
      </li>`).join('')}</ol>
    </section>`;
  }
  if (p.archetype === 'listicle' && p.itemlist) {
    return groupsOf(p).map(g => `<section class="block" id="${g.id}">
      <h2>${esc(g.name)}</h2>
      <ul class="ilist">${g.items.map(it => `<li>
        <h3>${it.tool_slug ? toolLink(it.tool_slug) : esc(it.name)}</h3>
        ${parasHtml(it.body)}
        ${it.price ? `<div class="price">${esc(it.price)}</div>` : ''}
      </li>`).join('')}</ul>
    </section>`).join('');
  }
  if (p.archetype === 'case-study' && p.results) {
    return `<section class="block">
      <h2>The results</h2>
      <table class="dtable">
        <thead><tr><th>Metric</th><th>Before</th><th>After</th><th>Timeframe</th></tr></thead>
        <tbody>${p.results.map(r => `<tr><td>${esc(r.metric)}</td><td>${esc(r.before ?? 'Not stated')}</td><td>${esc(r.after)}</td><td>${esc(r.timeframe)}</td></tr>`).join('')}</tbody>
      </table>
      ${p.results.some(r => r.as_of) ? `<p class="disclosure">Figures as reported live by the operator${p.results[0].as_of ? `, as of ${esc(p.results[0].as_of)}` : ''}.</p>` : ''}
    </section>`;
  }
  return '';
}

// ---------- post page ----------
export function blogPage(p) {
  const url = postUrl(p);
  const trail = [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: p.title, url: `/blog/${p.slug}` }];
  const author = PEOPLE[p.author];
  const people = peopleOf(p);
  const arch = ARCHETYPES[p.archetype];
  const ep = p.source?.session ? EP[p.source.session] : null;

  const bylineHtml = `<div class="byline">
    <span class="op-stack byline-stack">${people.map(x => `<img src="${x.photo}" alt="${esc(x.name)}" loading="lazy" decoding="async" style="object-position:${x.objectPos}" onerror="this.remove()">`).join('')}</span>
    <span class="byline-txt">By <a href="/about#${author.slug}">${esc(author.name)}</a>${p.reviewers?.length ? `, with ${p.reviewers.map(n => `<a href="/about#${PEOPLE[n].slug}">${esc(n)}</a>`).join(' and ')}` : ''}${p.updated ? ` <span class="byline-sep">&middot;</span> <span class="byline-date">Updated ${esc(fmtMonthYear(p.updated))}</span>` : ''}</span>
  </div>`;

  const answerHtml = `<div class="answer-box">
    <div class="al">The short answer</div>
    <p>${esc(jtxt(p.answer))}</p>
  </div>`;

  const takeawaysHtml = (p.takeaways || []).length ? `<div class="takeaways">
    <h2>Key takeaways</h2>
    <ul>${p.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  </div>` : '';

  // Listicle groups are H2s too, so they belong in the TOC alongside the prose sections.
  const tocEntries = [
    ...(p.sections || []).map(s => ({ id: s.id, label: s.h2 })),
    ...groupsOf(p).map(g => ({ id: g.id, label: g.name })),
  ];
  const tocHtml = tocEntries.length > 2 ? `<nav class="toc" aria-label="On this page">
    <div class="tl">On this page</div>
    <ol>${tocEntries.map(e => `<li><a href="#${e.id}">${esc(e.label)}</a></li>`).join('')}</ol>
  </nav>` : '';

  const sectionsHtml = (p.sections || []).map(s => `<section class="block post-body" id="${s.id}">
    <h2>${esc(s.h2)}</h2>
    ${parasHtml(s.body)}
    ${quoteHtml(s.quote)}
    ${tableHtml(s.table)}
  </section>`).join('');

  const faqHtml = (p.faqs || []).length ? `<section class="block faq">
    <h2>Frequently asked questions</h2>
    ${p.faqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
  </section>` : '';

  const toolsHtml = (p.links?.tools || []).length ? `<section class="block">
    <h2>Tools used in this post</h2>
    <p>Every tool here has its own page with pricing, who used it live, and honest alternatives.</p>
    <div class="rel">${p.links.tools.map(toolLink).join('')}</div>
  </section>` : '';

  // The moat, made visible: every claim above traces to a timestamp in a recording we own.
  const sourceHtml = ep ? `<div class="seen">
    <h2>Where this came from</h2>
    <div class="ep">
      <div class="meta">${esc(ep.num)} &middot; Recorded live</div>
      <div class="uf">${esc(ep.title)}.</div>
      <a href="${ep.recap}">${ep.replay ? 'Watch the recap' : 'Show notes'} &rarr;</a>${ep.replay ? `<a href="${esc(ep.replay)}" target="_blank" rel="noopener">YouTube replay &rarr;</a>` : ''}
    </div>
    ${(p.source.citations || []).length ? `<div class="cites">${p.source.citations.map(c => `<div class="ct"><span class="cm">${esc(c.ts)} ${esc(c.speaker)}</span><q>${esc(c.quote)}</q></div>`).join('')}</div>` : ''}
  </div>` : '';

  const authorCardHtml = `<section class="block contributors">
    <h2>Who wrote this</h2>
    <p class="contrib-intro">Every AI4NTP post is written by an operator who was in the room when the work happened.</p>
    <div class="contrib-grid">${people.map(x => `<div class="contrib-card">
      <a class="contrib-av" data-initials="${initialsOf(x.name)}" href="${x.linkedin}" target="_blank" rel="noopener" aria-label="${esc(x.name)} on LinkedIn"><img src="${x.photo}" alt="${esc(x.name)}" loading="lazy" decoding="async" style="object-position:${x.objectPos}" onerror="this.remove()"></a>
      <div class="contrib-body">
        <div class="contrib-top"><a class="contrib-name" href="/about#${x.slug}">${esc(x.name)}</a><a class="contrib-ln" href="${x.linkedin}" target="_blank" rel="noopener">LinkedIn &rarr;</a></div>
        <div class="contrib-role">${esc(x.role)}</div>
        <p class="contrib-bio">${esc(x.bio)}</p>
      </div>
    </div>`).join('')}</div>
  </section>`;

  const related = POSTS.filter(x => x.slug !== p.slug).slice(0, 4);
  const relatedHtml = related.length ? `<section class="block">
    <h2>More field notes</h2>
    <div class="rel">${related.map(x => `<a href="/blog/${x.slug}">${esc(x.title)}</a>`).join('')}</div>
  </section>` : '';

  const ctaHref = p.links?.cta || '/register';
  const ctaCard = `<section class="cta-card">
    <h2>Want to watch this happen live?</h2>
    <p>AI4NTP runs free live sessions where real operators build in real time, with the audience picking what gets built. No theory, no slides.</p>
    <div class="cta-links">
      <a class="btn" href="${ctaHref}" data-cta="blog_register_click">Save your seat &rarr;</a>
      <a class="btn-ghost" href="/ai-tools" data-cta="blog_tools_click">Browse the tools &rarr;</a>
    </div>
  </section>`;

  const body = `
${crumb(trail)}
<header class="post-head wrap narrow">
  <div class="eyebrow">${esc(arch.label)}${ep ? ` &middot; From ${esc(ep.num)}` : ''}</div>
  <h1 class="title">${esc(p.title)}</h1>
  <p class="post-dek">${esc(p.dek)}</p>
  ${bylineHtml}
</header>

<div class="wrap narrow">
  ${answerHtml}
  ${takeawaysHtml}
  ${tocHtml}
  ${sectionsHtml}
  ${extHtml(p)}
  ${faqHtml}
  ${toolsHtml}
  ${sourceHtml}
  ${authorCardHtml}
  ${relatedHtml}
  ${ctaCard}

  <div class="endcta">
    <a href="/blog">&larr; All posts</a>
    <a href="https://ai4ntp.beehiiv.com" target="_blank" rel="noopener" data-cta="blog_newsletter_click">Get these in our newsletter</a>
  </div>
  <div class="updated">Last updated ${esc(p.updated || p.published)}</div>
</div>
`;
  return head({
    title: p.seo_title || `${p.title} | AI4NTP`,
    desc: jtxt(p.description),
    canonical: url,
    jsonld: jsonldFor(p),
    ogType: 'article',
    image: ogFor(p),
    published: p.published,
    modified: p.updated || p.published,
    extraCss: BLOG_CSS,
  }) + body + FOOT;
}

// ---------- hub ----------
export function blogHub() {
  const url = `${ORIGIN}/blog`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }];
  const lastUpdated = POSTS.map(p => p.updated).filter(Boolean).sort().pop() || TODAY;

  const blogLd = {
    '@context': 'https://schema.org', '@type': 'Blog', '@id': BLOG_ID, url,
    name: 'AI4NTP field notes',
    description: 'Written field notes drawn from AI4NTP live sessions. Every claim traces to a timestamp in a recorded session.',
    publisher: { '@id': ORIGIN + '/#org' },
    inLanguage: 'en-US',
    isPartOf: { '@id': ORIGIN + '/#website' },
    dateModified: lastUpdated,
    blogPost: POSTS.map(p => ({ '@type': 'BlogPosting', '@id': postUrl(p) + '#post', headline: jtxt(p.title).slice(0, 110), url: postUrl(p), datePublished: p.published })),
  };
  const itemListLd = {
    '@context': 'https://schema.org', '@type': 'ItemList', '@id': url + '#itemlist',
    itemListElement: POSTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: postUrl(p), name: p.title })),
  };
  const hubFaqs = [
    { q: 'Where do these posts come from?', a: 'Every post is drawn from a real AI4NTP live session. We record each session, then write up what actually happened, with the timestamp and the operator behind every claim. Nothing here is researched from other blog posts.' },
    { q: 'How often do you publish?', a: `We publish after each live session, drawing the posts out of what was demonstrated on stage. Last updated ${lastUpdated}.` },
  ];
  const hubFaqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: hubFaqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  const cards = POSTS.map(p => {
    const ep = p.source?.session ? EP[p.source.session] : null;
    const searchStr = jtxt(`${p.title} ${p.dek} ${ARCHETYPES[p.archetype].label} ${p.keyword?.primary || ''}`).toLowerCase();
    return `<a class="card post-card" href="/blog/${p.slug}" data-cat="${p.archetype}" data-name="${esc(p.title.toLowerCase())}" data-search="${esc(searchStr)}" data-updated="${esc(p.published || '')}">
      <div class="pc-meta">${esc(ARCHETYPES[p.archetype].label)}${ep ? ` &middot; ${esc(ep.num)}` : ''}</div>
      <span class="cn">${esc(p.title)}</span>
      <div class="cd">${esc(p.dek)}</div>
      <div class="badges"><span class="badge">${esc(fmtMonthYear(p.published))}</span></div>
    </a>`;
  }).join('');

  const archsUsed = [...new Set(POSTS.map(p => p.archetype))];
  const catBtns = ['<li><button class="active" data-cat="all">All posts</button></li>']
    .concat(archsUsed.map(a => `<li><button data-cat="${a}">${esc(ARCHETYPES[a].label)}</button></li>`)).join('');

  const opsHtml = [
    { img: '/sessions/001/images/ian-kilpatrick.jpg', name: 'Ian Kilpatrick' },
    { img: '/sessions/001/images/justin-novak.jpg', name: 'Justin Novak' },
    { img: '/sessions/001/images/alec-saluga.jpg', name: 'Alec Saluga' },
  ].map(o => `<img src="${o.img}" alt="${esc(o.name)}" loading="lazy">`).join('');

  const title = 'AI4NTP Field Notes: What We Actually Built, Live | AI4NTP';
  const desc = 'Written field notes drawn from AI4NTP live sessions. Every claim traces to a timestamp in a session we recorded, with the operator who did the work.';

  const body = `
${crumb(trail)}
<header class="dir-hero wrap">
  <div class="eyebrow">AI4NTP field notes</div>
  <h1 class="title">What we actually built, <em>written down.</em></h1>
  <p class="lede">Every post here comes out of a live session we recorded. Real numbers, real tools, and the timestamp behind every claim.</p>
  <div class="dh-proof">
    <div class="dh-ops">
      <span class="op-stack">${opsHtml}</span>
      <span class="dh-stat"><strong>${POSTS.length} post${POSTS.length === 1 ? '' : 's'}</strong>, drawn from sessions built live by real operators.</span>
    </div>
    <div class="dh-companies">Join 450+ operators from organizations like <b>JPMorgan &middot; Amazon &middot; Carnegie Mellon &middot; O'Reilly</b></div>
  </div>
  <div class="cta-row"><a class="btn-ghost" href="#posts">Read the field notes &darr;</a></div>
</header>

<div class="dir wrap" id="posts">
  <aside class="dir-side">
    <div class="search"><input type="search" id="postSearch" placeholder="Search posts..." aria-label="Search posts"></div>
    <div class="side-label">Type</div>
    <ul class="catlist" id="catList">${catBtns}</ul>
    <div class="side-label">Sort by</div>
    <ul class="sortlist" id="sortList">
      <li><button class="active" data-sort="newest">Newest</button></li>
      <li><button data-sort="az">A to Z</button></li>
    </ul>
  </aside>
  <main class="dir-main">
    <div class="dir-count" id="dirCount">${POSTS.length} post${POSTS.length === 1 ? '' : 's'}</div>
    <div class="grid" id="postGrid">${cards}</div>
    <div class="no-results" id="noResults" hidden>No posts match. Try another search or type.</div>
  </main>
</div>

<section class="block faq wrap narrow">
  <h2>About these field notes</h2>
  ${hubFaqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
</section>

<div class="wrap narrow endcta">
  <a href="/ai-tools" data-cta="blog_tools_click">Browse the tools directory</a>
  <a href="/register" data-cta="blog_register_click">Watch the next session live</a>
</div>
<div class="wrap narrow updated">Last updated ${esc(lastUpdated)}</div>

<script>
(function(){
  var grid=document.getElementById('postGrid'),count=document.getElementById('dirCount'),no=document.getElementById('noResults');
  var cards=[].slice.call(grid.querySelectorAll('.card'));
  var state={cat:'all',q:'',sort:'newest'};
  function apply(){
    var q=state.q.trim().toLowerCase(),shown=0;
    cards.forEach(function(c){
      var ok=(state.cat==='all'||c.dataset.cat===state.cat)&&(!q||c.dataset.search.indexOf(q)>-1);
      c.style.display=ok?'':'none'; if(ok)shown++;
    });
    var vis=cards.filter(function(c){return c.style.display!=='none';});
    vis.sort(function(a,b){
      if(state.sort==='az')return a.dataset.name.localeCompare(b.dataset.name);
      return (b.dataset.updated||'').localeCompare(a.dataset.updated||'')||a.dataset.name.localeCompare(b.dataset.name);
    });
    vis.forEach(function(c){grid.appendChild(c);});
    count.textContent=shown+(shown===1?' post':' posts');
    no.hidden=shown>0; grid.style.display=shown>0?'':'none';
  }
  document.getElementById('postSearch').addEventListener('input',function(){state.q=this.value;apply();});
  document.getElementById('catList').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;state.cat=b.dataset.cat;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);});apply();});
  document.getElementById('sortList').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;state.sort=b.dataset.sort;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);});apply();});
  apply();
})();
</script>
`;
  return head({
    title, desc, canonical: url,
    jsonld: [ORG_LD, blogLd, itemListLd, hubFaqLd, breadcrumbLd(trail)],
    extraCss: BLOG_CSS,
  }) + body + FOOT;
}

// Rename or unpublish a post and its old directory stays live at the old URL forever.
// Nothing else catches this, so warn loudly.
export function warnStaleBlogDirs() {
  const dir = resolve(REPO, 'blog');
  if (!existsSync(dir)) return;
  const live = new Set(POSTS.map(p => p.slug));
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (!name.isDirectory()) continue;
    if (!live.has(name.name)) {
      const why = ALL_POST_SLUGS.has(name.name) ? 'is status:draft' : 'is not in posts.json';
      console.warn(`[blog] STALE: /blog/${name.name} ${why} but the directory still exists and will still deploy. Delete it.`);
    }
  }
}
