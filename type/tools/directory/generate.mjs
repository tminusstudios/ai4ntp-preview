#!/usr/bin/env node
/* AI4NTP /ai-tools directory generator.
   Reads tools/directory/tools.json (source of truth) and writes static HTML:
     /ai-tools/index.html            (hub, CollectionPage + ItemList)
     /ai-tools/<slug>/index.html     (one per tool: SoftwareApplication + FAQPage + BreadcrumbList)
     /sitemap.xml, /robots.txt
   Pure Node (no deps). Reuses the site's head boilerplate + nav.js/footer.js.
   Related tools and FAQs are auto-derived. Run:  node tools/directory/generate.mjs

   This is THE build entrypoint for the whole static site: it also emits /blog (via
   tools/blog/blog.mjs) plus sitemap.xml, robots.txt, and llms.txt, which cover tools,
   posts, and sessions together. Shared chrome lives in tools/lib/site.mjs. */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EP, ORIGIN, TODAY, esc, jtxt, toParas, parasHtml, plainText, ORG_LD,
  PEOPLE, ALL_OPERATORS, operatorsOf, personLd,
  fmtMonthYear, initialsOf, head, FOOT, crumb, breadcrumbLd, write,
} from '../lib/site.mjs';
import { POSTS, blogHub, blogPage, warnStaleBlogDirs } from '../blog/blog.mjs';
import { verifyCitations } from '../blog/verify-citations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const data = JSON.parse(readFileSync(resolve(__dirname, 'tools.json'), 'utf8'));
const TOOLS = data.tools.slice().sort((a, b) => a.name.localeCompare(b.name));
const bySlug = Object.fromEntries(TOOLS.map(t => [t.slug, t]));

// Normalize episode ids (Google Sheets strips leading zeros: "001" -> "1") and drop unknowns.
for (const t of TOOLS) {
  t.episodes = (t.episodes || [])
    .map(e => ({ ...e, id: String(e.id).trim().padStart(3, '0') }))
    .filter(e => { if (!EP[e.id]) { console.warn(`[generate] ${t.slug}: unknown episode id "${e.id}", skipping`); return false; } return true; });
}

// Curated, genuine substitutes only (from tools.json `alternatives`).
function altsFor(tool) {
  return (tool.alternatives || []).map(s => bySlug[s]).filter(Boolean);
}
// Honest internal-link row: other tools that appeared in the SAME episode(s).
function usedAlongside(tool) {
  const eps = new Set(tool.episodes.map(e => e.id));
  return TOOLS.filter(t => t.slug !== tool.slug && t.episodes.some(e => eps.has(e.id))).slice(0, 6);
}
// Broader "explore more" internal-link module: additional tools from the directory
// (same category first, then the rest, alphabetical), excluding this tool and anything
// already linked above. This is a browse aid, NOT a substitutes claim, so it can draw
// from the whole directory. Its job is crawl depth: every tool page links out to ~9 more
// siblings, so no tool page is more than a click or two from any other (spreads link
// equity and gives Googlebot dense paths through /ai-tools).
function moreToolsFor(tool, exclude) {
  const ex = new Set([tool.slug, ...exclude.map(t => t.slug)]);
  const sameCat = TOOLS.filter(t => !ex.has(t.slug) && t.category === tool.category);
  const rest = TOOLS.filter(t => !ex.has(t.slug) && t.category !== tool.category);
  return [...sameCat, ...rest].slice(0, 9);
}

// ---- Logos: auto-pulled from each tool's domain at build, monogram fallback ----
function domainOf(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } }
function logoHtml(tool, cls = '') {
  const initial = esc(((tool.name || '?').trim()[0] || '?').toUpperCase());
  const mono = `<span class="logo-mono">${initial}</span>`;
  const dom = tool.website ? domainOf(tool.website) : '';
  const img = dom
    ? `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(dom)}&amp;sz=128" alt="${esc(tool.name)} logo" loading="lazy" decoding="async" onerror="this.remove()">`
    : '';
  return `<span class="logo ${cls}">${mono}${img}</span>`;
}
// Max episode number (003 > 002 > 001) for the "by episode" sort.
const epOrder = t => Math.max(0, ...t.episodes.map(e => parseInt(e.id, 10) || 0));

