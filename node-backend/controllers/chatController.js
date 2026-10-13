// controllers/chatController.js

const { buildSystemPrompt } = require('../prompts/chatSystemPrompt');
const { findRelevantResources, listCertifications } = require('../utils/chatGrounding');

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_ITEMS = 20;
const MAX_TOKENS = 800;

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))
    .slice(-MAX_HISTORY_ITEMS);
};

const chatConfig = () => ({
  baseUrl: (process.env.CHAT_API_BASE_URL || '').replace(/\/+$/, ''),
  apiKey: process.env.CHAT_API_KEY || '',
  model: process.env.CHAT_MODEL || '',
});

const isConfigured = () => {
  const { baseUrl, apiKey, model } = chatConfig();
  return Boolean(baseUrl && apiKey && model);
};

// @desc    Stream a study-guide chat completion (SSE)
// @route   POST /chat
// @access  Public (rate-limited)
const streamChat = async (req, res, next) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Chat is not configured on the server yet.',
      });
    }

    const { message, history } = req.body || {};

    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'A message is required.' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      });
    }

    const userMessage = message.trim();
    const cleanHistory = sanitizeHistory(history);

    // Ground the answer in the site's own data
    const [certifications, resources] = await Promise.all([
      listCertifications(),
      findRelevantResources(userMessage),
    ]);

    const systemPrompt = buildSystemPrompt({ certifications, resources });

    const { baseUrl, apiKey, model } = chatConfig();

    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: systemPrompt },
          ...cleanHistory,
          { role: 'user', content: userMessage },
        ],
      }),
      signal: req.aborted ? AbortSignal.abort() : undefined,
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => '');
      console.error(`Chat upstream error ${upstream.status}: ${detail.slice(0, 300)}`);
      return res.status(502).json({
        success: false,
        error: 'The chat service is temporarily unavailable. Please try again.',
      });
    }

    // Re-stream the upstream SSE to the browser
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const abortUpstream = () => {
      // Client went away — stop reading the upstream stream
      upstream.body.cancel().catch(() => {});
    };
    req.on('close', abortUpstream);

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
      res.write('data: [DONE]\n\n');
    } finally {
      reader.releaseLock();
      req.off('close', abortUpstream);
    }

    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { streamChat };
