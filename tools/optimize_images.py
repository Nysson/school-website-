#!/usr/bin/env python3
"""
Create web-optimized copies of every photo in /images.

    pip install pillow
    python3 tools/optimize_images.py

For each images/<name>.jpg|jpeg|png it writes
    images/optimized/<name>.jpg   (max 1600px wide, quality 80, progressive)
    images/optimized/<name>.webp  (max 1600px wide, quality 80)
Originals are never modified. EXIF orientation is applied so photos are not sideways.
Existing optimized files are skipped unless --force is given.
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = SRC / "optimized"
MAX_WIDTH = 1600
QUALITY = 80


def main(force=False):
    OUT.mkdir(exist_ok=True)
    photos = [p for p in sorted(SRC.iterdir()) if p.suffix.lower() in (".jpg", ".jpeg", ".png")]
    if not photos:
        print("No photos found in", SRC)
        return
    for src in photos:
        jpg, webp = OUT / (src.stem + ".jpg"), OUT / (src.stem + ".webp")
        if not force and jpg.exists() and webp.exists():
            print("skip  ", src.name)
            continue
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            if im.width > MAX_WIDTH:
                im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
            im.save(jpg, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            im.save(webp, "WEBP", quality=QUALITY, method=6)
            print("ok    ", src.name, "→", f"{im.width}x{im.height}")


if __name__ == "__main__":
    main(force="--force" in sys.argv)
