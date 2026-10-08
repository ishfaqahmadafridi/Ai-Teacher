import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';
import { constants, createQueryClient } from './helpers/queryHarness.mjs';
import { MutationObserver } from '@tanstack/react-query';

test('empty backend dashboard lists stay empty and mutations never retry automatically', () => {
  const { mapDashboardOverview } = load('features/dashboard/utilities/dashboardDataUtils.ts', {
    '../constants/dashboardDataConstants': load('features/dashboard/constants/dashboardDataConstants.ts'),
  });
  const result = mapDashboardOverview({ courses: [], live_classes: [], assignments: [], continue_learning: null });
  assert.equal(result.registeredCourses.length, 0);
  assert.equal(result.liveClasses.length, 0);
  assert.equal(result.assignments.length, 0);
  assert.equal(result.continueLearning, undefined);
  const client = createQueryClient();
  assert.equal(client.getDefaultOptions().mutations.retry, false);
  client.clear();
});

test('course registration failures do not create cached courses or report success', async () => {
  const client = createQueryClient();
  const original = { courses: [] };
  client.setQueryData(constants.queryKeys.dashboard('a'), original);
  const store = selector => selector({ user: { id: 'a' } });
  store.getState = () => ({ user: { id: 'a' } });
  let calls = 0;
  const { useDashboardData } = load('features/dashboard/hooks/useDashboardData.ts', {
    '@tanstack/react-query': { useQueryClient: () => client, useQuery: () => ({}),
      useMutation: options => ({ mutateAsync: input => new MutationObserver(client, options).mutate(input) }) },
    '@/services/dashboardService': { DashboardService: { registerCourse: async () => { calls++; throw new Error('Backend rejected registration'); } } },
    '@/features/auth/state/authStore': { useAuthStore: store },
    '@/shared/constants/queryConstants': constants,
    '../utilities/dashboardDataUtils': { mapDashboardOverview() {} },
    '../constants/dashboardConstants': { DEFAULT_CONTINUE_LEARNING: {} },
  });
  await assert.rejects(useDashboardData().handleRegisterCourse({ title: 'Physics', subjectField: 'Science', courseCode: 'PHY', creditHours: 3 }), /Backend rejected/);
  assert.equal(client.getQueryData(constants.queryKeys.dashboard('a')), original);
  assert.equal(calls, 1);
  client.clear();
});
