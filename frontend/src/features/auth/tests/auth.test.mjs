import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { test } from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const sourceRoot = resolve(import.meta.dirname, '../../..');

function loadSource(path, mocks = {}) {
  const file = resolve(sourceRoot, path);
  const javascript = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(javascript, {
    module: testModule, exports: testModule.exports,
    require: (name) => name in mocks ? mocks[name] : require(name),
    console, Error, window: {}, localStorage: { removeItem() {} },
  }, { filename: file });
  return testModule.exports;
}

const apiUser = {
  id: 42, first_name: 'Ayesha', last_name: 'Khan', username: 'ayesha',
  email: 'ayesha@example.com', country_code: '+92', mobile: '3007654321',
  role: 'student', avatar_url: null, cover_url: '', created_at: '2026-10-06T00:00:00Z',
  is_verified: false, bio: 'Physics student', grade_level: 'University',
  preferred_language: 'Urdu', dob: null, country: 'Pakistan', timezone: 'Asia/Karachi',
  education_level: 'undergraduate', academic_year: 'junior', selected_interests: ['Physics'],
  onboarding_completed: true,
};
const userUtils = loadSource('features/auth/utilities/userUtils.ts');

test('API identity fields map into the frontend schema without losing real values', () => {
  const user = userUtils.mapAuthUser(apiUser);
  assert.equal(user.id, '42');
  assert.equal(user.firstName, 'Ayesha');
  assert.equal(user.lastName, 'Khan');
  assert.equal(user.email, apiUser.email);
  assert.equal(user.countryCode, '+92');
  assert.equal(user.mobile, apiUser.mobile);
  assert.equal(user.createdAt, apiUser.created_at);
  assert.equal(user.onboardingCompleted, true);
  assert.equal(user.isVerified, false);
  assert.equal(user.avatarUrl, undefined);
});

test('login, registration, and profile reads share the same API identity conversion', async () => {
  const calls = [];
  const apiClient = {
    post: async (url, payload) => { calls.push([url, payload]); return { data: { user: apiUser, access: 'signed-access', refresh: 'signed-refresh' } }; },
    get: async () => ({ data: apiUser }),
    patch: async (url, payload) => { calls.push([url, payload]); return { data: { ...apiUser, first_name: 'Updated' } }; },
  };
  const { AuthService } = loadSource('features/auth/services/authService.ts', {
    '@/lib/api': { apiClient }, '../utilities/userUtils': userUtils,
  });
  const login = await AuthService.login({ email: apiUser.email, password: 'password' });
  assert.equal(login.user.firstName, 'Ayesha');
  assert.equal(login.refresh, 'signed-refresh');
  const register = await AuthService.register({ firstName: 'Ayesha', lastName: 'Khan', email: apiUser.email, password: 'password' });
  assert.equal(register.user.countryCode, '+92');
  assert.equal((await AuthService.getProfile()).lastName, 'Khan');
  assert.equal((await AuthService.updateProfile({ first_name: 'Updated' })).firstName, 'Updated');
  assert.equal(calls[0][0], '/api/auth/login/');
  assert.equal(calls[1][1].first_name, 'Ayesha');
  assert.equal(calls[2][0], '/api/auth/me/');
});

test('switching accounts replaces credentials and clears the prior onboarding identity', () => {
  const bound = [];
  let resets = 0;
  const { useAuthStore } = loadSource('features/auth/state/authStore.ts', {
    '../../onboarding/state/onboardingStore': {
      useOnboardingStore: { getState: () => ({ bindUser: (user) => bound.push(user.id), resetOnboarding: () => { resets += 1; } }) },
    },
  });
  const first = userUtils.mapAuthUser(apiUser);
  useAuthStore.getState().setUser(first, 'first-access', 'first-refresh');
  useAuthStore.getState().setUser(first, 'renewed-access');
  assert.equal(useAuthStore.getState().refreshToken, 'first-refresh');
  const second = { ...first, id: '84', email: 'second@example.com' };
  useAuthStore.getState().setUser(second, 'second-access', 'second-refresh');
  assert.equal(useAuthStore.getState().user.email, 'second@example.com');
  assert.equal(useAuthStore.getState().refreshToken, 'second-refresh');
  assert.deepEqual(bound, ['42', '84']);
  useAuthStore.getState().clearAuth();
  assert.equal(useAuthStore.getState().user, null);
  assert.equal(useAuthStore.getState().refreshToken, null);
  assert.equal(resets, 1);
});

