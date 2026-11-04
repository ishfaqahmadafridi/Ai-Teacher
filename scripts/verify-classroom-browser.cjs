// Run against scripts/serve-classroom-test.py and the local frontend.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const stateDir = process.env.CLASSROOM_E2E_STATE_DIR || path.join(os.tmpdir(), 'ai-teacher-e2e');
const frontendUrl = process.env.CLASSROOM_E2E_FRONTEND_URL || 'http://127.0.0.1:3001';
const artifactsDir = path.join(root, 'docs/testing/artifacts');

async function main() {
  const auth = JSON.parse(fs.readFileSync(path.join(stateDir, 'auth.json'), 'utf8'));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}),
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // The authenticated profile API supplies the student's actual preferences.
    await page.addInitScript(({ token, id }) => {
      localStorage.setItem('auth-store', JSON.stringify({
        version: 1,
        state: { user: { id: String(id) }, accessToken: token, isAuthenticated: true },
      }));
    }, { token: auth.token, id: auth.id });
    await page.goto(`${frontendUrl}/classroom`);
    const input = page.getByRole('textbox', { name: 'Question for the AI teacher' });
    await input.waitFor({ timeout: 90000 });
    await input.fill('Explain Ohm law');
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/lesson-jobs/') && response.request().method() === 'GET',
    { timeout: 30000 });
    await page.getByRole('button', { name: 'Ask', exact: true }).click();
    const job = await (await responsePromise).json();
    assert.equal(job.status, 'ready');
    assert.equal(job.result.chunks[0].diagram.action, auth.injected_action);
    assert.ok(job.result.model_info.note_id, 'The worker must save a note');
    // Assert visible lesson content, not just the absence of the empty state.
    await page.getByText(job.result.chunks[0].key_point, { exact: true }).first().waitFor();
    const text = await page.locator('body').innerText();
    assert.doesNotMatch(text, /invalid_value|Invalid option/);
    assert.deepEqual(errors, []);
    fs.mkdirSync(artifactsDir, { recursive: true });
    await page.screenshot({ path: path.join(artifactsDir, 'classroom-contract-e2e.png'), fullPage: true });
    fs.writeFileSync(path.join(artifactsDir, 'classroom-contract-e2e-results.json'), JSON.stringify({
      passed: true, jobStatus: job.status, injectedAction: auth.injected_action,
      lessonRendered: true, noteSaved: true, pageErrors: errors,
      provider: 'deterministic fixture; Redis/Celery dispatch replaced by direct worker invocation',
      speech: 'native browser; audio quality not assessed',
    }, null, 2));
    console.log('PASS authenticated HTTP -> worker -> saved note -> rendered classroom');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
