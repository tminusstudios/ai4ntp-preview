/* AI4NTP shared site primitives.
   Extracted verbatim from tools/directory/generate.mjs so the /ai-tools directory and
   the /blog generator emit the same chrome, the same design system, and the same
   JSON-LD @id graph. Pure Node (no deps).

   Consumers: tools/directory/generate.mjs, tools/blog/blog.mjs.
   RULE: anything here is shared by 50+ pages. Change it and you change the whole site. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(__dirname, '../..');
export const ORIGIN = 'https://ai4ntp.com';
export const TODAY = new Date().toISOString().slice(0, 10);

// Canonical session registry. Shared by the /ai-tools directory (episode badges) and
// /blog (source attribution). RULE: a new session must be registered here or the
// generators drop its episode entries and blog posts hard-fail.
export const EP = {
  '001': { num: 'Episode 001', title: 'How marketers are actually using AI to grow',
           recap: '/sessions/001', replay: 'https://www.youtube.com/watch?v=-8nM4ypUdUM' },
  '002': { num: 'Episode 002', title: 'We built a company with AI in under an hour',
           recap: '/sessions/002', replay: 'https://www.youtube.com/watch?v=AdylF0tNIbY' },
  '003': { num: 'Episode 003', title: 'Build your own AI Clone Agent (with OpenClaw)',
           recap: '/sessions/003', replay: null },
  '004': { num: 'Episode 004', title: "7 AI tools you've never heard of",
           recap: '/sessions/004', replay: 'https://www.youtube.com/watch?v=I1D_RD-kMhg' },
  '005': { num: 'Episode 005', title: 'Three bakery businesses built with AI in one hour',
           recap: '/sessions/005', replay: null },
  '006': { num: 'Session 006', title: '7 AI agents we built to run our company',
           recap: '/sessions/006', replay: 'https://www.youtube.com/watch?v=q7-F4KbikbY' },
};

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');
export const jtxt = (s = '') => String(s).replace(/\s+/g, ' ').trim(); // for JSON-LD plain text

// Rich copy fields (what_is, ai4ntp_take, who_for) accept a string (single or
// \n\n-separated paragraphs) or an array of paragraph strings. Render to <p> blocks.
export const toParas = v => (Array.isArray(v) ? v : String(v || '').split(/\n\n+/))
  .map(p => jtxt(p)).filter(Boolean);
export const parasHtml = v => toParas(v).map(p => `<p>${esc(p)}</p>`).join('');
export const plainText = v => toParas(v).join(' '); // flatten for meta description / JSON-LD

export const ORG_LD = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': ORIGIN + '/#org',
  name: 'AI4NTP', alternateName: 'AI for Non-Techy People', url: ORIGIN,
  logo: ORIGIN + '/icon-192.png',
  description: 'AI4NTP (AI for Non-Techy People) runs free live sessions where real operators show non-technical professionals exactly how they use and build with AI.',
  foundingDate: '2026',
  founder: { '@type': 'Person', name: 'Justin Novak', url: 'https://www.linkedin.com/in/justin-edward-stephen-novak-683046158/' },
  knowsAbout: ['Artificial intelligence', 'AI for business', 'AI automation', 'Generative AI tools', 'AI for non-technical professionals'],
  sameAs: ['https://www.youtube.com/@AI4NonTechyPeople', 'https://x.com/ai4ntp', 'https://www.instagram.com/ai4ntp'],
};

// ---- Operators as page authors (E-E-A-T). Canonical people who demo tools live. ----
// Full bios + Person JSON-LD nodes live on /about (#<slug>); these are the short cards.
export const PEOPLE = {
  'Justin Novak': {
    name: 'Justin Novak', slug: 'justin-novak', role: 'Partner at AI4NTP', company: 'AI4NTP',
    linkedin: 'https://www.linkedin.com/in/justin-edward-stephen-novak-683046158/',
    photo: '/sessions/001/images/justin-novak.jpg', objectPos: 'center',
    bio: 'Founder and host of AI4NTP. He sold his first company from his college dorm room, and as a fractional CMO has helped scale multiple businesses past $50M in ARR.',
  },
  'Ian Kilpatrick': {
    name: 'Ian Kilpatrick', slug: 'ian-kilpatrick', role: 'Partner at AI4NTP', company: 'AI4NTP',
    linkedin: 'https://www.linkedin.com/in/ianpk/',
    photo: '/sessions/001/images/ian-kilpatrick.jpg', objectPos: 'center 22%',
    bio: 'A designer, developer, and serial entrepreneur writing code since age 10. He has worked with Disney, the Golden Globes, and the AMAs, and now runs a fleet of AI agents doing real work every day.',
  },
  'Alec Saluga': {
    name: 'Alec Saluga', slug: 'alec-saluga', role: 'Partner at AI4NTP', company: 'AI4NTP',
    linkedin: 'https://www.linkedin.com/in/alec-saluga-4295521a6/',
    photo: '/sessions/001/images/alec-saluga.jpg', objectPos: 'center 22%',
    bio: 'A former B2B salesman with no technical background who self-taught AI. He builds and deploys AI-driven marketing and websites, and has grown a following of over 15,000 teaching AI adoption.',
  },
};
export const ALL_OPERATORS = ['Justin Novak', 'Ian Kilpatrick', 'Alec Saluga'];

// Parse each episode's `operator` string into canonical people. Handles "A and B",
// "A, B, and C", and expands the generic "The operators" to all three. Deduped, in
// first-appearance order across the tool's episodes.
export function operatorsOf(tool) {
  const seen = new Set(); const out = [];
  const add = (n) => { const p = PEOPLE[n]; if (p && !seen.has(n)) { seen.add(n); out.push(p); } };
  for (const ep of (tool.episodes || [])) {
    const raw = String(ep.operator || '').trim();
    if (/^the operators$/i.test(raw)) { ALL_OPERATORS.forEach(add); continue; }
    raw.split(/,\s*|\s+and\s+/).map(s => s.trim()).filter(Boolean).forEach(add);
  }
  return out;
}

// Person JSON-LD node. The @id (/about#<slug>) is the canonical identity for each
// operator sitewide: tool pages, blog posts, and /about all point at the same node.
export const personLd = (p) => ({
  '@type': 'Person', '@id': ORIGIN + '/about#' + p.slug, name: p.name,
  url: ORIGIN + '/about#' + p.slug, image: ORIGIN + p.photo, jobTitle: p.role,
  worksFor: { '@type': 'Organization', name: p.company }, sameAs: [p.linkedin],
});

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtMonthYear = (d) => { const m = /^(\d{4})-(\d{2})/.exec(String(d || '')); return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : ''; };
export const initialsOf = (name) => name.split(/\s+/).map(w => w[0] || '').slice(0, 2).join('').toUpperCase();

// ---------- shared HTML head ----------
// Defaults reproduce the original /ai-tools head byte-for-byte. Blog posts opt in to
// ogType:'article' + a co-located OG card + article:*_time stamps + extra CSS.
export function head({
  title, desc, canonical, jsonld = [],
  ogType = 'website',
  image = ORIGIN + '/og-image.jpg',
  published = null, modified = null,
  extraCss = '',
}) {
  const og = image;
  const ld = jsonld.map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 2)}\n</script>`).join('\n');
  // Built as a filtered array, not inline ternaries on their own lines: an empty
  // result must leave NO stray blank line, so non-article pages stay byte-identical.
  const extraMeta = [
    ogType === 'article' && published ? `<meta property="article:published_time" content="${published}">` : null,
    ogType === 'article' && modified ? `<meta property="article:modified_time" content="${modified}">` : null,
  ].filter(Boolean).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-4YY783506Y"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-4YY783506Y');
</script>
<script defer src="/_vercel/insights/script.js"></script>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${canonical}">

<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${og}">
${extraMeta ? extraMeta + '\n' : ''}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/logo-monogram.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
${ld}
<style>${CSS}${extraCss}</style>
<link rel="stylesheet" href="/reskin.css">
</head>
<body>
<script src="/nav.js"></script>`;
}

export const FOOT = `<script src="/footer.js"></script>\n<script src="/reskin.js" defer></script>\n</body>\n</html>`;

export const CSS = `
  :root{ --ink:#0F1113;--ink-soft:#1C1F23;--paper:#F4F1EA;--paper-warm:#EDE7DA;--cream:#FAF7F0;
    --signal:#D4FF3A;--signal-deep:#A8D000;--rust:#C4471C;--line:rgba(15,17,19,.12);--line-strong:rgba(15,17,19,.32);}
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;background:var(--paper);color:var(--ink);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overflow-x:hidden;}
  body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.3;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");}
  a{color:inherit;}
  .wrap{max-width:1100px;margin:0 auto;padding:0 40px;position:relative;z-index:2;}
  .narrow{max-width:840px;}
  .crumb{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.6;padding:28px 0 0;}
  .crumb a{text-decoration:none;border-bottom:1px solid transparent;}
  .crumb a:hover{border-color:var(--ink);}
  .crumb span{margin:0 8px;opacity:.5;}
  .eyebrow{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;opacity:.6;display:flex;align-items:center;gap:12px;margin-bottom:18px;}
  .eyebrow::before{content:'';width:28px;height:1px;background:var(--ink);opacity:.5;}
  h1.title{font-family:'Fraunces',Georgia,serif;font-weight:300;font-optical-sizing:auto;font-size:clamp(38px,6vw,72px);letter-spacing:-.025em;line-height:1.02;margin-bottom:20px;}
  h1.title em,.hl{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;background:var(--signal);padding:0 .12em;}
  .lede{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:clamp(19px,2.4vw,24px);line-height:1.4;opacity:.9;max-width:720px;}
  /* hub */
  .hub-head{padding:8px 0 40px;border-bottom:1px solid var(--line);}
  .cat{padding:48px 0 8px;}
  .cat h2{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:clamp(24px,3vw,34px);letter-spacing:-.02em;margin-bottom:24px;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;}
  .card{display:block;background:var(--cream);border:1px solid var(--line);padding:22px;text-decoration:none;transition:border-color .2s,transform .2s;}
  .card:hover{border-color:var(--ink);transform:translateY(-2px);}
  .card .cn{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:21px;letter-spacing:-.01em;margin-bottom:8px;display:flex;align-items:center;gap:8px;}
  .card .cd{font-size:14px;line-height:1.5;opacity:.78;margin-bottom:14px;}
  .badges{display:flex;flex-wrap:wrap;gap:6px;}
  .badge{font-family:'JetBrains Mono','SF Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:var(--paper-warm);color:rgba(15,17,19,.7);}
  .badge.net{background:var(--signal);color:var(--ink);}
  /* tool page */
  .tool-head{padding:8px 0 36px;border-bottom:1px solid var(--line);}
  .cat-tag{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--rust);margin-bottom:16px;}
  .tool-sub{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:clamp(18px,2.2vw,23px);line-height:1.4;opacity:.9;max-width:680px;margin-bottom:28px;}
  .cta-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;}
  .btn{display:inline-flex;align-items:center;gap:9px;background:var(--ink);color:var(--cream);text-decoration:none;padding:14px 24px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;transition:background .2s,color .2s;}
  .btn:hover{background:var(--signal);color:var(--ink);}
  .disclosure{font-size:12px;opacity:.55;font-style:italic;}
  .private-note{display:inline-block;font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:10px 16px;border:1px dashed var(--line-strong);opacity:.7;}
  section.block{padding:40px 0;border-bottom:1px solid var(--line);}
  section.block h2{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:clamp(22px,2.6vw,30px);letter-spacing:-.02em;margin-bottom:18px;}
  section.block p{max-width:720px;margin-bottom:14px;}
  .seen{background:var(--ink);color:var(--cream);border:none;padding:32px;margin:40px 0;}
  .seen h2{color:var(--cream);}
  .seen .ep{padding:16px 0;border-top:1px solid rgba(250,247,240,.16);}
  .seen .ep:first-of-type{border-top:none;}
  .seen .ep .meta{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--signal);margin-bottom:6px;}
  .seen .ep .uf{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:19px;margin-bottom:8px;}
  .seen .ep a{color:var(--cream);font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid var(--signal);padding-bottom:2px;margin-right:18px;}
  .seen .ep a:hover{color:var(--signal);}
  .rel{display:flex;flex-wrap:wrap;gap:10px;}
  .rel a{text-decoration:none;border:1px solid var(--line);padding:10px 16px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.06em;transition:border-color .2s,background .2s;}
  .rel a:hover{border-color:var(--ink);background:var(--cream);}
  .faq details{border-top:1px solid var(--line);padding:18px 0;}
  .faq details:last-child{border-bottom:1px solid var(--line);}
  .faq summary{font-family:'Fraunces',Georgia,serif;font-weight:500;font-size:18px;cursor:pointer;list-style:none;}
  .faq summary::-webkit-details-marker{display:none;}
  .faq summary::before{content:'+';color:var(--rust);font-weight:700;margin-right:12px;}
  .faq details[open] summary::before{content:'\\2013';}
  .faq p{margin:14px 0 0;opacity:.85;}
  .endcta{padding:48px 0;}
  .endcta a{font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid var(--signal-deep);padding-bottom:3px;margin-right:24px;}
  .updated{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;opacity:.45;padding:24px 0 0;}
  .summary{font-size:18px;line-height:1.6;padding:28px 0 6px;max-width:760px;}
  .facts{width:100%;border-collapse:collapse;margin:6px 0 8px;}
  .facts th,.facts td{text-align:left;vertical-align:top;padding:11px 14px 11px 0;border-top:1px solid var(--line);font-size:15px;}
  .facts tr:last-child td,.facts tr:last-child th{border-bottom:1px solid var(--line);}
  .facts th{width:150px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.6;font-weight:400;white-space:nowrap;}
  .facts a{text-decoration:underline;text-decoration-color:var(--line-strong);text-underline-offset:2px;}
  .catnav{display:flex;flex-wrap:wrap;gap:9px;padding:6px 0 12px;}
  .catnav a{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.06em;text-decoration:none;border:1px solid var(--line);padding:7px 13px;border-radius:999px;transition:border-color .2s,background .2s;}
  .catnav a:hover{border-color:var(--ink);background:var(--cream);}
  .cta-card{background:var(--signal);color:var(--ink);padding:38px;margin:44px 0 8px;}
  .cta-card h2{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:clamp(24px,3.2vw,34px);letter-spacing:-.02em;line-height:1.05;margin-bottom:12px;}
  .cta-card p{max-width:640px;margin-bottom:26px;opacity:.82;}
  .cta-links{display:flex;flex-wrap:wrap;gap:12px;}
  .cta-card .btn{background:var(--ink);color:var(--signal);}
  .cta-card .btn:hover{background:var(--ink-soft);color:var(--signal);}
  .btn-ghost{display:inline-flex;align-items:center;gap:9px;background:transparent;color:var(--ink);border:1px solid var(--ink);text-decoration:none;padding:13px 22px;font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;transition:background .2s,color .2s;}
  .btn-ghost:hover{background:var(--ink);color:var(--signal);}
  /* logos */
  .logo{position:relative;width:46px;height:46px;border-radius:11px;overflow:hidden;border:1px solid var(--line);background:#fff;flex:0 0 auto;display:grid;place-items:center;}
  .logo img{position:relative;z-index:1;width:100%;height:100%;object-fit:contain;padding:7px;background:#fff;}
  .logo-mono{position:absolute;inset:0;z-index:0;display:grid;place-items:center;font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:20px;background:var(--signal);color:var(--ink);}
  .logo.lg{width:68px;height:68px;border-radius:15px;}
  .logo.lg img{padding:11px;}
  .logo.lg .logo-mono{font-size:30px;}
  /* directory hero */
  .dir-hero{padding:44px 0 42px;border-bottom:1px solid var(--line);}
  .dir-hero .lede{margin-bottom:30px;}
  .dh-proof{display:flex;flex-direction:column;gap:16px;margin-bottom:32px;}
  .dh-ops{display:flex;align-items:center;gap:15px;flex-wrap:wrap;}
  .op-stack{display:flex;}
  .op-stack img{width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid var(--paper);margin-left:-12px;filter:grayscale(100%) contrast(1.05);background:var(--cream);}
  .op-stack img:first-child{margin-left:0;}
  .dh-stat{font-size:15px;line-height:1.45;max-width:340px;opacity:.85;}
  .dh-stat strong{font-weight:600;}
  .dh-companies{font-size:14px;opacity:.7;}
  .dh-companies b{font-family:'JetBrains Mono','SF Mono',monospace;font-weight:500;font-size:12px;letter-spacing:.04em;opacity:.95;}
  /* directory layout: sidebar + grid */
  .dir{display:grid;grid-template-columns:236px 1fr;gap:40px;align-items:start;padding:34px 0 64px;}
  .dir-side{position:sticky;top:22px;}
  .search{margin-bottom:26px;}
  .search input{width:100%;background:var(--cream) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230F1113' stroke-width='2' stroke-opacity='0.45'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M21 21l-4.3-4.3'/%3E%3C/svg%3E") no-repeat 12px center;background-size:15px;border:1px solid var(--line-strong);border-radius:8px;padding:11px 14px 11px 36px;font-family:inherit;font-size:14px;color:var(--ink);}
  .search input:focus{outline:none;border-color:var(--ink);}
  .side-label{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.5;margin:0 0 8px 4px;}
  .catlist,.sortlist{list-style:none;margin:0 0 26px;}
  .catlist button,.sortlist button{display:block;width:100%;text-align:left;background:none;border:none;cursor:pointer;font:inherit;font-size:14px;color:var(--ink);padding:8px 12px;border-radius:7px;opacity:.72;transition:background .15s,opacity .15s,color .15s;}
  .catlist button:hover,.sortlist button:hover{opacity:1;background:var(--cream);}
  .catlist button.active,.sortlist button.active{opacity:1;background:var(--ink);color:var(--cream);font-weight:500;}
  .dir-count{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;opacity:.55;margin-bottom:18px;}
  .no-results{padding:40px 0;font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:20px;opacity:.6;}
  /* card with logo */
  .card-top{display:flex;align-items:center;gap:13px;margin-bottom:13px;}
  .card-meta{min-width:0;}
  .card .cn{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:19px;letter-spacing:-.01em;margin:0;line-height:1.1;display:block;}
  .card-cat{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.5;margin-top:4px;}
  .badge.free{background:transparent;border:1px solid var(--signal-deep);color:var(--signal-deep);}
  /* tool page header */
  .tool-id{display:flex;align-items:center;gap:18px;margin-bottom:22px;}
  .tool-desc{font-size:18px;line-height:1.6;max-width:680px;margin-bottom:20px;opacity:.92;}
  /* author byline (E-E-A-T) */
  .byline{display:flex;align-items:center;gap:12px;margin:0 0 26px;flex-wrap:wrap;}
  .byline-stack img{width:34px;height:34px;margin-left:-10px;}
  .byline-txt{font-family:'JetBrains Mono','SF Mono',monospace;font-size:12px;letter-spacing:.02em;line-height:1.5;opacity:.85;}
  .byline-txt a{text-decoration:none;border-bottom:1px solid var(--line-strong);}
  .byline-txt a:hover{border-color:var(--ink);}
  .byline-date{opacity:.6;}
  .byline-sep{opacity:.4;}
  /* contributor / author cards */
  .contributors .contrib-intro{max-width:720px;margin-bottom:22px;opacity:.85;}
  .contrib-grid{display:grid;gap:16px;}
  .contrib-card{display:flex;gap:18px;align-items:flex-start;background:var(--cream);border:1px solid var(--line);padding:22px;}
  .contrib-av{position:relative;width:64px;height:64px;border-radius:50%;overflow:hidden;flex:0 0 auto;background:var(--ink);display:grid;place-items:center;text-decoration:none;border:2px solid var(--paper);}
  .contrib-av::before{content:attr(data-initials);position:absolute;font-family:'Fraunces',Georgia,serif;font-weight:300;font-size:22px;color:rgba(212,255,58,.7);}
  .contrib-av img{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.05);}
  .contrib-body{min-width:0;}
  .contrib-top{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;}
  .contrib-name{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:20px;letter-spacing:-.01em;text-decoration:none;border-bottom:1px solid transparent;}
  .contrib-name:hover{border-color:var(--ink);}
  .contrib-ln{font-family:'JetBrains Mono','SF Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;color:var(--rust);border-bottom:1px solid transparent;}
  .contrib-ln:hover{border-color:var(--rust);}
  .contrib-role{font-family:'JetBrains Mono','SF Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin:4px 0 10px;}
  .contrib-bio{font-size:15px;line-height:1.6;opacity:.9;margin:0;max-width:640px;}
  @media(max-width:920px){.dir{grid-template-columns:1fr;gap:22px;}.dir-side{position:static;}.catlist,.sortlist{display:flex;flex-wrap:wrap;gap:7px;}.catlist button,.sortlist button{width:auto;border:1px solid var(--line);}.side-label{margin-left:0;}}
  @media(max-width:700px){.wrap{padding:0 22px;}.grid{grid-template-columns:1fr;}.seen{padding:24px;}.cta-card{padding:26px;}.cta-links{flex-direction:column;align-items:stretch;}.cta-card .btn,.btn-ghost{justify-content:center;}.facts th{width:108px;white-space:normal;}.tool-id{gap:14px;}}
`;

// ---------- breadcrumb ----------
export function crumb(trail) {
  const parts = trail.map((t, i) => i === trail.length - 1
    ? `<span aria-current="page">${esc(t.name)}</span>`
    : `<a href="${t.url}">${esc(t.name)}</a>`).join('<span>/</span>');
  return `<nav class="crumb wrap" aria-label="Breadcrumb">${parts}</nav>`;
}
export function breadcrumbLd(trail) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name,
      item: t.url.startsWith('http') ? t.url : ORIGIN + t.url,
    })),
  };
}

// ---------- write ----------
export function write(rel, content) {
  const abs = resolve(REPO, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log('wrote', rel);
}
