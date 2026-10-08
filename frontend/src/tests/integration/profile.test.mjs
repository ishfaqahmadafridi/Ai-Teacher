import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';
import { constants, createQueryClient } from './helpers/queryHarness.mjs';
import { MutationObserver } from '@tanstack/react-query';

function authHarness() {
  const client = createQueryClient();
  let state = { user: { id: 'a', email: 'old' }, accessToken: 'a-token' };
  const store = selector => selector(state);
  store.getState = () => ({ ...state, setUser: user => { state = { ...state, user }; }, clearAuth: () => { state = { user: null, accessToken: null }; } });
  const hooks = load('features/auth/hooks/useAuthQueries.ts', {
    '@tanstack/react-query': { useQueryClient: () => client, useQuery: options => options,
      useMutation: options => ({ mutateAsync: input => new MutationObserver(client, options).mutate(input) }) },
    '../state/authStore': { useAuthStore: store },
    '../services/authService': { AuthService: {} },
    '@/shared/constants/queryConstants': constants,
  });
  return { client, hooks, state: () => state, change: next => { state = next; } };
}

test('profile save updates the shared profile and invalidates dashboard data', async () => {
  const h = authHarness();
  h.client.setQueryData(constants.queryKeys.dashboard('a'), { courses: [] });
  const updated = { id: 'a', email: 'updated' };
  await h.hooks.useProfileMutation().mutateAsync(async () => updated);
  assert.equal(h.client.getQueryData(constants.queryKeys.profile('a')), updated);
  assert.equal(h.state().user, updated);
  assert.equal(h.client.getQueryState(constants.queryKeys.dashboard('a')).isInvalidated, true);
  h.client.clear();
});

test('failed profile saves and late responses from another account cannot overwrite identity', async () => {
  const h = authHarness();
  await assert.rejects(h.hooks.useProfileMutation().mutateAsync(async () => { throw new Error('Rejected'); }), /Rejected/);
  assert.equal(h.state().user.email, 'old');
  await assert.rejects(h.hooks.useProfileMutation().mutateAsync(async () => {
    h.change({ user: { id: 'b', email: 'second' }, accessToken: 'b-token' });
    return { id: 'a', email: 'late' };
  }), /account changed/);
  assert.equal(h.state().user.email, 'second');
  assert.equal(h.client.getQueryData(constants.queryKeys.profile('a')), undefined);
  h.client.clear();
});

test('profile verification rejects a mismatched server identity', async () => {
  const client = createQueryClient();
  let cleared = false;
  const store = selector => selector({ user: { id: 'a' }, accessToken: 'token' });
  store.getState = () => ({ user: { id: 'a' }, accessToken: 'token', clearAuth: () => { cleared = true; } });
  const hooks = load('features/auth/hooks/useAuthQueries.ts', {
    '@tanstack/react-query': { useQuery: options => options },
    '../state/authStore': { useAuthStore: store },
    '../services/authService': { AuthService: { getProfile: async () => ({ id: 'b' }) } },
    '@/shared/constants/queryConstants': constants,
  });
  await assert.rejects(client.fetchQuery(hooks.useProfileQuery()), /verify your account/);
  assert.equal(cleared, true);
  client.clear();
});
