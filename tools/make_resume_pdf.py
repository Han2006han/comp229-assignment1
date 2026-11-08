"""Build the one-page resume PDF without third-party libraries.

Chrome/Word are not usable in this environment, so the PDF is written directly
with the core PDF fonts (Helvetica family) and a small layout engine.

Usage:
    python tools/make_resume_pdf.py public/docs/Han-Resume.pdf
"""

import sys

PAGE_W, PAGE_H = 612.0, 792.0
MARGIN = 48.0
CONTENT_W = PAGE_W - 2 * MARGIN

INK = (0.08, 0.08, 0.16)
MUTED = (0.36, 0.36, 0.45)
BRAND = (0.31, 0.27, 0.88)
RULE = (0.86, 0.86, 0.94)

# Helvetica advance widths (units per 1000 em) for the characters used here.
WIDTHS = {
    " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667,
    "'": 222, "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333,
    ".": 278, "/": 278, ":": 278, ";": 278, "<": 584, "=": 584, ">": 584,
    "?": 556, "@": 1015, "[": 278, "\\": 278, "]": 278, "^": 469,
    "_": 556, "`": 222, "{": 334, "|": 260, "}": 334, "~": 584,
    "0": 556, "1": 556, "2": 556, "3": 556, "4": 556, "5": 556, "6": 556,
    "7": 556, "8": 556, "9": 556,
    "a": 556, "b": 556, "c": 500, "d": 556, "e": 556, "f": 278, "g": 556,
    "h": 556, "i": 222, "j": 222, "k": 500, "l": 222, "m": 833, "n": 556,
    "o": 556, "p": 556, "q": 556, "r": 333, "s": 500, "t": 278, "u": 556,
    "v": 500, "w": 722, "x": 500, "y": 500, "z": 500,
    "A": 667, "B": 667, "C": 722, "D": 722, "E": 667, "F": 611, "G": 778,
    "H": 722, "I": 278, "J": 500, "K": 667, "L": 556, "M": 833, "N": 722,
    "O": 778, "P": 667, "Q": 778, "R": 722, "S": 667, "T": 611, "U": 722,
    "V": 667, "W": 944, "X": 667, "Y": 667, "Z": 611,
    "\u2022": 350, "\u2013": 556, "\u2014": 1000, "\u2019": 222, "\u201c": 333,
    "\u201d": 333, "\u00b7": 278,
}

REPLACEMENTS = {
    "\u2014": "-", "\u2013": "-", "\u2019": "'", "\u2018": "'",
    "\u201c": '"', "\u201d": '"', "\u00b7": "-", "\u00b0": " degrees",
}


def measure(text, size, bold=False):
    total = 0
    for ch in text:
        total += WIDTHS.get(ch, 556)
    factor = 1.035 if bold else 1.0
    return total * size / 1000.0 * factor


def wrap(text, size, avail, bold=False):
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if measure(candidate, size, bold) <= avail or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def pdf_string(text):
    text = "".join(REPLACEMENTS.get(ch, ch) for ch in text)
    raw = text.encode("cp1252", "replace")
    out = bytearray()
    for byte in raw:
        if byte in (0x28, 0x29, 0x5C):
            out.append(0x5C)
        out.append(byte)
    return bytes(out)


class Page:
    def __init__(self):
        self.ops = []
        self.items = []

    def text(self, x, y, text, size, bold=False, color=INK, track=0.0):
        font = "F2" if bold else "F1"
        self.items.append(("text", x, y, text, size, bold, color))
        self.ops.append(
            f"BT /{font} {size} Tf {color[0]:.3f} {color[1]:.3f} {color[2]:.3f} rg "
            f"{track:.3f} Tc {x:.2f} {y:.2f} Td ({pdf_string(text).decode('cp1252', 'replace')}) Tj ET"
        )

    def line(self, x1, y1, x2, y2, width=0.6, color=RULE):
        self.items.append(("line", x1, y1, x2, y2, width, color))
        self.ops.append(
            f"{color[0]:.3f} {color[1]:.3f} {color[2]:.3f} RG {width} w "
            f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S"
        )


