const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const { pool } = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public enquiry form shouldn't be spammable.
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many enquiries from this address. Please try again later.' },
});

const VALID_INTERESTS = ['institute', 'tailoring'];
const VALID_SOURCES = ['website', 'instagram', 'whatsapp', 'google', 'referral', 'other'];
const VALID_STATUSES = ['new', 'contacted', 'converted', 'lost'];

// PUBLIC -- create a lead from the website's enquiry form.
router.post(
  '/',
  enquiryLimiter,
  [
    body('name').trim().isLength({ min: 1, max: 200 }),
    body('phone').trim().isLength({ min: 6, max: 20 }),
    body('interested_in').isIn(VALID_INTERESTS),
    body('source').optional().isIn(VALID_SOURCES),
    body('message').optional().trim().isLength({ max: 2000 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Please check the enquiry form and try again.', details: errors.array() });
      }

      const { name, phone, interested_in, message } = req.body;
      const source = req.body.source || 'website';

      const { rows } = await pool.query(
        `INSERT INTO leads (name, phone, interested_in, source, message)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, phone, interested_in, source, status, created_at`,
        [name, phone, interested_in, source, message || null]
      );

      res.status(201).json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// ADMIN -- list leads, optionally filtered by status.
router.get('/', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { status } = req.query;
    let sql = `SELECT id, name, phone, interested_in, source, message, status, assigned_to, created_at, updated_at
               FROM leads`;
    const params = [];
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status filter.' });
      }
      params.push(status);
      sql += ` WHERE status = $${params.length}`;
    }
    sql += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ADMIN -- update a lead's status / assignment.
router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN', 'SUPER_ADMIN', 'STAFF'),
  [
    param('id').isUUID(),
    body('status').optional().isIn(VALID_STATUSES),
    body('assigned_to').optional({ nullable: true }).isUUID(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid update.', details: errors.array() });
      }

      const { id } = req.params;
      const fields = [];
      const params = [];

      if (req.body.status !== undefined) {
        params.push(req.body.status);
        fields.push(`status = $${params.length}`);
      }
      if (req.body.assigned_to !== undefined) {
        params.push(req.body.assigned_to);
        fields.push(`assigned_to = $${params.length}`);
      }
      if (fields.length === 0) {
        return res.status(400).json({ error: 'Nothing to update.' });
      }

      params.push(id);
      const { rows } = await pool.query(
        `UPDATE leads SET ${fields.join(', ')} WHERE id = $${params.length}
         RETURNING id, name, phone, interested_in, source, status, assigned_to, updated_at`,
        params
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Lead not found.' });
      }
      res.json(rows[0]);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
