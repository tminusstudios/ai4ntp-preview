#!/usr/bin/env python3
"""
AI4NTP Episode 002 · YouTube Thumbnail Generator (1280x720)

Reuses the OG-image brand style but recomposed for a small-view YouTube
thumbnail: fewer words, bigger type, the REPLAY badge, three headshots.

Run: python3 generate-thumbnail.py
Output: thumbnail.jpg (1280x720, < 2 MB)
"""

from PIL import Image, ImageDraw, ImageFont, ImageOps
import os

# ---- canvas ----
W, H = 1280, 720
INK = (15, 17, 19)
PAPER = (244, 241, 234)
CREAM = (250, 247, 240)
SIGNAL = (212, 255, 58)
RUST = (196, 71, 28)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")
OUTPUT = os.path.join(BASE_DIR, "thumbnail.jpg")

GEORGIA = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
GEORGIA_BOLD_ITALIC = "/System/Library/Fonts/Supplemental/Georgia Bold Italic.ttf"
HELVETICA = "/System/Library/Fonts/Helvetica.ttc"


def f(path, size, index=None):
    return ImageFont.truetype(path, size) if index is None else ImageFont.truetype(path, size, index=index)


def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def circle_headshot(path, d):
    img = Image.open(path).convert("RGB")
    img = ImageOps.fit(img, (d, d), centering=(0.5, 0.32))
    img = ImageOps.grayscale(img).convert("RGB")
    mask = Image.new("L", (d, d), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, d, d), fill=255)
    return img, mask


img = Image.new("RGB", (W, H), PAPER)
draw = ImageDraw.Draw(img)

# subtle paper grain via a thin border frame
draw.rectangle((24, 24, W - 24, H - 24), outline=(0, 0, 0), width=0)

# ---- top-left wordmark: ai4ntp (yellow box on 4) ----
mark = f(GEORGIA_BOLD, 50)
x = 56
y = 48
x = tracked(draw, (x, y), "ai", mark, INK)
# yellow "4"
fw = draw.textlength("4", font=mark)
draw.rectangle((x - 2, y + 6, x + fw + 10, y + 58), fill=SIGNAL)
draw.text((x + 4, y), "4", font=mark, fill=INK)
x = x + fw + 16
tracked(draw, (x, y), "ntp", mark, INK)

# ---- top-right: REPLAY · EP 002 ----
lbl = f(HELVETICA, 24, index=1)  # Helvetica Bold
tag = "EP 002"
rep = "REPLAY"
sep = "   ·   "
total = draw.textlength(rep, font=lbl) + draw.textlength(sep, font=lbl) + draw.textlength(tag, font=lbl)
rx = W - 56 - total
# red dot
draw.ellipse((rx - 24, 60, rx - 8, 76), fill=RUST)
cx = rx
draw.text((cx, 56), rep, font=lbl, fill=RUST); cx += draw.textlength(rep, font=lbl)
draw.text((cx, 56), sep, font=lbl, fill=INK); cx += draw.textlength(sep, font=lbl)
draw.text((cx, 56), tag, font=lbl, fill=INK)

# ---- kicker ----
kick = f(HELVETICA, 28, index=1)
tracked(draw, (60, 196), "WE BUILT", kick, RUST, tracking=6)

# ---- headline (two lines, big) ----
hl = f(GEORGIA_BOLD, 120)
hli = f(GEORGIA_BOLD_ITALIC, 120)
line1_y = 238
line2_y = 372
draw.text((56, line1_y), "A COMPANY", font=hl, fill=INK)
# line 2: highlighted "IN 60 MIN" + period
seg = "IN 60 MIN"
w_seg = draw.textlength(seg, font=hli)
pad = 14
draw.rectangle((56 - pad + 6, line2_y + 18, 56 + w_seg + pad, line2_y + 126), fill=SIGNAL)
draw.text((56, line2_y), seg, font=hli, fill=INK)
draw.text((56 + w_seg + 6, line2_y), ".", font=hl, fill=INK)

# ---- bottom rule ----
draw.line((56, 566, W - 56, 566), fill=(0, 0, 0, 60), width=2)

# ---- headshots (bottom-left) ----
d = 92
hs_files = ["ian-kilpatrick.jpg", "alec-saluga.jpg", "justin-novak.jpg"]
hx = 56
hy = 592
for i, fn in enumerate(hs_files):
    p = os.path.join(IMAGES_DIR, fn)
    if not os.path.exists(p):
        continue
    chip, mask = circle_headshot(p, d)
    px = hx + i * (d - 22)
    # cream ring
    ring = Image.new("L", (d + 8, d + 8), 0)
    ImageDraw.Draw(ring).ellipse((0, 0, d + 8, d + 8), fill=255)
    img.paste(CREAM, (px - 4, hy - 4), ring)
    img.paste(chip, (px, hy), mask)

# ---- tagline (bottom-right) ----
tg = f(HELVETICA, 22, index=1)
t1 = "BUILT LIVE WITH AI"
t2 = "GOTOBUILD · AI4NTP.COM"
draw.text((W - 56 - draw.textlength(t1, font=tg), 596), t1, font=tg, fill=INK)
tg2 = f(HELVETICA, 18)
draw.text((W - 56 - draw.textlength(t2, font=tg2), 628), t2, font=tg2, fill=(90, 88, 80))

img.save(OUTPUT, "JPEG", quality=90)
print("Saved:", OUTPUT)
print("Size:", img.size)
print("File size:", round(os.path.getsize(OUTPUT) / 1024), "KB")