def render_preview(page, png_path, scale=1.6):
    """Rasterise the recorded layout with Arial so the PDF can be eyeballed."""
    from PIL import Image, ImageDraw, ImageFont

    width = int(PAGE_W * scale)
    height = int(PAGE_H * scale)
    image = Image.new("RGB", (width, height), "#ffffff")
    draw = ImageDraw.Draw(image)

    fonts = {}

    def font_for(size, bold):
        key = (round(size, 2), bold)
        if key not in fonts:
            path = r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf"
            fonts[key] = ImageFont.truetype(path, int(round(size * scale)))
        return fonts[key]

    for item in page.items:
        if item[0] == "text":
            _, x, y, text, size, bold, color = item
            rgb = tuple(int(round(c * 255)) for c in color)
            draw.text(
                (x * scale, (PAGE_H - y) * scale),
                text,
                font=font_for(size, bold),
                fill=rgb,
                anchor="ls",
            )
        else:
            _, x1, y1, x2, y2, line_width, color = item
            rgb = tuple(int(round(c * 255)) for c in color)
            draw.line(
                [(x1 * scale, (PAGE_H - y1) * scale), (x2 * scale, (PAGE_H - y2) * scale)],
                fill=rgb,
                width=max(1, int(round(line_width * scale))),
            )

    image.save(png_path)
    print(f"Wrote preview {png_path}")


