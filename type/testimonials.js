/* AI4NTP global testimonials wall (static masonry).
   Self-contained and namespaced (.ai4tm*). Inject with
   <script src="/ai4ntp-preview/type/testimonials.js"></script> where the section should appear.
   Edit the DATA array below to add/update testimonials in ONE place.
   Headshots live at /testimonials/headshots/<slug>.jpg; if a headshot is
   missing, the card falls back to the person's initials, so it never looks broken. */
(function () {
  var DATA = [
    {
      quote: "Your event today was one of the BEST. I attend a lot of online and in-person events and this one stood out. Glad to be connected and happy to refer others.",
      name: "Susan D'Elia", title: "Founder & CEO", company: "TECHMarket",
      companyUrl: "https://www.techmarket.com",
      linkedin: "https://www.linkedin.com/in/susandelia/",
      location: "San Francisco, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/susan-delia.jpg", initials: "SD"
    },
    {
      quote: "Great session this week on building a new biz from scratch in an hour! Looking forward to the OpenClaw session.",
      name: "Peggy Tsai", title: "AI & Data Product Director, JPMorgan Chase", company: "Executive Instructor, Carnegie Mellon University",
      companyUrl: "https://www.cmu.edu",
      linkedin: "https://www.linkedin.com/in/peggy-tsai-data/",
      location: "New York, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/peggy-tsai.jpg", initials: "PT"
    },
    {
      quote: "You are like the Gary Vaynerchuk of AI for everyday people.",
      name: "Mark Yoldi", title: "CEO", company: "Innovate Labs",
      companyUrl: "",
      linkedin: "https://www.linkedin.com/in/mark-yoldi-8326b4232/",
      location: "Manila, Philippines", photo: "/ai4ntp-preview/type/testimonials/headshots/mark-yoldi.jpg", initials: "MY"
    },
    {
      quote: "I really liked the natural conversations that were happening between you and the other speakers. It didn't feel like a sales pitch, but more of a genuine way to share knowledge. I really liked that.",
      name: "Farha Akhtar", title: "Marketing Manager", company: "iSoftStone",
      companyUrl: "https://www.isoftstoneinc.com",
      linkedin: "https://www.linkedin.com/in/farhaakhtar/",
      location: "Texas, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/farha-akhtar.jpg", initials: "FA"
    },
    {
      quote: "Session yesterday was really helpful. Would you mind sending that matrix of which AI tool is best used for what? I know it will change, but it would be a great starting point to share with the team.",
      name: "Johan Jimenez", title: "Director, Amazon Marketing", company: "PLTFRM",
      companyUrl: "https://www.onepltfrm.com",
      linkedin: "https://www.linkedin.com/in/johan-jimenez-10a167150/",
      location: "West Palm Beach, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/johan-jimenez.jpg", initials: "JJ"
    },
    {
      quote: "I found the last one fantastic! I've registered with hopes of watching the recording if it's shared afterward. Thanks for sharing!",
      name: "Jennie Kimmel", title: "Senior Marketing Manager", company: "O'Reilly",
      companyUrl: "https://www.oreilly.com",
      linkedin: "https://www.linkedin.com/in/jenniekimmel/",
      location: "San Francisco, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/jennie-kimmel.jpg", initials: "JK"
    },
    {
      quote: "I enjoyed the content at the end and in the Q&A. When I've got some specific questions I will check back in with you. Appreciate the time!",
      name: "Sydney Kida Timmers", title: "Senior Marketing", company: "86 Repairs",
      companyUrl: "https://www.86repairs.com/",
      linkedin: "https://www.linkedin.com/in/sydneymkida/",
      location: "Atlanta, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/sydney-kida-timmers.jpg", initials: "ST"
    },
    {
      quote: "I so appreciate the knowledge and would love to continue learning more. Inspiring group that you four are, so thank you again.",
      name: "Kristin DaRoza", title: "Director of Wholesale Marketing", company: "",
      companyUrl: "",
      linkedin: "https://www.linkedin.com/in/kristinkolenicdaroza/",
      location: "Oceanside, USA", photo: "/ai4ntp-preview/type/testimonials/headshots/kristin-daroza.jpg", initials: "KD"
    }
  ];

  var CSS = [
    '.ai4tm{background:#0F1113;color:#FAF7F0;padding:128px 0;border-top:1px solid rgba(15,17,19,.12);position:relative;z-index:2;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif;}',
    '.ai4tm *{box-sizing:border-box;}',
    '.ai4tm-head{max-width:1152px;margin:0 auto 56px;padding:0 20px;text-align:left;}',
    '.ai4tm-eyebrow{font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:rgba(250,247,240,.4);margin-bottom:16px;}',
    '.ai4tm-title{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(40px,5.5vw,64px);letter-spacing:-.01em;line-height:1.05;}',
    '.ai4tm-title em{font-style:italic;}',
    /* static masonry wall */
    '.ai4tm-grid{max-width:1152px;margin:0 auto;padding:0 20px;column-count:3;column-gap:20px;}',
    '@media(max-width:920px){.ai4tm-grid{column-count:2;}}',
    '@media(max-width:600px){.ai4tm-grid{column-count:1;max-width:480px;padding:0 24px;}}',
    '.ai4tm-card{background:#1C1F23;border-radius:16px;padding:26px 26px 24px;margin:0 0 20px;width:100%;display:inline-block;break-inside:avoid;-webkit-column-break-inside:avoid;}',
    '.ai4tm-quote{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:clamp(18px,1.9vw,21px);line-height:1.45;color:#FAF7F0;margin:0;}',
    '.ai4tm-foot{display:flex;align-items:center;gap:13px;margin-top:20px;padding-top:18px;border-top:1px solid rgba(250,247,240,.14);}',
    '.ai4tm-av{position:relative;width:46px;height:46px;border-radius:50%;overflow:hidden;flex-shrink:0;background:#0F1113;display:flex;align-items:center;justify-content:center;text-decoration:none;}',
    '.ai4tm-av::before{content:attr(data-initials);position:absolute;font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:20px;color:rgba(212,255,58,.5);}',
    '.ai4tm-av img{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;display:block;}',
    '.ai4tm-meta{min-width:0;}',
    '.ai4tm-name{font-family:"Inter Tight",-apple-system,sans-serif;font-weight:600;font-size:13.5px;letter-spacing:-.01em;color:#FAF7F0;text-decoration:none;}',
    '.ai4tm-name:hover{color:#D4FF3A;}',
    '.ai4tm-role{font-family:"Inter Tight",-apple-system,sans-serif;font-size:12.5px;line-height:1.4;color:rgba(250,247,240,.55);margin-top:3px;}',
    '.ai4tm-role a{color:rgba(250,247,240,.7);text-decoration:none;border-bottom:1px solid rgba(212,255,58,.35);padding-bottom:1px;transition:color .2s,border-color .2s;}',
    '.ai4tm-role a:hover{color:#D4FF3A;border-color:#D4FF3A;}',
    '.ai4tm-loc{font-family:"Inter Tight",-apple-system,sans-serif;font-weight:500;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(250,247,240,.35);margin-top:7px;}'
  ].join('');

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  function cardHTML(t) {
    var company = t.companyUrl
      ? '<a href="' + esc(t.companyUrl) + '" target="_blank" rel="noopener">' + esc(t.company) + '</a>'
      : esc(t.company);
    return '<figure class="ai4tm-card">' +
      '<blockquote class="ai4tm-quote">“' + esc(t.quote) + '”</blockquote>' +
      '<figcaption class="ai4tm-foot">' +
        '<a class="ai4tm-av" data-initials="' + esc(t.initials) + '" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener" aria-label="' + esc(t.name) + ' on LinkedIn">' +
          '<img src="' + esc(t.photo) + '" alt="' + esc(t.name) + '" loading="lazy" onerror="this.remove()">' +
        '</a>' +
        '<div class="ai4tm-meta">' +
          '<a class="ai4tm-name" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">' + esc(t.name) + '</a>' +
          '<div class="ai4tm-role">' + esc(t.title) + (t.company ? ' &middot; ' + company : '') + '</div>' +
          '<div class="ai4tm-loc">' + esc(t.location) + '</div>' +
        '</div>' +
      '</figcaption>' +
    '</figure>';
  }

  var HTML =
    '<section class="ai4tm" id="testimonials" aria-label="What the room is saying">' +
      '<div class="ai4tm-head">' +
        '<div class="ai4tm-eyebrow">What the room is saying</div>' +
        '<h2 class="ai4tm-title">You are in <em>good company.</em></h2>' +
      '</div>' +
      '<div class="ai4tm-grid">' + DATA.map(cardHTML).join('') + '</div>' +
    '</section>';

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var mount = document.currentScript;
  var wrap = document.createElement('div');
  wrap.innerHTML = HTML;
  var section = wrap.firstChild;
  if (mount && mount.parentNode) mount.parentNode.insertBefore(section, mount.nextSibling);
  else document.body.appendChild(section);

  // fire a one-time engagement event when the proof scrolls into view
  if ('IntersectionObserver' in window && typeof gtag === 'function') {
    var fired = false;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && !fired) { fired = true; gtag('event', 'testimonial_engage'); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(section);
  }
})();
