/** k6 workload selection: viewers, submissions, or mixed. Use staging credentials. */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.6.0/index.js';

const mode = __ENV.WORKLOAD || 'viewers';
const base = __ENV.BASE_URL;
const tokens = (__ENV.TEST_TOKENS || '').split(',').filter(Boolean);
if (!base || !tokens.length) throw new Error('BASE_URL and TEST_TOKENS are required');
if (mode !== 'viewers' && __ENV.ALLOW_AI_LOAD !== 'true') throw new Error('Set ALLOW_AI_LOAD=true only on an approved staging provider budget');
export const options = {
  scenarios: { workload: { executor: 'ramping-vus', startVUs: 0,
    stages: [{ duration: '1m', target: 1000 }, { duration: '3m', target: 1000 }, { duration: '30s', target: 0 }] } },
  thresholds: { http_req_duration: ['p(95)<1500'], checks: ['rate>0.99'] },
};
export default function () {
  const token = tokens[(__VU - 1) % tokens.length];
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  if (mode === 'submissions' || (mode === 'mixed' && __ITER % 10 === 0)) {
    const result = http.post(`${base}/api/lesson-jobs/`, JSON.stringify({ request_id: uuidv4(),
      question: `Explain Ohm's law with example ${__VU}-${__ITER}`, session_id: `load-${__VU}`, research: true }), { headers });
    // 429 is expected backpressure, not a server failure. Measure acceptance separately.
    check(result, { 'controlled admission': r => r.status === 202 || r.status === 429 });
  } else {
    const result = http.get(`${base}/api/notes/`, { headers });
    check(result, { 'prepared notes available': r => r.status === 200 });
  }
  sleep(10);
}
