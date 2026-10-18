#!/usr/bin/env python3
"""
Procedural, brand-palette architectural scenes for Serendib Condos.

The supplied ZIP did not contain photography, so these illustrated scenes stand in for
project imagery. They use only tints/shades of the three brand colours
(navy #0D1C31, gold #C9A66B, white #FFFFFF). Replace the generated files in
public/assets/images/ with real, licensed photography whenever it is available –
the filenames are referenced from src/data/site.js and src/data/properties.js.

Usage (optional – the generated JPEGs are already committed):
    python3 tools/generate-images.py            # needs: pillow, numpy
"""
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

NAVY = np.array([13, 28, 49], dtype=np.float32)
GOLD = np.array([201, 166, 107], dtype=np.float32)
WHITE = np.array([255, 255, 255], dtype=np.float32)
INK = np.array([5, 11, 21], dtype=np.float32)  # navy shaded toward black

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "images")
SS = 2  # supersampling factor


def mix(a, b, t):
    return a * (1 - t) + b * t


def rgb(c):
    return tuple(int(max(0, min(255, v))) for v in c)


def vgrad(w, h, stops):
    """stops: [(pos 0..1, colour)] -> float image (h, w, 3)."""
    ys = np.linspace(0, 1, h)[:, None]
    out = np.zeros((h, 1, 3), dtype=np.float32)
    pos = [s[0] for s in stops]
    for ch in range(3):
        out[:, 0, ch] = np.interp(ys[:, 0], pos, [s[1][ch] for s in stops])
    return np.repeat(out, w, axis=1)


def glow(img, cx, cy, radius, colour, strength):
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - cx) / radius) ** 2 + ((yy - cy) / radius) ** 2)
    a = np.clip(1 - d, 0, 1) ** 2.2 * strength
    img += (colour[None, None, :] - img) * a[..., None]
    return img


def to_pil(arr):
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def ridge_points(w, base, amp, seed, freq=1.0, x0=0, x1=None):
    r = random.Random(seed)
    x1 = w if x1 is None else x1
    ph = [r.uniform(0, 6.28) for _ in range(4)]
    pts = []
    for x in range(x0, x1 + 8, 8):
        t = x / w
        y = (
            math.sin(t * 5 * freq + ph[0]) * 0.5
            + math.sin(t * 11 * freq + ph[1]) * 0.28
            + math.sin(t * 23 * freq + ph[2]) * 0.14
            + math.sin(t * 47 * freq + ph[3]) * 0.07
        )
        pts.append((x, base - y * amp))
    return pts


def draw_ridge(layer, w, h, base, amp, colour, seed, freq=1.0, alpha=255):
    d = ImageDraw.Draw(layer)
    pts = ridge_points(w, base, amp, seed, freq)
    d.polygon(pts + [(w + 8, h), (0, h)], fill=rgb(colour) + (alpha,))


