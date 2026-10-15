// src/api/chatApi.js

import { API_URL } from '../config/config';

const CHAT_URL = `${API_URL}/chat`;

// Pull a text token out of one SSE `data:` payload. Handles the
// OpenAI-compatible `choices[0].delta.content` shape plus a couple of
// common alternates.
const extractToken = (payload) => {
  if (!payload || payload === '[DONE]') return '';
  try {
    const json = JSON.parse(payload);
    return (
      json?.choices?.[0]?.delta?.content ??
      json?.choices?.[0]?.message?.content ??
      json?.text ??
      json?.content ??
      ''
    );
  } catch {
    return '';
  }
};

/**
 * Stream a chat completion from the backend.
 *
 * @param {Object} args
 * @param {string} args.message - the visitor's message
 * @param {Array<{role: string, content: string}>} [args.history] - prior turns
 * @param {string} [args.turnstileToken] - Cloudflare Turnstile token (bot check)
 * @param {Object} callbacks
 * @param {(token: string) => void} callbacks.onToken - called per streamed token
 * @param {AbortSignal} [callbacks.signal] - to cancel the stream
 * @returns {Promise<void>} resolves when the stream completes
 * @throws {Error} with the server's message on failure
 */
export const streamChatMessage = async (
  { message, history = [], turnstileToken = null },
  { onToken, signal }
) => {
  const response = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, turnstileToken }),
    signal,
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let detail = `Chat request failed (${response.status}).`;
    try {
      const data = await response.json();
      if (data?.error) detail = data.error;
    } catch {
      // fall through with the generic message
    }
    throw new Error(detail);
  }

  if (!contentType.includes('text/event-stream') || !response.body) {
    throw new Error('Unexpected response from the chat service.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by blank lines
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        const lines = event.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') return;
          const token = extractToken(payload);
          if (token) onToken(token);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};
