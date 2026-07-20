// GET /internal/refer  (via vercel.json rewrite -> /api/internal-refer)
//
// Private growth console for the referral program. Same HTTP Basic Auth gate as
// api/internal.js (INTERNAL_PW / FALLBACK_PW, realm "AI4NTP Internal"). After auth it
// queries Supabase with the service-role key and server-renders:
//   - headline signal cards (affiliates, activated, signups, clicks, attended)
//   - a viral-engine panel: K-factor decomposed into activation x sharer-productivity,
//     in plain English with benchmarks, a growth projection, and the top lever to pull
//   - a sortable leaderboard (click any column header)
//   - referral chains (who invited whom, across generations)
// Test rows (@example.com) are flagged and excluded from the metrics.
// noindex + no-store; never a public static file.

const SUPABASE_URL = 'https://qytiyechjtkrejhhczcg.supabase.co';
const FALLBACK_PW = 'ntp-goldrush-26';
const TIERS = [
  { n: 3, name: 'Insider' }, { n: 5, name: 'VIP' }, { n: 10, name: 'Inner Circle' },
  { n: 20, name: 'Vanguard' }, { n: 50, name: 'Legend' },
];

async function sb(path) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Supabase ${res.status} on ${path}: ${await res.text()}`);
  return res.json();
}

// Framing A/B test variants, in rotation order.
const VARIANT_META = [
  { key: 'blend', name: 'Blend', desc: 'status + generosity + reward' },
  { key: 'status', name: 'Status', desc: 'be the one ahead' },
  { key: 'generosity', name: 'Generosity', desc: 'give a peer the edge' },
  { key: 'gamified', name: 'Gamified', desc: 'unlock your first reward' },
];

// Fetch affiliates including `variant`, falling back if the column is not added yet.
async function sbAffiliates() {
  const cols = 'id,created_at,email,first_name,code,source';
  try { return await sb(`/ai4ntp_affiliates?select=${cols},variant&order=created_at.desc`); }
  catch (e) { if (/variant/i.test(String(e.message))) return await sb(`/ai4ntp_affiliates?select=${cols}&order=created_at.desc`); throw e; }
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function isTest(email) { return /@example\.com$/i.test(String(email || '')); }
function tierFor(attended) { let name = '—'; for (const t of TIERS) if (attended >= t.n) name = t.name; return name; }
function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()];
  return `${mo} ${d.getUTCDate()}`;
}
function pct(x) { return Math.round(x * 100) + '%'; }

// --- Plain-English viral readout -------------------------------------------
function viralReadout(m) {
  const out = [];
  let label, tone;
  if (m.S === 0) {
    return { label: 'Not started', tone: 'muted', lines: ['No referred signups have come through a link yet. Once a few sharers get clicks and signups, your growth signal fills in here.'] };
  }
  if (m.K < 0.2) { label = 'Early'; tone = 'amber'; out.push(`Each person who gets a link brings about <b>${m.K.toFixed(2)}</b> new signups so far. That is an early, gentle loop: it adds fuel but will not self-sustain yet. Normal for a young program.`); }
  else if (m.K < 0.5) { label = 'Healthy'; tone = 'teal'; out.push(`Each person who gets a link brings about <b>${m.K.toFixed(2)}</b> new signups. That is a healthy referral engine: most programs live between 0.15 and 0.40.`); }
  else if (m.K < 1) { label = 'Strong'; tone = 'teal'; out.push(`Each person who gets a link brings about <b>${m.K.toFixed(2)}</b> new signups. That is strong: you are meaningfully amplifying every group of new people you bring in.`); }
  else { label = 'Viral'; tone = 'green'; out.push(`Each person who gets a link brings more than one new signup (<b>${m.K.toFixed(2)}</b>). That is true viral growth: each group spawns a bigger one. Rare and valuable, protect it.`); }

  // Decomposition (the two levers).
  out.push(`That number is two levers multiplied together: <b>activation</b> (${pct(m.activationRate)} of people who got a link actually shared it and got a click) times <b>sharer productivity</b> (each active sharer brings ${m.sharerK.toFixed(2)} signups). Lift either one and K rises.`);

  // Projection.
  if (m.K < 1) {
    const amp = 1 / (1 - m.K);
    out.push(`At this rate the loop multiplies your reach about <b>${amp.toFixed(1)}x</b>: for every 100 people you bring in the front door, referrals turn them into roughly <b>${Math.round(100 * amp)}</b> over time, with no extra ad spend.`);
  } else {
    out.push(`Above 1.0, growth compounds on its own: each cohort refers more than one full new cohort. Keep the reward and the share flow healthy and it snowballs.`);
  }

  // Top lever.
  if (m.activationRate < 0.5) {
    out.push(`<b>Biggest lever: activation.</b> Only ${m.activated} of ${m.A} people who got a link have gotten a single click, so most links sit unused. A reminder email with their link, or a stronger push on step 1 of /refer, gets more people actually sharing.`);
  } else if (m.clickConv < 0.25) {
    out.push(`<b>Biggest lever: conversion.</b> People click but few sign up (${pct(m.clickConv)} of clicks convert). The leak is the page they land on, tighten the session offer or the form.`);
  } else {
    out.push(`<b>Fundamentals look healthy.</b> To push K higher, get more reach per sharer: a bigger reward, or asking each active sharer to invite more people.`);
  }

  if (m.A < 10 || m.S < 5) out.push(`<i>Heads up: still a small sample, so treat these as directional. They firm up as volume grows.</i>`);
  return { label, tone, lines: out };
}

function renderPage(rows, m, chains, exp) {
  const trs = rows.map((r) => `
    <tr${r.test ? ' class="isTest"' : ''}>
      <td class="who" data-v="${esc((r.first_name || r.email).toLowerCase())}">
        <span class="nm">${esc(r.first_name || '—')}${r.test ? ' <span class="tag">test</span>' : ''}</span>
        <span class="em">${esc(r.email)}</span>
        <a class="cd" href="https://ai4ntp.com/r/${esc(r.code)}" target="_blank" rel="noopener">/r/${esc(r.code)}</a>
      </td>
      <td class="mono muted" data-v="${esc(r.parent ? r.parent.toLowerCase() : 'zzz')}">${r.parent ? esc(r.parent) : '<span class="muted">direct</span>'}</td>
      <td class="num big" data-v="${r.signups}">${r.signups}</td>
      <td class="num teal" data-v="${r.attended}">${r.attended}</td>
      <td class="num" data-v="${r.clicks}">${r.clicks}</td>
      <td class="num ${r.convV >= 0 ? '' : 'muted'}" data-v="${r.convV}">${r.conv}</td>
      <td class="ctr" data-v="${r.activated ? 1 : 0}">${r.activated ? '<span class="dot on"></span>Yes' : '<span class="dot"></span>No'}</td>
      <td class="num muted" data-v="${r.downline}">${r.downline || '—'}</td>
      <td class="mono muted" data-v="${esc(r.source || '')}">${esc(r.source || '')}</td>
      <td class="mono" data-v="${esc(r.variant || 'zzz')}">${r.variant ? esc(r.variant) : '<span class="muted">&mdash;</span>'}</td>
      <td class="mono muted" data-v="${new Date(r.created_at).getTime() || 0}">${esc(fmtDate(r.created_at))}</td>
    </tr>`).join('');

  const chainHtml = chains.length
    ? chains.map((c) => `<div class="chain"><span class="croot">${esc(c.root)}</span>${c.kids.map((k) => `<span class="carrow">&rarr;</span><span class="cnode${k.deep ? ' deep' : ''}">${esc(k.label)}${k.own ? `<span class="cown">(${k.own} of their own)</span>` : ''}</span>`).join('')}</div>`).join('')
    : '<div class="empty">No multi-level chains yet. When someone you referred signs up, gets their own link, and refers someone else, it shows up here.</div>';

  const rd = m.readout;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Referral growth console · AI4NTP</title>
<style>
  :root{--ink:#0E1116;--surface:#171D26;--surface2:#1F2733;--line:#2A323F;--line2:#384252;
    --text:#EDEBE6;--text2:#A7B0BD;--muted:#8A93A1;--amber:#F5B133;--teal:#4FD6C4;--green:#8BE28B;--red:#FF6B6B;
    --mono:ui-monospace,"SF Mono","JetBrains Mono",Menlo,monospace;--sans:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;}
  *{box-sizing:border-box;} body{margin:0;background:var(--ink);color:var(--text);font-family:var(--sans);}
  .wrap{max-width:1240px;margin:0 auto;padding:34px clamp(16px,4vw,40px) 90px;}
  .eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--amber);margin:0 0 6px;}
  .eyebrow::before{content:"// ";}
  h1{font-size:1.95rem;margin:0 0 4px;font-weight:650;}
  .updated{color:var(--muted);font-size:.85rem;font-family:var(--mono);margin:0 0 26px;}
  h2.sec{font-size:1.05rem;margin:34px 0 14px;font-weight:650;display:flex;align-items:center;gap:10px;}
  h2.sec .hint{font-weight:400;font-size:.8rem;color:var(--muted);font-family:var(--mono);}

  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px 20px;}
  .card .n{font-size:2rem;font-weight:700;line-height:1;}
  .card .n.teal{color:var(--teal);} .card .n.amber{color:var(--amber);}
  .card .l{color:var(--text2);font-size:.82rem;margin-top:6px;}
  .card .sub{color:var(--muted);font-size:.72rem;margin-top:3px;font-family:var(--mono);}

  /* viral panel */
  .viral{display:grid;grid-template-columns:230px 1fr;gap:22px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:24px;margin-top:2px;}
  @media(max-width:720px){.viral{grid-template-columns:1fr;}}
  .kbox{text-align:center;border-right:1px solid var(--line);padding-right:22px;}
  @media(max-width:720px){.kbox{border-right:0;border-bottom:1px solid var(--line);padding:0 0 18px;}}
  .kbox .kk{font-size:3.4rem;font-weight:750;line-height:1;font-family:var(--sans);}
  .kbox .klbl{display:inline-block;margin-top:10px;font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;padding:5px 12px;border-radius:99px;border:1px solid var(--line2);}
  .kbox .kcap{color:var(--muted);font-size:.72rem;margin-top:10px;font-family:var(--mono);}
  .klbl.teal{color:var(--teal);border-color:var(--teal);} .klbl.amber{color:var(--amber);border-color:var(--amber);}
  .klbl.green{color:var(--green);border-color:var(--green);} .klbl.muted{color:var(--muted);}
  .kk.teal{color:var(--teal);} .kk.amber{color:var(--amber);} .kk.green{color:var(--green);} .kk.muted{color:var(--muted);}
  .vchips{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px;}
  .vchip{background:var(--surface2);border:1px solid var(--line);border-radius:10px;padding:9px 13px;}
  .vchip .cv{font-weight:700;font-size:1.05rem;} .vchip .cl{color:var(--muted);font-size:.72rem;font-family:var(--mono);text-transform:uppercase;letter-spacing:.06em;}
  .readout p{margin:0 0 9px;color:var(--text2);font-size:.92rem;line-height:1.6;} .readout p b{color:var(--text);} .readout p:last-child{margin-bottom:0;}
  .exp{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px;}
  .ecard{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
  .ecard.lead{border-color:var(--teal);box-shadow:0 0 0 1px rgba(79,214,196,.25);}
  .etop{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:1px;}
  .ename{font-weight:700;font-size:1.05rem;}
  .ewin{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#062019;background:var(--teal);border-radius:6px;padding:2px 7px;}
  .edesc{color:var(--muted);font-size:.75rem;font-family:var(--mono);margin:0 0 10px;}
  .erow{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid var(--line);}
  .erow span:first-child{font-weight:700;font-size:1.02rem;} .erow .teal{color:var(--teal);}
  .erow .el{color:var(--text2);font-size:.74rem;text-align:right;}

  /* leaderboard */
  .tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:var(--surface);}
  table{border-collapse:collapse;width:100%;min-width:1040px;font-size:14px;}
  thead th{position:sticky;top:0;background:var(--surface2);text-align:left;font-family:var(--mono);font-size:10px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);padding:12px 14px;border-bottom:1px solid var(--line);white-space:nowrap;cursor:pointer;user-select:none;}
  thead th.nosort{cursor:default;}
  thead th[data-sorted]{color:var(--teal);}
  thead th[data-sorted="asc"]::after{content:" \\2191";} thead th[data-sorted="desc"]::after{content:" \\2193";}
  th.num,td.num{text-align:right;} th.ctr,td.ctr{text-align:left;}
  tbody td{padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:middle;}
  tbody tr:last-child td{border-bottom:0;} tbody tr:hover{background:rgba(255,255,255,.02);}
  tbody tr.isTest{opacity:.5;}
  .who .nm{display:block;font-weight:600;} .who .em{display:block;color:var(--text2);font-size:12px;font-family:var(--mono);}
  .who .cd{display:inline-block;margin-top:2px;color:var(--teal);text-decoration:none;font-family:var(--mono);font-size:11.5px;} .who .cd:hover{text-decoration:underline;}
  .tag{font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;background:var(--line2);color:var(--text2);padding:1px 6px;border-radius:5px;vertical-align:middle;}
  .mono{font-family:var(--mono);font-size:12.5px;} .num.big{font-weight:700;font-size:15px;} .teal{color:var(--teal);} .muted{color:var(--muted);}
  .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--line2);margin-right:7px;vertical-align:middle;} .dot.on{background:var(--teal);}

  /* chains */
  .chains{border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:8px 20px;}
  .chain{display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:14px 0;border-bottom:1px solid var(--line);font-size:14px;}
  .chain:last-child{border-bottom:0;}
  .croot{font-weight:700;} .carrow{color:var(--muted);} .cnode{color:var(--text2);}
  .cnode.deep{color:var(--teal);font-weight:600;} .cown{color:var(--muted);font-size:12px;margin-left:5px;font-family:var(--mono);}
  .empty{padding:26px 4px;color:var(--muted);text-align:center;}
  .foot{margin-top:22px;color:var(--muted);font-size:.8rem;font-family:var(--mono);line-height:1.7;}
</style></head><body>
<div class="wrap">
  <p class="eyebrow">Referral program</p>
  <h1>Growth console</h1>
  <p class="updated">${m.A} affiliates${m.testAff ? ` (+${m.testAff} test, excluded)` : ''} · rendered live from Supabase</p>

  <div class="cards">
    <div class="card"><div class="n">${m.A}</div><div class="l">Affiliates with a link</div><div class="sub">people who created a code</div></div>
    <div class="card"><div class="n amber">${m.activated}</div><div class="l">Activated</div><div class="sub">${pct(m.activationRate)} shared + got a click</div></div>
    <div class="card"><div class="n">${m.S}</div><div class="l">Signups referred</div><div class="sub">${m.attended} confirmed attended</div></div>
    <div class="card"><div class="n teal">${m.C}</div><div class="l">Human link clicks</div><div class="sub">bots excluded</div></div>
    <div class="card"><div class="n">${pct(m.clickConv)}</div><div class="l">Click to signup</div><div class="sub">overall conversion</div></div>
  </div>

  <h2 class="sec">Viral engine <span class="hint">how well this will flywheel</span></h2>
  <div class="viral">
    <div class="kbox">
      <div class="kk ${rd.tone}">${m.K.toFixed(2)}</div>
      <div class="klbl ${rd.tone}">${esc(rd.label)}</div>
      <div class="kcap">K-factor: new signups per person who gets a link</div>
    </div>
    <div>
      <div class="vchips">
        <div class="vchip"><div class="cv">${pct(m.activationRate)}</div><div class="cl">Activation</div></div>
        <div class="vchip"><div class="cv">${m.sharerK.toFixed(2)}</div><div class="cl">Per active sharer</div></div>
        <div class="vchip"><div class="cv">${pct(m.clickConv)}</div><div class="cl">Click&rarr;signup</div></div>
        <div class="vchip"><div class="cv">${m.avgClicks.toFixed(1)}</div><div class="cl">Clicks / sharer</div></div>
        <div class="vchip"><div class="cv">${m.secondGen}</div><div class="cl">2nd-gen referrers</div></div>
      </div>
      <div class="readout">${rd.lines.map((l) => `<p>${l}</p>`).join('')}</div>
    </div>
  </div>

  <h2 class="sec">Framing experiment <span class="hint">which post-signup words drive activity, even rotation</span></h2>
  ${exp.expTotal ? `<div class="exp">${exp.experiment.map((e) => `
    <div class="ecard${e.key === exp.leaderKey ? ' lead' : ''}">
      <div class="etop"><span class="ename">${esc(e.name)}</span>${e.key === exp.leaderKey ? '<span class="ewin">leading</span>' : ''}</div>
      <div class="edesc">${esc(e.desc)}</div>
      <div class="erow"><span>${e.affs}</span><span class="el">links issued</span></div>
      <div class="erow"><span class="teal">${pct(e.actRate)}</span><span class="el">activated (shared + clicked)</span></div>
      <div class="erow"><span>${e.clicks}</span><span class="el">clicks</span></div>
      <div class="erow"><span>${e.signups}</span><span class="el">signups referred</span></div>
    </div>`).join('')}</div>
    <p class="foot" style="margin-top:12px">Leader by activation rate (the earliest CVR signal); it shifts as volume grows.${exp.preExp ? ` ${exp.preExp} affiliate(s) predate the experiment and are excluded.` : ''} Treat as directional until each variant has more links.</p>`
    : `<div class="empty" style="border:1px solid var(--line);border-radius:14px;background:var(--surface)">Rotation just started, no data yet. New signups now cycle blend &rarr; status &rarr; generosity &rarr; gamified; this fills in as they share.</div>`}

  <h2 class="sec">Leaderboard <span class="hint">click any column to sort</span></h2>
  <div class="tablewrap">
    ${rows.length ? `<table id="lb"><thead><tr>
      <th>Referrer</th><th>Invited by</th><th class="num">Signups</th><th class="num">Attended</th>
      <th class="num">Clicks</th><th class="num">Conv</th><th class="ctr">Activated</th>
      <th class="num">Downline</th><th>Source</th><th>Variant</th><th>Joined</th>
    </tr></thead><tbody>${trs}</tbody></table>` : `<div class="empty">No affiliates yet.</div>`}
  </div>

  <h2 class="sec">Referral chains <span class="hint">who invited whom, across generations</span></h2>
  <div class="chains">${chainHtml}</div>

  <p class="foot">
    Activated = their link has at least one human click (a code that never gets clicked is not really in use).
    Downline = how many people they referred who then got their own link. K-factor = signups referred / affiliates with a link;
    it splits into activation x per-active-sharer. Metrics exclude ${m.testAff} test affiliate(s) and ${m.testRef} test referral(s) (@example.com).
    ${m.testAff ? 'Clear test rows anytime with the cleanup SQL from the build session.' : ''}
  </p>
</div>
<script>
(function(){
  var t=document.getElementById('lb'); if(!t) return;
  var ths=t.tHead.rows[0].cells, state={};
  for(var i=0;i<ths.length;i++){(function(idx){
    ths[idx].addEventListener('click',function(){
      var dir=state[idx]==='desc'?'asc':'desc'; state={}; state[idx]=dir;
      var rows=[].slice.call(t.tBodies[0].rows);
      rows.sort(function(a,b){
        var av=a.cells[idx].getAttribute('data-v'), bv=b.cells[idx].getAttribute('data-v');
        var an=parseFloat(av), bn=parseFloat(bv), x, y;
        if(!isNaN(an)&&!isNaN(bn)&&av!==''&&bv!==''){x=an;y=bn;} else {x=(av||'').toLowerCase();y=(bv||'').toLowerCase();}
        return x<y?(dir==='asc'?-1:1):x>y?(dir==='asc'?1:-1):0;
      });
      rows.forEach(function(r){t.tBodies[0].appendChild(r);});
      for(var j=0;j<ths.length;j++) ths[j].removeAttribute('data-sorted');
      ths[idx].setAttribute('data-sorted',dir);
    });
  })(i);}
})();
</script>
</body></html>`;
}