function faqsFor(tool) {
  // Note: "What is X?" is a visible section (objective), so it's intentionally not
  // repeated here to avoid the section/FAQ redundancy.
  const out = [];
  if (tool.pricing && tool.pricing.free_tier === true)
    out.push({ q: `Is ${tool.name} free?`, a: jtxt(`Yes, ${tool.name} has a free tier. ${tool.pricing.summary || ''}`) });
  if (tool.pricing && tool.pricing.summary)
    out.push({ q: `How much does ${tool.name} cost?`, a: jtxt(tool.pricing.summary) });
  if (tool.episodes && tool.episodes.length) {
    const liveEps = tool.episodes.filter(ep => !EP[ep.id].upcoming);
    const upEps = tool.episodes.filter(ep => EP[ep.id].upcoming);
    if (liveEps.length) {
      const e = liveEps.map(ep => `${ep.operator} used it in ${EP[ep.id].num} for ${ep.used_for.charAt(0).toLowerCase() + ep.used_for.slice(1)}`).join('; ');
      out.push({ q: `What did AI4NTP use ${tool.name} for?`, a: jtxt(e + '.') });
    } else if (upEps.length) {
      const e = upEps.map(ep => `${EP[ep.id].num}, ${ep.used_for.charAt(0).toLowerCase() + ep.used_for.slice(1)}`).join('; ');
      out.push({ q: `Will AI4NTP cover ${tool.name}?`, a: jtxt(`Yes. We are showcasing ${tool.name} live in ${e}.`) });
    }
  }
  if (tool.who_for)
    out.push({ q: `Is ${tool.name} good for non-technical people?`, a: plainText(tool.who_for) });
  const alts = altsFor(tool);
  if (alts.length)
    out.push({ q: `What are some ${tool.name} alternatives?`, a: jtxt(`Tools we've also used live that can stand in for ${tool.name}: ${alts.map(r => r.name).join(', ')}.`) });
  return out;
}

