/**
 * lightbox.js — accessible, dependency-free lightbox.
 * Lightbox.open(items, startIndex, openerElement)
 *   items: [{ file: 'photo.jpg', caption: function () { return 'localised caption'; } }]
 * Mouse (buttons, backdrop), keyboard (←/→, Esc, Tab trapped), touch (swipe).
 */
(function () {
  'use strict';

  var i18n = window.i18n, SITE = window.SITE;
  var root, mediaEl, captionEl, counterEl, closeBtn, prevBtn, nextBtn;
  var items = [], index = 0, opener = null, touchX = null, touchY = null;
  var outside = ['site-header', 'main', 'site-footer'];

  function build() {
    root = document.createElement('div');
    root.className = 'lightbox';
    root.hidden = true;
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('data-i18n-attr', 'aria-label:lb.dialog');
    root.innerHTML =
      '<div class="lightbox__backdrop" data-lb-close></div>' +
      '<figure class="lightbox__figure">' +
        '<div class="lightbox__media media"></div>' +
        '<figcaption class="lightbox__caption"><span class="lightbox__text"></span><span class="lightbox__counter"></span></figcaption>' +
      '</figure>' +
      '<button type="button" class="lightbox__btn lightbox__btn--prev" data-i18n-attr="aria-label:lb.prev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" class="lightbox__btn lightbox__btn--next" data-i18n-attr="aria-label:lb.next"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<button type="button" class="lightbox__btn lightbox__btn--close" data-lb-close data-i18n-attr="aria-label:lb.close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(root);
    mediaEl = root.querySelector('.lightbox__media');
    captionEl = root.querySelector('.lightbox__text');
    counterEl = root.querySelector('.lightbox__counter');
    closeBtn = root.querySelector('.lightbox__btn--close');
    prevBtn = root.querySelector('.lightbox__btn--prev');
    nextBtn = root.querySelector('.lightbox__btn--next');
    i18n.apply(root);

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-close]')) close();
      else if (e.target.closest('.lightbox__btn--prev')) go(-1);
      else if (e.target.closest('.lightbox__btn--next')) go(1);
    });
    root.addEventListener('keydown', onKey);
    root.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX, dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close(); // swipe down to close
      touchX = touchY = null;
    });
    i18n.onChange(function () { if (!root.hidden) show(); });
  }

  function show() {
    var item = items[index];
    var caption = item.caption();
    mediaEl.classList.remove('media--missing');
    mediaEl.innerHTML = SITE.picture(item.file, caption, { eager: true });
    SITE.checkBrokenImages(mediaEl);
    captionEl.textContent = caption;
    counterEl.textContent = (index + 1) + ' / ' + items.length;
    var single = items.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
    // preload neighbours for instant navigation
    [index + 1, index - 1].forEach(function (n) {
      var it = items[(n + items.length) % items.length];
      if (it) { var pre = new Image(); pre.src = 'images/optimized/' + it.file.replace(/\.[^.]+$/, '') + '.jpg'; }
    });
  }

  function go(step) {
    index = (index + step + items.length) % items.length;
    show();
  }

  function focusables() {
    return Array.prototype.filter.call(root.querySelectorAll('button'), function (b) { return !b.hidden; });
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      var f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function setInert(on) {
    outside.forEach(function (id) {
      var el = id === 'main' ? document.querySelector('main') : document.getElementById(id);
      if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); }
    });
  }

  function open(list, start, from) {
    if (!root) build();
    items = list;
    index = start || 0;
    opener = from || document.activeElement;
    show();
    root.hidden = false;
    document.body.classList.add('no-scroll');
    setInert(true);
    window.requestAnimationFrame(function () { root.classList.add('is-open'); });
    closeBtn.focus();
  }

  function close() {
    root.classList.remove('is-open');
    root.hidden = true;
    document.body.classList.remove('no-scroll');
    setInert(false);
    if (opener && opener.focus) opener.focus();
  }

  window.Lightbox = { open: open, close: close };
})();
