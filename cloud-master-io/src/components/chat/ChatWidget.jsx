// src/components/chat/ChatWidget.jsx

import { useEffect, useRef, useState } from 'react';
import { streamChatMessage } from '../../api/chatApi';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

// Load Cloudflare's Turnstile script once. Resolves immediately when the
// site key isn't configured (bot check disabled).
const loadTurnstile = () => {
  if (!TURNSTILE_SITE_KEY) return Promise.resolve(false);
  if (window.turnstile) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

const GREETING = {
  role: 'assistant',
  content:
    "Hi! I'm the Cloud Master Study Guide. Ask me about certifications, study paths, or which topics to tackle next — I'll point you at the right resources on this site.",
};

const toHistory = (messages) =>
  messages.map((m) => ({ role: m.role, content: m.content }));

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const turnstileBoxRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const turnstileResolveRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  // Render the invisible Turnstile widget once the panel opens. When no
  // site key is configured the bot check stays disabled.
  useEffect(() => {
    if (!open || !TURNSTILE_SITE_KEY || turnstileWidgetId.current !== null) return;
    let cancelled = false;
    loadTurnstile().then((ready) => {
      if (cancelled || !ready || !turnstileBoxRef.current || !window.turnstile) return;
      turnstileWidgetId.current = window.turnstile.render(turnstileBoxRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        size: 'invisible',
        callback: (token) => {
          const resolve = turnstileResolveRef.current;
          turnstileResolveRef.current = null;
          if (resolve) resolve(token);
        },
        'expired-callback': () => {
          turnstileResolveRef.current = null;
        },
        'error-callback': () => {
          const resolve = turnstileResolveRef.current;
          turnstileResolveRef.current = null;
          if (resolve) resolve(null);
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [open ]);

  // Get a fresh bot-check token before sending. Resolves null when the
  // check is disabled or unavailable (backend skips verification then).
  const getTurnstileToken = () => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || turnstileWidgetId.current === null) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      turnstileResolveRef.current = resolve;
      window.turnstile.execute(turnstileWidgetId.current);
      setTimeout(() => {
        if (turnstileResolveRef.current) {
          turnstileResolveRef.current = null;
          resolve(null);
        }
      }, 10000);
    });
  };

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidgetId.current !== null) {
      try {
        window.turnstile.reset(turnstileWidgetId.current);
      } catch {
        // Ignore reset failures; the next execute still works.
      }
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const toggle = () => {
    if (streaming && abortRef.current) abortRef.current.abort();
    setOpen((prev) => !prev);
    setError(null);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setError(null);
    setInput('');
    setStreaming(true);

    const history = toHistory(messages);
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Invisible bot check (skipped when not configured).
      const turnstileToken = await getTurnstileToken();
      if (controller.signal.aborted) return;

      await streamChatMessage(
        { message: text, history, turnstileToken },
        {
          signal: controller.signal,
          onToken: (token) => {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: last.content + token };
              return next;
            });
          },
        }
      );
    } catch (err) {
      if (err?.name === 'AbortError') {
        // Stream cancelled — leave whatever arrived so far in place.
      } else {
        setError(err?.message || 'Something went wrong. Please try again.');
        // Drop the empty assistant bubble on failure
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === 'assistant' && !last.content) next.pop();
          return next;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      resetTurnstile();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className='chat-widget' aria-live='polite'>
      {open && (
        <div className='fixed bottom-24 right-4 z-50 flex h-[480px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101418] shadow-2xl'>
          <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
            <div>
              <p className='text-sm font-semibold text-gray-100'>Study Guide</p>
              <p className='text-xs text-gray-400'>Certification help, powered by this site</p>
            </div>
            <button
              type='button'
              onClick={toggle}
              aria-label='Close chat'
              className='rounded-full p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100'
            >
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className='flex-1 space-y-3 overflow-y-auto px-4 py-3'>
            {/* Invisible Cloudflare Turnstile mount point (bot check) */}
            <div ref={turnstileBoxRef} aria-hidden='true' className='hidden' />
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}
                >
                  {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
                </div>
              </div>
            ))}
            {error && (
              <p className='rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300'>{error}</p>
            )}
          </div>

          <div className='border-t border-white/10 p-3'>
            <div className='flex items-end gap-2'>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder='Ask about a certification…'
                aria-label='Chat message'
                disabled={streaming}
                className='max-h-28 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-sky-500 focus:outline-none disabled:opacity-50'
              />
              <button
                type='button'
                onClick={send}
                disabled={streaming || !input.trim()}
                aria-label='Send message'
                className='rounded-xl bg-sky-600 p-2.5 text-white transition hover:bg-sky-500 disabled:opacity-40'
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <line x1='22' y1='2' x2='11' y2='13' />
                  <polygon points='22 2 15 22 11 13 2 9 22 2' />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type='button'
        onClick={toggle}
        aria-label={open ? 'Close study guide chat' : 'Open study guide chat'}
        className='fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-xl transition hover:bg-sky-500'
      >
        {open ? (
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
        ) : (
          <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
