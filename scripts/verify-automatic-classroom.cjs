// Uses only the isolated serve-classroom-test.py API; never the running user's API.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const stateDir = process.env.CLASSROOM_E2E_STATE_DIR || path.join(os.tmpdir(), 'ai-teacher-e2e');
const frontend = process.env.CLASSROOM_E2E_FRONTEND_URL || 'http://127.0.0.1:3001';
const api = `http://127.0.0.1:${process.env.CLASSROOM_E2E_API_PORT || '8002'}`;

async function main() {
  const auth = JSON.parse(fs.readFileSync(path.join(stateDir, 'auth.json'), 'utf8'));
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', async route => {
      const target = new URL(route.request().url());
      const response = await route.fetch({ url: `${api}${target.pathname}${target.search}` });
      await route.fulfill({ response });
    });
    await page.addInitScript(({ token, id }) => {
      localStorage.setItem('auth-store', JSON.stringify({ version: 1,
        state: { user: { id: String(id) }, accessToken: token, isAuthenticated: true },
      }));
      window._spoken = [];
      window._holdSpeech = false;
      window._micStarts = 0;
      window._micStops = 0;
      window.SpeechRecognition = class {
        start() {
          window._micStarts += 1;
          window._lateTranscript = this.onresult;
          this.onstart?.();
        }
        stop() { window._micStops += 1; this.onend?.(); }
      };
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      const voice = { name: 'Test voice', voiceURI: 'test-voice', lang: 'en-US', localService: true, default: true };
      const engine = { speaking: false, pending: false, paused: false,
        getVoices: () => [voice], addEventListener() {}, removeEventListener() {},
        cancel() { engine.speaking = false; }, resume() {}, pause() {},
        speak(utterance) {
          window._spoken.push(utterance.text);
          window._lastUtterance = utterance;
          engine.speaking = true;
          setTimeout(() => {
            utterance.onstart?.();
            if (!window._holdSpeech) setTimeout(() => { engine.speaking = false; utterance.onend?.(); }, 120);
          }, 20);
        },
      };
      Object.defineProperty(window, 'speechSynthesis', { value: engine, configurable: true });
    }, { token: auth.token, id: auth.id });
    // Warm the real frontend before creating the short server-clock fixtures.
    await page.goto(`${frontend}/classroom`);
    await page.getByRole('textbox', { name: 'Question for the AI teacher' }).waitFor({ timeout: 15000 }).catch(async problem => {
      console.error('Classroom bootstrap:', page.url(), await page.locator('body').innerText(), errors);
      throw problem;
    });
    execFileSync(process.env.DJANGO_PYTHON || path.join(root, 'backend/django_app/.venv/bin/python'),
      [path.join(root, 'scripts/seed-automatic-classroom-test.py')], { cwd: root, env: process.env });
    const fixtures = JSON.parse(fs.readFileSync(path.join(stateDir, 'automatic-classes.json'), 'utf8'));
    await page.goto(`${frontend}/classroom?session=${fixtures[0].sessionId}`);
    await page.getByRole('textbox', { name: 'Question for the AI teacher' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Chat', exact: true }).count(), 0);
    assert.equal(await page.locator('#mic-btn').isDisabled(), true);
    assert.equal(await page.locator('#subtitles-toggle-btn').count(), 0);
    assert.equal(await page.evaluate(() => window._spoken.length), 0);
    const input = page.getByRole('textbox', { name: 'Question for the AI teacher' });
    assert.equal(await input.isDisabled(), true);
    await page.waitForFunction(() => document.querySelector('#mic-btn')?.disabled === false, { timeout: 15000 });
    assert.equal(await page.getByText('Your teacher is waiting for your answer.', { exact: true }).count(), 0);
    assert.equal(await page.evaluate(() => window._micStarts), 0, 'Opening a question must not activate the microphone');
    await page.locator('#mic-btn').click();
    assert.equal(await page.evaluate(() => window._micStarts), 1);
    assert.equal(await page.locator('#play-pause-btn, #stop-btn').count(), 0);
    await input.fill('The current halves when voltage stays fixed.');
    const completed = page.waitForResponse(response => response.url().includes('/progress/') &&
      response.request().method() === 'PUT' && response.request().postDataJSON()?.section_index === 3);
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    assert.equal((await (await completed).json()).section_index, 3);
    assert.equal(await page.evaluate(() => window._spoken.length), 3);
    assert.equal(await page.getByRole('button', { name: 'Chat', exact: true }).count(), 0);
    assert.equal(await page.getByPlaceholder('Send message to classroom chat...').count(), 0);
    assert.equal(await page.locator('#mic-btn').isDisabled(), true);
    assert.ok(await page.evaluate(() => window._micStops > 0));
    await page.evaluate(() => window._lateTranscript?.({ results: [[{ transcript: 'stale transcript' }]] }));
    assert.equal(await input.inputValue(), '', 'Late recognition results must not enter the next teaching turn');
    const restored = page.waitForResponse(response => response.url().includes('/progress/') && response.request().method() === 'GET');
    await page.reload();
    assert.equal((await (await restored).json()).section_index, 3);
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => window._spoken.length), 0, 'Completed lessons must not restart');
    await page.waitForURL('**/dashboard', { timeout: 35000 });
    await page.addInitScript(() => { window._holdSpeech = true; });
    await page.goto(`${frontend}/classroom?session=${fixtures[1].sessionId}`);
    await page.waitForFunction(() => window._spoken.length > 0, { timeout: 10000 });
    assert.equal(await input.isDisabled(), true, 'Active narration cannot be interrupted through the input');
    assert.equal(await page.getByRole('button', { name: 'Chat', exact: true }).count(), 0);
    assert.equal(await page.locator('#mic-btn').isDisabled(), true);
    assert.equal(await page.locator('#subtitles-toggle-btn').count(), 0);
    assert.equal(await page.locator('#play-pause-btn, #stop-btn').count(), 0);
    const artifacts = path.join(root, 'docs/testing/artifacts');
    fs.mkdirSync(artifacts, { recursive: true });
    await page.screenshot({ path: path.join(artifacts, 'automatic-classroom.png'), fullPage: true });
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    const before = await page.evaluate(() => window._spoken.length);
    await page.evaluate(() => window._lastUtterance?.onend?.());
    assert.equal(await page.evaluate(() => window._spoken.length), before, 'Late speech callbacks cannot restart an ended class');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(artifacts, 'automatic-classroom-results.json'), JSON.stringify({
      passed: true, checks: ['wait for server start', 'automatic narration', 'no manual playback controls',
        'teacher question pauses', 'accepted answer automatically continues', 'completion persists',
        'reload does not replay completed content', 'automatic scheduled exit', 'active narration stops at scheduled end',
        'late speech callback ignored', 'no CC or status strip', 'chat and voice open only at teacher questions',
        'no automatic microphone recording', 'chat and microphone close when teaching resumes', 'late transcripts ignored', 'no uncaught page exceptions'], pageErrors: errors,
      limits: 'Real frontend and isolated authenticated HTTP/database; seeded admitted classes, deterministic grading and simulated speech/recognition. No physical microphone permission, real audio, provider or broker test.',
    }, null, 2));
    console.log('PASS automatic scheduled classroom lifecycle and checkpoint continuation');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