def tower(d, x, base, w, h, body, lit, rng, rim=None, lit_prob=0.35, win=(10, 16), style="slab", crown=True):
    """Elevation of a condo tower, drawn on an RGBA ImageDraw."""
    top = base - h
    d.rectangle([x, top, x + w, base], fill=rgb(body) + (255,))
    # side shading (darker right edge) + rim light on the sun-facing side
    d.rectangle([x + w * 0.78, top, x + w, base], fill=rgb(mix(body, INK, 0.45)) + (255,))
    if rim is not None:
        d.rectangle([x, top, x + max(2, w * 0.035), base], fill=rgb(rim) + (255,))
    ww, wh = win
    cols = max(2, int(w // (ww * 1.6)))
    rows = max(3, int(h // (wh * 1.55)))
    gx = w / cols
    gy = h / rows
    for r in range(rows):
        for c in range(cols):
            wx = x + c * gx + gx * 0.2
            wy = top + r * gy + gy * 0.22
            if rng.random() < lit_prob:
                col = mix(lit, WHITE, rng.random() * 0.25)
                d.rectangle([wx, wy, wx + gx * 0.58, wy + gy * 0.5], fill=rgb(col) + (235,))
            else:
                d.rectangle([wx, wy, wx + gx * 0.58, wy + gy * 0.5], fill=rgb(mix(body, NAVY, 0.4) * 0.92) + (255,))
        if style == "balcony" and r % 2 == 0:
            d.rectangle([x, top + r * gy + gy * 0.78, x + w, top + r * gy + gy * 0.86], fill=rgb(mix(body, GOLD, 0.16)) + (255,))
    if crown:
        d.rectangle([x - w * 0.03, top - h * 0.012, x + w * 1.03, top + h * 0.004], fill=rgb(mix(body, GOLD, 0.25)) + (255,))
        d.rectangle([x + w * 0.2, top - h * 0.045, x + w * 0.62, top - h * 0.012], fill=rgb(mix(body, INK, 0.2)) + (255,))


def crane(d, x, base, h, colour, jib=0.55):
    c = rgb(colour) + (255,)
    d.line([(x, base), (x, base - h)], fill=c, width=5)
    d.line([(x - h * 0.12, base - h), (x + h * jib, base - h)], fill=c, width=4)
    d.line([(x, base - h * 1.08), (x + h * jib * 0.9, base - h)], fill=c, width=2)
    d.line([(x, base - h * 1.08), (x - h * 0.14, base - h)], fill=c, width=2)
    d.line([(x + h * jib * 0.8, base - h), (x + h * jib * 0.8, base - h * 0.78)], fill=c, width=2)
    for k in range(10):
        y0 = base - h + k * h / 10
        d.line([(x - 5, y0), (x + 5, y0 + h / 10)], fill=c, width=1)


def palm(d, x, base, h, colour, lean, rng, scale=1.0):
    c = rgb(colour) + (255,)
    cx0, cy0 = x, base
    tip = (x + lean * h, base - h)
    ctrl = (x + lean * h * 0.15, base - h * 0.6)
    pts = []
    for i in range(0, 21):
        t = i / 20
        px = (1 - t) ** 2 * cx0 + 2 * (1 - t) * t * ctrl[0] + t**2 * tip[0]
        py = (1 - t) ** 2 * cy0 + 2 * (1 - t) * t * ctrl[1] + t**2 * tip[1]
        pts.append((px, py))
    for i in range(len(pts) - 1):
        wdt = max(2, int((14 - 9 * i / 20) * scale))
        d.line([pts[i], pts[i + 1]], fill=c, width=wdt)
    # fronds
    for k in range(11):
        ang = -math.pi + k * (math.pi / 10) + rng.uniform(-0.12, 0.12)
        length = h * rng.uniform(0.34, 0.48)
        droop = rng.uniform(0.3, 0.55)
        fp = []
        for i in range(0, 13):
            t = i / 12
            fx = tip[0] + math.cos(ang) * length * t
            fy = tip[1] + math.sin(ang) * length * t * 0.55 + droop * length * t * t
            fp.append((fx, fy))
        side = []
        for (fx, fy), i in zip(fp, range(len(fp))):
            t = i / 12
            side.append((fx, fy - (1 - t) * 7 * scale - 1))
        back = [(fx, fy + (1 - i / 12) * 7 * scale + 1) for i, (fx, fy) in enumerate(fp)][::-1]
        d.polygon(side + back, fill=c)


def sea(img, y0, deep, shallow):
    h, w, _ = img.shape
    g = vgrad(w, h - y0, [(0, shallow), (1, deep)])
    img[y0:, :, :] = g
    return img


def sun_reflection(img, y0, cx, colour, width, strength, seed=3):
    h, w, _ = img.shape
    r = np.random.RandomState(seed)
    yy = np.arange(y0, h)
    for i, y in enumerate(yy):
        t = (y - y0) / max(1, h - y0)
        wv = width * (0.35 + t * 1.2)
        jitter = math.sin(y * 0.09 + r.rand() * 6) * 6 * (0.3 + t)
        a0 = max(0.0, 1 - t * 1.05) * strength
        if a0 <= 0:
            continue
        xs = np.arange(max(0, int(cx - wv * 2)), min(w, int(cx + wv * 2)))
        k = np.exp(-(((xs - cx - jitter) / wv) ** 2))
        ripple = 0.55 + 0.45 * np.sin(xs * 0.22 + y * 0.8 + r.rand() * 3)
        a = (k * ripple * a0)[:, None]
        img[y, xs, :] += (colour[None, :] - img[y, xs, :]) * a


def reflect(base_rgba, y0, strength=0.5, blur=6, ripple=5):
    """Mirror everything above y0 into the water below it."""
    w, h = base_rgba.size
    top = base_rgba.crop((0, max(0, 2 * y0 - h), w, y0)).transpose(Image.FLIP_TOP_BOTTOM)
    arr = np.array(top.convert("RGBA")).astype(np.float32)
    hh = arr.shape[0]
    for y in range(hh):
        sh = int(math.sin(y * 0.35) * ripple * (0.3 + y / hh))
        arr[y] = np.roll(arr[y], sh, axis=0)
    refl = Image.fromarray(arr.astype(np.uint8), "RGBA").filter(ImageFilter.GaussianBlur(blur))
    fade = np.linspace(strength, 0.0, hh)[:, None]
    a = np.array(refl).astype(np.float32)
    a[..., 3] = a[..., 3] * fade
    return Image.fromarray(a.astype(np.uint8), "RGBA"), y0


def haze(layer_img, y_from, y_to, colour, strength):
    arr = np.array(layer_img).astype(np.float32)
    h, w, _ = arr.shape
    for y in range(max(0, int(y_from)), min(h, int(y_to))):
        t = 1 - abs((y - (y_from + y_to) / 2) / ((y_to - y_from) / 2 + 1e-6))
        a = max(0.0, t) ** 1.2 * strength
        arr[y, :, :3] += (colour[None, :] - arr[y, :, :3]) * a
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")


def finish(img, grain=5.5, vignette=0.34, seed=1):
    arr = np.array(img.convert("RGB")).astype(np.float32)
    h, w, _ = arr.shape
    r = np.random.RandomState(seed)
    arr += r.normal(0, grain, (h, w, 1))
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    arr *= (1 - vignette * np.clip(d - 0.35, 0, 1.2) ** 1.6)[..., None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def bloom(img, thresh=185, radius=60, gain=0.55):
    arr = np.array(img.convert("RGB")).astype(np.float32)
    lum = arr.mean(axis=2)
    mask = np.clip((lum - thresh) / (255 - thresh), 0, 1)
    b = Image.fromarray((mask * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(radius))
    bm = np.array(b).astype(np.float32)[..., None] / 255.0
    arr += (mix(GOLD, WHITE, 0.4)[None, None, :] - arr) * bm * gain
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def houses_row(d, w, y_fn, x0, x1, size, rng, tint, lit_col, density=1.0, flat=True):
    x = x0
    while x < x1:
        bw = int(size * rng.uniform(0.8, 1.7))
        bh = int(size * rng.uniform(0.55, 1.1))
        y = int(y_fn(x))
        body = mix(tint, WHITE, rng.uniform(0.0, 0.18))
        d.rectangle([x, y - bh, x + bw, y + 2], fill=rgb(body) + (255,))
        d.rectangle([x + bw * 0.74, y - bh, x + bw, y + 2], fill=rgb(mix(body, INK, 0.4)) + (255,))
        d.rectangle([x - 2, y - bh - 3, x + bw + 2, y - bh + 1], fill=rgb(mix(body, GOLD, 0.35)) + (255,))
        if rng.random() < 0.7:
            d.rectangle([x + bw * 0.14, y - bh * 0.66, x + bw * 0.52, y - bh * 0.32], fill=rgb(lit_col) + (225,))
        x += bw + int(size * rng.uniform(0.25, 0.9) / density)


def scene(kind, W, H, seed=1, sun=0.62, tod="dusk"):
    """Compose a scene. kind: skyline | coast | hill | harbour | construction | sunrise."""
    rng = random.Random(seed)
    w, h = W * SS, H * SS
    horizon = int(h * (0.56 if kind in ("coast", "sunrise") else 0.60))

    if tod == "dusk":
        stops = [(0, NAVY), (0.42, mix(NAVY, WHITE, 0.10)), (0.7, mix(NAVY, GOLD, 0.5)), (0.9, mix(GOLD, WHITE, 0.22)), (1, mix(GOLD, WHITE, 0.66))]
        shallow, deep = mix(NAVY, GOLD, 0.58), mix(NAVY, INK, 0.25)
    elif tod == "night":
        stops = [(0, mix(NAVY, INK, 0.45)), (0.6, NAVY), (0.9, mix(NAVY, GOLD, 0.42)), (1, mix(NAVY, GOLD, 0.62))]
        shallow, deep = mix(NAVY, GOLD, 0.4), mix(NAVY, INK, 0.45)
    else:
        stops = [(0, NAVY), (0.45, mix(NAVY, GOLD, 0.3)), (0.78, mix(GOLD, WHITE, 0.3)), (1, mix(GOLD, WHITE, 0.72))]
        shallow, deep = mix(GOLD, NAVY, 0.45), mix(NAVY, INK, 0.2)
    sky = vgrad(w, horizon, stops)
    img = np.zeros((h, w, 3), dtype=np.float32)
    img[:horizon] = sky
    sx = int(w * sun)
    k = 1.0 if tod != "night" else 0.55
    glow(img, sx, horizon - int(h * 0.01), h * 0.7, mix(GOLD, WHITE, 0.4), 0.8 * k)
    glow(img, sx, horizon - int(h * 0.01), h * 0.12, WHITE, 0.75 * k)
    sea(img, horizon, deep, shallow)
    sun_reflection(img, horizon, sx, mix(GOLD, WHITE, 0.6), w * 0.03, 0.95 * k, seed)

    base = to_pil(img)
    cl = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cl)
    for _ in range(9):
        cx_, cy_ = rng.randrange(0, w), int(horizon * rng.uniform(0.25, 0.85))
        cw_, ch_ = int(w * rng.uniform(0.12, 0.34)), int(h * rng.uniform(0.008, 0.02))
        cd.ellipse([cx_ - cw_, cy_ - ch_, cx_ + cw_, cy_ + ch_], fill=rgb(mix(GOLD, WHITE, 0.4)) + (int(70 if tod != "night" else 28),))
    base = Image.alpha_composite(base, cl.filter(ImageFilter.GaussianBlur(26 * SS)))
    if tod == "night":
        dd = ImageDraw.Draw(base)
        for _ in range(160):
            x, y = rng.randrange(w), rng.randrange(int(horizon * 0.7))
            dd.ellipse([x, y, x + 2, y + 2], fill=(255, 255, 255, rng.randrange(80, 210)))

    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    dark = mix(NAVY, INK, 0.72)
    mid = mix(NAVY, INK, 0.30)
    lit = mix(GOLD, WHITE, 0.22)
    water_line = horizon  # where reflections start

    if kind == "hill":
        for i in range(6):
            t = i / 5
            col = mix(mix(NAVY, GOLD, 0.45 * (1 - t) + 0.05), INK, 0.12 + 0.55 * t)
            draw_ridge(layer, w, h, h * (0.44 + t * 0.10), h * (0.10 + 0.05 * t), col, seed * 7 + i, freq=0.7 + i * 0.22)
        # terraced settlements climbing the slope
        for tier in range(7):
            ty = h * (0.60 + tier * 0.048)
            tint = mix(mix(NAVY, WHITE, 0.5 - tier * 0.07), INK, 0.12 + tier * 0.12)
            slope = lambda x, ty=ty, tier=tier: ty + math.sin(x / w * 6.0 + tier * 1.3) * h * 0.016
            d.polygon([(x, slope(x)) for x in range(0, w + 8, 8)] + [(w + 8, h), (0, h)], fill=rgb(mix(mid, INK, 0.1 + tier * 0.12)) + (255,))
            houses_row(d, w, slope, int(w * 0.02), int(w * 0.98), int(w * (0.009 + 0.0035 * tier)), rng, tint, lit, density=1.2 + tier * 0.2)
        water_line = None
    elif kind == "skyline":
        base_y = int(h * 0.74)
        d.polygon(ridge_points(w, horizon - h * 0.015, h * 0.025, seed * 5, freq=0.6) + [(w + 8, horizon + 4), (0, horizon + 4)], fill=rgb(mix(NAVY, GOLD, 0.2)) + (170,))
        x = int(w * 0.03)
        while x < w * 0.97:
            frac = x / w
            tw = rng.randint(int(w * 0.04), int(w * 0.075))
            tall = 0.16 + 0.34 * math.exp(-((frac - 0.38) / 0.25) ** 2)
            th = int(h * (tall * rng.uniform(0.7, 1.15)))
            body = mix(mid, NAVY, rng.random() * 0.45)
            tower(d, x, base_y, tw, th, body, lit, rng, rim=mix(GOLD, WHITE, 0.25) if rng.random() < 0.7 else None, lit_prob=0.4 if tod == "night" else 0.22, win=(9 * SS // 2, 13 * SS // 2), style="balcony" if rng.random() < 0.5 else "slab")
            x += tw + rng.randint(int(w * 0.006), int(w * 0.024))
        d.polygon([(0, base_y), (w, base_y), (w, base_y + h * 0.02), (0, base_y + h * 0.02)], fill=rgb(dark) + (255,))
        water_line = base_y + int(h * 0.02)
    elif kind == "construction":
        base_y = int(h * 0.74)
        d.polygon(ridge_points(w, horizon - h * 0.012, h * 0.02, seed * 5, freq=0.6) + [(w + 8, horizon + 4), (0, horizon + 4)], fill=rgb(mix(NAVY, GOLD, 0.2)) + (170,))
        x = int(w * 0.04)
        for i, (tw, th) in enumerate([(0.07, 0.22), (0.085, 0.30), (0.075, 0.2), (0.09, 0.26)]):
            tower(d, x, base_y, int(w * tw), int(h * th), mix(mid, NAVY, 0.25), lit, rng, rim=mix(GOLD, WHITE, 0.3), lit_prob=0.25, win=(9 * SS // 2, 13 * SS // 2))
            x += int(w * tw) + int(w * 0.02)
        # the tower under construction (right of centre): finished base, open frame above
        tx, tw_, tth = int(w * 0.55), int(w * 0.12), int(h * 0.50)
        fin = int(tth * 0.45)
        tower(d, tx, base_y, tw_, fin, mid, lit, rng, rim=mix(GOLD, WHITE, 0.4), lit_prob=0.3, win=(9 * SS // 2, 13 * SS // 2), crown=False)
        fr_top = base_y - tth
        fr_bot = base_y - fin
        gold_dim = rgb(mix(GOLD, INK, 0.25)) + (255,)
        step = (fr_bot - fr_top) / 7
        for i in range(8):
            yy = fr_top + i * step
            d.rectangle([tx - 3, yy, tx + tw_ + 3, yy + 5], fill=gold_dim)
        for i in range(5):
            xx = tx + i * tw_ / 4
            d.rectangle([xx - 2, fr_top, xx + 2, fr_bot], fill=gold_dim)
        # tower crane standing on the frame
        mast_top = fr_top - int(h * 0.20)
        cx_ = tx + tw_ * 0.5
        d.rectangle([cx_ - 3, mast_top, cx_ + 3, fr_top], fill=gold_dim)
        d.rectangle([cx_ - h * 0.18, mast_top, cx_ + h * 0.28, mast_top + 5], fill=gold_dim)
        d.line([(cx_, mast_top - h * 0.05), (cx_ + h * 0.28, mast_top + 2)], fill=gold_dim, width=2)
        d.line([(cx_, mast_top - h * 0.05), (cx_ - h * 0.18, mast_top + 2)], fill=gold_dim, width=2)
        d.line([(cx_, mast_top - h * 0.05), (cx_, mast_top)], fill=gold_dim, width=3)
        d.line([(cx_ + h * 0.2, mast_top + 4), (cx_ + h * 0.2, mast_top + h * 0.08)], fill=gold_dim, width=2)
        d.rectangle([cx_ + h * 0.18, mast_top + h * 0.08, cx_ + h * 0.22, mast_top + h * 0.095], fill=gold_dim)
        d.polygon([(0, base_y), (w, base_y), (w, base_y + h * 0.02), (0, base_y + h * 0.02)], fill=rgb(dark) + (255,))
        water_line = base_y + int(h * 0.02)
    elif kind == "harbour":
        base_y = int(h * 0.72)
        x = int(w * 0.04)
        while x < w * 0.58:
            tw = rng.randint(int(w * 0.05), int(w * 0.09))
            th = rng.randint(int(h * 0.12), int(h * 0.34))
            tower(d, x, base_y, tw, th, mix(mid, NAVY, rng.random() * 0.4), lit, rng, rim=mix(GOLD, WHITE, 0.3), lit_prob=0.3, win=(9 * SS // 2, 13 * SS // 2), style="balcony")
            x += tw + rng.randint(int(w * 0.004), int(w * 0.014))
        d.polygon([(0, base_y), (w * 0.66, base_y), (w * 0.9, base_y + h * 0.02), (0, base_y + h * 0.02)], fill=rgb(dark) + (255,))
        # breakwater with lighthouse + sailing boats
        d.polygon([(w * 0.62, horizon + h * 0.02), (w, horizon + h * 0.01), (w, horizon + h * 0.04), (w * 0.62, horizon + h * 0.045)], fill=rgb(dark) + (255,))
        d.rectangle([w * 0.84, horizon - h * 0.07, w * 0.848, horizon + h * 0.02], fill=rgb(mix(WHITE, NAVY, 0.4)) + (255,))
        d.polygon([(w * 0.838, horizon - h * 0.07), (w * 0.858, horizon - h * 0.07), (w * 0.848, horizon - h * 0.085)], fill=rgb(dark) + (255,))
        for bx_, sc in ((0.70, 1.0), (0.78, 0.7), (0.93, 0.85)):
            bw = int(w * 0.045 * sc)
            by = horizon + int(h * 0.12 * sc)
            d.polygon([(w * bx_, by), (w * bx_ + bw, by), (w * bx_ + bw * 0.85, by + h * 0.016), (w * bx_ + bw * 0.1, by + h * 0.016)], fill=rgb(dark) + (255,))
            d.line([(w * bx_ + bw * 0.45, by), (w * bx_ + bw * 0.45, by - h * 0.12 * sc)], fill=rgb(dark) + (255,), width=3)
            d.polygon([(w * bx_ + bw * 0.5, by - h * 0.118 * sc), (w * bx_ + bw * 0.5, by - h * 0.006), (w * bx_ + bw * 0.95, by - h * 0.006)], fill=rgb(mix(GOLD, WHITE, 0.1)) + (235,))
        water_line = base_y + int(h * 0.02)
    elif kind == "coast":
        base_y = int(h * 0.70)
        x = int(w * 0.04)
        while x < w * 0.6:
            tw = rng.randint(int(w * 0.07), int(w * 0.115))
            th = rng.randint(int(h * 0.08), int(h * 0.17))
            tower(d, x, base_y, tw, th, mix(mid, NAVY, rng.random() * 0.3), lit, rng, rim=mix(GOLD, WHITE, 0.45), lit_prob=0.42, win=(10 * SS // 2, 14 * SS // 2), style="balcony", crown=False)
            x += tw + rng.randint(int(w * 0.008), int(w * 0.022))
        d.polygon([(0, base_y), (w * 0.66, base_y - h * 0.004), (w * 0.82, base_y + h * 0.09), (0, base_y + h * 0.11)], fill=rgb(dark) + (255,))
        water_line = None
    elif kind == "sunrise":
        water_line = horizon

    comp = Image.alpha_composite(base, layer)
    if water_line:
        refl, y0 = reflect(layer, water_line, strength=0.42, blur=7 * SS // 2, ripple=6 * SS // 2)
        rl = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        rl.paste(refl, (0, y0), refl)
        comp = Image.alpha_composite(comp, rl)

    comp = haze(comp, horizon - h * 0.10, horizon + h * 0.08, mix(GOLD, WHITE, 0.55), 0.32 if tod != "night" else 0.16)

    fg = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(fg)
    if kind == "coast":
        fd.polygon([(0, int(h * 0.80)), (w * 0.28, int(h * 0.84)), (w * 0.5, int(h * 0.93)), (w * 0.72, int(h * 1.0)), (0, h)], fill=rgb(mix(INK, GOLD, 0.06)) + (255,))
        fd.polygon([(w, int(h * 0.90)), (w * 0.86, int(h * 0.96)), (w * 0.8, h), (w, h)], fill=rgb(INK) + (255,))
    elif kind == "hill":
        fd.polygon(ridge_points(w, int(h * 0.95), h * 0.025, seed + 99, freq=0.6) + [(w + 8, h), (0, h)], fill=rgb(INK) + (255,))
    elif kind == "sunrise":
        fd.polygon([(0, int(h * 0.94)), (w * 0.4, int(h * 0.965)), (w * 0.6, h), (0, h)], fill=rgb(INK) + (255,))
        fd.polygon([(w, int(h * 0.92)), (w * 0.8, int(h * 0.97)), (w * 0.74, h), (w, h)], fill=rgb(INK) + (255,))
    else:
        fd.polygon([(0, int(h * 0.90)), (w * 0.17, int(h * 0.92)), (w * 0.26, h), (0, h)], fill=rgb(INK) + (255,))
        fd.polygon([(w, int(h * 0.91)), (w * 0.86, int(h * 0.94)), (w * 0.78, h), (w, h)], fill=rgb(INK) + (255,))
    palms_cfg = {
        "skyline": [(0.04, 0.93, 0.34, 0.10), (0.11, 0.96, 0.26, -0.10), (0.96, 0.95, 0.32, -0.12), (0.90, 0.97, 0.22, 0.08)],
        "construction": [(0.04, 0.93, 0.30, 0.12), (0.95, 0.94, 0.34, -0.12)],
        "harbour": [(0.05, 0.93, 0.32, 0.10), (0.96, 0.94, 0.28, -0.12)],
        "coast": [(0.06, 0.86, 0.50, 0.12), (0.15, 0.89, 0.36, -0.08), (0.94, 0.99, 0.52, -0.16), (0.85, 1.0, 0.36, 0.10)],
        "hill": [(0.08, 0.97, 0.30, 0.10), (0.93, 0.98, 0.34, -0.12)],
        "sunrise": [(0.07, 0.95, 0.52, 0.10), (0.17, 0.96, 0.36, -0.10), (0.93, 0.96, 0.46, -0.12)],
    }[kind]
    for px, py, ph, lean in palms_cfg:
        palm(fd, int(w * px), int(h * py), int(h * ph), INK, lean, rng, scale=SS * 1.5)
    comp = Image.alpha_composite(comp, fg)
    comp = comp.convert("RGB").resize((W, H), Image.LANCZOS)
    comp = bloom(comp, radius=40 * W / 1600).convert("RGB")
    comp = comp.filter(ImageFilter.GaussianBlur(0.4))
    return finish(comp, grain=4.5, vignette=0.28, seed=seed)


def save(img, name, q=80):
    path = os.path.join(OUT, name)
    img.save(path, "JPEG", quality=q, optimize=True, progressive=True)
    print(f"{name:30s} {img.size}  {os.path.getsize(path)//1024} KB")


def main():
    os.makedirs(OUT, exist_ok=True)
    # large editorial / hero scenes (16:10 / 16:9)
    save(scene("skyline", 2200, 1300, seed=11, sun=0.66, tod="dusk"), "hero-waterfront.jpg", 80)
    save(scene("coast", 1800, 1100, seed=21, sun=0.72, tod="dusk"), "gallery-coast.jpg", 78)
    save(scene("skyline", 1800, 1100, seed=31, sun=0.3, tod="night"), "gallery-city.jpg", 78)
    save(scene("hill", 1800, 1100, seed=41, sun=0.55, tod="dusk"), "gallery-hills.jpg", 78)
    save(scene("harbour", 1800, 1100, seed=51, sun=0.4, tod="dusk"), "gallery-harbour.jpg", 78)
    save(scene("sunrise", 2000, 1200, seed=61, sun=0.5, tod="sunrise"), "cta-sunrise.jpg", 78)
    # property images (3:2)
    save(scene("skyline", 1200, 800, seed=101, sun=0.7, tod="dusk"), "property-aurora.jpg")
    save(scene("coast", 1200, 800, seed=102, sun=0.35, tod="dusk"), "property-coastline.jpg")
    save(scene("construction", 1200, 800, seed=103, sun=0.62, tod="dusk"), "property-skyline.jpg")
    save(scene("hill", 1200, 800, seed=104, sun=0.5, tod="dusk"), "property-garden.jpg")
    save(scene("harbour", 1200, 800, seed=105, sun=0.3, tod="dusk"), "property-harbour.jpg")
    save(scene("skyline", 1200, 800, seed=106, sun=0.55, tod="night"), "property-lake.jpg")
    # portrait pieces for the "How it works" storytelling (4:5)
    save(scene("skyline", 1000, 1250, seed=201, sun=0.5, tod="dusk"), "journey-explore.jpg")
    save(scene("coast", 1000, 1250, seed=202, sun=0.45, tod="dusk"), "journey-payment.jpg")
    save(scene("hill", 1000, 1250, seed=203, sun=0.5, tod="dusk"), "journey-team.jpg")


if __name__ == "__main__":
    main()
