import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';
const globals = { TextDecoder };
const { readChatStream } = load('features/ask/utilities/readChatStream.ts', {}, globals);
const encoder = new TextEncoder();
const body = (text) => new ReadableStream({ start(c) { for (const byte of encoder.encode(text)) c.enqueue(new Uint8Array([byte])); c.close(); } });

test('chat renders tokens incrementally across split SSE and UTF-8 boundaries', async () => {
  const tokens = [];
  await readChatStream(body('data: {"token":"Hello café","done":false}\r\n\r\ndata: {"token":"!","done":false}\n\ndata: {"done":true}\n\n'), token => tokens.push(token));
  assert.equal(tokens.join(''), 'Hello café!');
  assert.equal(tokens.length, 2);
});

test('chat rejects interrupted responses and explicit backend errors', async () => {
  await assert.rejects(readChatStream(body('data: {"token":"partial","done":false}\n\n'), () => {}), /interrupted/);
  await assert.rejects(readChatStream(body('data: {"error":"Service unavailable","done":true}\n\n'), () => {}), /Service unavailable/);
});

test('chat sends authenticated streaming requests instead of classroom lesson jobs', async () => {
  let request;
  const { AskService } = load('features/ask/services/askService.ts', { '@/lib/api': { apiClient: {} }, '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ user: { id: '42' } }) } } }, {
    ...globals, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => { request = { url, options }; return { ok: true, body: body('data: {"token":"Hi!","done":false}\n\ndata: {"done":true}\n\n') }; },
  });
  let answer = '';
  await AskService.streamQuestion({ question: 'hi', sessionId: 'a9b8c7d6-e5f4-43a2-a1c0-e9f8a7b6c5d4', accessToken: 'test-only', signal: new AbortController().signal, onToken: t => { answer += t; } });
  assert.equal(request.url, '/api/chat/stream');
  assert.equal(request.options.headers.Authorization, 'Bearer test-only');
  assert.equal(answer, 'Hi!');
});

test('chat fails with a clear message when first-token timeout expires', async () => {
  const { AskService } = load('features/ask/services/askService.ts', { '@/lib/api': { apiClient: {} }, '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ user: { id: '42' } }) } } }, {
    ...globals, AbortController, clearTimeout, setTimeout: callback => setTimeout(callback, 5),
    fetch: async (url, { signal }) => new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))),
  });
  await assert.rejects(AskService.streamQuestion({ question: 'hi', sessionId: 'a9b8c7d6-e5f4-43a2-a1c0-e9f8a7b6c5d4', accessToken: 'test-only', signal: new AbortController().signal, onToken: () => {} }), /too long/);
});

test('chat refreshes an expired access token once and retries with the new token', async () => {
  let refreshes = 0;
  const tokens = [];
  const { AskService } = load('features/ask/services/askService.ts', {
    '@/lib/api': { apiClient: {}, refreshAccessToken: async (id) => { assert.equal(id, '42'); refreshes++; return 'fresh-access'; } },
    '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ user: { id: '42' } }) } },
  }, {
    ...globals, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      tokens.push(options.headers.Authorization);
      return tokens.length === 1 ? { ok: false, status: 401, body: { cancel: async () => {} } }
        : { ok: true, status: 200, body: body('data: {"token":"Welcome back","done":true}\n\n') };
    },
  });
  let answer = '';
  await AskService.streamQuestion({ question: 'hi', sessionId: 'a9b8c7d6-e5f4-43a2-a1c0-e9f8a7b6c5d4', accessToken: 'expired-access', signal: new AbortController().signal, onToken: token => { answer += token; } });
  assert.deepEqual(tokens, ['Bearer expired-access', 'Bearer fresh-access']);
  assert.equal(refreshes, 1);
  assert.equal(answer, 'Welcome back');
});

test('a repeated chat 401 is reported without an infinite refresh loop', async () => {
  let refreshes = 0;
  let requests = 0;
  const { AskService } = load('features/ask/services/askService.ts', {
    '@/lib/api': { apiClient: {}, refreshAccessToken: async () => { refreshes++; return 'fresh'; } },
    '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ user: { id: '42' } }) } },
  }, {
    ...globals, AbortController, setTimeout, clearTimeout,
    fetch: async () => { requests++; return { ok: false, status: 401, body: { cancel: async () => {} } }; },
  });
  await assert.rejects(AskService.streamQuestion({ question: 'hi', sessionId: 'a9b8c7d6-e5f4-43a2-a1c0-e9f8a7b6c5d4', accessToken: 'token', signal: new AbortController().signal, onToken: () => {} }), /could not verify/);
  assert.equal(refreshes, 1);
  assert.equal(requests, 2);
});
