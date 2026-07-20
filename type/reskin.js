/* AI4NTP Reskin v1 — shared behavior layer (every page).
   Self-contained: optionally loads Lenis from CDN for buttery scroll,
   wires scroll reveals (staggered) and sheen hovers (dark-context aware).
   Load with: <script src="/ai4ntp-preview/type/reskin.js" defer></script> before </body>. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- buttery smooth scrolling (degrades silently to native) ---- */
  if (!reduce && !window.__ai4lenis) {
    window.__ai4lenis = true;
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/lenis@1.1.18/dist/lenis.min.js';
    s.onload = function () {
      try {
        var lenis = new Lenis({ lerp: 0.1, anchors: true });
        document.documentElement.style.scrollBehavior = 'auto';
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      } catch (e) { /* native scrolling remains */ }
    };
    document.head.appendChild(s);
  }

  function boot() {
    /* ---- sheen on cards / rows / chips ---- */
    var SHEEN = '.session-card,.replay,.tool-chip,.card,.rel a,.catnav a,.post-card,.callout,.expect-cell,.s6-moment,.s6-agent,.s6-tool,.t-card,.badge-row a,.steps li,.rewards li';
    var DARKCTX = '.session-featured,.featured,.seen,.expect,.ai4why,.cta-final,.dark,section.ink,.s6-dark';
    document.querySelectorAll(SHEEN).forEach(function (el) {
      if (el.classList.contains('rk-host')) return;
      el.classList.add('rk-host');
      if (el.closest(DARKCTX)) el.classList.add('rk-dark');
      var ov = document.createElement('i');
      ov.className = 'rk-sheen';
      ov.setAttribute('aria-hidden', 'true');
      el.appendChild(ov);
    });

    /* ---- reveals, staggered per sibling position ---- */
    var REV = '.section-label,.section-heading,.hero-inner>*,.session-card,.replay,.faq-item,.tool-chip,.tools-home-lede,.tools-home-all,.cta-final-inner>*,.hub-head>*,.dir-hero>*,.cat h2,.card,.tool-head>*,section.block,.seen,.cta-card,.post-head>*,.post-card,.toc,.expect-cell,.callout,.s6-intro>*,.s6-h2';
    var els = document.querySelectorAll(REV);
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('rv', 'rv-in'); });
    } else {
      els.forEach(function (e) {
        e.classList.add('rv');
        var idx = Array.prototype.indexOf.call(e.parentNode.children, e);
        e.style.transitionDelay = Math.min(idx * 45, 270) + 'ms';
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('rv-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      els.forEach(function (e) { io.observe(e); });
    }

    /* ---- hero scroll cue fades once you start scrolling ---- */
    var cue = document.getElementById('hero-cue');
    if (cue) {
      var onScroll = function () { cue.style.opacity = (window.scrollY > 120 ? '0' : '1'); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
