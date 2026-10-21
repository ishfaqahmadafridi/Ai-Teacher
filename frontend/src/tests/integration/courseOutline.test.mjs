import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';

test('course outline drafts are fetched separately from explicit saves', async () => {
  const calls = [];
  const draft = { topics: ['Foundations', 'Sorting'], source: 'ai', updated_at: null };
  const { courseOutlineService } = load('features/dashboard/services/courseOutlineService.ts', {
    '@/lib/api': { apiClient: {
      get: async url => { calls.push(['GET', url]); return { data: { topics: [], source: '', updated_at: null } }; },
      post: async (url, payload, config) => { calls.push(['POST', url, config.timeout]); return { data: draft }; },
      put: async (url, payload) => { calls.push(['PUT', url, payload]); return { data: { ...payload, updated_at: '2026-10-21T00:00:00Z' } }; },
    } },
  });
  assert.equal((await courseOutlineService.read('42')).topics.length, 0);
  assert.equal((await courseOutlineService.generate('42')).topics[1], 'Sorting');
  assert.equal(calls.filter(call => call[0] === 'PUT').length, 0);
  const saved = await courseOutlineService.save('42', { ...draft, topics: ['Foundations', 'Sorting edited'] });
  assert.equal(saved.topics[1], 'Sorting edited');
  assert.equal(calls[1][1], '/api/dashboard/courses/42/outline/generate/');
  assert.equal(calls[1][2], 45000);
  assert.equal(calls[2][1], '/api/dashboard/courses/42/outline/');
});

test('successful registration opens outline setup without closing the modal', async () => {
  const updates = [], course = { id: '42', title: 'Algorithms' };
  let closed = false;
  const { useRegisterCourseModal } = load('features/dashboard/hooks/useRegisterCourseModal.ts', {
    react: {
      useCallback: fn => fn,
      useState: initial => [initial && typeof initial === 'object' && 'subjectField' in initial
        ? { subjectField: 'Computer Science', title: 'Algorithms', courseCode: 'CS101', creditHours: 3 } : initial,
        value => updates.push(value)],
    },
  });
  const modal = useRegisterCourseModal({ isOpen: true, onClose: () => { closed = true; }, onRegisterCourse: async () => course });
  await modal.handleSubmit({ preventDefault() {} });
  assert.equal(closed, false);
  assert.ok(updates.includes(course));
});
