import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/loadModule.mjs';

test('scheduled lesson sends only its class ID and does not recover another class’s pending job', async () => {
  const oldId = '00000000-0000-4000-8000-000000000001';
  const currentId = '00000000-0000-4000-8000-000000000002';
  let payload, reads = 0;
  const records = new Map([['classroom_pending_lesson:session', JSON.stringify({ id: oldId, question: 'Teach this lesson', scheduledSessionId: oldId })]]);
  const { ClassroomService } = load('features/classroom/services/classroomService.ts', {
    '@/lib/api': { apiClient: {
      get: async () => { reads++; throw new Error('Do not resume another class'); },
      post: async (_url, data) => { payload = data; return { data: { id: currentId, status: 'ready', error: '', result: { chunks: [{ speak: 'A scheduled lesson' }], topic: 'Plants', language: 'en', diagram_type: 'default' } } }; },
    } },
  }, { crypto: { randomUUID: () => currentId }, sessionStorage: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) } });
  await ClassroomService.askQuestion({ question: 'Teach this lesson', sessionId: 'session', scheduledSessionId: currentId });
  assert.equal(payload.scheduled_session_id, currentId);
  assert.equal(payload.question, 'Teach this lesson');
  assert.equal('curriculum' in payload, false);
  assert.equal(reads, 0);
});

test('pending lesson storage preserves class context for page refresh recovery', () => {
  const records = new Map();
  const pending = load('features/classroom/utilities/pendingLessonJob.ts', {}, {
    sessionStorage: { getItem: key => records.get(key), setItem: (key, value) => records.set(key, value), removeItem: key => records.delete(key) },
  });
  const id = '00000000-0000-4000-8000-000000000001';
  pending.savePendingLessonJob('session', id, 'Teach this lesson', id);
  assert.equal(pending.readPendingLessonJob('session').scheduledSessionId, id);
});
