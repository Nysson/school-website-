/**
 * main.js — shared behaviour for every page:
 * header/footer templates, language switch, mobile menu, sticky header,
 * scroll reveal, count-up numbers, progress ring, contact section + map, image fallbacks.
 */
(function () {
  'use strict';

  var cfg = window.SCHOOL_CONFIG;
  var i18n = window.i18n;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var ICONS = {
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    phone: '<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
    telegram: '<path d="m21 4-18 7.5 6 2 2 6.5 3.5-4.5 5 3.5L21 4zM9 13.5 18 7"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  /**
   * Responsive picture markup for a file in /images.
   * Tries images/optimized/<name>.webp → images/optimized/<name>.jpg → images/<file> → ornamental placeholder.
   */
  function picture(file, alt, opts) {
    opts = opts || {};
    var stem = file.replace(/\.[^.]+$/, '');
    return '<picture>' +
      '<source type="image/webp" srcset="images/optimized/' + esc(stem) + '.webp">' +
      '<img src="images/optimized/' + esc(stem) + '.jpg" data-fallback="images/' + esc(file) + '"' +
      ' alt="' + esc(alt) + '" width="' + (opts.width || 1600) + '" height="' + (opts.height || 1200) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"' +
      (opts.className ? ' class="' + opts.className + '"' : '') + '>' +
      '</picture>';
  }

  /* ---------- image fallback chain ---------- */
  function handleImgError(img) {
    var pic = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null;
    var sources = pic ? pic.querySelectorAll('source') : [];
    if (sources.length) {
      sources.forEach(function (s) { s.remove(); });
      img.src = img.getAttribute('src'); // re-select the <img> src (optimized JPEG)
      return;
    }
    var fb = img.getAttribute('data-fallback');
    if (fb) {
      img.removeAttribute('data-fallback');
      img.src = fb;
      return;
    }
    img.classList.add('is-missing');
    var media = img.closest('.media');
    if (media) media.classList.add('media--missing');
  }
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') handleImgError(e.target);
  }, true);
  function checkBrokenImages(scope) {
    (scope || document).querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) handleImgError(img);
    });
  }

  /* ---------- header ---------- */
  var NAV = [
    { href: 'index.html', key: 'nav.home', page: 'home' },
    { href: 'about.html', key: 'nav.about', page: 'about' },
    { href: 'news.html', key: 'nav.news', page: 'news' },
    { href: 'gallery.html', key: 'nav.gallery', page: 'gallery' },
    { href: 'index.html#contact', key: 'nav.contact', page: 'contact' }
  ];

  function renderHeader(page) {
    var links = NAV.map(function (n) {
      var current = n.page === page ? ' aria-current="page"' : '';
      return '<li><a class="nav__link" href="' + n.href + '"' + current + ' data-i18n="' + n.key + '"></a></li>';
    }).join('');
    var langs = cfg.languages.map(function (l) {
      return '<button type="button" class="lang-switch__btn" data-set-lang="' + l + '" lang="' + l + '">' + l.toUpperCase() + '</button>';
    }).join('<span class="lang-switch__sep" aria-hidden="true">|</span>');

    return '<div class="site-header__inner container">' +
      '<a class="brand" href="index.html" data-i18n-attr="aria-label:a11y.home">' +
        '<img class="brand__logo" src="assets/logo.svg" alt="" width="40" height="45">' +
        '<span class="brand__text"><span class="brand__name">Alisher Navoiy</span>' +
        '<span class="brand__sub">IDUM · Navoiy</span></span>' +
      '</a>' +
      '<nav class="nav" id="site-nav" data-i18n-attr="aria-label:a11y.mainNav">' +
        '<ul class="nav__list">' + links + '</ul>' +
      '</nav>' +
      '<div class="site-header__tools">' +
        '<div class="lang-switch" role="group" data-i18n-attr="aria-label:a11y.lang">' + langs + '</div>' +
        '<button type="button" class="menu-toggle" aria-controls="site-nav" aria-expanded="false" data-i18n-attr="aria-label:a11y.menuOpen">' +
          '<span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span><span class="menu-toggle__bar"></span>' +
        '</button>' +
      '</div>' +
    '</div>';
  }

  /* ---------- contact list (footer + contact section) ---------- */
  function contactItems(withLabels) {
    var items = [];
    var label = function (k) { return withLabels ? '<span class="contact-list__label" data-i18n="' + k + '"></span>' : ''; };
    var newTab = '<span class="visually-hidden" data-i18n="a11y.newTab"></span>';
    items.push('<li class="contact-list__item">' + icon('pin') + '<span>' + label('contact.address') +
      '<span class="contact-list__value" data-config="address"></span></span></li>');
    if (cfg.phone) items.push('<li class="contact-list__item">' + icon('phone') + '<span>' + label('contact.phone') +
      '<a class="contact-list__value" href="tel:' + esc(cfg.phone) + '">' + esc(cfg.phoneDisplay || cfg.phone) + '</a></span></li>');
    if (cfg.email) items.push('<li class="contact-list__item">' + icon('mail') + '<span>' + label('contact.email') +
      '<a class="contact-list__value" href="mailto:' + esc(cfg.email) + '">' + esc(cfg.email) + '</a></span></li>');
    ['facebook', 'instagram', 'telegram'].forEach(function (net) {
      var url = cfg.social && cfg.social[net];
      if (!url) return; // empty = hidden automatically
      var name = net.charAt(0).toUpperCase() + net.slice(1);
      items.push('<li class="contact-list__item">' + icon(net) + '<span>' + label('contact.social') +
        '<a class="contact-list__value" href="' + esc(url) + '" target="_blank" rel="noopener">' + name + newTab + '</a></span></li>');
    });
    return '<ul class="contact-list">' + items.join('') + '</ul>';
  }

  function renderFooter() {
    var links = NAV.map(function (n) {
      return '<li><a href="' + n.href + '" data-i18n="' + n.key + '"></a></li>';
    }).join('');
    return '<div class="site-footer__ornament" aria-hidden="true"></div>' +
      '<div class="container site-footer__grid">' +
        '<div class="site-footer__brand">' +
          '<img src="assets/logo.svg" alt="" width="56" height="63" loading="lazy">' +
          '<p class="site-footer__name" data-config="name"></p>' +
          '<p class="site-footer__motto" data-i18n="motto.text"></p>' +
        '</div>' +
        '<div><h2 class="site-footer__title" data-i18n="footer.pages"></h2><ul class="site-footer__links">' + links + '</ul></div>' +
        '<div><h2 class="site-footer__title" data-i18n="footer.contact"></h2>' + contactItems(false) + '</div>' +
      '</div>' +
      '<div class="divider divider--light" aria-hidden="true"></div>' +
      '<div class="container site-footer__bottom"><p><span data-i18n="footer.copy"></span>. <span data-i18n="footer.rights"></span></p></div>';
  }

  function renderContactSection(el) {
    var q = encodeURIComponent(cfg.mapQuery);
    el.innerHTML =
      '<div class="contact__info reveal">' +
        '<p class="eyebrow" data-i18n="contact.eyebrow"></p>' +
        '<h2 class="section-title" id="contact-title" data-i18n="contact.title"></h2>' +
        '<p class="lead" data-i18n="contact.lead"></p>' +
        contactItems(true) +
        '<div class="btn-row">' +
          (cfg.phone ? '<a class="btn btn--primary" href="tel:' + esc(cfg.phone) + '">' + icon('phone') + '<span data-i18n="contact.call"></span></a>' : '') +
          '<a class="btn btn--outline" href="https://www.google.com/maps/dir/?api=1&amp;destination=' + q + '" target="_blank" rel="noopener">' +
            icon('route') + '<span data-i18n="contact.directions"></span><span class="visually-hidden" data-i18n="a11y.newTab"></span></a>' +
        '</div>' +
      '</div>' +
      '<div class="contact__map reveal">' +
        '<iframe src="https://www.google.com/maps?q=' + q + '&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-i18n-attr="title:contact.map" allowfullscreen></iframe>' +
      '</div>';
  }

  function applyConfigText() {
    document.querySelectorAll('[data-config]').forEach(function (el) {
      el.textContent = i18n.pick(cfg[el.getAttribute('data-config')]);
    });
  }

  function syncLangButtons() {
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === i18n.lang));
    });
  }

  /* ---------- mobile menu ---------- */
  function initMenu(header) {
    var toggle = header.querySelector('.menu-toggle');
    var nav = header.querySelector('.nav');
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('data-i18n-attr', 'aria-label:' + (open ? 'a11y.menuClose' : 'a11y.menuOpen'));
      toggle.setAttribute('aria-label', i18n.t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
      header.classList.toggle('is-menu-open', open);
      document.body.classList.toggle('no-scroll', open);
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-menu-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  function initStickyHeader(header) {
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- scroll reveal, count-up, ring ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var from = parseInt(el.getAttribute('data-count-from') || '0', 10);
    var plain = el.hasAttribute('data-plain'); // years: no thousands separator
    var fmt = function (n) { return plain ? String(n) : i18n.formatNumber(n); };
    el.setAttribute('data-done', '');
    if (reduceMotion) { el.textContent = fmt(target); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(from + (target - from) * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  function refreshNumbers() {
    document.querySelectorAll('[data-count][data-done]:not([data-plain])').forEach(function (el) {
      el.textContent = i18n.formatNumber(parseInt(el.getAttribute('data-count'), 10));
    });
  }

  function observeReveal(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.is-visible), [data-count]:not([data-done]), .ring:not(.is-drawn)');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { activate(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { activate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function activate(el) {
    if (el.hasAttribute('data-count')) countUp(el);
    if (el.classList.contains('ring')) el.classList.add('is-drawn');
    el.classList.add('is-visible');
  }

  /* ---------- init ---------- */
  function init() {
    var page = document.body.getAttribute('data-page');
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');
    if (header) { header.innerHTML = renderHeader(page); initMenu(header); initStickyHeader(header); }
    if (footer) footer.innerHTML = renderFooter();
    var contact = document.getElementById('contact-block');
    if (contact) renderContactSection(contact);

    // progress ring / bars: the fraction comes from the real numbers in data attributes, drawn by CSS
    document.querySelectorAll('[data-value][data-total]').forEach(function (r) {
      var frac = parseFloat(r.getAttribute('data-value')) / parseFloat(r.getAttribute('data-total'));
      r.style.setProperty('--frac', frac.toFixed(4));
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-set-lang]');
      if (btn) i18n.setLang(btn.getAttribute('data-set-lang'));
    });
    i18n.onChange(function () { applyConfigText(); syncLangButtons(); refreshNumbers(); });

    i18n.apply();
    i18n.updatePageMeta();
    applyConfigText();
    syncLangButtons();
    checkBrokenImages();
    observeReveal();
    document.documentElement.classList.add('js-ready');
  }

  window.SITE = { esc: esc, icon: icon, picture: picture, observeReveal: observeReveal, checkBrokenImages: checkBrokenImages };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
