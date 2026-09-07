const { verifyToken } = require('../utils/auth');

// Attaches req.user if a valid token is present. Does not block the request.
function attachUser(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch (err) {
      // invalid/expired token -- treat as unauthenticated, let requireAuth handle it
    }
  }
  next();
}

// Blocks the request unless a valid token was attached.
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  next();
}

// Blocks the request unless req.user's role is in the allowed list.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to do that.' });
    }
    next();
  };
}

module.exports = { attachUser, requireAuth, requireRole };
