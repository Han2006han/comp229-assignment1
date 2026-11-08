"""Generate a flat illustrated portrait placeholder for the About page.

Run with the workspace Python, e.g.
    python tools/make_profile.py public/images/profile.png
"""

import sys
from PIL import Image, ImageDraw

S = 4  # supersampling factor for smooth edges
SIZE = 800


def box(coords):
    return tuple(int(v * S) for v in coords)


def main(out_path):
    w = SIZE * S
    base = Image.new("RGB", (w, w), "#eef2ff")
    draw = ImageDraw.Draw(base)

    # Soft vertical gradient background
    top = (238, 242, 255)
    bottom = (224, 231, 255)
    for y in range(w):
        t = y / (w - 1)
        color = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        draw.line([(0, y), (w, y)], fill=color)

    overlay = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse(box((520, 40, 820, 340)), fill=(199, 210, 254, 110))
    od.ellipse(box((-80, 560, 240, 880)), fill=(165, 180, 252, 90))
    od.ellipse(box((600, 640, 860, 900)), fill=(139, 92, 246, 40))
    # Subtle dot grid
    for gx in range(60, 780, 60):
        for gy in range(60, 780, 60):
            if (gx + gy) % 120 == 0:
                od.ellipse(box((gx, gy, gx + 5, gy + 5)), fill=(99, 102, 241, 45))
    base = Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(base)

    skin = (243, 201, 168)
    skin_shadow = (226, 178, 145)
    hair = (35, 35, 55)
    shirt = (79, 70, 229)
    shirt_dark = (67, 56, 202)
    white = (255, 255, 255)

    # Shoulders / torso
    draw.rounded_rectangle(box((150, 600, 650, 900)), radius=int(150 * S), fill=shirt)
    draw.rounded_rectangle(box((150, 600, 650, 900)), radius=int(150 * S), outline=shirt_dark, width=int(3 * S))

    # Neck and its shadow
    draw.rounded_rectangle(box((352, 470, 448, 620)), radius=int(28 * S), fill=skin)
    draw.ellipse(box((352, 462, 448, 522)), fill=skin_shadow)
    draw.rounded_rectangle(box((360, 500, 440, 620)), radius=int(24 * S), fill=skin)

    # Collar
    draw.polygon(
        [(box((368, 600))), (box((400, 660))), (box((432, 600)))],
        fill=white,
    )
    draw.polygon(
        [(box((300, 600))), (box((368, 600))), (box((400, 660))), (box((330, 700)))],
        fill=(236, 234, 254),
    )
    draw.polygon(
        [(box((500, 600))), (box((432, 600))), (box((400, 660))), (box((470, 700)))],
        fill=(236, 234, 254),
    )

    # Ears
    draw.ellipse(box((232, 322, 282, 402)), fill=skin_shadow)
    draw.ellipse(box((518, 322, 568, 402)), fill=skin_shadow)
    draw.ellipse(box((240, 330, 276, 394)), fill=skin)
    draw.ellipse(box((524, 330, 560, 394)), fill=skin)

    # Face
    draw.ellipse(box((252, 190, 548, 540)), fill=skin)

    # Hair: top cap plus side panels, drawn over the forehead
    draw.ellipse(box((244, 132, 556, 420)), fill=hair)
    draw.polygon(
        [
            box((244, 300)),
            box((252, 250)),
            box((300, 210)),
            box((400, 196)),
            box((500, 210)),
            box((548, 250)),
            box((556, 300)),
            box((520, 268)),
            box((470, 246)),
            box((400, 240)),
            box((330, 246)),
            box((280, 268)),
        ],
        fill=hair,
    )
    # Remove the hair covering the lower face by repainting the face oval
    draw.ellipse(box((268, 268, 532, 540)), fill=skin)
    # Sideburns
    draw.rounded_rectangle(box((252, 300, 284, 392)), radius=int(14 * S), fill=hair)
    draw.rounded_rectangle(box((516, 300, 548, 392)), radius=int(14 * S), fill=hair)
    # Fringe sweep
    draw.polygon(
        [
            box((268, 268)),
            box((300, 236)),
            box((360, 224)),
            box((420, 228)),
            box((452, 250)),
            box((430, 268)),
            box((360, 262)),
            box((300, 270)),
        ],
        fill=hair,
    )

    # Eyebrows
    draw.line([box((300, 330)), box((346, 322)), box((376, 330))], fill=(70, 52, 44), width=int(6 * S), joint="curve")
    draw.line([box((424, 330)), box((454, 322)), box((500, 330))], fill=(70, 52, 44), width=int(6 * S), joint="curve")

    # Eyes
    draw.ellipse(box((316, 352, 348, 372)), fill=(255, 255, 255))
    draw.ellipse(box((452, 352, 484, 372)), fill=(255, 255, 255))
    draw.ellipse(box((327, 356, 339, 370)), fill=(38, 38, 58))
    draw.ellipse(box((461, 356, 473, 370)), fill=(38, 38, 58))
    draw.ellipse(box((330, 358, 336, 364)), fill=(255, 255, 255))
    draw.ellipse(box((464, 358, 470, 364)), fill=(255, 255, 255))

    # Glasses
    glass = (45, 45, 70)
    lw = int(5 * S)
    draw.ellipse(box((298, 334, 382, 392)), outline=glass, width=lw)
    draw.ellipse(box((418, 334, 502, 392)), outline=glass, width=lw)
    draw.line([box((382, 360)), box((418, 360))], fill=glass, width=lw)
    draw.line([box((298, 356)), box((252, 348))], fill=glass, width=lw)
    draw.line([box((502, 356)), box((548, 348))], fill=glass, width=lw)

    # Nose
    draw.line([box((398, 380)), box((392, 424)), box((402, 432)), box((416, 426))], fill=skin_shadow, width=int(5 * S), joint="curve")

    # Mouth
    draw.arc(box((344, 440, 456, 502)), start=15, end=165, fill=(176, 96, 88), width=int(5 * S))
    draw.arc(box((356, 446, 444, 496)), start=20, end=160, fill=(230, 150, 140), width=int(3 * S))

    final = base.resize((SIZE, SIZE), Image.LANCZOS)
    final.save(out_path, "PNG", optimize=True)
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/images/profile.png")