// ---------- per-tool page ----------
function toolPage(tool) {
  const url = `${ORIGIN}/ai-tools/${tool.slug}`;
  const alts = altsFor(tool);
  const along = usedAlongside(tool);
  const more = moreToolsFor(tool, [...alts, ...along]);
  const faqs = faqsFor(tool);
  const trail = [{ name: 'Home', url: '/' }, { name: 'AI Tools', url: '/ai-tools' }, { name: tool.name, url: `/ai-tools/${tool.slug}` }];
  const epNums = [...new Set(tool.episodes.map(e => EP[e.id].num))].join(' and ');
  const people = operatorsOf(tool);
  const ops = people.length ? people.map(p => p.name).join(', ') : [...new Set(tool.episodes.map(e => e.operator))].join(', ');
  const allUpcoming = tool.episodes.length > 0 && tool.episodes.every(e => EP[e.id].upcoming);

  const softwareLd = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': url + '#software',
    name: tool.name, applicationCategory: tool.category, operatingSystem: 'Web',
    description: jtxt(tool.tagline),
    ...(tool.website ? { url: tool.website } : {}),
    ...(tool.pricing && tool.pricing.free_tier === true
      ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } } : {}),
  };
  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const webpageLd = {
    '@context': 'https://schema.org', '@type': 'WebPage', '@id': url + '#webpage', url,
    name: `${tool.name} · AI4NTP`,
    isPartOf: { '@type': 'CollectionPage', '@id': ORIGIN + '/ai-tools#collection', url: ORIGIN + '/ai-tools' },
    about: { '@id': url + '#software' },
    ...(people.length ? {
      author: people.map(personLd),
      contributor: people.map(p => ({ '@type': 'Person', '@id': ORIGIN + '/about#' + p.slug })),
      publisher: { '@id': ORIGIN + '/#org' },
    } : {}),
    dateModified: tool.updated || TODAY,
  };

  const title = `${tool.name}: Pricing, Features & Live Demo | AI4NTP`;
  const desc = jtxt(`${tool.tagline} ${plainText(tool.ai4ntp_take)}`).slice(0, 158);

  const ctaLabel = tool.cta_label || `Visit ${tool.name}`;
  let cta;
  if (tool.is_private) {
    cta = `<span class="private-note">Private &middot; not publicly available</span>`;
  } else if (tool.website) {
    const href = tool.affiliate_url || tool.website;
    const relAttr = tool.affiliate_url ? 'noopener sponsored' : 'noopener';
    cta = `<a class="btn" href="${esc(href)}" target="_blank" rel="${relAttr}" data-cta="tool_click" data-tool="${esc(tool.name)}">${esc(ctaLabel)} &rarr;</a>`;
  } else {
    cta = '';
  }

  const yn = tool.pricing && tool.pricing.free_tier === true ? 'Yes'
    : (tool.pricing && tool.pricing.free_tier === false ? 'No' : 'Not stated');
  const websiteCell = tool.website
    ? `<a href="${esc(tool.affiliate_url || tool.website)}" target="_blank" rel="${tool.affiliate_url ? 'noopener sponsored' : 'noopener'}">${esc(tool.website.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>`
    : 'Private / not public';
  let ratingRow = '';
  if (tool.g2 && tool.g2.score) {
    const g = tool.g2;
    const paren = [];
    if (g.reviews) paren.push(`${g.reviews} reviews`);
    paren.push('G2');
    if (g.as_of) paren.push(`as of ${g.as_of}`);
    let cell = `${esc(g.score)}/5 (${esc(paren.join(', '))})`;
    if (g.source_url) cell += ` &middot; <a href="${esc(g.source_url)}" target="_blank" rel="noopener">source</a>`;
    ratingRow = `<tr><th>Rating</th><td>${cell}</td></tr>`;
  }
  const factsHtml = `<table class="facts"><tbody>
    <tr><th>Category</th><td>${esc(tool.category)}</td></tr>
    <tr><th>Pricing</th><td>${esc(tool.pricing && tool.pricing.summary ? tool.pricing.summary : 'Not stated')}</td></tr>
    <tr><th>Free tier</th><td>${yn}</td></tr>
    ${tool.episodes.length ? `<tr><th>${allUpcoming ? 'Showcasing in' : 'Used live in'}</th><td>${esc(epNums)}${allUpcoming ? ' (upcoming)' : ''}</td></tr>
    <tr><th>Operator(s)</th><td>${esc(ops)}</td></tr>` : ''}
    <tr><th>Website</th><td>${websiteCell}</td></tr>
    ${ratingRow}
  </tbody></table>`;
  const summaryHtml = `<p class="summary"><strong>${esc(tool.name)}:</strong> ${esc(tool.tagline)} Demoed live on AI4NTP in ${esc(epNums)}.</p>`;
  const subj = encodeURIComponent(`Training & resources: ${tool.name}`);
  const visitBtn = (!tool.is_private && tool.website)
    ? `<a class="btn" href="${esc(tool.affiliate_url || tool.website)}" target="_blank" rel="${tool.affiliate_url ? 'noopener sponsored' : 'noopener'}" data-cta="tool_click" data-tool="${esc(tool.name)}">${esc(ctaLabel)} &rarr;</a>`
    : '';
  const ctaCard = `<section class="cta-card">
    <h2>Want to get more out of ${esc(tool.name)}?</h2>
    <p>See tools like ${esc(tool.name)} set up live, step by step, on AI4NTP, or get hands-on help putting it to work.</p>
    <div class="cta-links">
      ${visitBtn}
      <a class="${visitBtn ? 'btn-ghost' : 'btn'}" href="mailto:justin@ai4ntp.com?subject=${subj}" data-cta="tool_email_click">Email us &rarr;</a>
    </div>
  </section>`;

  const seen = tool.episodes.map(ep => {
    const e = EP[ep.id];
    if (e.upcoming) {
      return `<div class="ep">
      <div class="meta">${esc(e.num)} &middot; Coming up</div>
      <div class="uf">${esc(ep.used_for)}.</div>
      <a href="${e.recap}">See the session &rarr;</a>
    </div>`;
    }
    return `<div class="ep">
      <div class="meta">${esc(e.num)} &middot; ${esc(ep.operator)}</div>
      <div class="uf">${esc(ep.used_for)}.</div>
      <a href="${e.recap}">${e.replay ? 'Watch the recap' : 'Show notes'} &rarr;</a>${e.replay ? `<a href="${esc(e.replay)}" target="_blank" rel="noopener">YouTube replay &rarr;</a>` : ''}
    </div>`;
  }).join('');

  const faqHtml = faqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');
  const altHtml = alts.length
    ? `<section class="block"><h2>${esc(tool.name)} alternatives we've used live</h2><p>Genuine substitutes for ${esc(tool.name)} that we've also run on stage:</p><div class="rel">${alts.map(r => `<a href="/ai-tools/${r.slug}">${esc(r.name)}</a>`).join('')}</div></section>`
    : '';
  const alongHtml = along.length
    ? `<section class="block"><h2>Tools we used alongside ${esc(tool.name)}</h2><p>Other tools from ${esc(epNums)} in the directory:</p><div class="rel">${along.map(r => `<a href="/ai-tools/${r.slug}">${esc(r.name)}</a>`).join('')}</div></section>`
    : '';
  const moreHtml = more.length
    ? `<section class="block"><h2>More AI tools we use</h2><p>Explore other tools we've demoed live at AI4NTP:</p><div class="rel">${more.map(r => `<a href="/ai-tools/${r.slug}">${esc(r.name)}</a>`).join('')}</div></section>`
    : '';

  // Author byline (E-E-A-T): the operator(s) who demoed this tool live.
  const bylineNames = people.map(p => `<a href="/about#${p.slug}">${esc(p.name)}</a>`);
  const bylineJoined = bylineNames.length <= 1 ? bylineNames.join('')
    : bylineNames.length === 2 ? bylineNames.join(' and ')
    : bylineNames.slice(0, -1).join(', ') + ', and ' + bylineNames[bylineNames.length - 1];
  const updated = fmtMonthYear(tool.updated);
  const bylineHtml = people.length ? `<div class="byline">
    <span class="op-stack byline-stack">${people.map(p => `<img src="${p.photo}" alt="${esc(p.name)}" loading="lazy" decoding="async" style="object-position:${p.objectPos}" onerror="this.remove()">`).join('')}</span>
    <span class="byline-txt">Demoed live by ${bylineJoined}${updated ? ` <span class="byline-sep">&middot;</span> <span class="byline-date">Updated ${updated}</span>` : ''}</span>
  </div>` : '';

  const contributorsHtml = people.length ? `<section class="block contributors">
    <h2>Who demoed ${esc(tool.name)} at AI4NTP</h2>
    <p class="contrib-intro">On AI4NTP, every tool is shown live by a real operator. These are the people who demoed ${esc(tool.name)} on stage.</p>
    <div class="contrib-grid">${people.map(p => `<div class="contrib-card">
      <a class="contrib-av" data-initials="${initialsOf(p.name)}" href="${p.linkedin}" target="_blank" rel="noopener" aria-label="${esc(p.name)} on LinkedIn"><img src="${p.photo}" alt="${esc(p.name)}" loading="lazy" decoding="async" style="object-position:${p.objectPos}" onerror="this.remove()"></a>
      <div class="contrib-body">
        <div class="contrib-top"><a class="contrib-name" href="/about#${p.slug}">${esc(p.name)}</a><a class="contrib-ln" href="${p.linkedin}" target="_blank" rel="noopener">LinkedIn &rarr;</a></div>
        <div class="contrib-role">${esc(p.role)}</div>
        <p class="contrib-bio">${esc(p.bio)}</p>
      </div>
    </div>`).join('')}</div>
  </section>` : '';

  const body = `
${crumb(trail)}
<header class="tool-head wrap narrow">
  <div class="tool-id">
    ${logoHtml(tool, 'lg')}
    <div>
      <div class="cat-tag">${esc(tool.category)}${tool.is_network ? ' &middot; AI4NTP network' : ''}</div>
      <h1 class="title">${esc(tool.name)}</h1>
    </div>
  </div>
  <p class="tool-desc">${esc(tool.tagline)}</p>
  ${bylineHtml}
  <div class="cta-row">${cta}</div>
</header>

<div class="wrap narrow">
  ${tool.what_is ? `<section class="block">
    <h2>What is ${esc(tool.name)}?</h2>
    ${parasHtml(tool.what_is)}
  </section>` : ''}

  <section class="block">
    <h2>How and why we use ${esc(tool.name)} at AI4NTP</h2>
    ${parasHtml(tool.ai4ntp_take)}
  </section>

  ${tool.who_for ? `<section class="block">
    <h2>Is ${esc(tool.name)} right for non-technical people?</h2>
    ${parasHtml(tool.who_for)}
  </section>` : ''}

  ${altHtml}

  <section class="block faq">
    <h2>${esc(tool.name)} FAQ</h2>
    ${faqHtml}
  </section>

  <section class="block">
    <h2>${esc(tool.name)} at a glance</h2>
    ${factsHtml}
  </section>

  ${tool.episodes.length ? `<div class="seen">
    <h2>${allUpcoming ? `Coming up: ${esc(tool.name)} at AI4NTP` : `See how we used ${esc(tool.name)} live at AI4NTP`}</h2>
    ${seen}
  </div>` : ''}

  ${contributorsHtml}

  ${moreHtml}

  ${ctaCard}

  <div class="endcta">
    <a href="/ai-tools">&larr; All AI tools</a>
    <a href="https://ai4ntp.beehiiv.com" target="_blank" rel="noopener" data-cta="tools_newsletter_click">Get the full stack in our newsletter</a>
  </div>
  <div class="updated">Last updated ${esc(tool.updated || TODAY)}</div>
</div>
`;
  return head({ title, desc, canonical: url, jsonld: [ORG_LD, softwareLd, faqLd, webpageLd, breadcrumbLd(trail)] }) + body + FOOT;
}

