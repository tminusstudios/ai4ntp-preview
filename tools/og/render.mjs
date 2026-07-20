#!/usr/bin/env node
/* AI4NTP OG card renderer.
   Renders an editorial brand card to a 2400x1260 JPEG using the REAL Fraunces
   variable font + actual brand CSS, screenshotted by headless Google Chrome.
   This replaces the old Pillow scripts (which fell back to Georgia and could not
   do real web typography, gradients, or blend modes).

   Usage:
     node tools/og/render.mjs <config.json> [output.jpg]
     node tools/og/render.mjs --all          # render every og.json in the repo

   Config (JSON, co-located with the page it belongs to). Two modes:

   EPISODE card (has session_id + operators):
   {
     "session_id": "003",
     "status": "LIVE",                  // "LIVE" or "REPLAY" (rust dot vs ink dot)
     "date": "JUNE 10, 2026",
     "time": "6:00 PM EST",
     "headline_line1": "Build your own",
     "headline_pre": "",                // text before the highlight on line 2
     "headline_highlight": "AI Clone Agent",
     "headline_post": ".",
     "tagline": "SET UP LIVE IN UNDER AN HOUR · WITH OPENCLAW",
     "operators": [{ "img": "images/ian-kilpatrick.jpg", "name": "Ian Kilpatrick" }],
     "output": "og-image.jpg"
   }

   BRAND card (no session_id, no operators):
   {
     "kicker": "AI FOR NON-TECHY PEOPLE",   // top-right plain label (no status dot)
     "headline_line1": "AI for Non-Techy",
     "headline_highlight": "People", "headline_post": ".",
     "subtitle": "Real operators show exactly how they use and build with AI.",
     "footer_note": "Field notes from people building with AI every day.",
     "output": "og-image.jpg"
   }

   Optional on either: "headline_size" (max px before auto-fit; default 124).
*/
import puppeteer from 'puppeteer-core';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../..');