def build(out_path):
    page = Page()
    y = PAGE_H - 56

    # ---------------- Header ----------------
    page.text(MARGIN, y - 12, "HAN", 26, bold=True, color=INK)
    y -= 38
    page.text(MARGIN, y, "WEB DEVELOPER & COMPUTER PROGRAMMING STUDENT", 9.6, bold=True, color=BRAND, track=1.1)
    y -= 16
    contact = "Suzhou, China  |  sergeyhans529@gmail.com  |  +44 7763370061  |  github.com/Han2006han"
    page.text(MARGIN, y, contact, 9.0, color=MUTED)
    y -= 10
    page.line(MARGIN, y, PAGE_W - MARGIN, y, 1.4, BRAND)
    y -= 26

    # ---------------- Sections ----------------
    def heading(label):
        nonlocal y
        page.text(MARGIN, y, label.upper(), 9.0, bold=True, color=BRAND, track=1.0)
        y -= 6
        page.line(MARGIN, y, PAGE_W - MARGIN, y, 0.6, RULE)
        y -= 15

    def paragraph(text, size=9.7, color=INK, leading=12.6, indent=0.0, bold=False):
        nonlocal y
        for line in wrap(text, size, CONTENT_W - indent, bold):
            page.text(MARGIN + indent, y, line, size, bold=bold, color=color)
            y -= leading

    def bullet(text, size=9.6, leading=12.2):
        nonlocal y
        lines = wrap(text, size, CONTENT_W - 14)
        page.text(MARGIN + 2, y, "\u2022", size)
        for index, line in enumerate(lines):
            page.text(MARGIN + 14, y, line, size, color=INK)
            y -= leading if index < len(lines) - 1 else leading
        # small breathing room after the block
        y -= 1.2

    def row(left, right, size=10.1):
        nonlocal y
        left_w = measure(left, size, bold=True)
        right_w = measure(right, 9.2)
        if left_w + right_w + 18 > CONTENT_W:
            page.text(MARGIN, y, left, size, bold=True)
            y -= 12.6
            page.text(MARGIN, y, right, 9.2, color=MUTED)
            y -= 12.6
        else:
            page.text(MARGIN, y, left, size, bold=True)
            page.text(PAGE_W - MARGIN - right_w, y, right, 9.2, color=MUTED)
            y -= 12.6

    # Summary
    heading("Summary")
    paragraph(
        "Second-year Software Engineering Technology student at Centennial College with hands-on "
        "experience building full-stack JavaScript applications. Comfortable across the stack: "
        "semantic HTML and CSS, Express routes and EJS templates, MongoDB data models, and the "
        "debugging that holds it all together. Looking for a co-op placement starting May 2027."
    )
    y -= 8

    # Education
    heading("Education")
    row("Centennial College - Software Engineering Technology (Co-op)", "Toronto, ON  |  2024 - 2027")
    paragraph("Advanced Diploma  |  GPA 3.8 / 4.0  |  Dean's List, Fall 2025", size=9.3, color=MUTED, leading=12.0)
    bullet("Relevant coursework: Web Application Development (COMP229), Java Programming, Database Concepts, Client-Side JavaScript.")
    y -= 6

    # Skills
    heading("Technical Skills")
    skills = [
        ("Languages", "JavaScript (ES2023), HTML5, CSS3, Java, SQL"),
        ("Frameworks", "Node.js, Express, EJS, React, Bootstrap"),
        ("Data", "MongoDB, PostgreSQL, REST APIs, localStorage"),
        ("Tooling", "Git & GitHub, VS Code, Figma, Jest, Chrome DevTools"),
        ("Practice", "Accessibility (WCAG 2.1), responsive design, code review"),
    ]
    for label, value in skills:
        page.text(MARGIN, y, label, 9.5, bold=True)
        page.text(MARGIN + 92, y, value, 9.5)
        y -= 12.2
    y -= 8

    # Projects
    heading("Projects")

    row("Campus Course Planner", "2026")
    paragraph("Node.js  |  Express  |  MongoDB  |  EJS", size=9.2, color=MUTED, leading=11.6)
    bullet("Built the Express API and data model that detects lecture and lab conflicts before registration.")
    bullet("Adopted by roughly 200 students in its first term; reported timetable clashes fell from 31% to 4%.")
    y -= 4

    row("TaskFlow Board", "2025")
    paragraph("JavaScript  |  HTML5 drag events  |  localStorage", size=9.2, color=MUTED, leading=11.6)
    bullet("Implemented a keyboard-operable kanban board with offline persistence; passed accessibility review with no critical issues.")
    y -= 4

    row("Weather Dashboard", "2025")
    paragraph("JavaScript  |  OpenWeather API  |  Chart.js", size=9.2, color=MUTED, leading=11.6)
    bullet("Cut average load time to 0.9s on a throttled 3G profile and reduced API calls by 60% with a ten-minute cache.")
    y -= 6

    # Experience
    heading("Experience")
    row("Peer Tutor - Centennial College Learning Centre", "Toronto, ON  |  2025 - Present")
    bullet("Run weekly drop-in sessions for first-year programming students on JavaScript fundamentals and debugging.")
    bullet("Wrote a short troubleshooting guide that the department now hands out in COMP125 labs.")
    y -= 6

    # Additional
    heading("Additional")
    bullet("Languages: English (fluent), Mandarin (native).")
    bullet("Available for co-op or internship starting May 2027; open to on-site work in the Greater Toronto Area.")

    final_y = y
    content = "\n".join(page.ops).encode("cp1252", "replace")

    objects = []
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    objects.append(
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>"
    )
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>")
    objects.append(b"<< /Length " + str(len(content)).encode() + b" >>\nstream\n" + content + b"\nendstream")

    header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    out = bytearray(header)
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{index} 0 obj\n".encode() + obj + b"\nendobj\n"

    xref_offset = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for offset in offsets[1:]:
        out += f"{offset:010d} 00000 n \n".encode()
    out += (
        b"trailer\n<< /Size " + str(len(objects) + 1).encode() + b" /Root 1 0 R >>\nstartxref\n"
        + str(xref_offset).encode() + b"\n%%EOF\n"
    )

    with open(out_path, "wb") as handle:
        handle.write(out)

    print(f"Wrote {out_path} ({len(out)} bytes), last baseline y={final_y:.1f}")
    return page


if __name__ == "__main__":
    output = sys.argv[1] if len(sys.argv) > 1 else "public/docs/Han-Resume.pdf"
    finished_page = build(output)
    if len(sys.argv) > 2:
        render_preview(finished_page, sys.argv[2])
