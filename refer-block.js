// refer-block.js — the post-signup "share moment" as a celebration modal.
// Include with <script src="/ai4ntp-preview/refer-block.js"></script> (after /ref.js), then call
// window.AI4Refer.issue(email, firstName, mountEl, opts) from a signup success handler.
//
// It POSTs /api/refer-link (idempotent), then pops a full-screen celebration modal with
// the visitor's personal link, one-tap native share, and their reward progress. The modal
// renders to document.body (over any page, light or dark), so mountEl is no longer used
// for placement (kept for call-site compatibility). If the request fails, nothing pops and
// the underlying success state is untouched (never breaks a signup).
//
// Framing A/B test: the copy variant comes from data.variant (blend | status | generosity |
// gamified), assigned + rotated server-side in /api/refer-link. Defaults to 'blend'. Every
// event is tagged with { variant } so the growth console can tell which framing wins.
(function () {
  var STYLE_ID = 'a4rb-style';
  var SHARE_TEXT = 'Join me at a free live AI4NTP session. Grab your seat with my link:';
  var EMAIL_SUBJECT = 'A free live AI4NTP session';

  var FRAMINGS = {
    blend: {
      eyebrow: 'Step 1 done — your link is live',
      h: "You're in. Now bring your team and unlock rewards.",
      sub: "Send peers a free seat, they'll thank you, and every one who attends moves you up the ranks, from Insider to Legend."
    },
    status: {
      eyebrow: "You're on the list",
      h: 'Be the one who brings AI to your team.',
      sub: "Share your link and you're the peer who found the good stuff first. Every person who joins moves you up, Insider to Legend."
    },
    generosity: {
      eyebrow: "You're in",
      h: 'Now give a peer the same edge.',
      sub: "The best ideas spread because someone cared enough to share. Send a peer a free seat, they'll thank you, and you'll earn rewards as they show up."
    },
    gamified: {
      eyebrow: 'Reward unlocked: your link',
      h: 'Your link is live. Unlock your first reward.',
      sub: "You're one step in. Invite 3 peers who attend and Insider unlocks, with rewards revealed as you climb."
    }
  };

  var CSS = [
    '.a4rb-backdrop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;',
    'padding:18px;background:rgba(4,6,9,.66);opacity:0;transition:opacity .28s ease;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);}',
    '.a4rb-backdrop.a4rb-open{opacity:1;}',
    '.a4rb-modal{position:relative;width:100%;max-width:420px;max-height:92vh;overflow-y:auto;-webkit-overflow-scrolling:touch;',
    'background:#0E1116;border:1px solid #384252;border-radius:20px;padding:26px 22px 18px;text-align:left;',
    'box-shadow:0 30px 80px rgba(0,0,0,.6);transform:translateY(16px) scale(.97);transition:transform .3s cubic-bezier(.2,.8,.2,1);',
    'color:#EDEBE6;font-family:"Hanken Grotesk",system-ui,-apple-system,sans-serif;}',
    '.a4rb-backdrop.a4rb-open .a4rb-modal{transform:none;}',
    '.a4rb-modal>*{position:relative;z-index:2;}',
    '.a4rb-modal>canvas.a4rb-confetti{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;}',
    '.a4rb-x{position:absolute;top:12px;right:12px;z-index:3;width:30px;height:30px;border-radius:50%;border:1px solid #384252;',
    'background:transparent;color:#A7B0BD;font-size:16px;line-height:1;cursor:pointer;}',
    '.a4rb-x:hover{color:#EDEBE6;border-color:#4FD6C4;}',
    '.a4rb-ico{width:52px;height:52px;border-radius:50%;background:#D4FF3A;color:#14170a;display:grid;place-items:center;',
    'font-family:"Fraunces",Georgia,serif;font-size:26px;font-weight:700;}',
    '.a4rb-eyebrow{font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#F5B133;margin:16px 0 7px;}',
    '.a4rb-h{font-family:"Fraunces",Georgia,serif;font-weight:600;font-size:23px;line-height:1.12;letter-spacing:-.01em;margin:0 0 8px;}',
    '.a4rb-sub{font-size:14px;line-height:1.5;color:#A7B0BD;margin:0 0 16px;}',
    '.a4rb-ladder{display:flex;margin:0 0 6px;}',
    '.a4rb-seg{flex:1;height:6px;background:#1F2733;border:1px solid #2A323F;border-left:0;}',
    '.a4rb-seg:first-child{border-left:1px solid #2A323F;border-radius:99px 0 0 99px;background:linear-gradient(90deg,#2E9E90,#4FD6C4);}',
    '.a4rb-seg:last-child{border-radius:0 99px 99px 0;}',
    '.a4rb-prog{display:flex;justify-content:space-between;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:9px;',
    'letter-spacing:.06em;text-transform:uppercase;color:#8A93A1;margin:0 0 16px;}',
    '.a4rb-prog b{color:#F5B133;}',
    '.a4rb-share{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;font-family:inherit;font-weight:800;',
    'font-size:15px;border:0;border-radius:11px;padding:14px;background:#D4FF3A;color:#14170a;cursor:pointer;margin:2px 0 12px;}',
    '.a4rb-share:hover{background:#e2ff63;}',
    '.a4rb-share:active{transform:translateY(1px);}',
    '.a4rb-linkrow{display:flex;gap:8px;align-items:center;margin:0 0 12px;}',
    '.a4rb-link{flex:1;min-width:0;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:12px;padding:11px 12px;',
    'border:1px solid #384252;border-radius:9px;background:#0b0e12;color:#EDEBE6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.a4rb-copy{font-family:inherit;font-weight:700;font-size:12.5px;border:1px solid #384252;background:#1F2733;color:#EDEBE6;',
    'border-radius:9px;padding:11px 13px;cursor:pointer;white-space:nowrap;}',
    '.a4rb-actions{display:flex;flex-wrap:wrap;gap:9px 16px;margin:0 0 16px;}',
    '.a4rb-actions a,.a4rb-actions button{font-family:inherit;font-size:13px;font-weight:600;color:#A7B0BD;text-decoration:none;',
    'border:0;background:transparent;border-bottom:1px solid #384252;padding:0 0 1px;cursor:pointer;}',
    '.a4rb-actions a:hover,.a4rb-actions button:hover{color:#4FD6C4;border-color:#4FD6C4;}',
    '.a4rb-rewards{display:inline-block;font-family:inherit;font-weight:700;font-size:14px;color:#4FD6C4;text-decoration:none;}',
    '.a4rb-rewards:hover{text-decoration:underline;}',
    '.a4rb-later{display:block;width:100%;text-align:center;background:transparent;border:0;color:#8A93A1;',
    'font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:14px 0 4px;cursor:pointer;}',
    '.a4rb-later:hover{color:#A7B0BD;}',
    '.a4rb-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(10px);z-index:2147483001;',
    'background:#EDEBE6;color:#0b0e12;font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:13px;font-weight:600;',
    'padding:11px 16px;border-radius:11px;opacity:0;transition:opacity .2s,transform .2s;max-width:88vw;text-align:center;pointer-events:none;box-shadow:0 12px 30px rgba(0,0,0,.4);}',
    '.a4rb-toast.a4rb-show{opacity:1;transform:translateX(-50%) translateY(0);}',
    '@media(max-width:480px){.a4rb-modal{padding:24px 18px 16px;}.a4rb-h{font-size:21px;}}',
    '@media(prefers-reduced-motion:reduce){.a4rb-backdrop,.a4rb-modal{transition:none;}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ev(name, variant, extra) {
    if (typeof gtag !== 'function') return;
    var d = { variant: variant, format: 'modal' };
    if (extra) for (var k in extra) d[k] = extra[k];
    gtag('event', name, d);
  }

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'a4rb-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('a4rb-show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('a4rb-show'); }, 2600);
  }

  function copy(text, cb) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(cb, cb); }
    else {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); if (cb) cb();
    }
  }

  function confetti(canvas) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
    var cols = ['#D4FF3A', '#4FD6C4', '#F5B133', '#EDEBE6'], parts = [];
    for (var i = 0; i < 80; i++) {
      parts.push({ x: canvas.width / 2 + (Math.random() - .5) * 80, y: canvas.height * 0.34,
        vx: (Math.random() - .5) * 6, vy: -Math.random() * 7 - 2, g: .22, s: 3 + Math.random() * 4,
        c: cols[i % 4], a: 1, rot: Math.random() * 6 });
    }
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i]; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.a -= .012; p.rot += .2;
        if (p.a > 0 && p.y < canvas.height + 12) {
          alive = true; ctx.globalAlpha = Math.max(0, p.a); ctx.fillStyle = p.c;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .5); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      if (alive) requestAnimationFrame(tick);
    })();
  }

  function open(data) {
    injectStyle();
    var variant = FRAMINGS[data.variant] ? data.variant : 'blend';
    var f = FRAMINGS[variant];
    var link = data.share_link;
    var body = SHARE_TEXT + '\n\n' + link;
    var mailHref = 'mailto:?subject=' + encodeURIComponent(EMAIL_SUBJECT) + '&body=' + encodeURIComponent(body);
    var liHref = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(link);
    var xHref = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(SHARE_TEXT) + '&url=' + encodeURIComponent(link);

    var backdrop = document.createElement('div');
    backdrop.className = 'a4rb-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Your referral link is ready');
    backdrop.innerHTML =
      '<div class="a4rb-modal" tabindex="-1">' +
        '<canvas class="a4rb-confetti" aria-hidden="true"></canvas>' +
        '<button class="a4rb-x" type="button" aria-label="Close">×</button>' +
        '<div class="a4rb-ico">✓</div>' +
        '<p class="a4rb-eyebrow">' + esc(f.eyebrow) + '</p>' +
        '<h3 class="a4rb-h">' + esc(f.h) + '</h3>' +
        '<p class="a4rb-sub">' + esc(f.sub) + '</p>' +
        '<div class="a4rb-ladder"><div class="a4rb-seg"></div><div class="a4rb-seg"></div><div class="a4rb-seg"></div><div class="a4rb-seg"></div><div class="a4rb-seg"></div></div>' +
        '<div class="a4rb-prog"><span>Your climb</span><span><b>0</b> / 3 to Insider</span></div>' +
        '<button class="a4rb-share" type="button">Share your link</button>' +
        '<div class="a4rb-linkrow"><div class="a4rb-link" title="' + esc(link) + '">' + esc(link) + '</div>' +
          '<button class="a4rb-copy" type="button">Copy</button></div>' +
        '<div class="a4rb-actions">' +
          '<a class="js-a4rb-email" href="' + mailHref + '">Send an email</a>' +
          '<a class="js-a4rb-li" target="_blank" rel="noopener" href="' + liHref + '">Post to LinkedIn</a>' +
          '<a class="js-a4rb-x" target="_blank" rel="noopener" href="' + xHref + '">Post to X</a>' +
          '<button type="button" class="js-a4rb-copy2">Copy your link</button>' +
        '</div>' +
        '<a class="a4rb-rewards" href="' + esc(data.portal_link) + '">See your rewards →</a>' +
        '<button class="a4rb-later" type="button">Maybe later</button>' +
      '</div>';
    document.body.appendChild(backdrop);

    var modal = backdrop.querySelector('.a4rb-modal');
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close(how) {
      backdrop.classList.remove('a4rb-open');
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      setTimeout(function () { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }, 300);
      ev('refer_modal_close', variant, { how: how });
    }
    function onKey(e) { if (e.key === 'Escape') close('escape'); }

    backdrop.querySelector('.a4rb-x').addEventListener('click', function () { close('x'); });
    backdrop.querySelector('.a4rb-later').addEventListener('click', function () { close('later'); });
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close('backdrop'); });
    document.addEventListener('keydown', onKey);

    var shareBtn = backdrop.querySelector('.a4rb-share');
    shareBtn.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: 'AI4NTP', text: SHARE_TEXT, url: link })
          .then(function () { ev('refer_share_native', variant); })
          .catch(function () {});
      } else {
        copy(link, function () { toast('Link copied. Paste it anywhere, or use the buttons below.'); });
        ev('refer_share_native_fallback', variant);
      }
    });

    function wireCopy(btn) {
      btn.addEventListener('click', function () {
        copy(link, function () {
          var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1500);
        });
        ev('refer_link_copied', variant);
      });
    }
    wireCopy(backdrop.querySelector('.a4rb-copy'));
    wireCopy(backdrop.querySelector('.js-a4rb-copy2'));
    backdrop.querySelector('.js-a4rb-email').addEventListener('click', function () { ev('refer_share_email', variant); });
    backdrop.querySelector('.js-a4rb-li').addEventListener('click', function () { ev('refer_share_linkedin', variant); });
    backdrop.querySelector('.js-a4rb-x').addEventListener('click', function () { ev('refer_share_x', variant); });
    backdrop.querySelector('.a4rb-rewards').addEventListener('click', function () { ev('refer_rewards_click', variant); });

    requestAnimationFrame(function () {
      backdrop.classList.add('a4rb-open');
      modal.focus();
      confetti(backdrop.querySelector('.a4rb-confetti'));
    });
    ev('refer_modal_view', variant);
  }

  window.AI4Refer = {
    issue: function (email, firstName, mountEl, opts) {
      if (!email) return;
      opts = opts || {};
      fetch('/api/refer-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, first_name: firstName || null, source: opts.source || 'auto-issue' })
      })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data || !data.share_link) return;
          if (window.AI4Ref && data.code) window.AI4Ref.setMyCode(data.code);
          ev('refer_link_issued', FRAMINGS[data.variant] ? data.variant : 'blend', { source: opts.source || 'auto-issue' });
          open(data);
        })
        .catch(function () { /* non-breaking: leave the success state untouched */ });
    }
  };
})();
