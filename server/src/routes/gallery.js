const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['institute', 'tailoring'];

// PUBLIC -- list active gallery items.
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    let sql = `SELECT id, image_url, category, caption, sort_order
               FROM gallery_items WHERE is_active = true`;
    const params = [];
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid category filter.' });
      }
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }
    sql += ' ORDER BY category, sort_order';

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ADMIN -- add a gallery item. NOTE: this stores an image URL, it does not accept
// file uploads yet -- that needs object storage wiring, which is a separate task.
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [
    body('image_url').isURL(),
    body('category').isIn(VALID_CATEGORIES),
    body('caption').optional().trim().isLength({ max: 300 }),
    body('sort_order').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid gallery item.', details: errors.array() });
      }
      const { image_url, category, caption, sort_order } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO gallery_items (image_url, category, caption, sort_order)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [image_url, category, caption || null, sort_order || 0]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ADMIN -- remove a gallery item (soft: flips is_active off, keeps history).
router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [param('id').isUUID()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid gallery item id.' });
      }
      const { rowCount } = await pool.query(
        'UPDATE gallery_items SET is_active = false WHERE id = $1',
        [req.params.id]
      );
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Gallery item not found.' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
