/* AI4NTP global footer.
   Self-contained and namespaced (.ai4ft*) so it is safe to drop on any page.
   Inject with <script src="/ai4ntp-preview/type/footer.js"></script> where the footer should appear
   (near the end of <body>). Styles are written to win over any page's old bare
   `footer {}` rules via class specificity + explicit resets on .ai4ft. */
(function () {
  var CSS = [
    '.ai4ft{display:block;margin:0;padding:0;background:#0F1113;color:#FAF7F0;border-top:2px solid #D4FF3A;position:relative;z-index:2;opacity:1;text-align:left;text-transform:none;letter-spacing:normal;line-height:1.5;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;}',
    '.ai4ft *{box-sizing:border-box;}',
    '.ai4ft-top{max-width:1200px;margin:0 auto;padding:64px 40px 48px;display:flex;align-items:flex-start;gap:48px;}',
    '.ai4ft-brand{max-width:360px;flex-shrink:0;}',
    '.ai4ft-links{margin-left:auto;display:flex;gap:56px;}',
    '.ai4ft-logo{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:26px;letter-spacing:0;text-decoration:none;color:#FAF7F0;display:inline-block;margin-bottom:18px;}',
    '.ai4ft-logo .four{color:#D4FF3A;font-style:italic;}',
    '.ai4ft-blurb{font-family:"Instrument Serif",Georgia,serif;font-style:italic;text-transform:none;font-size:17px;line-height:1.5;opacity:.72;margin:0 0 24px;}',
    '.ai4ft-cta{display:inline-flex;align-items:center;gap:8px;background:#D4FF3A;color:#0F1113;text-decoration:none;padding:13px 22px;border-radius:999px;font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:.14em;text-transform:uppercase;transition:background .2s,transform .2s;}',
    '.ai4ft-cta:hover{background:#FAF7F0;transform:translateY(-1px);}',
    '.ai4ft-col h4{font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#FAF7F0;opacity:.45;margin:0 0 16px;}',
    '.ai4ft-col a{display:block;color:#FAF7F0;text-decoration:none;text-transform:none;opacity:.82;font-size:14px;letter-spacing:normal;padding:7px 0;transition:color .2s,opacity .2s,transform .2s;}',
    '.ai4ft-col a:hover{opacity:1;color:#D4FF3A;transform:translateX(5px);}',
    '.ai4ft-bottom{max-width:1200px;margin:0 auto;padding:22px 40px 40px;border-top:1px solid rgba(250,247,240,.14);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:10px;letter-spacing:.15em;text-transform:uppercase;opacity:.6;}',
    '.ai4ft-tag{font-family:"Instrument Serif",Georgia,serif;font-style:italic;text-transform:none;letter-spacing:0;font-size:13px;opacity:.85;}',
    '.ai4ft-legal{display:inline-flex;gap:18px;}',
    '.ai4ft-legal a{color:#FAF7F0;text-decoration:none;opacity:.6;text-transform:uppercase;letter-spacing:.15em;font-size:10px;transition:opacity .2s,color .2s;}',
    '.ai4ft-legal a:hover{opacity:1;color:#D4FF3A;}',
    '@media(max-width:900px){.ai4ft-top{flex-direction:column;gap:40px;}.ai4ft-brand{max-width:460px;}.ai4ft-links{margin-left:0;display:grid;grid-template-columns:1fr 1fr;gap:36px 32px;}}',
    '@media(max-width:560px){.ai4ft-top{padding:48px 24px 32px;gap:32px;}.ai4ft-links{grid-template-columns:1fr;gap:28px;}.ai4ft-bottom{flex-direction:column;text-align:center;gap:12px;padding:22px 24px 32px;}}'
  ].join('');

  var HTML =
    '<footer class="ai4ft" aria-label="Site footer">' +
      '<div class="ai4ft-top">' +
        '<div class="ai4ft-brand">' +
          '<a class="ai4ft-logo" href="/ai4ntp-preview/type/">ai<span class="four">4</span>ntp</a>' +
          '<p class="ai4ft-blurb">AI for Non-Techy People. Real operators show exactly how they use and build with AI, so you can apply it the same day.</p>' +
          '<a class="ai4ft-cta" href="/ai4ntp-preview/type/register" data-cta="footer_save_seat_click">Save your seat &rarr;</a>' +
        '</div>' +
        '<div class="ai4ft-links">' +
        '<div class="ai4ft-col">' +
          '<h4>Sessions</h4>' +
          '<a href="/ai4ntp-preview/type/sessions">All sessions</a>' +
          '<a href="/ai4ntp-preview/type/sessions/005">Episode 005 replay</a>' +
          '<a href="/ai4ntp-preview/type/sessions/004">Episode 004 replay</a>' +
          '<a href="/ai4ntp-preview/type/sessions/003">Episode 003 replay</a>' +
          '<a href="/ai4ntp-preview/type/sessions/002">Episode 002 replay</a>' +
          '<a href="/ai4ntp-preview/type/ai-tools">AI tools directory</a>' +
          '<a href="/ai4ntp-preview/type/blog">Field notes</a>' +
          '<a href="/ai4ntp-preview/type/register">Reserve your seat</a>' +
        '</div>' +
        '<div class="ai4ft-col">' +
          '<h4>Get involved</h4>' +
          '<a href="/ai4ntp-preview/type/about">About AI4NTP</a>' +
          '<a href="/ai4ntp-preview/type/refer">Refer &amp; earn</a>' +
          '<a href="/ai4ntp-preview/type/partner">Apply to be a guest</a>' +
          '<a href="/ai4ntp-preview/type/partner#apply">Sponsor</a>' +
        '</div>' +
        '<div class="ai4ft-col">' +
          '<h4>Socials</h4>' +
          '<a href="https://www.youtube.com/@AI4NonTechyPeople" target="_blank" rel="noopener">YouTube</a>' +
          '<a href="https://x.com/ai4ntp" target="_blank" rel="noopener">X (Twitter)</a>' +
          '<a href="https://www.instagram.com/ai4ntp" target="_blank" rel="noopener">Instagram</a>' +
          '<a href="https://ai4ntp.beehiiv.com" target="_blank" rel="noopener">Newsletter</a>' +
        '</div>' +
        '<div class="ai4ft-col">' +
          '<h4>Connect</h4>' +
          '<a href="mailto:justin@ai4ntp.com">Email</a>' +
        '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ai4ft-bottom">' +
        '<span>&copy; AI4NTP Media &middot; 2026</span>' +
        '<span class="ai4ft-legal"><a href="/ai4ntp-preview/type/privacy">Privacy</a><a href="/ai4ntp-preview/type/terms">Terms</a></span>' +
        '<span class="ai4ft-tag">Made for humans who aren\'t engineers.</span>' +
      '</div>' +
    '</footer>';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var mount = document.currentScript;
  var wrap = document.createElement('div');
  wrap.innerHTML = HTML;
  var footerEl = wrap.firstChild;
  if (mount && mount.parentNode) {
    mount.parentNode.insertBefore(footerEl, mount.nextSibling);
  } else {
    document.body.appendChild(footerEl);
  }
})();
