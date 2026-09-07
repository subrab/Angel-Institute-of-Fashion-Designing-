const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const VALID_TRACKS = ['fashion_designing', 'tailoring'];

// PUBLIC -- list active courses.
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, track, name, duration, description, is_certification, sort_order
       FROM courses
       WHERE is_active = true
       ORDER BY track, sort_order`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ADMIN -- create a course. Deliberately no fee field -- fees are not displayed publicly.
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [
    body('track').isIn(VALID_TRACKS),
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('duration').trim().isLength({ min: 1, max: 50 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('is_certification').optional().isBoolean(),
    body('sort_order').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid course data.', details: errors.array() });
      }

      const { track, name, duration, description, is_certification, sort_order } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO courses (track, name, duration, description, is_certification, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [track, name, duration, description || null, is_certification || false, sort_order || 0]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ADMIN -- update a course.
router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [
    param('id').isUUID(),
    body('name').optional().trim().isLength({ min: 1, max: 200 }),
    body('duration').optional().trim().isLength({ min: 1, max: 50 }),
    body('description').optional().trim().isLength({ max: 2000 }),
    body('is_certification').optional().isBoolean(),
    body('is_active').optional().isBoolean(),
    body('sort_order').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid update.', details: errors.array() });
      }

      const allowed = ['name', 'duration', 'description', 'is_certification', 'is_active', 'sort_order'];
      const fields = [];
      const params = [];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          params.push(req.body[key]);
          fields.push(`${key} = $${params.length}`);
        }
      }
      if (fields.length === 0) {
        return res.status(400).json({ error: 'Nothing to update.' });
      }

      params.push(req.params.id);
      const { rows } = await pool.query(
        `UPDATE courses SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
        params
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ADMIN -- delete a course.
router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [param('id').isUUID()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid course id.' });
      }
      const { rowCount } = await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
