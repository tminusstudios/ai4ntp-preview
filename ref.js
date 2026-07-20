// ref.js — shared referral-capture helper. Include with <script src="/ai4ntp-preview/ref.js"></script>
// on any page that has a signup form. Exposes window.AI4Ref.
//
//   AI4Ref.attach(payload)  -> adds payload.ref_code if a referral is in play
//   AI4Ref.get()            -> the active ref code (or '')
//   AI4Ref.myCode()         -> this visitor's OWN affiliate code (set after auto-issue)
//
// Attribution precedence: URL ?ref (or legacy ?src) first, then the a4ref cookie /
// localStorage from a prior click. First-touch: we never overwrite an existing a4ref,
// so the referrer who first drove the visit keeps the credit.
(function () {
  var MAX = 40;
  function clean(v) { return String(v || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, MAX); }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function setCookie(name, val, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + encodeURIComponent(val) + '; Expires=' + d.toUTCString() + '; Path=/; SameSite=Lax';
  }

  var params = new URLSearchParams(window.location.search);
  var fromUrl = clean(params.get('ref') || params.get('src'));

  // First-touch persistence for links shared directly (not via /r, which already
  // sets the cookie server-side): store only if we do not already have one.
  if (fromUrl) {
    if (!getCookie('a4ref')) setCookie('a4ref', fromUrl, 30);
    try { if (!localStorage.getItem('a4ref')) localStorage.setItem('a4ref', fromUrl); } catch (e) {}
  }

  function activeRef() {
    if (fromUrl) return fromUrl;
    var c = clean(getCookie('a4ref'));
    if (c) return c;
    try { return clean(localStorage.getItem('a4ref') || ''); } catch (e) { return ''; }
  }

  window.AI4Ref = {
    get: function () { return activeRef(); },
    attach: function (payload) {
      var r = activeRef();
      if (r) payload.ref_code = r;
      return payload;
    },
    myCode: function () {
      try { return localStorage.getItem('a4_mycode') || ''; } catch (e) { return ''; }
    },
    setMyCode: function (code) {
      try { if (code) localStorage.setItem('a4_mycode', code); } catch (e) {}
    }
  };
})();
