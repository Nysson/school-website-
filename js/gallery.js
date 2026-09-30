/**
 * gallery.js — renders data/gallery.json.
 * - gallery.html: #gallery-grid with category chips + lightbox
 * - index.html: #gallery-preview mosaic of 6 photos (featured first)
 * Adding a photo = drop the file in /images and add an entry to data/gallery.json.
 */
(function () {
  'use strict';

  var i18n = window.i18n, SITE = window.SITE, esc = SITE.esc;
  var CATEGORIES = ['bino', 'tadbirlar', 'darslar', 'kutubxona', 'mehmonlar']; // labels: 'gcat.<name>' in i18n.js

  var gridEl = document.getElementById('gallery-grid');
  var previewEl = document.getElementById('gallery-preview');
  var filtersEl = document.getElementById('gallery-filters');
  var countEl = document.getElementById('gallery-count');
  if (!gridEl && !previewEl) return;

  var items = [];
  var failed = false;
  var category = 'all';

  function visible() {
    return items.filter(function (it) { return category === 'all' || it.category === category; });
  }

  function tile(item, index) {
    var caption = i18n.field(item, 'title');
    return '<li class="gallery__item' + (item.featured ? ' gallery__item--wide' : '') + ' reveal">' +
      '<button type="button" class="gallery__btn media" data-index="' + index + '">' +
        SITE.picture(item.file, caption, { width: 1600, height: 1200 }) +
        '<span class="gallery__caption"><span class="gallery__cat">' + esc(i18n.t('gcat.' + item.category)) + '</span>' +
        '<span>' + esc(caption) + '</span></span>' +
        '<span class="visually-hidden">' + esc(i18n.t('gallery.open')) + '</span>' +
      '</button></li>';
  }

  function renderFilters() {
    var used = CATEGORIES.filter(function (c) { return items.some(function (it) { return it.category === c; }); });
    filtersEl.innerHTML = ['all'].concat(used).map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (category === c) + '">' +
        esc(i18n.t('gcat.' + c)) + '</button>';
    }).join('');
  }

  function renderGrid() {
    if (failed) { gridEl.innerHTML = '<li class="state-box state-box--error" role="status"><p>' + esc(i18n.t('gallery.error')) + '</p></li>'; return; }
    var list = visible();
    if (countEl) countEl.textContent = i18n.t('gallery.count', { n: list.length });
    gridEl.innerHTML = list.length
      ? list.map(tile).join('')
      : '<li class="state-box state-box--empty" role="status"><p>' + esc(i18n.t('gallery.empty')) + '</p></li>';
    SITE.checkBrokenImages(gridEl);
    SITE.observeReveal(gridEl);
  }

  function renderPreview() {
    if (failed) { previewEl.innerHTML = ''; return; }
    var picked = items.filter(function (it) { return it.featured; })
      .concat(items.filter(function (it) { return !it.featured; })).slice(0, 6);
    previewEl.className = 'mosaic mosaic--n' + picked.length; // layout adapts to 5 or 6 photos
    previewEl.innerHTML = picked.map(function (item, i) {
      var caption = i18n.field(item, 'title');
      return '<a class="mosaic__item mosaic__item--' + (i + 1) + ' media reveal" href="gallery.html">' +
        SITE.picture(item.file, caption, { width: 1600, height: 1200 }) +
        '<span class="mosaic__caption">' + esc(caption) + '</span></a>';
    }).join('');
    SITE.checkBrokenImages(previewEl);
    SITE.observeReveal(previewEl);
  }

  function renderAll() {
    if (gridEl) { if (!failed) renderFilters(); renderGrid(); }
    if (previewEl) renderPreview();
  }

  if (filtersEl) {
    filtersEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      category = b.getAttribute('data-cat');
      renderFilters();
      gridEl.classList.add('is-filtering');
      window.setTimeout(function () { renderGrid(); gridEl.classList.remove('is-filtering'); }, 150);
    });
  }

  if (gridEl) {
    gridEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-index]');
      if (!b || !window.Lightbox) return;
      var list = visible();
      window.Lightbox.open(list.map(function (it) {
        return { file: it.file, caption: function () { return i18n.field(it, 'title'); } };
      }), parseInt(b.getAttribute('data-index'), 10), b);
    });
  }

  i18n.onChange(renderAll);

  // Photos listed in gallery.json but not uploaded yet are skipped, so no empty tiles are shown.
  // (A cheap HEAD request per photo; on file:// or unusual hosts every photo is kept.)
  function exists(item) {
    var stem = item.file.replace(/\.[^.]+$/, '');
    var head = function (url) { return fetch(url, { method: 'HEAD' }).then(function (r) { return r.ok; }); };
    return head('images/optimized/' + stem + '.jpg')
      .then(function (ok) { return ok || head('images/' + item.file); })
      .catch(function () { return true; });
  }

  fetch('data/gallery.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var list = Array.isArray(data) ? data : [];
      return Promise.all(list.map(exists)).then(function (flags) {
        items = list.filter(function (it, i) { return flags[i]; });
      });
    })
    .catch(function () { failed = true; })
    .then(renderAll);
})();
