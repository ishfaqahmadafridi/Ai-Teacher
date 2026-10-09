import assert from 'node:assert/strict';
import { test } from 'node:test';
import { load } from './helpers/loadModule.mjs';
import { constants, createQueryClient, getQueryClient } from './helpers/queryHarness.mjs';

test('server renders get separate QueryClients and concurrent reads are deduplicated', async () => {
  assert.notEqual(getQueryClient(), getQueryClient());
  const client = createQueryClient();
  let calls = 0;
  let release;
  const waiting = new Promise(resolve => { release = resolve; });
  const options = { queryKey: constants.queryKeys.dashboard('a'), queryFn: async () => { calls++; await waiting; return []; } };
  const first = client.fetchQuery(options);
  const second = client.fetchQuery(options);
  release();
  assert.deepEqual(await first, []);
  await second;
  await client.fetchQuery(options);
  assert.equal(calls, 1);
  client.clear();
});

test('account changes abort queries and remove query and mutation caches', async () => {
  const client = createQueryClient();
  let subscribe;
  let signal;
  load('shared/hooks/useQueryProvider.ts', {
    react: { useEffect: effect => effect() },
    '@/features/auth/state/authStore': { useAuthStore: { subscribe: callback => { subscribe = callback; return () => {}; } } },
    '../utilities/queryClient': { getQueryClient: () => client },
  }).useQueryProvider();
  const request = client.fetchQuery({ queryKey: constants.queryKeys.profile('a'), queryFn: context => {
    signal = context.signal;
    return new Promise(() => {});
  } });
  const rejected = assert.rejects(request);
  client.getMutationCache().build(client, { mutationFn: async () => 'private', gcTime: 0 });
  subscribe({ user: { id: 'b' }, accessToken: 'b-token' }, { user: { id: 'a' }, accessToken: 'a-token' });
  await rejected;
  assert.equal(signal.aborted, true);
  assert.equal(client.getQueryCache().getAll().length, 0);
  assert.equal(client.getMutationCache().getAll().length, 0);
});
