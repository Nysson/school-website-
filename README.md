# Alisher Navoiy nomidagi IDUM — official website

Bilingual (Uzbek / English) static website for the Alisher Navoiy Specialized State School for
Uzbek Language and Literature (IDUM), Navoiy. Plain HTML + CSS + vanilla JS. No build step, no dependencies.

## 1. Run locally
The news and gallery are loaded from JSON with `fetch()`, which browsers block for files opened
directly (`file://`). Start a tiny local server from the project folder:

```bash
python3 -m http.server 8000
```
Then open <http://localhost:8000>. (Pages still open without a server, but news/gallery show a friendly message.)

## 2. Photos ⚠️ (still to do)
The repository did not contain any photos yet. Every image slot currently shows an ornamental
placeholder, and the real photos will show up automatically once they are added:

1. Put the photos in `/images` with these exact names:
   `building-entrance.jpg`, `literary-event.jpg`, `gazebo-lesson.jpg`, `drawing-class.jpg`,
   `library-reading.jpg`, `guests-hall.jpg`, `english-lesson.jpg`.
2. Create optimized copies (≤1600 px, JPEG + WebP, quality 80). The originals are never changed:
   ```bash
   pip install pillow
   python3 tools/optimize_images.py
   ```
3. Check the captions in `data/gallery.json` and the `img.*` alt texts in `js/i18n.js` against the real photos.
   They were written from the photo descriptions in the brief.

Loading order for each image: `images/optimized/<name>.webp` → `images/optimized/<name>.jpg` → `images/<name>.jpg` → placeholder.

### Add a new gallery photo
1. Copy the file into `/images` with a short kebab-case name (e.g. `sports-day.jpg`) and run the optimizer.
2. Add an entry to `data/gallery.json`:
```json
{ "file": "sports-day.jpg", "title_uz": "…", "title_en": "…", "category": "tadbirlar", "featured": false }
```
Categories: `bino`, `tadbirlar`, `darslar`, `kutubxona`, `mehmonlar`. `featured: true` makes the tile wide and
puts it first in the home-page mosaic.

## 3. Add news
Only `data/news.json` needs editing (plus an image in `/images`). Add an object:
```json
{
  "id": "unique-short-id",
  "date": "2026-10-15",
  "category": "events",
  "image": "literary-event.jpg",
  "title_uz": "…", "title_en": "…",
  "summary_uz": "…", "summary_en": "…",
  "body_uz": "First paragraph.\n\nSecond paragraph.",
  "body_en": "First paragraph.\n\nSecond paragraph."
}
```
- Categories: `results`, `events`, `announcements`.
- News is sorted newest first automatically. The home page shows the 3 newest items.
- Detail page: `news.html?id=unique-short-id`.
- **The 6 current items are samples** (`"sample": true`, shown with a “Namuna / Sample” badge) based only on
  the official facts. Replace or delete them before launch.
- Tip: validate the JSON at <https://jsonlint.com> after editing. One missing comma breaks the list.

## 4. Edit contact details, add email / Instagram / Telegram
Everything is in **`js/config.js`**: address, phone, map query and social links. Fill in `email`,
`social.instagram` or `social.telegram` and they appear in the footer and contact section automatically.
Empty fields stay hidden.

## 5. Texts and languages
- UI strings: `js/i18n.js` (`uz` and `en` dictionaries), used with `data-i18n="key"` attributes.
- Long texts (About page, director’s welcome) are in the HTML as paired blocks
  `<div data-lang="uz">…</div><div data-lang="en">…</div>`.
- Uzbek uses `ʻ` (U+02BB) in oʻ/gʻ and `ʼ` (U+02BC) for the tutuq belgisi.
- **Adding Russian:** add a `ru` dictionary in `js/i18n.js`, add `'ru'` to `languages` in `js/config.js`,
  add `*_ru` fields to the JSON files, add `ru` blocks in the HTML and one CSS line in `css/style.css` §2.
- The director’s welcome on the home page is a **DRAFT** (marked with an HTML comment) and must be approved by the director.
  The director’s photo placeholder is marked with a `TODO` comment.

## 6. Deploy
Upload the whole folder to any static host.
- **GitHub Pages:** Settings → Pages → Deploy from branch → select the branch and `/ (root)`.
  The site will be at `https://nysson.github.io/school-website-/`.
- **Netlify:** drag and drop the folder at <https://app.netlify.com/drop>.
- **Shared hosting:** upload via FTP into `public_html`.

**If you move to a real domain,** replace `https://nysson.github.io/school-website-/` in `js/config.js`,
in the `<head>` of every HTML page (canonical, og:url, og:image, JSON-LD), and in `sitemap.xml` and `robots.txt`.

## 7. Structure
```
index.html about.html news.html gallery.html 404.html
css/style.css        design tokens + all styles (sections numbered in the header comment)
js/config.js         contact data            js/i18n.js    strings + translation engine
js/main.js           header/footer, menu, language switch, animations, image fallbacks
js/news.js           news list/detail        js/gallery.js gallery + home mosaic
js/lightbox.js       accessible lightbox
data/news.json  data/gallery.json
images/ (originals)  images/optimized/ (generated)  assets/ (logo, favicon, ornaments)
tools/optimize_images.py
```
`assets/logo.svg` and `assets/favicon.svg` are placeholder emblems. Replace them with the official logo when available.
