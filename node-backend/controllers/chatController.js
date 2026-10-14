// controllers/chatController.js

const { buildSystemPrompt } = require('../prompts/chatSystemPrompt');
const { findRelevantResources, listCertifications } = require('../utils/chatGrounding');
const { checkBudget, recordUsage } = require('../utils/chatBudget');
const { verifyTurnstile } = require('../utils/turnstile');

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

    // Bot check first: fail fast before spending anything (Mongo queries,
    // let alone model tokens) on automated traffic.
    const human = await verifyTurnstile(req.body?.turnstileToken, req.ip);
    if (!human) {
      return res.status(403).json({
        success: false,
        error: 'Verification failed. Please try again.',
      });
    }

    // Hard daily spend ceiling: refuse new chats once today's token
    // budget is exhausted.
    const budget = await checkBudget();
    if (!budget.allowed) {
      return res.status(429).json({
        success: false,
        code: 'BUDGET_EXCEEDED',
        error: 'Chat is paused for today — please come back tomorrow.',
      });
    }

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
        // Ask for token counts in the final chunk so the daily budget
        // can be enforced. Providers that don't support this ignore it.
        stream_options: { include_usage: true },
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
    let buffer = '';
    let usage = null;

    // The final SSE chunk may carry { usage: { prompt_tokens, completion_tokens } }.
    const captureUsage = (payload) => {
      if (!payload || payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        if (json && json.usage) usage = json.usage;
      } catch {
        // Not JSON — ignore.
      }
    };

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        res.write(text);
        buffer += text;
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const event of events) {
          for (const line of event.split('\n')) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data:')) {
              captureUsage(trimmed.slice(5).trim());
            }
          }
        }
      }
      res.write('data: [DONE]\n\n');
    } finally {
      reader.releaseLock();
      req.off('close', abortUpstream);
    }

    // Record token usage for the daily budget (best effort — never fail
    // an otherwise successful chat over accounting).
    try {
      await recordUsage(usage?.prompt_tokens, usage?.completion_tokens);
    } catch (err) {
      console.error(`Chat usage recording failed: ${err.message}`);
    }

    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = { streamChat };
