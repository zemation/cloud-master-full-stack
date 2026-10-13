// routes/chatRoutes.js

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const { streamChat } = require('../controllers/chatController');

// Stricter than the global limiter: every chat message spends model
// tokens, so keep per-IP usage bounded. Tune CHAT_RATE_MAX to taste.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.CHAT_RATE_MAX || '30', 10),
  message: {
    success: false,
    error: 'Too many chat messages, please slow down and try again later.',
  },
});

// @route   POST /chat
// @access  Public (rate-limited)
router.post('/', chatLimiter, streamChat);

module.exports = router;
