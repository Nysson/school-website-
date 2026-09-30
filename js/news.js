/**
 * news.js — renders news from data/news.json.
 * - index.html: #latest-news → the 3 newest items
 * - news.html: list with category filter + "show more", or a detail view for news.html?id=<id>
 * Adding news = adding an object to data/news.json (and an image to /images). No code changes.
 */
(function () {
  'use strict';

  var i18n = window.i18n, SITE = window.SITE, esc = SITE.esc;
  var PAGE_SIZE = 6;
  var CATEGORIES = ['results', 'events', 'announcements']; // add new categories here + 'cat.<name>' in i18n.js

  var latestEl = document.getElementById('latest-news');
  var listEl = document.getElementById('news-list');
  var detailEl = document.getElementById('news-detail');
  if (!latestEl && !listEl && !detailEl) return;

  var items = [];
  var state = { category: 'all', shown: PAGE_SIZE, failed: false };
  var params = new URLSearchParams(window.location.search);
  var detailId = params.get('id');

  function sortNewest(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }

  function card(item, featured) {
    var url = 'news.html?id=' + encodeURIComponent(item.id);
    var title = i18n.field(item, 'title');
    return '<article class="news-card' + (featured ? ' news-card--featured' : '') + ' reveal">' +
      '<a class="news-card__media media" href="' + url + '" tabindex="-1" aria-hidden="true">' +
        SITE.picture(item.image, '', { width: 1600, height: 1200 }) + '</a>' +
      '<div class="news-card__body">' +
        '<p class="news-card__meta"><span class="badge">' + esc(i18n.t('cat.' + item.category)) + '</span>' +
          '<time datetime="' + esc(item.date) + '">' + esc(i18n.formatDate(item.date)) + '</time>' +
          (item.sample ? '<span class="badge badge--muted">' + esc(i18n.t('news.sample')) + '</span>' : '') + '</p>' +
        '<h3 class="news-card__title"><a href="' + url + '">' + esc(title) + '</a></h3>' +
        '<p class="news-card__summary">' + esc(i18n.field(item, 'summary')) + '</p>' +
        '<span class="news-card__more" aria-hidden="true">' + esc(i18n.t('news.readMore')) + SITE.icon('arrow') + '</span>' +
      '</div></article>';
  }

  function stateBox(kind, message, extra) {
    return '<div class="state-box state-box--' + kind + '" role="status"><p>' + esc(message) + '</p>' +
      (extra ? '<p class="state-box__hint">' + esc(extra) + '</p>' : '') + '</div>';
  }
  function errorBox() {
    return stateBox('error', i18n.t('news.error'), window.location.protocol === 'file:' ? i18n.t('news.errorLocal') : '');
  }

  function after(el) { SITE.checkBrokenImages(el); SITE.observeReveal(el); }

  /* ---- home: latest 3 ---- */
  function renderLatest() {
    if (state.failed) { latestEl.innerHTML = errorBox(); return; }
    latestEl.innerHTML = items.slice(0, 3).map(function (it) { return card(it, false); }).join('');
    after(latestEl);
  }

  /* ---- list page ---- */
  var filtersEl = document.getElementById('news-filters');
  var moreBtn = document.getElementById('news-more');

  function renderFilters() {
    if (!filtersEl) return;
    var used = CATEGORIES.filter(function (c) { return items.some(function (it) { return it.category === c; }); });
    filtersEl.innerHTML = ['all'].concat(used).map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (state.category === c) + '">' +
        esc(i18n.t('cat.' + c)) + '</button>';
    }).join('');
  }

  function renderList() {
    if (state.failed) { listEl.innerHTML = errorBox(); moreBtn.hidden = true; return; }
    var filtered = items.filter(function (it) { return state.category === 'all' || it.category === state.category; });
    if (!filtered.length) {
      listEl.innerHTML = stateBox('empty', i18n.t('news.empty'));
      moreBtn.hidden = true;
      return;
    }
    listEl.innerHTML = filtered.slice(0, state.shown).map(function (it, i) {
      return card(it, i === 0 && state.category === 'all');
    }).join('');
    moreBtn.hidden = filtered.length <= state.shown;
    after(listEl);
  }

  /* ---- detail view ---- */
  function renderDetail() {
    var listView = document.getElementById('news-list-view');
    var hero = document.getElementById('news-hero');
    if (listView) listView.hidden = true;
    if (hero) hero.hidden = true;
    detailEl.hidden = false;
    document.body.classList.add('page--article');

    if (state.failed) { detailEl.innerHTML = '<div class="container">' + errorBox() + '</div>'; return; }
    var item = items.filter(function (it) { return String(it.id) === detailId; })[0];
    var back = '<a class="back-link" href="news.html">← ' + esc(i18n.t('news.back')) + '</a>';
    if (!item) {
      detailEl.innerHTML = '<div class="container container--narrow article">' + back + stateBox('empty', i18n.t('news.notFound')) + '</div>';
      return;
    }
    var title = i18n.field(item, 'title');
    var body = i18n.field(item, 'body').split(/\n\s*\n/).map(function (p) { return '<p>' + esc(p.trim()) + '</p>'; }).join('');
    var pageUrl = window.SCHOOL_CONFIG.siteUrl + 'news.html?id=' + encodeURIComponent(item.id);
    var others = items.filter(function (it) { return it !== item; }).slice(0, 3);

    detailEl.innerHTML =
      '<article class="article container container--narrow">' + back +
        '<header class="article__header">' +
          '<p class="news-card__meta"><span class="badge">' + esc(i18n.t('cat.' + item.category)) + '</span>' +
            '<time datetime="' + esc(item.date) + '">' + esc(i18n.formatDate(item.date)) + '</time>' +
            (item.sample ? '<span class="badge badge--muted">' + esc(i18n.t('news.sample')) + '</span>' : '') + '</p>' +
          '<h1 class="article__title">' + esc(title) + '</h1>' +
          '<p class="article__lead">' + esc(i18n.field(item, 'summary')) + '</p>' +
        '</header>' +
        '<figure class="article__media media">' + SITE.picture(item.image, title, { eager: true }) + '</figure>' +
        '<div class="article__body prose">' + body + '</div>' +
        '<div class="article__share">' +
          '<a class="btn btn--outline" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener">' +
            SITE.icon('facebook') + '<span>' + esc(i18n.t('news.share')) + '</span><span class="visually-hidden">' + esc(i18n.t('a11y.newTab')) + '</span></a>' +
          '<button type="button" class="btn btn--ghost" id="copy-link">' + esc(i18n.t('news.copy')) + '</button>' +
          '<span class="article__copied" role="status" id="copy-status"></span>' +
        '</div>' +
      '</article>' +
      (others.length ? '<section class="section section--mist" aria-labelledby="more-news"><div class="container">' +
        '<h2 class="section-title" id="more-news">' + esc(i18n.t('news.more')) + '</h2>' +
        '<div class="news-grid">' + others.map(function (it) { return card(it, false); }).join('') + '</div></div></section>' : '');

    i18n.setMeta(title + ' — ' + i18n.t('meta.news.title'), i18n.field(item, 'summary'));
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = pageUrl;
    var copyBtn = document.getElementById('copy-link');
    copyBtn.addEventListener('click', function () {
      var done = function () { document.getElementById('copy-status').textContent = i18n.t('news.copied'); };
      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(done, function () {});
    });
    after(detailEl);
  }

  function renderAll() {
    if (latestEl) renderLatest();
    if (detailEl && detailId) { renderDetail(); return; }
    if (listEl) { renderFilters(); renderList(); }
  }

  /* ---- events ---- */
  if (filtersEl) {
    filtersEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      state.category = b.getAttribute('data-cat');
      state.shown = PAGE_SIZE;
      renderFilters();
      renderList();
    });
  }
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var firstNew = state.shown;
      state.shown += PAGE_SIZE;
      renderList();
      var next = listEl.children[firstNew] && listEl.children[firstNew].querySelector('a[href]:not([tabindex])');
      if (next) next.focus(); // keep keyboard users in place
    });
  }
  i18n.onChange(renderAll);

  if (listEl && !detailId) listEl.innerHTML = stateBox('loading', i18n.t('news.loading'));

  fetch('data/news.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) { items = (Array.isArray(data) ? data : []).slice().sort(sortNewest); })
    .catch(function () { state.failed = true; })
    .then(renderAll);
})();
