const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '12h';

function hashPassword(plain) {
  return bcrypt.hash(plain, 12);
}

function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  }
  return jwt.sign(
    { sub: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  }
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken };
