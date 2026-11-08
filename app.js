/**
 * File name: app.js
 * Student's Name: Han
 * Student ID: 2024110006
 * Date: 2026-11-08
 *
 * Application entry point. Configures the Express application produced by the
 * Express Generator (EJS flavour) and mounts the site routes.
 */

// ---------------------------------------------------------------------------
// Module dependencies
// ---------------------------------------------------------------------------
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

// ---------------------------------------------------------------------------
// View engine setup (EJS templates live in /views)
// ---------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Everything inside /public is served from the site root, exactly as the
// Express Generator arranges it (e.g. /css/style.css, /images/logo.svg).
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

// Values every template can rely on without each route re-declaring them.
app.use((req, res, next) => {
  res.locals.studentName = 'Han';
  res.locals.studentId = '2024110006';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.activePage = '';
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/', indexRouter);

// ---------------------------------------------------------------------------
// 404 handler - forward to the error handler below
// ---------------------------------------------------------------------------
app.use((req, res, next) => {
  next(createError(404));
});

// ---------------------------------------------------------------------------
// Error handler - renders views/error.ejs
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', {
    pageTitle: 'Something went wrong',
    activePage: '',
  });
});

module.exports = app;
