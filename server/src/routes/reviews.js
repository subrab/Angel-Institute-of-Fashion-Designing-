const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions from this address. Please try again later.' },
});

// PUBLIC -- list approved reviews only.
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, author_name, rating, comment, created_at
       FROM reviews WHERE status = 'approved'
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// PUBLIC -- submit a review. Goes into 'pending' -- never auto-published.
router.post(
  '/',
  submitLimiter,
  [
    body('author_name').trim().isLength({ min: 1, max: 200 }),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim().isLength({ max: 2000 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Please check the review form and try again.', details: errors.array() });
      }
      const { author_name, rating, comment } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO reviews (author_name, rating, comment, source, status)
         VALUES ($1, $2, $3, 'website form', 'pending')
         RETURNING id, author_name, rating, status, created_at`,
        [author_name, rating, comment || null]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ADMIN -- list all reviews regardless of status, for moderation.
router.get('/all', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, author_name, rating, comment, status, source, created_at
       FROM reviews ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ADMIN -- approve or reject a review.
router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [param('id').isUUID(), body('status').isIn(['pending', 'approved', 'rejected'])],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid update.' });
      }
      const { rows } = await pool.query(
        `UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *`,
        [req.body.status, req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Review not found.' });
      }
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
