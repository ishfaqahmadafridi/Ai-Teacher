import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const { MutationObserver } = require('@tanstack/react-query');
const root = resolve(import.meta.dirname, '../..');
function load(path, mocks = {}) {
  const source = ts.transpileModule(readFileSync(resolve(root, path), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(source, { module: testModule, exports: testModule.exports, console,
    require: name => name in mocks ? mocks[name] : require(name),
  });
  return testModule.exports;
}
const constants = load('shared/constants/queryConstants.ts');
const { createQueryClient: createProductionQueryClient, getQueryClient } = load('shared/utilities/queryClient.ts', {
  '../constants/queryConstants': constants,
});
function createQueryClient() {
  const client = createProductionQueryClient();
  const defaults = client.getDefaultOptions();
  client.setDefaultOptions({ ...defaults, queries: { ...defaults.queries, gcTime: 0 } });
  return client;
}


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

test('classroom response parsing preserves diagram metadata and rejects malformed chunks', () => {
  const { classroomAnswerSchema } = load('features/classroom/validators/classroom.schema.ts');
  const response = classroomAnswerSchema.parse({
    chunks: [{ speak: 'Force has magnitude and direction.', diagram: { action: 'none', enabled: true, type: 'diagram' } }],
    topic: 'Force', language: 'en', diagram_type: 'vector_force',
  });
  assert.equal(response.chunks[0].diagram.enabled, true);
  assert.equal(response.diagram_type, 'default');
  assert.equal(classroomAnswerSchema.safeParse({ chunks: 'bad' }).success, false);
});

test('native emoji picker keeps reaction callbacks and removes its element on cleanup', async () => {
  let effect;
  let selected;
  let removed = false;
  let options;
  const element = { remove: () => { removed = true; } };
  const container = { appendChild: child => assert.equal(child, element) };
  const { useEmojiReactionPicker } = load('features/classroom/hooks/useEmojiReactionPicker.ts', {
    react: { useRef: () => ({ current: container }), useEffect: callback => { effect = callback; } },
    '@emoji-mart/data': {},
    '../constants/inputConstants': { EMOJI_PICKER_OPTIONS: { theme: 'dark', perLine: 7 } },
    'emoji-mart': { Picker: class { constructor(input) { options = input; return element; } } },
  });
  useEmojiReactionPicker(true, (emoji, name) => { selected = [emoji, name]; });
  const cleanup = effect();
  await new Promise(resolve => setImmediate(resolve));
  options.onEmojiSelect({ native: '😀', name: 'Grinning' });
  assert.deepEqual(selected, ['😀', 'Grinning']);
  assert.equal(options.perLine, 7);
  cleanup();
  assert.equal(removed, true);
});

test('closing the emoji picker during lazy loading does not append a detached picker', async () => {
  let effect;
  let mounted = 0;
  const { useEmojiReactionPicker } = load('features/classroom/hooks/useEmojiReactionPicker.ts', {
    react: { useRef: () => ({ current: { appendChild: () => { mounted++; } } }), useEffect: callback => { effect = callback; } },
    '@emoji-mart/data': {},
    '../constants/inputConstants': { EMOJI_PICKER_OPTIONS: {} },
    'emoji-mart': { Picker: class {} },
  });
  useEmojiReactionPicker(true, () => {});
  effect()();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(mounted, 0);
});

test('custom timetable respects user hours and never overlaps daily classes', () => {
  const { generateSuggestedTimetable } = load('features/dashboard/utilities/scheduleUtils.ts');
  const prefs = { preferredTime: 'custom', customStartTime: '13:15', customEndTime: '16:45', maxClassesPerDay: 4, includeSaturday: true, registeredCourses: ['A', 'B', 'C', 'D', 'E', 'F'] };
  const result = generateSuggestedTimetable(prefs);
  assert.ok(result.schedule.length > 0);
  const occupied = new Set();
  for (const item of result.schedule) {
    assert.ok(['01:15 PM - 02:45 PM', '03:15 PM - 04:45 PM'].includes(item.timeSlot));
    const key = `${item.dayOfWeek}:${item.timeSlot}`;
    assert.equal(occupied.has(key), false);
    occupied.add(key);
  }
  assert.throws(() => generateSuggestedTimetable({ ...prefs, customEndTime: '13:45' }), /90-minute/);
  assert.throws(() => generateSuggestedTimetable({ ...prefs, customStartTime: '25:00' }), /90-minute/);
});
