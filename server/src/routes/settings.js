const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// PUBLIC -- fetch all settings as a single key/value object (contact info, hours, etc).
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT key, value FROM site_settings');
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// ADMIN -- update one setting by key (creates it if it doesn't exist yet).
router.put(
  '/:key',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN'),
  [body('value').isString().isLength({ max: 2000 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid value.' });
      }
      const { key } = req.params;
      const { rows } = await pool.query(
        `INSERT INTO site_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
         RETURNING key, value`,
        [key, req.body.value]
      );
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
