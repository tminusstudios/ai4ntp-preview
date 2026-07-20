/* AI4NTP global "Why AI4NTP" section — Option A design (full-width editorial rows + white sheen).
   Self-contained and namespaced (.ai4why*). Inject where the section should appear:
   <script src="/ai4ntp-preview/type/why.js"></script>. Single source of truth — edit here only.
   Used on: index.html (homepage) and register/index.html. */
(function () {
  var CSS = [
    '.ai4why{display:block;background:#F4F1EA;color:#0F1113;padding:96px 0;position:relative;z-index:2;text-align:left;font-family:"Inter Tight",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;}',
    '.ai4why *{box-sizing:border-box;}',
    '.ai4why-inner{max-width:1152px;margin:0 auto;padding:0 20px;}',
    '.ai4why-kicker{font-family:"Inter Tight",sans-serif;font-size:11px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:rgba(15,17,19,.45);margin:0 0 16px;}',
    '.ai4why-title{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(42px,6vw,72px);letter-spacing:-.01em;line-height:1.05;max-width:896px;margin:0 0 64px;color:#0F1113;}',
    '.ai4why-title em{font-style:italic;}',
    /* rows: full-width 3-col grid — numeral | title | description */
    '.ai4why-row{position:relative;display:grid;grid-template-columns:1fr;gap:16px;padding:40px 0;border-top:1px solid rgba(15,17,19,.15);overflow:hidden;opacity:0;transform:translateY(32px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1);}',
    '.ai4why-row:last-child{border-bottom:1px solid rgba(15,17,19,.15);}',
    '.ai4why-row.ai4why-in{opacity:1;transform:none;}',
    /* white sheen sweep on hover (matches React row-glimmer) */
    '.ai4why-row::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.55) 50%,transparent 62%);transform:translateX(-115%);transition:transform 1s cubic-bezier(.22,1,.36,1);}',
    '.ai4why-row:hover::after{transform:translateX(115%);}',
    '.ai4why-num{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;font-size:48px;line-height:1;color:rgba(15,17,19,.25);transition:color .5s;}',
    '.ai4why-row:hover .ai4why-num{color:#0F1113;}',
    '.ai4why-h{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:30px;letter-spacing:-.01em;line-height:1.2;margin:0;color:#0F1113;}',
    '.ai4why-p{font-size:16px;line-height:1.625;color:rgba(15,17,19,.6);max-width:448px;margin:0;}',
    '@media(min-width:640px){',
      '.ai4why{padding:128px 0;}',
      '.ai4why-row{grid-template-columns:120px 1fr 1.2fr;gap:40px;padding:48px 0;align-items:start;}',
      '.ai4why-num{font-size:60px;}',
      '.ai4why-h{font-size:36px;line-height:1.15;}',
    '}'
  ].join('');

  var ROWS = [
    ['01', 'Real operators, live.',
     'People who\u2019ve built real products and businesses with AI teach you their exact playbook \u2014 in the open, on real work, with real stakes.'],
    ['02', 'Every level welcome.',
     'Just getting started, using AI daily, or hunting cutting-edge plays before everyone else finds them \u2014 you\u2019re in the right room.'],
    ['03', 'Never figure it out alone.',
     'Founders, operators, and builders learning in public. Ask anything in the live Q&A and leave with answers you can use the same day.']
  ];

  var rowsHTML = ROWS.map(function (r) {
    return '<div class="ai4why-row">' +
      '<span class="ai4why-num">' + r[0] + '</span>' +
      '<h3 class="ai4why-h">' + r[1] + '</h3>' +
      '<p class="ai4why-p">' + r[2] + '</p>' +
    '</div>';
  }).join('');

  var HTML =
    '<section class="ai4why" aria-label="Why AI4NTP">' +
      '<div class="ai4why-inner">' +
        '<p class="ai4why-kicker">Why AI4NTP</p>' +
        '<h2 class="ai4why-title">For everyone trying to <em>keep up with AI.</em></h2>' +
        '<div class="ai4why-rows">' + rowsHTML + '</div>' +
      '</div>' +
    '</section>';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var mount = document.currentScript;
  var wrap = document.createElement('div');
  wrap.innerHTML = HTML;
  var el = wrap.firstChild;
  if (mount && mount.parentNode) {
    mount.parentNode.insertBefore(el, mount.nextSibling);
  } else {
    document.body.appendChild(el);
  }

  /* staggered row entrances (runs for everyone — matches the React design) */
  var rows = el.querySelectorAll('.ai4why-row');
  function reveal(i) { return function () { rows[i].classList.add('ai4why-in'); }; }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var i = Array.prototype.indexOf.call(rows, entry.target);
        setTimeout(reveal(i), i * 100);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '-10% 0px' });
    for (var i = 0; i < rows.length; i++) io.observe(rows[i]);
  } else {
    for (var j = 0; j < rows.length; j++) rows[j].classList.add('ai4why-in');
  }
})();