test('missing phone numbers display empty rather than an invented contact number', () => {
  const { formatPhoneWithCountryCode } = loadSource('features/dashboard/utilities/profileUtils.ts');
  assert.equal(formatPhoneWithCountryCode(undefined, '+92'), '');
  assert.equal(formatPhoneWithCountryCode('03007654321', '+92'), '+92 3007654321');
  assert.equal(formatPhoneWithCountryCode('+923007654321', '+92'), '+923007654321');
});

test('invalid login errors do not try token refresh or clear the current account', async () => {
  let onError;
  let refreshCalls = 0;
  let cleared = 0;
  loadSource('lib/api/interceptors.ts', {
    axios: { default: { isCancel: () => false, post: async () => { refreshCalls += 1; } } },
    './client': { BASE_URL: 'http://backend', apiClient: { interceptors: {
      request: { use() {} }, response: { use(success, failure) { onError = failure; } },
    } } },
    '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ clearAuth: () => { cleared += 1; } }) } },
  });
  await assert.rejects(() => onError({ response: { status: 401, data: { detail: 'Invalid email or password.' } },
    config: { url: '/api/auth/login/', headers: {} } }), /Invalid email or password/);
  assert.equal(refreshCalls, 0);
  assert.equal(cleared, 0);
});

test('the displayed profile follows the signed-in database user rather than browser defaults', () => {
  const profileUtils = loadSource('features/dashboard/utilities/profileUtils.ts');
  const defaults = loadSource('features/dashboard/constants/profileConstants.ts');
  const user = userUtils.mapAuthUser({ ...apiUser, id: 12345, mobile: null });
  const useAuthStore = (select) => select({ user, accessToken: 'signed-access' });
  const { useStudentProfile } = loadSource('features/dashboard/hooks/useStudentProfile.ts', {
    react: { useState: (initial) => [initial, () => {}], useEffect() {}, useMemo: (calculate) => calculate(), useCallback: (fn) => fn },
    'next/navigation': { useRouter: () => ({ replace() {} }) },
    '../../auth/state/authStore': { useAuthStore },
    '../../auth/hooks/useAuthQueries': { useUpdateProfileMutation: () => ({ mutateAsync() {} }) },
    '../constants/profileConstants': defaults,
    '../utilities': profileUtils,
  });
  const { profile } = useStudentProfile();
  assert.equal(profile.name, 'Ayesha Khan');
  assert.equal(profile.email, 'ayesha@example.com');
  assert.equal(profile.phone, '');
  assert.equal(profile.studentId, 'STU-2026-12345');
  assert.equal(profile.gradeLevel, 'University');
  assert.equal(profile.bio, 'Physics student');
  assert.equal(profile.preferredLanguage, 'Urdu');
  assert.equal(profile.isVerified, false);
});

test('concurrent expired-token requests share one refresh and use the rotated credentials', async () => {
  let onError;
  let release;
  let refreshCalls = 0;
  const retried = [];
  const pending = new Promise((done) => { release = done; });
  let state = { user: userUtils.mapAuthUser(apiUser), accessToken: 'expired', refreshToken: 'initial-refresh' };
  const actions = {
    setUser(user, accessToken, refreshToken) { state = { ...state, user, accessToken, refreshToken }; },
    clearAuth() { throw new Error('Valid refresh must not clear the account'); },
  };
  const apiClient = async (request) => { retried.push(request.headers.Authorization); return { data: 'ok' }; };
  apiClient.interceptors = { request: { use() {} }, response: { use(success, failure) { onError = failure; } } };
  loadSource('lib/api/interceptors.ts', {
    axios: { default: { isCancel: () => false, post: async (url, body) => {
      refreshCalls += 1;
      assert.equal(body.refresh, 'initial-refresh');
      await pending;
      return { data: { access: 'new-access', refresh: 'rotated-refresh' } };
    } } },
    './client': { BASE_URL: 'http://backend', apiClient },
    '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ ...state, ...actions }) } },
  });
  const error = () => ({ response: { status: 401, data: {} }, config: { url: '/api/auth/me/', headers: {} } });
  const first = onError(error());
  const second = onError(error());
  release();
  await Promise.all([first, second]);
  assert.equal(refreshCalls, 1);
  assert.equal(state.refreshToken, 'rotated-refresh');
  assert.deepEqual(retried, ['Bearer new-access', 'Bearer new-access']);
});

