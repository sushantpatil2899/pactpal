"""Cuts a product out onto white (Priya's two finished photos). Run with rembg 2.0.67 (isnet-general-use)."""
import sys
from rembg import remove, new_session
from PIL import Image, ImageOps, ImageEnhance
src, dst = sys.argv[1], sys.argv[2]
session = new_session("isnet-general-use")
im = Image.open(src).convert("RGB")
im = ImageEnhance.Brightness(ImageOps.autocontrast(im, cutoff=1)).enhance(1.05)
cut = remove(im, session=session)
box = cut.getbbox(); cut = cut.crop(box)
side = int(max(cut.size) * 1.25)
canvas = Image.new("RGB", (side, side), (255, 255, 255))
canvas.paste(cut, ((side - cut.width) // 2, (side - cut.height) // 2), cut)
canvas.resize((1200, 1200)).save(dst, quality=90)