export default async function handler(req, res) {
  const expected = process.env.INTERNAL_PW || FALLBACK_PW;
  const auth = req.headers.authorization || '';
  let ok = false;
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      if (decoded.slice(decoded.indexOf(':') + 1) === expected) ok = true;
    } catch (e) { ok = false; }
  }
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (!ok) {
    res.setHeader('WWW-Authenticate', 'Basic realm="AI4NTP Internal", charset="UTF-8"');
    res.status(401).send('Authentication required.');
    return;
  }

  try {
    let [affiliates, referrals, clicks] = await Promise.all([
      sbAffiliates(),
      sb('/ai4ntp_referrals?select=affiliate_id,referred_email,status'),
      sb('/ai4ntp_referral_clicks?select=affiliate_id,is_bot'),
    ]);

    // Owner / internal accounts are removed from ALL tracking here (leaderboard, metrics,
    // viral engine, framing experiment, chains) so self-testing does not skew the data. Their
    // links still work in production, they just do not appear or count on this dashboard.
    // Add more emails to OWNER_EMAILS to exclude them too.
    const OWNER_EMAILS = new Set([
      'justin@tminusstudios.com',
      'justin@ai4ntp.com',
      'justinedwardnovak@gmail.com',
      'justin@brandsauce.io',
    ]);
    const ownerIds = new Set(affiliates.filter((a) => OWNER_EMAILS.has(String(a.email).toLowerCase())).map((a) => a.id));
    affiliates = affiliates.filter((a) => !ownerIds.has(a.id));
    referrals = referrals.filter((r) => !ownerIds.has(r.affiliate_id));
    clicks = clicks.filter((c) => !ownerIds.has(c.affiliate_id));

    const byId = new Map(affiliates.map((a) => [a.id, a]));
    const byEmail = new Map(affiliates.map((a) => [String(a.email).toLowerCase(), a]));

    // Per-affiliate referral + click aggregates.
    const refBy = new Map(), downBy = new Map();
    for (const r of referrals) {
      const agg = refBy.get(r.affiliate_id) || { total: 0, attended: 0 };
      agg.total++; if (r.status === 'attended' || r.status === 'rewarded') agg.attended++;
      refBy.set(r.affiliate_id, agg);
      // downline: this referred person became an affiliate?
      if (byEmail.has(String(r.referred_email).toLowerCase())) downBy.set(r.affiliate_id, (downBy.get(r.affiliate_id) || 0) + 1);
    }
    const clickBy = new Map();
    for (const c of clicks) {
      if (!c.affiliate_id || c.is_bot) continue;
      clickBy.set(c.affiliate_id, (clickBy.get(c.affiliate_id) || 0) + 1);
    }
    // parent: the affiliate who referred this affiliate (referred_email == their email).
    const parentAffId = new Map();
    for (const r of referrals) {
      const child = byEmail.get(String(r.referred_email).toLowerCase());
      if (child) parentAffId.set(child.id, r.affiliate_id);
    }

    const rows = affiliates.map((a) => {
      const rf = refBy.get(a.id) || { total: 0, attended: 0 };
      const clicksN = clickBy.get(a.id) || 0;
      const parent = parentAffId.has(a.id) ? byId.get(parentAffId.get(a.id)) : null;
      const convV = clicksN ? Math.round((rf.total / clicksN) * 100) : -1;
      return {
        id: a.id, email: a.email, first_name: a.first_name, code: a.code, source: a.source,
        created_at: a.created_at, test: isTest(a.email),
        signups: rf.total, attended: rf.attended, clicks: clicksN,
        activated: clicksN >= 1, conv: convV >= 0 ? convV + '%' : '—', convV,
        downline: downBy.get(a.id) || 0,
        parent: parent ? (parent.first_name ? `${parent.first_name} (${parent.email})` : parent.email) : null,
        variant: a.variant || null,
      };
    });
    rows.sort((x, y) => y.signups - x.signups || y.clicks - x.clicks);

    // Framing experiment: aggregate real (non-test) affiliates by variant.
    const experiment = VARIANT_META.map((vm) => {
      const grp = rows.filter((r) => !r.test && r.variant === vm.key);
      const affs = grp.length;
      const activated = grp.filter((r) => r.clicks >= 1).length;
      const clicksN = grp.reduce((s, r) => s + r.clicks, 0);
      const signups = grp.reduce((s, r) => s + r.signups, 0);
      return { ...vm, affs, activated, clicks: clicksN, signups, actRate: affs ? activated / affs : 0, perAff: affs ? clicksN / affs : 0 };
    });
    const preExp = rows.filter((r) => !r.test && !r.variant).length;
    const contenders = experiment.filter((e) => e.affs > 0);
    const leaderKey = contenders.length ? contenders.slice().sort((a, b) => b.actRate - a.actRate || b.perAff - a.perAff)[0].key : null;
    const expTotal = experiment.reduce((s, e) => s + e.affs, 0);

    // Real-only aggregates (exclude test).
    const testIds = new Set(affiliates.filter((a) => isTest(a.email)).map((a) => a.id));
    const realAff = affiliates.filter((a) => !isTest(a.email));
    const realRef = referrals.filter((r) => !testIds.has(r.affiliate_id) && !isTest(r.referred_email));
    const realClicks = clicks.filter((c) => c.affiliate_id && !testIds.has(c.affiliate_id) && !c.is_bot);
    const activated = realAff.filter((a) => (clickBy.get(a.id) || 0) >= 1).length;
    const A = realAff.length, S = realRef.length, C = realClicks.length;
    const attended = realRef.filter((r) => r.status === 'attended' || r.status === 'rewarded').length;
    const secondGen = realAff.filter((a) => parentAffId.has(a.id) && !testIds.has(parentAffId.get(a.id))).length;

    const m = {
      A, activated, S, attended, C, testAff: affiliates.length - A, testRef: referrals.length - realRef.length,
      K: A ? S / A : 0,
      sharerK: activated ? S / activated : 0,
      activationRate: A ? activated / A : 0,
      clickConv: C ? S / C : 0,
      avgClicks: activated ? C / activated : 0,
      secondGen,
    };
    m.readout = viralReadout(m);

    // Chains: roots (no parent) that have downline; list each parent -> children who became affiliates.
    const chains = [];
    for (const a of affiliates) {
      if (isTest(a.email)) continue;
      const kidsRefs = referrals.filter((r) => r.affiliate_id === a.id && byEmail.has(String(r.referred_email).toLowerCase()) && !isTest(r.referred_email));
      if (!kidsRefs.length) continue;
      const kids = kidsRefs.map((r) => {
        const kid = byEmail.get(String(r.referred_email).toLowerCase());
        const own = downBy.get(kid.id) || 0;
        return { label: kid.first_name ? `${kid.first_name} (${kid.email})` : kid.email, own, deep: own > 0 };
      });
      chains.push({ root: a.first_name ? `${a.first_name} (${a.email})` : a.email, kids });
    }
    chains.sort((x, y) => y.kids.length - x.kids.length);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.status(200).send(renderPage(rows, m, chains, { experiment, preExp, leaderKey, expTotal }));
  } catch (err) {
    console.error('internal-refer failed', err);
    res.status(500).send('Error loading referral data: ' + esc(String(err.message || err)));
  }
}