function protectedRouteHarness(getProfile, initialUser = userUtils.mapAuthUser(apiUser)) {
  const values = [];
  const effects = [];
  let profile = { isFetchedAfterMount: false, isSuccess: false, error: null };
  const redirects = [];
  let cursor = 0;
  let state = { user: initialUser, accessToken: initialUser ? 'stored-token' : null };
  const store = (selector) => selector(state);
  store.persist = { hasHydrated: () => true, onFinishHydration: () => () => {} };
  store.getState = () => ({ ...state, setUser: (user, accessToken) => { state = { user, accessToken }; }, clearAuth: () => { state = { user: null, accessToken: null }; } });
  const { useProtectedRoute } = loadSource('features/auth/hooks/useProtectedRoute.ts', {
    react: {
      useCallback: (fn) => fn,
      useSyncExternalStore: (subscribe, snapshot) => snapshot(),
      useEffect: (effect) => effects.push(effect),
      useState: (initial) => {
        const index = cursor++;
        if (!(index in values)) values[index] = initial;
        return [values[index], (next) => { values[index] = typeof next === 'function' ? next(values[index]) : next; }];
      },
    },
    'next/navigation': { useRouter: () => ({ replace: (path) => redirects.push(path) }) },
    '../state/authStore': { useAuthStore: store },
    './useAuthQueries': { useProfileQuery: () => {
      if (state.user) effects.push(() => getProfile().then(user => { profile = { isFetchedAfterMount: true, isSuccess: true, data: user }; }).catch(error => { profile = { isFetchedAfterMount: true, isSuccess: false, error }; }));
      return profile;
    } },
  });
  function useHarnessRender() {
    cursor = 0;
    return useProtectedRoute();
  }
  return {
    render: useHarnessRender,
    effects, redirects,
  };
}

test('a saved browser identity cannot unlock a page before database verification', async () => {
  const harness = protectedRouteHarness(async () => { throw new Error('Account does not exist'); });
  assert.equal(harness.render().allowed, false);
  harness.effects[0]();
  await new Promise((done) => setImmediate(done));
  const after = harness.render();
  assert.equal(after.allowed, false);
  assert.equal(after.error, 'Account does not exist');
});

test('registered accounts can unlock private pages only after successful backend verification', async () => {
  const harness = protectedRouteHarness(async () => userUtils.mapAuthUser(apiUser));
  assert.equal(harness.render().allowed, false);
  harness.effects[0]();
  await new Promise((done) => setImmediate(done));
  assert.equal(harness.render().allowed, true);
});

test('a visitor without credentials is redirected to login without calling profile lookup', () => {
  let calls = 0;
  const harness = protectedRouteHarness(async () => { calls += 1; }, null);
  assert.equal(harness.render().allowed, false);
  harness.effects[0]();
  assert.deepEqual(harness.redirects, ['/login']);
  assert.equal(calls, 0);
});

test('a rejected sign-in cannot authenticate the browser or navigate into the app', async () => {
  const errors = [];
  const redirects = [];
  let authenticated = 0;
  let stateIndex = 0;
  const { useLogin } = loadSource('features/auth/hooks/useLogin.ts', {
    react: {
      useEffect() {}, useCallback: (fn) => fn,
      useState: (initial) => [stateIndex++ === 0 ? { email: 'unknown@example.com', password: 'password', rememberMe: false } : initial, () => {}],
    },
    'next/navigation': { useRouter: () => ({ push: (path) => redirects.push(path) }) },
    '../state/authStore': { useAuthStore: () => ({ setUser: () => { authenticated += 1; }, setLoading() {}, setError: (message) => errors.push(message), isLoading: false, error: null }) },
    './useAuthQueries': { useLoginMutation: () => ({ isPending: false, mutateAsync: async () => { throw new Error('Invalid email or password.'); } }) },
    '../validators/auth.schema': { loginSchema: { safeParse: (data) => ({ success: true, data }) } },
  });
  await useLogin().handleSubmit({ preventDefault() {} });
  assert.equal(authenticated, 0);
  assert.deepEqual(redirects, []);
  assert.equal(errors.at(-1), 'Invalid email or password.');
});

test('an expired request from a previous account is never replayed under the new account', async () => {
  let onError;
  let refreshCalls = 0;
  loadSource('lib/api/interceptors.ts', {
    axios: { default: { isCancel: () => false, post: async () => { refreshCalls++; } } },
    './client': { BASE_URL: 'http://backend', apiClient: { interceptors: {
      request: { use() {} }, response: { use(success, failure) { onError = failure; } },
    } } },
    '@/features/auth/state/authStore': { useAuthStore: { getState: () => ({ user: { id: 'new' }, refreshToken: 'new-refresh' }) } },
  });
  await assert.rejects(onError({ response: { status: 401, data: {} }, config: { url: '/api/auth/me/', headers: {}, _accountId: 'old' } }), /account changed/);
  assert.equal(refreshCalls, 0);
});
