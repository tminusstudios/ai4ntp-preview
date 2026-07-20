/* AI4NTP global site header: countdown bar + nav.
   Self-contained and namespaced (.ai4nav*) so it is safe to drop on any page.
   Include with <script src="/ai4ntp-preview/type/nav.js"></script> right after the opening <body> tag.
   Shared by the homepage and session pages. */
(function () {
  // ---- Event constants (mirror of sessions/006) ----
  var EVENT_START = new Date('2026-07-12T14:00:00-04:00'); // July 12, 2026, 2:00 PM Eastern
  var EVENT_END   = new Date('2026-07-12T15:00:00-04:00');

  var CSS = [
    '.ai4nav{position:sticky;top:0;z-index:9999;background:#0F1113;transition:box-shadow .3s;}',
    '.ai4nav.scrolled{box-shadow:0 12px 40px rgba(0,0,0,.35);}',
    '.ai4nav-cd{background:#0F1113;color:#FAF7F0;display:flex;align-items:center;justify-content:center;gap:16px;padding:9px 24px;font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;flex-wrap:wrap;border-bottom:1px solid rgba(250,247,240,.1);}',
    '.ai4nav-dot{width:7px;height:7px;border-radius:50%;background:#D4FF3A;flex-shrink:0;animation:ai4navpulse 1.6s ease-in-out infinite;}',
    '@keyframes ai4navpulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.4;transform:scale(.7);}}',
    '.ai4nav-cdlabel{opacity:.82;}',
    '.ai4nav-cdclock{color:#D4FF3A;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:.08em;}',
    '.ai4nav-cdcta{color:#FAF7F0;text-decoration:none;border-bottom:1px solid #D4FF3A;padding-bottom:2px;transition:color .2s;}',
    '.ai4nav-cdcta:hover{color:#D4FF3A;}',
    '.ai4nav-bar{padding:18px 40px;border-bottom:1px solid rgba(250,247,240,.1);display:flex;justify-content:space-between;align-items:center;background:#0F1113;}',
    '.ai4nav-logo{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:24px;letter-spacing:0;text-decoration:none;color:#FAF7F0;}',
    '.ai4nav-four{color:#D4FF3A;font-style:italic;}',
    '.ai4nav-right{display:flex;align-items:center;gap:20px;}',
    '.ai4nav-links{display:flex;align-items:center;gap:26px;}',
    '.ai4nav-link{font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;color:#FAF7F0;opacity:.6;transition:opacity .2s;background-image:linear-gradient(#D4FF3A,#D4FF3A);background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;padding-bottom:3px;transition:opacity .2s,background-size .45s cubic-bezier(.22,1,.36,1);}',
    '.ai4nav-link:hover{opacity:1;background-size:100% 1px;}',
    '.ai4nav-cta{display:inline-flex;align-items:center;gap:8px;background:#0F1113;color:#FAF7F0;text-decoration:none;padding:10px 18px;border:1px solid #0F1113;border-radius:999px;font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:.12em;text-transform:uppercase;transition:background .2s,color .2s,border-color .2s,transform .25s,box-shadow .25s;}',
    '.ai4nav-cta:hover{background:#D4FF3A;color:#0F1113;border-color:#D4FF3A;transform:translateY(-2px);box-shadow:0 10px 28px rgba(212,255,58,.35);}',
    '.ai4nav-cta--signal{background:#D4FF3A;color:#0F1113;border-color:#D4FF3A;}',
    '.ai4nav-cta--signal:hover{background:#D4FF3A;color:#0F1113;border-color:#D4FF3A;transform:translateY(-2px);box-shadow:0 10px 32px rgba(212,255,58,.45);}',
    '.ai4nav-cta--ghost{background:transparent;color:#0F1113;border-color:rgba(15,17,19,.35);}',
    '.ai4nav-cta--ghost:hover{background:#0F1113;color:#FAF7F0;border-color:#0F1113;}',
    '.ai4nav-burger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;width:40px;height:40px;padding:0;background:transparent;border:none;cursor:pointer;}',
    '.ai4nav-burger span{display:block;width:22px;height:2px;background:#FAF7F0;transition:transform .25s,opacity .2s;}',
    '.ai4nav-burger[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg);}',
    '.ai4nav-burger[aria-expanded="true"] span:nth-child(2){opacity:0;}',
    '.ai4nav-burger[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}',
    '.ai4nav-panel{display:none;flex-direction:column;background:#0F1113;border-bottom:1px solid rgba(250,247,240,.1);padding:6px 24px 18px;}',
    '.ai4nav-panel.open{display:flex;}',
    '.ai4nav-panel a{padding:15px 4px;text-decoration:none;color:#FAF7F0;font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:13px;letter-spacing:.08em;text-transform:uppercase;border-top:1px solid rgba(250,247,240,.08);}',
    '.ai4nav-panel a:first-child{border-top:none;}',
    '.ai4nav-panel a:hover{color:#D4FF3A;}',
    '@media(max-width:820px){',
    '.ai4nav-links{display:none;}',
    '.ai4nav-cta--ghost{display:none;}',
    '.ai4nav-burger{display:flex;}',
    '}',
    '@media(max-width:700px){',
    '.ai4nav-cd{font-size:10px;gap:10px;padding:8px 16px;letter-spacing:.06em;}',
    '.ai4nav-cdcta{display:none;}',
    '.ai4nav-bar{padding:14px 20px;}',
    '.ai4nav-right{gap:10px;}',
    '.ai4nav-cta{padding:9px 14px;font-size:10px;letter-spacing:.08em;}',
    '}'
  ].join('');

  var HTML =
    '<header class="ai4nav">' +
      '<div class="ai4nav-cd">' +
        '<span class="ai4nav-dot" aria-hidden="true"></span>' +
        '<span class="ai4nav-cdlabel" id="ai4nav-cdlabel">Session 006 · live July 12 · begins in</span>' +
        '<span class="ai4nav-cdclock" id="ai4nav-cdclock">--d : --h : --m : --s</span>' +
        '<a class="ai4nav-cdcta" id="ai4nav-cdcta" href="/ai4ntp-preview/type/sessions/006" data-cta="countdown_cta_click">Save your seat →</a>' +
      '</div>' +
      '<nav class="ai4nav-bar">' +
        '<a class="ai4nav-logo" href="/ai4ntp-preview/type/">ai<span class="ai4nav-four">4</span>ntp</a>' +
        '<div class="ai4nav-right">' +
          '<div class="ai4nav-links">' +
            '<a class="ai4nav-link" href="/ai4ntp-preview/type/sessions" data-cta="nav_sessions_click">Sessions</a>' +
            '<a class="ai4nav-link" href="/ai4ntp-preview/type/ai-tools" data-cta="nav_tools_click">AI Tools</a>' +
            '<a class="ai4nav-link" href="/ai4ntp-preview/type/blog" data-cta="nav_blog_click">Blog</a>' +
          '</div>' +
          '<a class="ai4nav-cta ai4nav-cta--signal" href="/ai4ntp-preview/type/sessions/006" data-cta="nav_save_seat_click">Save your seat →</a>' +
          '<button class="ai4nav-burger" id="ai4nav-burger" aria-label="Menu" aria-controls="ai4nav-panel" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</nav>' +
      '<div class="ai4nav-panel" id="ai4nav-panel">' +
        '<a href="/ai4ntp-preview/type/sessions" data-cta="navm_sessions_click">Sessions</a>' +
        '<a href="/ai4ntp-preview/type/ai-tools" data-cta="navm_tools_click">AI Tools</a>' +
        '<a href="/ai4ntp-preview/type/blog" data-cta="navm_blog_click">Blog</a>' +
        '<a href="/ai4ntp-preview/type/sessions/006" data-cta="navm_save_seat_click">Save your seat →</a>' +
      '</div>' +
    '</header>';

  // ---- Inject styles + markup ----
  var style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);
  document.body.insertAdjacentHTML('afterbegin', HTML);

  // ---- Mobile menu toggle ----
  var navRoot = document.querySelector('.ai4nav');
  window.addEventListener('scroll', function () { if (navRoot) navRoot.classList.toggle('scrolled', window.scrollY > 24); }, { passive: true });

  var burger = document.getElementById('ai4nav-burger');
  var panel = document.getElementById('ai4nav-panel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        panel.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Countdown ----
  var cdLabel = document.getElementById('ai4nav-cdlabel');
  var cdClock = document.getElementById('ai4nav-cdclock');
  var cdCta = document.getElementById('ai4nav-cdcta');

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render() {
    if (!cdClock) return;
    var diff = EVENT_START - new Date();
    if (diff > 0) {
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600);  s -= h * 3600;
      var m = Math.floor(s / 60);    s -= m * 60;
      cdClock.textContent = pad(d) + 'd : ' + pad(h) + 'h : ' + pad(m) + 'm : ' + pad(s) + 's';
      return;
    }
    cdClock.textContent = '';
    if (new Date() < EVENT_END) {
      if (cdLabel) cdLabel.textContent = 'Session 006 is live now';
      if (cdCta) { cdCta.textContent = 'Join or register →'; cdCta.setAttribute('href', '/ai4ntp-preview/type/sessions/006'); }
    } else {
      if (cdLabel) cdLabel.textContent = 'Session 006 has wrapped';
      if (cdCta) { cdCta.textContent = 'Show notes →'; cdCta.setAttribute('href', '/ai4ntp-preview/type/sessions/006'); }
    }
  }

  render();
  setInterval(render, 1000);
})();