// ---------- hub page ----------
function hubPage() {
  const url = `${ORIGIN}/ai-tools`;
  const trail = [{ name: 'Home', url: '/' }, { name: 'AI Tools', url: '/ai-tools' }];
  const cats = [...new Set(TOOLS.map(t => t.category))];
  const catSlug = c => c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const lastUpdated = TOOLS.map(t => t.updated).filter(Boolean).sort().pop() || TODAY;
  const itemList = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    '@id': url + '#collection', name: 'AI tools we use on AI4NTP', url,
    description: 'A curated directory of the AI and software tools demoed live on AI4NTP, with which episode and operator used each one.',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: TOOLS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${ORIGIN}/ai-tools/${t.slug}`, name: t.name })),
    },
  };

  const cards = TOOLS.map(t => {
    const badges = t.episodes.map(e => `<span class="badge${EP[e.id].upcoming ? ' net' : ''}">${esc(EP[e.id].num)}${EP[e.id].upcoming ? ' · soon' : ''}</span>`).join('')
      + (t.pricing && t.pricing.free_tier === true ? '<span class="badge free">Free tier</span>' : '')
      + (t.is_network ? '<span class="badge net">AI4NTP network</span>' : '');
    const searchStr = jtxt(`${t.name} ${t.tagline} ${t.category}`).toLowerCase();
    return `<a class="card" href="/ai-tools/${t.slug}" data-cat="${catSlug(t.category)}" data-name="${esc(t.name.toLowerCase())}" data-search="${esc(searchStr)}" data-updated="${esc(t.updated || '')}" data-ep="${epOrder(t)}">
      <div class="card-top">${logoHtml(t)}<div class="card-meta"><span class="cn">${esc(t.name)}</span><div class="card-cat">${esc(t.category)}</div></div></div>
      <div class="cd">${esc(t.tagline)}</div>
      <div class="badges">${badges}</div>
    </a>`;
  }).join('');
  const hubFaqs = [
    { q: 'How are the tools in this directory chosen?', a: 'Every tool here was demonstrated live by an operator during an AI4NTP session. We only list tools we have actually seen used, and each page shows the episode and the person who used it.' },
    { q: 'How often is the directory updated?', a: `We add the tools from each new episode after it airs. Last updated ${lastUpdated}.` },
  ];
  const hubFaqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: hubFaqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const hubFaqHtml = hubFaqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('');

  const title = `AI Tools We Use Live: ${TOOLS.length} Operator-Tested Tools | AI4NTP`;
  const desc = `A curated directory of ${TOOLS.length} AI and software tools demoed live on AI4NTP, with the episode and operator who used each, pricing, and alternatives.`;

  const opsHtml = [
    { img: '/sessions/001/images/ian-kilpatrick.jpg', name: 'Ian Kilpatrick' },
    { img: '/sessions/001/images/justin-novak.jpg', name: 'Justin Novak' },
    { img: '/sessions/001/images/alec-saluga.jpg', name: 'Alec Saluga' },
  ].map(o => `<img src="${o.img}" alt="${esc(o.name)}" loading="lazy">`).join('');
  const epCount = Object.keys(EP).length;
  const catBtns = ['<li><button class="active" data-cat="all">All categories</button></li>']
    .concat(cats.map(c => `<li><button data-cat="${catSlug(c)}">${esc(c)}</button></li>`)).join('');

  const body = `
${crumb(trail)}
<header class="dir-hero wrap">
  <div class="eyebrow">The AI4NTP tool directory</div>
  <h1 class="title">The tools we actually used, <em>live.</em></h1>
  <p class="lede">Every tool here was demoed on an AI4NTP episode by a real operator. See which episode used it, who, and for what, plus pricing and genuine alternatives.</p>
  <div class="dh-proof">
    <div class="dh-ops">
      <span class="op-stack">${opsHtml}</span>
      <span class="dh-stat"><strong>${TOOLS.length} tools</strong>, demoed live by real operators across <strong>${epCount} episodes</strong>.</span>
    </div>
    <div class="dh-companies">Join 450+ operators from organizations like <b>JPMorgan &middot; Amazon &middot; Carnegie Mellon &middot; O'Reilly</b></div>
  </div>
  <div class="cta-row">
    <a class="btn-ghost" href="#directory">Browse the tools &darr;</a>
  </div>
</header>

<div class="dir wrap" id="directory">
  <aside class="dir-side">
    <div class="search"><input type="search" id="toolSearch" placeholder="Search tools..." aria-label="Search tools"></div>
    <div class="side-label">Category</div>
    <ul class="catlist" id="catList">${catBtns}</ul>
    <div class="side-label">Sort by</div>
    <ul class="sortlist" id="sortList">
      <li><button class="active" data-sort="az">A to Z</button></li>
      <li><button data-sort="newest">Newest</button></li>
      <li><button data-sort="ep">By episode</button></li>
    </ul>
  </aside>
  <main class="dir-main">
    <div class="dir-count" id="dirCount">${TOOLS.length} tools</div>
    <div class="grid" id="toolGrid">${cards}</div>
    <div class="no-results" id="noResults" hidden>No tools match. Try another search or category.</div>
  </main>
</div>

<section class="block faq wrap narrow">
  <h2>About this directory</h2>
  ${hubFaqHtml}
</section>

<div class="wrap narrow endcta">
  <a href="https://ai4ntp.beehiiv.com" target="_blank" rel="noopener" data-cta="tools_newsletter_click">Get new tools in our newsletter</a>
  <a href="/register" data-cta="tools_register_click">Watch the next session live</a>
</div>
<div class="wrap narrow updated">Last updated ${esc(lastUpdated)}</div>

<script>
(function(){
  var grid=document.getElementById('toolGrid'),count=document.getElementById('dirCount'),no=document.getElementById('noResults');
  var cards=[].slice.call(grid.querySelectorAll('.card'));
  var state={cat:'all',q:'',sort:'az'};
  function apply(){
    var q=state.q.trim().toLowerCase(),shown=0;
    cards.forEach(function(c){
      var ok=(state.cat==='all'||c.dataset.cat===state.cat)&&(!q||c.dataset.search.indexOf(q)>-1);
      c.style.display=ok?'':'none'; if(ok)shown++;
    });
    var vis=cards.filter(function(c){return c.style.display!=='none';});
    vis.sort(function(a,b){
      if(state.sort==='newest')return (b.dataset.updated||'').localeCompare(a.dataset.updated||'')||a.dataset.name.localeCompare(b.dataset.name);
      if(state.sort==='ep')return (b.dataset.ep-a.dataset.ep)||a.dataset.name.localeCompare(b.dataset.name);
      return a.dataset.name.localeCompare(b.dataset.name);
    });
    vis.forEach(function(c){grid.appendChild(c);});
    count.textContent=shown+(shown===1?' tool':' tools');
    no.hidden=shown>0; grid.style.display=shown>0?'':'none';
  }
  document.getElementById('toolSearch').addEventListener('input',function(){state.q=this.value;apply();});
  document.getElementById('catList').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;state.cat=b.dataset.cat;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);});apply();});
  document.getElementById('sortList').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;state.sort=b.dataset.sort;this.querySelectorAll('button').forEach(function(x){x.classList.toggle('active',x===b);});apply();});
  apply();
})();
</script>
`;
  return head({ title, desc, canonical: url, jsonld: [ORG_LD, itemList, hubFaqLd, breadcrumbLd(trail)] }) + body + FOOT;
}

// ---------- sitemap + robots ----------
function sitemap() {
  const staticPaths = ['', 'about', 'sessions', 'sessions/001', 'sessions/002', 'sessions/003', 'sessions/004', 'sessions/005', 'sessions/006', 'register', 'partner', 'agents', 'build', 'refer', 'calendar', 'privacy', 'terms', 'ai-tools', 'blog'];
  // Static pages omit <lastmod> (we don't track their real edit dates here) rather than
  // stamping TODAY on every build, which trains Google to ignore the signal. Tool pages
  // and blog posts carry their real `updated` date, so lastmod only moves when the page
  // actually changes.
  const rows = [
    ...staticPaths.map(p => ({ loc: `${ORIGIN}/${p}`.replace(/\/$/, '') || ORIGIN, lastmod: null })),
    ...TOOLS.map(t => ({ loc: `${ORIGIN}/ai-tools/${t.slug}`, lastmod: t.updated || null })),
    ...POSTS.map(p => ({ loc: `${ORIGIN}/blog/${p.slug}`, lastmod: p.updated || p.published || null })),
  ];
  const body = rows.map(u => `  <url><loc>${u.loc || ORIGIN}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;

