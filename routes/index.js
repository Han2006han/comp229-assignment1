/**
 * File name: routes/index.js
 * Student's Name: Han
 * Student ID: 2024110006
 * Date: 2026-11-08
 *
 * All site routes live here, as required by the assignment brief. Each page has
 * its own router.get(...) that ends in res.render(view, locals), and the contact
 * form is handled by a router.post(...) that captures the submission and
 * redirects the visitor back to the Home page.
 */

// ---------------------------------------------------------------------------
// Module dependencies
// ---------------------------------------------------------------------------
const express = require('express');
const { profile, projects, services, highlights } = require('../data/portfolio');

const router = express.Router();

// Contact submissions are captured in memory for this assignment. A production
// build would persist them (database or email service) instead.
const messageInbox = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\d][\d\s().-]{6,19}$/;

/**
 * Trim every submitted value so validation and storage see the same string.
 */
function normalizeForm(body) {
  return {
    firstName: String(body.firstName || '').trim(),
    lastName: String(body.lastName || '').trim(),
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim(),
    subject: String(body.subject || '').trim(),
    message: String(body.message || '').trim(),
  };
}

/**
 * Return a field -> message map. An empty object means the form is valid.
 */
function validateContact(form) {
  const errors = {};

  if (form.firstName.length < 2) {
    errors.firstName = 'Please enter your first name (at least 2 characters).';
  }
  if (form.lastName.length < 2) {
    errors.lastName = 'Please enter your last name (at least 2 characters).';
  }
  if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = 'Please enter a valid email address, for example name@example.com.';
  }
  if (form.phone && !PHONE_PATTERN.test(form.phone)) {
    errors.phone = 'Please use digits, spaces, brackets, dashes or a leading + only.';
  }
  if (form.message.length < 10) {
    errors.message = 'Please add a little more detail (at least 10 characters).';
  }
  if (form.message.length > 1000) {
    errors.message = 'Messages are limited to 1000 characters.';
  }

  return errors;
}

// ---------------------------------------------------------------------------
// GET / - Home page: welcome message, mission statement and calls to action
// ---------------------------------------------------------------------------
router.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Home',
    activePage: 'home',
    profile,
    highlights,
    projects: projects.slice(0, 3),
    messageSent: req.query.sent === '1',
  });
});

// ---------------------------------------------------------------------------
// GET /about - About Me page: legal name, photo, short introduction and resume
// ---------------------------------------------------------------------------
router.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About Me',
    activePage: 'about',
    profile,
    highlights,
  });
});

// ---------------------------------------------------------------------------
// GET /projects - Projects page: three project cards with image and outcome
// ---------------------------------------------------------------------------
router.get('/projects', (req, res) => {
  res.render('projects', {
    pageTitle: 'Projects',
    activePage: 'projects',
    projects,
  });
});

// ---------------------------------------------------------------------------
// GET /services - Services page: what I offer, with supporting detail
// ---------------------------------------------------------------------------
router.get('/services', (req, res) => {
  res.render('services', {
    pageTitle: 'Services',
    activePage: 'services',
    services,
  });
});

// ---------------------------------------------------------------------------
// GET /contact - Contact page: details panel plus the message form
// ---------------------------------------------------------------------------
router.get('/contact', (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact',
    activePage: 'contact',
    profile,
    form: { firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' },
    errors: {},
  });
});

// ---------------------------------------------------------------------------
// POST /contact - Capture the submission, then redirect back to the Home page
// ---------------------------------------------------------------------------
router.post('/contact', (req, res) => {
  const form = normalizeForm(req.body);
  const errors = validateContact(form);

  if (Object.keys(errors).length > 0) {
    // Re-render the form with the visitor's input still in place.
    return res.status(422).render('contact', {
      pageTitle: 'Contact',
      activePage: 'contact',
      profile,
      form,
      errors,
    });
  }

  messageInbox.push({ ...form, receivedAt: new Date() });
  console.log(`New portfolio message from ${form.firstName} ${form.lastName} <${form.email}>`);

  return res.redirect('/?sent=1#home');
});

// ---------------------------------------------------------------------------
// GET /resume - Friendly URL that hands off to the static PDF in /public/docs
// ---------------------------------------------------------------------------
router.get('/resume', (req, res) => {
  res.redirect('/docs/Han-Resume.pdf');
});

// Exposed so the assignment reviewer can see submissions during a demo.
router.get('/messages', (req, res) => {
  res.json({ count: messageInbox.length, messages: messageInbox });
});

module.exports = router;
