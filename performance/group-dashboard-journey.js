
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = 'http://localhost:8080';
const GROUP_ID = __ENV.GROUP_ID;
const TEST_EMAIL = __ENV.TEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD;
const TURNSTILE_BYPASS_TOKEN = __ENV.TURNSTILE_BYPASS_TOKEN;
const TARGET_VUS = Number(__ENV.TARGET_VUS || '5');

const eventsTrend = new Trend('dashboard_events_duration');
const billsTrend = new Trend('dashboard_bills_duration');
const membersTrend = new Trend('dashboard_members_duration');

export const options = {
  scenarios: {
    dashboard: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: TARGET_VUS },
        { duration: '2m', target: TARGET_VUS },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'dashboard_events_duration': ['p(95)<800'],
    'dashboard_bills_duration': ['p(95)<800'],
    'dashboard_members_duration': ['p(95)<800'],
  },
};

export function setup() {
  if (!GROUP_ID || !TEST_EMAIL || !TEST_PASSWORD) {
    throw new Error('GROUP_ID, TEST_EMAIL and TEST_PASSWORD are required');
  }

  const response = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      turnstileToken: TURNSTILE_BYPASS_TOKEN || '',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      responseCallback: http.expectedStatuses(200),
    }
  );

  if (response.status !== 200) {
    throw new Error(`Local test login failed: HTTP ${response.status}`);
  }

  const cookies = response.cookies['access_token'] || [];
  const token = cookies.find((cookie) => cookie.value)?.value;

  if (!token) {
    throw new Error('Login did not return access_token cookie');
  }

  return { token };
}

export default function (data) {
  const headers = {
    Cookie: `access_token=${data.token}`,
    Accept: 'application/json',
  };

  const from = '2026-10-11T17:00:00.000Z';
  const to = '2026-10-18T16:59:59.999Z';

  // ส่ง API ทั้งสามพร้อมกัน เหมือน Dashboard ที่โหลดข้อมูลหลายส่วน
  const responses = http.batch([
    {
      method: 'GET',
      url: `${BASE_URL}/api/groups/${GROUP_ID}/events?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      params: { headers, tags: { api: 'dashboard_events' } },
    },
    {
      method: 'GET',
      url: `${BASE_URL}/api/groups/${GROUP_ID}/bills?page=0&size=5`,
      params: { headers, tags: { api: 'dashboard_bills' } },
    },
    {
      method: 'GET',
      url: `${BASE_URL}/api/groups/${GROUP_ID}/members`,
      params: { headers, tags: { api: 'dashboard_members' } },
    },
  ]);

  const [events, bills, members] = responses;

  for (const [name, response] of [
  ['events', events],
  ['bills', bills],
  ['members', members],
]) {
  console.log(
    `${name}: status=${response.status}, ` +
    `duration=${response.timings.duration}ms, ` +
    `body=${String(response.body).slice(0, 250)}`
  );
}

  eventsTrend.add(events.timings.duration);
  billsTrend.add(bills.timings.duration);
  membersTrend.add(members.timings.duration);

  check(events, {
    'events returns 200': (r) => r.status === 200,
  });
  check(bills, {
    'bills returns 200': (r) => r.status === 200,
  });
  check(members, {
    'members returns 200': (r) => r.status === 200,
  });

  sleep(1);
}
