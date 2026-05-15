// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * @desc Protects routes from unauthenticated access.
 * Checks for a valid JWT in the Authorization header.
 */
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }

  try {
    // JWT contains id and role — no DB call needed
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired, please log in again'
      : 'Not authorized, invalid token';

    return res.status(401).json({
      success: false,
      error: message
    });
  }
};

/**
 * @desc Restricts access to specific roles.
 * Must be used after protect middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };