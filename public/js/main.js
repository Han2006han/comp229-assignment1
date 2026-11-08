/**
 * File name: public/js/main.js
 * Student's Name: Han
 * Student ID: 2024110006
 * Date: 2026-11-08
 *
 * Front-end behaviour for the portfolio site:
 *   1. Mobile navigation toggle
 *   2. Sticky header shadow on scroll
 *   3. Back-to-top button
 *   4. Contact form: live character counter and inline validation hints
 *
 * No framework and no build step: the file is served straight from /public/js.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // DOM references
  // -------------------------------------------------------------------------
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('primary-navigation');
  const toTopButton = document.querySelector('[data-to-top]');
  const contactForm = document.querySelector('[data-contact-form]');
  const messageInput = document.querySelector('[data-message-input]');
  const messageCounter = document.querySelector('[data-message-count]');

  // -------------------------------------------------------------------------
  // 1. Mobile navigation
  // -------------------------------------------------------------------------
  function closeNavigation() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function setupNavigation() {
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close the panel when a link is chosen, or when Escape is pressed.
    siteNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNavigation();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        closeNavigation();
        navToggle.focus();
      }
    });

    // Reset the panel when the viewport grows back to desktop width.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNavigation();
    });
  }

  // -------------------------------------------------------------------------
  // 2. Sticky header shadow
  // -------------------------------------------------------------------------
  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  // -------------------------------------------------------------------------
  // 3. Back-to-top button
  // -------------------------------------------------------------------------
  function setupToTop() {
    if (!toTopButton) return;

    toTopButton.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const brand = document.querySelector('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  function updateToTopVisibility() {
    if (!toTopButton) return;
    toTopButton.classList.toggle('is-visible', window.scrollY > 480);
  }

  // -------------------------------------------------------------------------
  // 4. Contact form helpers
  // -------------------------------------------------------------------------
  function updateMessageCounter() {
    if (!messageInput || !messageCounter) return;

    const used = messageInput.value.length;
    const limit = messageInput.getAttribute('maxlength') || 1000;
    messageCounter.textContent = used + ' / ' + limit + ' characters';

    // Warn slightly before the hard limit so the visitor is not cut off mid-sentence.
    messageCounter.classList.toggle('is-near-limit', used > Number(limit) * 0.9);
  }

  function setupContactForm() {
    if (!contactForm) return;

    updateMessageCounter();

    if (messageInput) {
      messageInput.addEventListener('input', updateMessageCounter);
    }

    // Set aria-invalid as the visitor leaves a field, then clear it once the
    // field becomes valid again. The server repeats every check on submit.
    contactForm.querySelectorAll('input[required], textarea[required]').forEach(function (field) {
      field.addEventListener('blur', function () {
        const isValid = field.checkValidity();
        field.setAttribute('aria-invalid', isValid ? 'false' : 'true');
      });

      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) {
          field.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Startup
  // -------------------------------------------------------------------------
  function init() {
    setupNavigation();
    setupToTop();
    setupContactForm();

    // One scroll handler drives both scroll-dependent behaviours.
    window.addEventListener('scroll', function () {
      updateHeaderState();
      updateToTopVisibility();
    }, { passive: true });

    updateHeaderState();
    updateToTopVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