// ---------- llms.txt (LLM/answer-engine index) ----------
function llms() {
  const L = [];
  L.push('# AI4NTP (AI for Non-Techy People)');
  L.push('');
  L.push('> AI4NTP runs free, live, recorded sessions where real operators show non-technical professionals exactly how they use and build with AI. No theory or jargon: screen-shared workflows you can apply the same day. This file orients AI assistants and answer engines to what AI4NTP is, who runs it, and what it offers.');
  L.push('');
  L.push('## About');
  L.push('- Name: AI4NTP, also written "AI for Non-Techy People".');
  L.push('- What it is: a free live series (webinars on Zoom, replays on YouTube) plus written resources, teaching non-technical operators how to actually use and build with AI.');
  L.push('- Audience: non-technical professionals, operators, marketers, and founders, from total beginners to people already shipping with AI.');
  L.push('- What makes it different: real operators demonstrate live, on screen, exactly how they use AI to get results, then hand over the tools and prompts. Show, do not just tell.');
  L.push(`- Website: ${ORIGIN} | Newsletter: https://ai4ntp.beehiiv.com | YouTube: https://www.youtube.com/@AI4NonTechyPeople`);
  L.push('');
  L.push('## Founders and operators');
  L.push('- Justin Novak: Partner at AI4NTP; leads go-to-market and moderates the sessions. https://www.linkedin.com/in/justin-edward-stephen-novak-683046158/');
  L.push('- Ian Kilpatrick: Partner at AI4NTP; runs a portfolio of companies with AI and builds AI agents live. https://www.linkedin.com/in/ianpk/');
  L.push('- Alec Saluga: Partner at AI4NTP; builds and deploys AI-driven marketing and websites. https://www.linkedin.com/in/alec-saluga-4295521a6/');
  L.push('- Brett Haralson: community and partnerships (Quetzal Labs); co-moderates AI4NTP sessions. https://www.linkedin.com/in/brett-haralson/');
  L.push('');
  L.push('## What AI4NTP offers');
  L.push('- Free live sessions and replays (register at ' + ORIGIN + '/register).');
  L.push('- A curated, operator-tested AI tools directory (' + ORIGIN + '/ai-tools).');
  L.push('- Partnerships: apply to demo live as a guest, or sponsor a session (' + ORIGIN + '/partner).');
  L.push('- 1:1 working sessions with the team (' + ORIGIN + '/calendar).');
  L.push('');
  L.push('## Key pages');
  L.push(`- [About AI4NTP](${ORIGIN}/about): who runs AI4NTP and what it does.`);
  L.push(`- [Register](${ORIGIN}/register): save a seat for the next live session.`);
  L.push(`- [AI Tools Directory](${ORIGIN}/ai-tools): tools demoed live, with episode and operator.`);
  L.push(`- [Blog](${ORIGIN}/blog): written field notes drawn from the live sessions.`);
  L.push(`- [Partner](${ORIGIN}/partner): guest and sponsor opportunities.`);
  L.push('');
  L.push('## AI Tools Directory');
  L.push(`Curated tools demoed live on AI4NTP, with the episode and operator who used each. Hub: ${ORIGIN}/ai-tools`);
  L.push('');
  for (const t of TOOLS) {
    const eps = [...new Set(t.episodes.map(e => EP[e.id].num))].join(', ');
    L.push(`- [${t.name}](${ORIGIN}/ai-tools/${t.slug}): ${jtxt(t.tagline)}${eps ? ` (used live in ${eps})` : ''}`);
  }
  L.push('');
  if (POSTS.length) {
    L.push('## Blog');
    L.push(`Written posts drawn from our live sessions. Every claim traces to a timestamp in a session we recorded. Hub: ${ORIGIN}/blog`);
    L.push('');
    for (const p of POSTS) {
      // First sentence of the answer block: the self-contained, quotable summary.
      const first = jtxt(p.answer).split(/(?<=\.)\s/)[0];
      L.push(`- [${p.title}](${ORIGIN}/blog/${p.slug}): ${first}${p.source?.session ? ` (from ${EP[p.source.session].num})` : ''}`);
    }
    L.push('');
  }
  L.push('## Sessions');
  for (const id of Object.keys(EP)) L.push(`- [${EP[id].num}](${ORIGIN}${EP[id].recap}): ${EP[id].title} (${EP[id].upcoming ? 'upcoming' : (EP[id].replay ? 'replay available' : 'show notes available')}).`);
  L.push('');
  return L.join('\n');
}

// Gate the build on the evidence, BEFORE writing anything. The moat is that every claim
// traces to a timestamp in a recording we own, so a bad citation must not be publishable.
// This is deliberately not a checklist item: checklist items get skipped.
if (!verifyCitations().ok) {
  console.error('[generate] Refusing to build. Fix the citations above.');
  process.exit(1);
}

write('ai-tools/index.html', hubPage());
for (const t of TOOLS) write(`ai-tools/${t.slug}/index.html`, toolPage(t));
write('blog/index.html', blogHub());
for (const p of POSTS) {
  write(`blog/${p.slug}/index.html`, blogPage(p));
  // Emit the co-located OG card config from posts.json (single source of truth) so
  // `node tools/og/render.mjs --all` auto-discovers it. It renders the .jpg beside it.
  if (p.og) write(`blog/${p.slug}/og.json`, JSON.stringify(p.og, null, 2) + '\n');
}
write('sitemap.xml', sitemap());
write('robots.txt', robots);
write('llms.txt', llms());
warnStaleBlogDirs();
console.log(`\nDone: ${TOOLS.length} tool pages + hub, ${POSTS.length} blog post${POSTS.length === 1 ? '' : 's'} + hub, sitemap + robots + llms.txt.`);
