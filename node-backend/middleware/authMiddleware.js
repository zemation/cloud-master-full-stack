// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const asyncHandler = require('express-async-handler');

/**
 * @desc Protects routes from unauthenticated access.
 * Checks for a valid JWT in the Authorization header.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in headers
  // The token is usually sent as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer" and the token itself)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token payload (excluding the password)
      // The payload contains the user ID we stored when creating the token.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found.');
      }

      // Proceed to the next middleware or controller function
      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed or expired.');
    }
  }

  // If no token is found at all
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided.');
  }
});

module.exports = { protect };