/**
 * i18n — UI strings + a tiny translation engine.
 *
 * Usage in HTML:
 *   <span data-i18n="nav.home"></span>                    → textContent
 *   <a data-i18n-attr="aria-label:a11y.menuOpen">          → attributes ("attr:key; attr2:key2")
 *   <div data-lang="uz">…</div><div data-lang="en">…</div> → long prose, toggled by CSS
 * Usage in JS: i18n.t('key'), i18n.field(item, 'title'), i18n.onChange(fn)
 *
 * Adding Russian: copy the `en` block to `ru`, translate, add 'ru' to SCHOOL_CONFIG.languages,
 * add `*_ru` fields to the JSON data and one CSS rule for [data-lang] (see css/style.css §2).
 * Uzbek orthography: oʻ / gʻ use U+02BB (ʻ), the tutuq belgisi uses U+02BC (ʼ).
 */
(function () {
  'use strict';

  var STRINGS = {
    uz: {
      'a11y.skip': 'Asosiy mazmunga oʻtish',
      'a11y.menuOpen': 'Menyuni ochish',
      'a11y.menuClose': 'Menyuni yopish',
      'a11y.lang': 'Tilni tanlash',
      'a11y.home': 'Bosh sahifa',
      'a11y.mainNav': 'Asosiy menyu',
      'a11y.newTab': '(yangi oynada ochiladi)',

      'nav.home': 'Bosh sahifa',
      'nav.about': 'Maktab haqida',
      'nav.news': 'Yangiliklar',
      'nav.gallery': 'Galereya',
      'nav.contact': 'Aloqa',

      'hero.eyebrow': 'Navoiy shahri · 2017-yildan beri',
      'hero.title': 'Alisher Navoiy nomidagi IDUM',
      'hero.subtitle': 'Oʻzbek tili va adabiyotiga ixtisoslashtirilgan davlat umumtaʼlim maktabi',
      'hero.btnAbout': 'Maktab haqida',
      'hero.btnGallery': 'Galereya',
      'hero.scroll': 'Pastga aylantirish',

      'stats.label': 'Maktab raqamlarda',
      'stats.students': 'oʻquvchi',
      'stats.teachers': 'oʻqituvchi',
      'stats.classes': 'sinf',
      'stats.founded': 'tashkil etilgan yil',

      'lang.eyebrow': 'Bizning ustunligimiz',
      'lang.title': 'Tillar — dunyoga ochilgan eshik',
      'lang.lead': 'Ona tili va adabiyotiga chuqur mehr bilan birga maktabimizda xorijiy tillarni puxta egallashga alohida eʼtibor qaratiladi. Natijalar buni yaqqol koʻrsatib turibdi.',
      'lang.certLabel': '10–11-sinf bitiruvchilarining 70 foizdan ortigʻi ingliz va rus tillaridan B2 va C1 darajadagi sertifikatlarga ega',
      'lang.english': 'Ingliz tili',
      'lang.russian': 'Rus tili',
      'lang.satTitle': 'SAT natijalari',
      'lang.satYear': 'Soʻnggi bir yilda',
      'lang.sat58': 'nafar oʻquvchi SAT imtihonida yuqori natija qayd etdi',
      'lang.sat17': 'nafari 1500 va undan yuqori ball toʻpladi',
      'lang.photo': 'Ingliz tili darsi',

      'results.eyebrow': '2025–2026 oʻquv yili',
      'results.title': 'Bitiruvchilarimiz — yangi marralar sari',
      'results.lead': 'Har bir bitiruvchi maktabdan bilim bilan birga oʻqishni davom ettirish ishtiyoqini ham olib ketadi.',
      'results.graduates': 'nafar bitiruvchi',
      'results.admitted': 'nafari oliy taʼlim muassasalariga qabul qilindi',
      'results.ring': '291 nafar bitiruvchidan 203 nafari oliy taʼlim muassasalariga qabul qilindi',
      'results.of': 'dan',

      'director.eyebrow': 'Xush kelibsiz',
      'director.title': 'Maktab rahbariyatining tabrigi',
      'director.name': 'Bobonazarov Dilshod',
      'director.role': 'Maktab direktori',
      'director.photo': 'Direktor surati tez orada',

      'news.eyebrow': 'Maktab hayoti',
      'news.latest': 'Soʻnggi yangiliklar',
      'news.all': 'Barcha yangiliklar',
      'news.readMore': 'Batafsil',
      'news.loadMore': 'Yana koʻrsatish',
      'news.back': 'Barcha yangiliklarga qaytish',
      'news.empty': 'Bu turkumda hozircha yangilik yoʻq.',
      'news.error': 'Yangiliklarni yuklab boʻlmadi. Sahifani yangilab koʻring.',
      'news.errorLocal': 'Maslahat: saytni server orqali oching (README.md faylida bir qatorli buyruq bor).',
      'news.notFound': 'Bu yangilik topilmadi yoki oʻchirilgan.',
      'news.more': 'Boshqa yangiliklar',
      'news.sample': 'Namuna',
      'news.share': 'Facebookda ulashish',
      'news.copy': 'Havolani nusxalash',
      'news.copied': 'Havola nusxalandi',
      'news.filter': 'Turkum boʻyicha saralash',
      'news.loading': 'Yuklanmoqda…',
      'news.pageEyebrow': 'Yangiliklar',
      'news.pageTitle': 'Yangiliklar va eʼlonlar',
      'news.pageLead': 'Maktabimiz hayotidagi voqealar, natijalar va muhim eʼlonlar — barchasi bir joyda.',

      'cat.all': 'Barchasi',
      'cat.results': 'Natijalar',
      'cat.events': 'Tadbirlar',
      'cat.announcements': 'Eʼlonlar',

      'gallery.eyebrow': 'Galereya',
      'gallery.previewTitle': 'Maktab hayotidan lavhalar',
      'gallery.viewAll': 'Butun galereyani koʻrish',
      'gallery.pageTitle': 'Fotogalereya',
      'gallery.pageLead': 'Darslar, tadbirlar va kundalik maktab hayotidan suratlar.',
      'gallery.filter': 'Turkum boʻyicha saralash',
      'gallery.empty': 'Bu turkumda hozircha surat yoʻq.',
      'gallery.error': 'Galereyani yuklab boʻlmadi. Sahifani yangilab koʻring.',
      'gallery.open': 'Kattalashtirib koʻrish',
      'gallery.count': '{n} ta surat',

      'gcat.all': 'Barchasi',
      'gcat.bino': 'Bino',
      'gcat.tadbirlar': 'Tadbirlar',
      'gcat.darslar': 'Darslar',
      'gcat.kutubxona': 'Kutubxona',
      'gcat.mehmonlar': 'Mehmonlar',

      'lb.dialog': 'Suratni koʻrish',
      'lb.close': 'Yopish',
      'lb.prev': 'Oldingi surat',
      'lb.next': 'Keyingi surat',

      'contact.eyebrow': 'Aloqa',
      'contact.title': 'Biz bilan bogʻlaning',
      'contact.lead': 'Savollaringiz boʻlsa, qoʻngʻiroq qiling yoki maktabimizga tashrif buyuring. Sizni doim mamnuniyat bilan kutamiz.',
      'contact.address': 'Manzil',
      'contact.phone': 'Telefon',
      'contact.email': 'Elektron pochta',
      'contact.social': 'Ijtimoiy tarmoqlar',
      'contact.directions': 'Yoʻnalishni koʻrish',
      'contact.call': 'Qoʻngʻiroq qilish',
      'contact.map': 'Maktabning xaritadagi joylashuvi',

      'motto.label': 'Maktab shiori',
      'motto.text': 'Qancha koʻp bilsang, shuncha koʻp bilmasligingni tushunasan.',

      'footer.pages': 'Sahifalar',
      'footer.contact': 'Aloqa',
      'footer.copy': '© 2026 Alisher Navoiy nomidagi IDUM',
      'footer.rights': 'Barcha huquqlar himoyalangan.',

      'about.pageEyebrow': 'Maktab haqida',
      'img.missing': 'Surat tez orada',
      'img.director': 'Maktab direktori Bobonazarov Dilshod',
      'img.building': 'Maktabning bosh binosi: bayroq, orkestr va safga tizilgan oʻquvchilar',
      'img.literary': 'Adabiy kecha: milliy liboslardagi oʻquvchilar sahnada',
      'img.gazebo': 'Atlas matolar bilan bezatilgan shiyponda ochiq havodagi dars',
      'img.drawing': 'Tasviriy sanʼat mashgʻuloti: oʻquvchilar ustoz bilan plakat chizmoqda',
      'img.library': 'Kutubxonada ustoz oʻquvchilarga kitob oʻqib bermoqda',
      'img.guests': 'Maktab zalida mehmonlar bilan suhbat',
      'img.english': 'Ingliz tili darsi: interaktiv doska va partalardagi bayroqchalar',

      'notfound.title': 'Sahifa topilmadi',
      'notfound.text': 'Siz izlagan sahifa mavjud emas yoki koʻchirilgan.',

      'meta.home.title': 'Alisher Navoiy nomidagi IDUM — Navoiy shahri',
      'meta.home.desc': 'Alisher Navoiy nomidagi oʻzbek tili va adabiyotiga ixtisoslashtirilgan davlat umumtaʼlim maktabi (IDUM), Navoiy shahri. 3190 oʻquvchi, 257 oʻqituvchi, 110 sinf.',
      'meta.about.title': 'Maktab haqida — Alisher Navoiy nomidagi IDUM',
      'meta.about.desc': 'Maktab tarixi, taʼlim modeli, natijalari va oʻquvchilar hayoti: 2017-yilda tashkil topgan, 2019-yildan IDUM maqomida.',
      'meta.news.title': 'Yangiliklar — Alisher Navoiy nomidagi IDUM',
      'meta.news.desc': 'Alisher Navoiy nomidagi IDUM yangiliklari, natijalari va eʼlonlari.',
      'meta.gallery.title': 'Galereya — Alisher Navoiy nomidagi IDUM',
      'meta.gallery.desc': 'Alisher Navoiy nomidagi IDUM hayotidan suratlar: bino, darslar, tadbirlar, kutubxona va mehmonlar.',
      'meta.notfound.title': 'Sahifa topilmadi — Alisher Navoiy nomidagi IDUM',
      'meta.notfound.desc': 'Sahifa topilmadi.',

      months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
    },

    en: {
      'a11y.skip': 'Skip to main content',
      'a11y.menuOpen': 'Open menu',
      'a11y.menuClose': 'Close menu',
      'a11y.lang': 'Choose language',
      'a11y.home': 'Home page',
      'a11y.mainNav': 'Main navigation',
      'a11y.newTab': '(opens in a new tab)',

      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.news': 'News',
      'nav.gallery': 'Gallery',
      'nav.contact': 'Contact',

      'hero.eyebrow': 'Navoiy, Uzbekistan · Since 2017',
      'hero.title': 'Alisher Navoiy Specialized School',
      'hero.subtitle': 'A specialized state school for Uzbek language and literature (IDUM)',
      'hero.btnAbout': 'About the school',
      'hero.btnGallery': 'Gallery',
      'hero.scroll': 'Scroll down',

      'stats.label': 'The school in numbers',
      'stats.students': 'students',
      'stats.teachers': 'teachers',
      'stats.classes': 'classes',
      'stats.founded': 'year founded',

      'lang.eyebrow': 'What sets us apart',
      'lang.title': 'Languages open doors to the world',
      'lang.lead': 'Alongside a deep love for the Uzbek language and its literature, our school places special emphasis on mastering foreign languages — and the results speak for themselves.',
      'lang.certLabel': 'More than 70% of our grade 10–11 graduates hold B2 and C1 level certificates in English and Russian',
      'lang.english': 'English',
      'lang.russian': 'Russian',
      'lang.satTitle': 'SAT results',
      'lang.satYear': 'In the past year',
      'lang.sat58': 'students achieved high SAT scores',
      'lang.sat17': 'of them scored 1500 or higher',
      'lang.photo': 'An English lesson',

      'results.eyebrow': 'Academic year 2025–2026',
      'results.title': 'Our graduates, on to new horizons',
      'results.lead': 'Every graduate leaves with knowledge — and with the drive to keep learning.',
      'results.graduates': 'graduates',
      'results.admitted': 'admitted to higher education institutions',
      'results.ring': '203 of 291 graduates were admitted to higher education institutions',
      'results.of': 'of',

      'director.eyebrow': 'Welcome',
      'director.title': 'A welcome from the school',
      'director.name': 'Dilshod Bobonazarov',
      'director.role': 'School Director',
      'director.photo': 'Director’s photo coming soon',

      'news.eyebrow': 'School life',
      'news.latest': 'Latest news',
      'news.all': 'All news',
      'news.readMore': 'Read more',
      'news.loadMore': 'Show more',
      'news.back': 'Back to all news',
      'news.empty': 'There is no news in this category yet.',
      'news.error': 'We couldn’t load the news. Please refresh the page.',
      'news.errorLocal': 'Tip: open the site through a local server (see the one-line command in README.md).',
      'news.notFound': 'This news item was not found or has been removed.',
      'news.more': 'More news',
      'news.sample': 'Sample',
      'news.share': 'Share on Facebook',
      'news.copy': 'Copy link',
      'news.copied': 'Link copied',
      'news.filter': 'Filter by category',
      'news.loading': 'Loading…',
      'news.pageEyebrow': 'News',
      'news.pageTitle': 'News & announcements',
      'news.pageLead': 'Events, achievements and important announcements from our school — all in one place.',

      'cat.all': 'All',
      'cat.results': 'Results',
      'cat.events': 'Events',
      'cat.announcements': 'Announcements',

      'gallery.eyebrow': 'Gallery',
      'gallery.previewTitle': 'Moments from school life',
      'gallery.viewAll': 'View the full gallery',
      'gallery.pageTitle': 'Photo gallery',
      'gallery.pageLead': 'Photographs from our lessons, events and everyday school life.',
      'gallery.filter': 'Filter by category',
      'gallery.empty': 'There are no photos in this category yet.',
      'gallery.error': 'We couldn’t load the gallery. Please refresh the page.',
      'gallery.open': 'View larger',
      'gallery.count': '{n} photos',

      'gcat.all': 'All',
      'gcat.bino': 'Building',
      'gcat.tadbirlar': 'Events',
      'gcat.darslar': 'Lessons',
      'gcat.kutubxona': 'Library',
      'gcat.mehmonlar': 'Guests',

      'lb.dialog': 'Photo viewer',
      'lb.close': 'Close',
      'lb.prev': 'Previous photo',
      'lb.next': 'Next photo',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Get in touch',
      'contact.lead': 'If you have a question, give us a call or visit the school. You are always welcome.',
      'contact.address': 'Address',
      'contact.phone': 'Phone',
      'contact.email': 'Email',
      'contact.social': 'Social media',
      'contact.directions': 'Get directions',
      'contact.call': 'Call us',
      'contact.map': 'School location on the map',

      'motto.label': 'School motto',
      'motto.text': 'The more you know, the more you realize how much you don’t know.',

      'footer.pages': 'Pages',
      'footer.contact': 'Contact',
      'footer.copy': '© 2026 Alisher Navoiy nomidagi IDUM',
      'footer.rights': 'All rights reserved.',

      'about.pageEyebrow': 'About the school',
      'img.missing': 'Photo coming soon',
      'img.director': 'School Director Dilshod Bobonazarov',
      'img.building': 'The school’s main building with the flag, a brass band and students lined up',
      'img.literary': 'A literary evening: students in national dress on stage',
      'img.gazebo': 'An outdoor lesson in a gazebo decorated with ikat fabric',
      'img.drawing': 'Art class: students drawing posters with their teacher',
      'img.library': 'A teacher reading a book to students in the library',
      'img.guests': 'Guests in conversation in the school hall',
      'img.english': 'An English lesson with a smart board and flags on the desks',

      'notfound.title': 'Page not found',
      'notfound.text': 'The page you are looking for doesn’t exist or has been moved.',

      'meta.home.title': 'Alisher Navoiy Specialized School (IDUM) — Navoiy, Uzbekistan',
      'meta.home.desc': 'Alisher Navoiy Specialized State School for Uzbek Language and Literature (IDUM) in Navoiy, Uzbekistan. 3,190 students, 257 teachers, 110 classes.',
      'meta.about.title': 'About the school — Alisher Navoiy IDUM',
      'meta.about.desc': 'Our history, education model, results and student life: founded in 2017, a specialized school (IDUM) since 2019.',
      'meta.news.title': 'News — Alisher Navoiy IDUM',
      'meta.news.desc': 'News, results and announcements from Alisher Navoiy Specialized School (IDUM), Navoiy.',
      'meta.gallery.title': 'Gallery — Alisher Navoiy IDUM',
      'meta.gallery.desc': 'Photos from Alisher Navoiy IDUM: the building, lessons, events, the library and guests.',
      'meta.notfound.title': 'Page not found — Alisher Navoiy IDUM',
      'meta.notfound.desc': 'Page not found.',

      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  };

  var cfg = window.SCHOOL_CONFIG;
  var STORAGE_KEY = 'idum-lang';
  var listeners = [];
  var root = document.documentElement;
  var lang = cfg.languages.indexOf(root.lang) > -1 ? root.lang : cfg.defaultLang;

  function t(key, vars) {
    var s = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS[cfg.defaultLang][key];
    if (s === undefined) return key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }

  /** Localised field of a data object: field(item, 'title') → item.title_en / item.title_uz */
  function field(obj, base) {
    return obj[base + '_' + lang] || obj[base + '_' + cfg.defaultLang] || '';
  }

  /** Localised value of a {uz:…, en:…} object (used by config.js). */
  function pick(obj) {
    return obj ? obj[lang] || obj[cfg.defaultLang] || '' : '';
  }

  // Thousands separator: a thin non-breaking space in Uzbek (3 190), a comma in English (3,190).
  function formatNumber(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '\u202F');
  }

  function formatDate(iso) {
    var p = String(iso).split('-');
    if (p.length !== 3) return iso;
    var d = parseInt(p[2], 10), m = t('months')[parseInt(p[1], 10) - 1];
    return lang === 'uz' ? p[0] + '-yil ' + d + '-' + m : d + ' ' + m + ' ' + p[0];
  }

  function apply(scope) {
    scope = scope || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
  }

  function setMeta(title, desc) {
    document.title = title;
    [['name', 'description'], ['property', 'og:description'], ['name', 'twitter:description']].forEach(function (m) {
      var el = document.querySelector('meta[' + m[0] + '="' + m[1] + '"]');
      if (el) el.setAttribute('content', desc);
    });
    [['property', 'og:title'], ['name', 'twitter:title']].forEach(function (m) {
      var el = document.querySelector('meta[' + m[0] + '="' + m[1] + '"]');
      if (el) el.setAttribute('content', title);
    });
    var loc = document.querySelector('meta[property="og:locale"]');
    if (loc) loc.setAttribute('content', lang === 'uz' ? 'uz_UZ' : 'en_US');
  }

  function updatePageMeta() {
    var page = document.body && document.body.getAttribute('data-page');
    if (page) setMeta(t('meta.' + page + '.title'), t('meta.' + page + '.desc'));
  }

  function setLang(next) {
    if (cfg.languages.indexOf(next) === -1) return;
    lang = next;
    root.lang = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage blocked: ignore */ }
    apply();
    updatePageMeta();
    listeners.forEach(function (fn) { fn(next); });
  }

  window.i18n = {
    t: t,
    field: field,
    pick: pick,
    apply: apply,
    setLang: setLang,
    setMeta: setMeta,
    updatePageMeta: updatePageMeta,
    formatNumber: formatNumber,
    formatDate: formatDate,
    onChange: function (fn) { listeners.push(fn); },
    get lang() { return lang; }
  };
})();