const mime = (p) => (extname(p).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg');
const dataUri = (abs) => `data:${mime(abs)};base64,${readFileSync(abs).toString('base64')}`;
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function joinNames(names) {
  if (names.length <= 1) return names[0] || '';
  if (names.length === 2) return `${names[0]} &amp; ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} &amp; ${names[names.length - 1]}`;
}

function buildHtml(cfg) {
  const ops = (cfg.operators || []).map((o) => ({
    name: o.name,
    uri: dataUri(resolve(cfg.baseDir, o.img)),
  }));
  const isReplay = String(cfg.status || '').toUpperCase() === 'REPLAY';
  const statusColor = isReplay ? '#0F1113' : '#C4471C';
  const hasMeta = !!cfg.status;

  // top-right
  let topRight = '';
  if (hasMeta) {
    const restParts = [cfg.date, cfg.time].filter(Boolean).map(esc).join(' &nbsp;&middot;&nbsp; ');
    topRight = `<div class="meta"><span class="dot"></span><span class="status">${esc(cfg.status)}</span>${restParts ? `<span class="rest">&nbsp;&middot;&nbsp; ${restParts}</span>` : ''}</div>`;
  } else if (cfg.kicker) {
    topRight = `<div class="kicker">${esc(cfg.kicker)}</div>`;
  }

  // episode label
  const label = cfg.session_id
    ? `<div class="label"><span class="rule"></span> EPISODE ${esc(cfg.session_id)}</div>`
    : '';

  // headline line 2
  const l2 = `${cfg.headline_pre ? `<span>${esc(cfg.headline_pre)}&nbsp;</span>` : ''}<span class="hl">${esc(cfg.headline_highlight)}</span>${cfg.headline_post ? `<span>${esc(cfg.headline_post)}</span>` : ''}`;

  const subtitle = cfg.subtitle ? `<div class="subtitle">${esc(cfg.subtitle)}</div>` : '';

  // footer
  const avatarsHtml = ops
    .map(
      (o, i) =>
        `<span class="avatar" style="margin-left:${i === 0 ? 0 : -22}px;z-index:${ops.length - i}"><img src="${o.uri}" alt=""></span>`
    )
    .join('');
  const namesHtml = joinNames(ops.map((o) => esc(o.name)));
  const tagHtml = esc(cfg.tagline || '');

  let footLeft = '';
  if (ops.length) {
    footLeft = `<div class="credit"><div class="avatars">${avatarsHtml}</div><div class="text"><div class="names">${namesHtml}</div><div class="tag">${tagHtml}</div></div></div>`;
  } else if (cfg.footer_note) {
    footLeft = `<div class="footnote">${esc(cfg.footer_note)}</div>`;
  }

  const headlineMT = cfg.session_id ? 26 : 70;
  const maxSize = cfg.headline_size || 124;
  const CW = cfg.card_w || 1200;
  const CH = cfg.card_h || 630;
  const centered = !!cfg.centered;
  const logoOnly = !!cfg.logo_only;
  // Square-safe content width: in centered mode the whole comp must fit inside
  // the 1:1 center crop (Eventbrite's square preview, IG, etc.). The square side
  // in logical px is the shorter of width/height; keep a margin inside it.
  const safeW = cfg.safe_w || Math.min(CW, CH) - 80;
  const avail = centered ? safeW : CW - 128;

  // Centered cards put status + episode + date/time on one centered row.
  const metaParts = [];
  if (cfg.status)
    metaParts.push(`<span class="cdot"></span><span class="cstatus">${esc(cfg.status)}</span>`);
  if (cfg.session_id) metaParts.push(`EPISODE ${esc(cfg.session_id)}`);
  if (cfg.date) metaParts.push(esc(cfg.date));
  if (cfg.time) metaParts.push(esc(cfg.time));
  const metaline = metaParts.join(' &middot; ');

  const centeredCredit = ops.length
    ? `<div class="credit cen-credit"><div class="avatars">${avatarsHtml}</div><div class="names">${namesHtml}</div><div class="tag">${tagHtml}</div></div>`
    : cfg.footer_note
      ? `<div class="footnote">${esc(cfg.footer_note)}</div>`
      : '';

  const cardBody = logoOnly
    ? `<div class="card cen">
    <div class="cen-inner">
      <div class="biglogo">ai<span class="four">4</span>ntp</div>
      ${cfg.sublabel ? `<div class="sublabel">${esc(cfg.sublabel)}</div>` : ''}
    </div>
  </div>`
    : centered
    ? `<div class="card cen">
    <div class="cen-inner">
      <div class="logo">ai<span class="four">4</span>ntp</div>
      <div class="headline">
        <div class="l1">${esc(cfg.headline_line1)}</div>
        <div class="l2">${l2}</div>
      </div>
      ${metaline ? `<div class="metaline">${metaline}</div>` : ''}
      ${centeredCredit}
    </div>
  </div>`
    : `<div class="card">
    <div class="row">
      <div class="logo">ai<span class="four">4</span>ntp</div>
      ${topRight}
    </div>
    ${label}
    <div class="headline">
      <div class="l1">${esc(cfg.headline_line1)}</div>
      <div class="l2">${l2}</div>
    </div>
    ${subtitle}
    <div class="spacer"></div>
    <div class="divider"></div>
    <div class="foot">
      ${footLeft}
      <div class="domain">AI4NTP.COM</div>
    </div>
  </div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root{ --ink:#0F1113; --paper:#F4F1EA; --cream:#FAF7F0; --signal:#D4FF3A; --rust:#C4471C; }
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:${CW}px; height:${CH}px; }
  .card{
    position:relative; width:${CW}px; height:${CH}px; overflow:hidden;
    background:
      radial-gradient(120% 130% at 88% 8%, rgba(212,255,58,0.10), rgba(212,255,58,0) 42%),
      radial-gradient(140% 120% at 0% 100%, rgba(15,17,19,0.05), rgba(15,17,19,0) 46%),
      var(--paper);
    color:var(--ink); font-family:'JetBrains Mono', monospace;
    padding:64px; display:flex; flex-direction:column; -webkit-font-smoothing:antialiased;
  }
  .card::after{
    content:''; position:absolute; inset:0; pointer-events:none; opacity:0.05; mix-blend-mode:multiply;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
  .row{ display:flex; justify-content:space-between; align-items:flex-start; }
  .logo{ font-family:'Fraunces',serif; font-weight:700; font-size:40px; letter-spacing:-0.02em; font-variation-settings:'opsz' 60; line-height:1; display:flex; align-items:center; }
  .logo .four{ font-style:italic; background:var(--signal); padding:0 7px; margin:0 3px; border-radius:3px; }
  .meta{ display:flex; align-items:center; gap:12px; font-size:15px; letter-spacing:0.12em; text-transform:uppercase; padding-top:8px; }
  .meta .dot{ width:10px; height:10px; border-radius:50%; background:${statusColor}; }
  .meta .status{ color:${statusColor}; font-weight:700; }
  .meta .rest{ color:var(--ink); opacity:0.85; }
  .kicker{ font-size:16px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.5; padding-top:10px; }
  .label{ display:flex; align-items:center; gap:18px; font-size:15px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.75; margin-top:74px; }
  .label .rule{ width:54px; height:2px; background:var(--ink); }
  .headline{ font-family:'Fraunces',serif; font-weight:300; font-variation-settings:'opsz' 144; letter-spacing:-0.03em; line-height:0.98; font-size:${maxSize}px; margin-top:${headlineMT}px; }
  .headline .l1, .headline .l2{ white-space:nowrap; }
  .headline .l2{ display:flex; align-items:baseline; flex-wrap:nowrap; }
  .hl{ font-style:italic; font-weight:400; background:var(--signal); color:var(--ink); padding:0 0.10em; border-radius:3px; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
  .subtitle{ font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-variation-settings:'opsz' 40; font-size:30px; letter-spacing:-0.01em; opacity:0.82; margin-top:30px; }
  .spacer{ flex:1; }
  .divider{ height:1px; background:rgba(15,17,19,0.22); margin-bottom:26px; }
  .foot{ display:flex; justify-content:space-between; align-items:center; }
  .credit{ display:flex; align-items:center; gap:18px; }
  .avatars{ display:flex; align-items:center; }
  .avatar{ width:60px; height:60px; border-radius:50%; overflow:hidden; border:2px solid var(--paper); box-shadow:0 0 0 1.5px var(--ink); background:var(--cream); display:block; }
  .avatar img{ width:100%; height:100%; object-fit:cover; filter:grayscale(100%) contrast(1.05); display:block; }
  .credit .text{ display:flex; flex-direction:column; gap:4px; }
  .credit .names{ font-family:'Fraunces',serif; font-style:italic; font-weight:600; font-size:24px; letter-spacing:-0.01em; line-height:1; }
  .credit .tag{ font-size:13px; letter-spacing:0.14em; text-transform:uppercase; opacity:0.6; }
  .footnote{ font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:21px; opacity:0.55; }
  .domain{ font-size:16px; letter-spacing:0.16em; text-transform:uppercase; opacity:0.8; }
  /* Centered (square-safe) layout: keeps all content inside the 1:1 center crop. */
  .card.cen{ align-items:center; justify-content:center; text-align:center; padding:48px; }
  .cen-inner{ width:${safeW}px; display:flex; flex-direction:column; align-items:center; }
  .cen-inner .logo{ margin-bottom:32px; }
  .cen-inner .headline{ margin-top:0; }
  .cen-inner .headline .l1{ display:block; }
  .cen-inner .headline .l2{ justify-content:center; }
  .metaline{ display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; font-size:14px; letter-spacing:0.14em; text-transform:uppercase; opacity:0.78; margin-top:30px; }
  .metaline .cdot{ width:9px; height:9px; border-radius:50%; background:${statusColor}; display:inline-block; }
  .metaline .cstatus{ color:${statusColor}; font-weight:700; }
  .cen-credit{ flex-direction:column; align-items:center; gap:12px; margin-top:36px; }
  .cen-credit .names{ font-family:'Fraunces',serif; font-style:italic; font-weight:600; font-size:24px; letter-spacing:-0.01em; line-height:1; }
  .cen-credit .tag{ font-size:13px; letter-spacing:0.14em; text-transform:uppercase; opacity:0.6; }
  /* logo-only tile (Zoom event logo, avatars, etc.) */
  .biglogo{ font-family:'Fraunces',serif; font-weight:700; font-size:120px; letter-spacing:-0.02em; font-variation-settings:'opsz' 144; line-height:1; }
  .biglogo .four{ font-style:italic; background:var(--signal); padding:0 14px; margin:0 6px; border-radius:8px; }
  .sublabel{ font-size:18px; letter-spacing:0.22em; text-transform:uppercase; opacity:0.6; margin-top:26px; }
</style></head>
<body>
  ${cardBody}
  <script>
    // Auto-fit: shrink the headline until both lines fit the content box (no overflow, no wrap).
    window.fitHeadline = function (max) {
      var h = document.querySelector('.headline');
      if (!h) return;
      var avail = ${avail};
      var size = max;
      h.style.fontSize = size + 'px';
      var lines = h.querySelectorAll('.l1, .l2');
      function tooWide() {
        for (var i = 0; i < lines.length; i++) if (lines[i].scrollWidth > avail) return true;
        return false;
      }
      while (size > 40 && tooWide()) { size -= 2; h.style.fontSize = size + 'px'; }
    };
  </script>
</body></html>`;
}

async function renderOne(browser, cfgPath) {
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  cfg.baseDir = dirname(cfgPath);
  const out = resolve(cfg.baseDir, cfg.output || 'og-image.jpg');
  const html = buildHtml(cfg);

  const page = await browser.newPage();
  await page.setViewport({
    width: cfg.card_w || 1200,
    height: cfg.card_h || 630,
    deviceScaleFactor: cfg.scale || 2,
  });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.evaluate((m) => window.fitHeadline(m), cfg.headline_size || 124);
  const el = await page.$('.card');
  await el.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await page.close();
  console.log('Saved:', out);
}

function findConfigs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) findConfigs(full, acc);
    else if (name === 'og.json') acc.push(full);
  }
  return acc;
}

async function main() {
  const arg = process.argv[2];
  let configs;
  if (arg === '--all') configs = findConfigs(REPO);
  else if (arg) configs = [resolve(process.cwd(), arg)];
  else configs = [resolve(REPO, 'sessions/003/og.json')];

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
  });
  try {
    for (const c of configs) await renderOne(browser, c);
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
