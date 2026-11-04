// Real local HTTP/database and real 30-second windows; AI and speech are controlled fixtures.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const stateDir = process.env.CLASSROOM_E2E_STATE_DIR || path.join(os.tmpdir(), 'ai-teacher-e2e');
const frontend = process.env.CLASSROOM_E2E_FRONTEND_URL || 'http://127.0.0.1:3002';
const api = `http://127.0.0.1:${process.env.CLASSROOM_E2E_API_PORT || '8002'}`;

async function main() {
  execFileSync(process.env.DJANGO_PYTHON || path.join(root, 'backend/django_app/.venv/bin/python'),
    [path.join(root, 'scripts/seed-timed-discussion-test.py')], { cwd: root, env: process.env });
  const auth = JSON.parse(fs.readFileSync(path.join(stateDir, 'auth.json'), 'utf8'));
  const notes = JSON.parse(fs.readFileSync(path.join(stateDir, 'timed-discussion-notes.json'), 'utf8'));
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
  });
  const results = [];
  try {
    for (const [index, noteId] of notes.entries()) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
      const errors = [], graded = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (request.url().includes('/evaluate/')) graded.push(request.url()); });
      await page.route('**/api/**', async route => {
        const target = new URL(route.request().url());
        await route.fulfill({ response: await route.fetch({ url: `${api}${target.pathname}${target.search}` }) });
      });
      await page.addInitScript(({ token, id, noteId }) => {
        localStorage.setItem('auth-store', JSON.stringify({ version: 1, state: {
          user: { id: String(id) }, accessToken: token, isAuthenticated: true,
        } }));
        localStorage.setItem(`classroom-active-note:${id}`, noteId);
        window._spoken = [];
        window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
        const engine = { speaking: false, pending: false, paused: false,
          getVoices: () => [{ name: 'Test', voiceURI: 'test', lang: 'en-US', localService: true, default: true }],
          addEventListener() {}, removeEventListener() {}, cancel() {}, resume() {}, pause() {},
          speak(utterance) {
            window._spoken.push(utterance.text); engine.speaking = true;
            setTimeout(() => { utterance.onstart?.(); setTimeout(() => { engine.speaking = false; utterance.onend?.(); }, utterance.text.startsWith('At fixed voltage') ? 3000 : 120); }, 20);
          },
        };
        Object.defineProperty(window, 'speechSynthesis', { value: engine, configurable: true });
      }, { token: auth.token, id: auth.id, noteId });
      const opened = page.waitForResponse(response => response.url().includes('/progress/') && response.request().method() === 'PUT');
      await page.goto(`${frontend}/classroom`);
      if (index === 1) {
        const raised = page.waitForResponse(response => response.url().endsWith('/hand/') && response.request().method() === 'PUT');
        await page.getByRole('button', { name: 'Raise Hand', exact: true }).click();
        assert.equal((await (await raised).json()).hand_raised, true);
        assert.equal(await page.locator('#mic-btn').isDisabled(), true);
      }
      const progress = await (await opened).json();
      if (index === 1) {
        await page.waitForFunction(() => window._spoken.includes('Test, what is your question about this concept?'));
        assert.equal(await page.getByRole('button', { name: 'Raise Hand', exact: true }).getAttribute('aria-pressed'), 'false');
      }
      assert.ok(progress.discussion_expires_at);
      assert.ok(Math.abs(Date.parse(progress.discussion_expires_at) - Date.parse(progress.server_now) - 30000) < 1000);
      await page.waitForFunction(() => document.querySelector('#mic-btn')?.disabled === false);
      const input = page.getByRole('textbox', { name: 'Question for the AI teacher' });
      assert.equal(await input.isEnabled(), true);
      assert.equal(await page.getByRole('button', { name: 'Chat', exact: true }).count(), 0);
      if (index === 0) {
        const restored = page.waitForResponse(response => response.url().includes('/progress/') && response.request().method() === 'GET');
        await page.reload();
        assert.equal((await (await restored).json()).discussion_expires_at, progress.discussion_expires_at);
      } else {
        await input.fill('Why does doubling resistance halve the current?');
        const reply = page.waitForResponse(response => response.url().endsWith('/discussion/') && response.request().method() === 'POST');
        await page.getByRole('button', { name: 'Ask', exact: true }).click();
        const response = await reply;
        assert.equal(response.status(), 200);
        assert.match((await response.json()).reply, /doubling resistance halves current/);
        await page.waitForFunction(() => window._spoken.some(text => text.includes('doubling resistance halves current')));
        await page.waitForFunction(() => document.querySelector('#mic-btn')?.disabled === false);
      }
      await page.waitForFunction(() => window._spoken.includes('Now we continue to the next concept.'), { timeout: 40000 });
      assert.equal(await input.isDisabled(), true);
      assert.equal(await page.locator('#mic-btn').isDisabled(), true);
      assert.equal(await page.getByRole('button', { name: 'Chat', exact: true }).count(), 0);
      assert.equal(await page.locator('#subtitles-toggle-btn, #play-pause-btn, #stop-btn').count(), 0);
      assert.deepEqual(graded, []);
      assert.deepEqual(errors, []);
      const final = await page.request.get(`${api}/api/notes/${noteId}/progress/`, { headers: { Authorization: `Bearer ${auth.token}` } });
      const saved = await final.json();
      assert.equal(saved.answer.chunks.length, 3);
      results.push({ scenario: index === 0 ? 'silent period and reload' : 'student concept question and spoken reply', passed: true,
        originalDeadlinePreserved: index === 0 ? true : undefined, raisedHandAddressedByAccountName: index === 1 ? true : undefined, noGradingRequests: true, savedLessonUnchanged: true, pageErrors: errors });
      console.log(`PASS ${results.at(-1).scenario}`);
      await page.close();
    }
    fs.writeFileSync(path.join(root, 'docs/testing/artifacts/timed-discussion-results.json'), JSON.stringify({
      passed: true, windowSeconds: 30, scenarios: results,
      limits: 'Real frontend and isolated authenticated API/database; seeded lessons, deterministic model and simulated speech. No physical microphone or live provider test.',
    }, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
