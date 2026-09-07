require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { attachUser } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const coursesRoutes = require('./routes/courses');
const galleryRoutes = require('./routes/gallery');
const reviewsRoutes = require('./routes/reviews');
const settingsRoutes = require('./routes/settings');

const app = express();

// Comma-separated list in .env, e.g. https://angelinstitute.in,https://www.angelinstitute.in
// Falls back to allowing any origin in development so the frontend can run locally.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(attachUser);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/settings', settingsRoutes);

// 404 for anything under /api that didn't match a route above.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Central error handler -- keeps stack traces out of API responses.
app.use((err, req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Something went wrong. Please try again.' : err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Angel API listening on port ${PORT}`);
});

module.exports = app;
