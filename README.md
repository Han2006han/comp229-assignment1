# COMP229 — Assignment 1: Express Portfolio Site

A personal portfolio website built with **Node.js, Express and EJS**, structured exactly like the
project produced by the Express Generator (`express --view=ejs`). It contains five pages, shared
EJS partials, a custom logo, a downloadable PDF resume and a working contact form that captures a
message and sends the visitor back to the Home page.

- **Student:** Han
- **Student ID:** 2024110006
- **Course:** COMP229 — Web Application Development
- **Date:** 2026-11-08

---

## Quick start

```bash
npm install
npm start
```

Then open <http://localhost:3000>.

The server listens on `PORT` when it is set, otherwise `3000`:

```bash
PORT=8080 npm start     # macOS / Linux
$env:PORT=8080; npm start   # PowerShell
```

`npm run dev` starts the same server with `node --watch` for automatic restarts while editing.

> If the npm registry is slow or blocked, add a mirror first:
> `npm config set registry https://registry.npmmirror.com`

---

## Pages and routes

| Route | View | What is on the page |
| --- | --- | --- |
| `GET /` | `views/index.ejs` | Welcome message, mission statement, highlights, three featured projects, calls to action |
| `GET /about` | `views/about.ejs` | Legal name, portrait, short biography, quick facts, skills, PDF resume link |
| `GET /projects` | `views/projects.ejs` | Three projects, each with an image, role, stack, description and outcome |
| `GET /services` | `views/services.ejs` | Four services, a four-step working process and a quote call to action |
| `GET /contact` | `views/contact.ejs` | Contact details panel and an interactive message form |
| `POST /contact` | — | Validates the form, stores the message, then redirects to `/?sent=1#home` |
| `GET /resume` | — | Redirects to the static PDF at `/docs/Han-Resume.pdf` |
| `GET /messages` | — | JSON view of captured contact submissions (handy for a demo) |

The contact form is captured in memory (`routes/index.js`), which satisfies the assignment
requirement: the visitor's details are recorded and they are redirected back to the Home page, where
a confirmation banner is displayed. A production version would write to a database or send email
instead.

---

## Project structure

```text
comp229-assignment1/
├── app.js                     # Express application (view engine, middleware, routes, error handlers)
├── bin/
│   └── www                    # HTTP server bootstrap (from the Express Generator)
├── data/
│   └── portfolio.js           # Profile, projects, services and highlights in one place
├── routes/
│   └── index.js               # Every site route: router.get(...) -> res.render(...)
├── views/
│   ├── index.ejs              # Home
│   ├── about.ejs              # About Me
│   ├── projects.ejs           # Projects
│   ├── services.ejs           # Services
│   ├── contact.ejs            # Contact + form
│   ├── error.ejs              # 404 / 500 page
│   └── partials/
│       ├── header.ejs         # <head>, brand, navigation
│       ├── footer.ejs         # Footer, back-to-top, script include
│       ├── logo.ejs           # Custom hexagon monogram logo (inline SVG)
│       ├── content.ejs        # Home page hero
│       ├── project-card.ejs   # Reusable project card
│       └── service-card.ejs   # Reusable service card
├── public/
│   ├── css/style.css          # Single stylesheet, organised in labelled sections
│   ├── js/main.js             # Navigation, header state, back-to-top, form helpers
│   ├── images/                # Logo, portrait and three project mock-ups
│   └── docs/Han-Resume.pdf    # One-page resume linked from the About page
├── tools/                     # Development helpers (not required at runtime)
└── package.json
```

---

## How the assignment requirements are covered

**Content (40 marks)**

- Five pages with portfolio content: Home, About Me, Projects, Services, Contact.
- A custom logo — a hexagon monogram with the letter H, drawn as an inline SVG partial and reused as
  the favicon.
- Home page has a welcome message, a mission statement and buttons to the Projects and About pages.
- About page has the legal name, a head-and-shoulders portrait, a short biography, quick facts and a
  link to the PDF resume.
