const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { pool } = require('../db');
const { verifyPassword, signToken } = require('../utils/auth');

const router = express.Router();

// A handful of attempts per window is plenty for a real admin logging in,
// and slows down anyone trying to brute-force the password.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Enter a valid email and password.' });
      }

      const { email, password } = req.body;
      const { rows } = await pool.query(
        'SELECT id, name, email, password_hash, role FROM users WHERE email = $1 AND deleted_at IS NULL',
        [email]
      );
      const user = rows[0];

      // Same generic error whether the email doesn't exist or the password is wrong --
      // never reveal which one it was.
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = signToken(user);
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
