/**
 * File name: tools/preview.js
 * Student's Name: Han
 * Student ID: 2024110006
 * Date: 2026-11-08
 *
 * Development helper: renders the EJS views to plain HTML in tools/preview so
 * the markup can be checked without installing Express. It implements only the
 * subset of EJS this project uses (<% %>, <%= %>, <%- %>, <%# %> and include).
 *
 * Usage: node tools/preview.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { profile, projects, services, highlights } = require('../data/portfolio');

const VIEWS = path.join(__dirname, '..', 'views');
const OUT = path.join(__dirname, 'preview');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveView(name) {
  const candidates = [path.join(VIEWS, `${name}.ejs`), path.join(VIEWS, 'partials', `${name}.ejs`)];
  const found = candidates.find((file) => fs.existsSync(file));
  if (!found) throw new Error(`View not found: ${name}`);
  return found;
}

const cache = new Map();

function compile(file) {
  if (cache.has(file)) return cache.get(file);

  let source = fs.readFileSync(file, 'utf8');

  // Turn include(...) calls into calls on the shared helper.
  source = source.replace(
    /<%-\s*include\(\s*(['"])([\s\S]+?)\1\s*(?:,\s*(\{[\s\S]*?\}))?\s*\)\s*%>/g,
    (match, quote, name, localsObject) =>
      `<%- __include('${name}', ${localsObject || '{}'}, locals) %>`
  );

  const body = [];
  const tagPattern = /<%([_=-]?)([\s\S]*?)%>/g;
  let cursor = 0;
  let match;

  while ((match = tagPattern.exec(source)) !== null) {
    const literal = source.slice(cursor, match.index);
    if (literal) body.push(`__out += ${JSON.stringify(literal)};`);

    const marker = match[1];
    const code = match[2].replace(/^[-_]?\s*/, '').trim();
    if (marker === '#') {
      // comment: emit nothing
    } else if (marker === '=') {
      body.push(`__out += __escape(${code});`);
    } else if (marker === '-') {
      body.push(`__out += (${code});`);
    } else {
      body.push(code);
    }
    cursor = tagPattern.lastIndex;
  }

  const tail = source.slice(cursor);
  if (tail) body.push(`__out += ${JSON.stringify(tail)};`);

  const fn = new Function('locals', '__escape', '__include', `let __out = ""; with (locals) { ${body.join('\n')} } return __out;`);
  const wrapper = (locals) =>
    fn(locals, escapeHtml, (name, extra, currentLocals) =>
      compile(resolveView(name))(Object.assign({}, currentLocals, extra))
    );

  cache.set(file, wrapper);
  return wrapper;
}

function renderView(name, locals) {
  return compile(resolveView(name))(locals);
}

// Route links and asset paths are absolute on the real server; rewrite them so
// the generated files open correctly straight from the filesystem.
function localise(html) {
  const routes = {
    '/': 'index.html',
    '/about': 'about.html',
    '/projects': 'projects.html',
    '/services': 'services.html',
    '/contact': 'contact.html',
  };

  let output = html.replace(/href="([^"]*)"/g, (match, href) => {
    if (routes[href]) return `href="${routes[href]}"`;
    if (/^\/(css|js|images|docs)\//.test(href)) return `href="../../public${href}"`;
    return match;
  });

  output = output.replace(/src="\/(css|js|images|docs)\/([^"]*)"/g, 'src="../../public/$1/$2"');
  return output;
}

function main() {
  const base = {
    studentName: 'Han',
    studentId: '2024110006',
    currentYear: new Date().getFullYear(),
  };

  const pages = [
    ['index', { pageTitle: 'Home', activePage: 'home', profile, highlights, projects: projects.slice(0, 3), messageSent: false }],
    ['about', { pageTitle: 'About Me', activePage: 'about', profile, highlights }],
    ['projects', { pageTitle: 'Projects', activePage: 'projects', projects }],
    ['services', { pageTitle: 'Services', activePage: 'services', services }],
    [
      'contact',
      {
        pageTitle: 'Contact',
        activePage: 'contact',
        profile,
        form: { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' },
        errors: {},
      },
    ],
    [
      'error',
      { pageTitle: 'Page not found', activePage: '', message: 'Not Found', error: { status: 404 } },
    ],
  ];

  fs.mkdirSync(OUT, { recursive: true });

  for (const [name, locals] of pages) {
    const html = localise(renderView(name, Object.assign({}, base, locals)));
    const file = path.join(OUT, `${name}.html`);
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Rendered ${file} (${html.length} bytes)`);
  }
}

main();