- Projects page shows three projects, each with an illustration, the role, the technology stack and
  the outcome.
- Services page lists four services with supporting points and a process explanation.
- Contact page has a details panel plus a form (first name, last name, email, contact number,
  subject, message) that validates, captures and redirects to Home.

**Express, EJS and routes (25 marks)**

- One view template per page, plus `header`, `footer`, `logo`, `content`, `project-card` and
  `service-card` partials in `views/partials/`.
- One `router.get(path, callback)` per page, each ending in `res.render(view, locals)`.
- `POST /contact` uses `router.post(...)` and `res.redirect(...)`.

**Site structure (20 marks)**

- Layout mirrors the Express Generator output (`app.js`, `bin/www`, `routes/`, `views/`, `public/`).
- Assets are separated into `public/css`, `public/js`, `public/images` and `public/docs`.
- Routes for every page live in `routes/index.js`.
- All views live in `views/`, all partials in `views/partials/`.

**Internal documentation (5 marks)**

- Every CSS and JavaScript file opens with a comment header giving the file name, student name,
  student ID and date.
- CSS is divided into numbered sections (tokens, base, layout, header, buttons, pages, footer,
  responsive); JavaScript is divided into numbered behaviours; EJS templates carry an HTML comment
  header.
- Variables and functions have descriptive names (`validateContact`, `normalizeForm`,
  `updateMessageCounter`, `--brand-600`, `project-image`).
- Inline comments explain the design and behaviour decisions without narrating every line.

**Submission (5 + 5 marks)**

- Source archive: `Han-2024110006-COMP229-Assignment1.zip` (project files without `node_modules`).
- GitHub: <https://github.com/Han2006han/comp229-assignment1>

---

## Repository

The `main` branch is published at <https://github.com/Han2006han/comp229-assignment1>, with the
remote already configured:

```bash
git remote -v
# origin  https://github.com/Han2006han/comp229-assignment1.git
git status
# Your branch is up to date with 'origin/main'
```

Future changes only need a commit and a push:

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub no longer accepts an account password for Git operations. When prompted for a password, paste a
**personal access token** (Settings → Developer settings → Personal access tokens → Fine-grained tokens,
with *Contents: Read and write* on this repository), or sign in through Git Credential Manager.


---

## Accessibility and quality notes

- Skip link, landmark elements, labelled form fields, `aria-invalid` and `aria-describedby` on
  validation errors, `aria-current="page"` in the navigation, and a visible focus style.
- Responsive from 360 px to wide desktop; the navigation collapses into a toggle below 860 px.
- `prefers-reduced-motion` disables the decorative animations.
- No framework and no build step — the page loads three local assets and nothing else.

---

## Development helpers in `tools/`

These scripts are optional; the site runs without them.

| File | Purpose |
| --- | --- |
| `preview.js` | Renders every EJS view to `tools/preview/*.html` with a tiny EJS-compatible renderer, so the markup can be checked without starting Express. |
| `make_profile.py` | Generates the illustrated portrait placeholder with Pillow. |
| `make_resume_pdf.py` | Generates `public/docs/Han-Resume.pdf` using only the PDF core fonts. |

---

## Content notes

The contact details are set to the owner's real values: `sergeyhans529@gmail.com`,
`+44 7763370061`, Suzhou, China and <https://github.com/Han2006han>.

Two pieces of content remain generic and can be swapped without touching any code:

1. `public/images/profile.png` — an illustrated portrait. Replace it with a real head-and-shoulders
   photo (square, at least 640 × 640) if you prefer.
2. `public/docs/Han-Resume.pdf` — regenerate with `tools/make_resume_pdf.py`, or drop in your own
   PDF at the same path.

Project write-ups and the biography live in `data/portfolio.js`.

## Credits

All code, copy, logo and illustrations in this repository were produced for this assignment.
No third-party logos, photographs or icon sets are included.
