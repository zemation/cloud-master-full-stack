// utils/turnstile.js
//
// Cloudflare Turnstile verification for the study-guide chat.
// If TURNSTILE_SECRET_KEY is not set, verification is skipped so local
// development works without a Turnstile account.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verify a Turnstile token from the chat widget.
 * @param {string} token - the token submitted by the browser
 * @param {string} ip - the visitor's IP (from Express req.ip)
 * @returns {Promise<boolean>} true when human (or when not configured)
 */
const verifyTurnstile = async (token, ip) => {
  const secret = process.env.TURNSTILE_SECRET_KEY || '';
  if (!secret) return true;
  if (!token || typeof token !== 'string') return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
    });
    const data = await response.json();
    return data && data.success === true;
  } catch (error) {
    console.error(`Turnstile verification failed: ${error.message}`);
    // Fail closed: if we can't reach Cloudflare, don't spend model tokens.
    return false;
  }
};

module.exports = { verifyTurnstile };
