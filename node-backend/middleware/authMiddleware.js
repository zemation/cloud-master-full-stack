// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const getBearerUser = (req) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) return null;

  const token = authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return {
    id: decoded.id,
    role: decoded.role
  };
};

const optionalProtect = (req, res, next) => {
  if (!req.headers.authorization) return next();

  try {
    req.user = getBearerUser(req);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: err.name === 'TokenExpiredError'
        ? 'Token expired, please log in again'
        : 'Not authorized, invalid token'
    });
  }
};

/**
 * @desc Protects routes from unauthenticated access.
 * Checks for a valid JWT in the Authorization header.
 */
const protect = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token provided'
    });
  }

  try {
    req.user = getBearerUser(req);
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

module.exports = { protect, optionalProtect, authorize };