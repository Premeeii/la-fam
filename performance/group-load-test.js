
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = (
  __ENV.BASE_URL || 'http://localhost:8080'
).replace(/\/$/, '');

const TEST_EMAIL = __ENV.TEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD;
const TURNSTILE_BYPASS_TOKEN = __ENV.TURNSTILE_BYPASS_TOKEN;

const TARGET_VUS = Number(__ENV.TARGET_VUS || '5');
const HOLD_DURATION = __ENV.HOLD_DURATION || '2m';

// ป้องกันการนำ Script ไปยิง Production
if (
  BASE_URL !== 'http://localhost:8080' &&
  BASE_URL !== 'http://127.0.0.1:8080'
) {
  throw new Error('This benchmark only allows localhost:8080');
}

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error('TEST_EMAIL and TEST_PASSWORD are required');
}

if (
  !Number.isInteger(TARGET_VUS) ||
  TARGET_VUS < 1 ||
  TARGET_VUS > 20
) {
  throw new Error('TARGET_VUS must be between 1 and 20');
}

export const options = {
  scenarios: {
    groups_api: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: TARGET_VUS },
        { duration: HOLD_DURATION, target: TARGET_VUS },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },

  // metrics only Request of groups (exclude Login)
  thresholds: {
    'http_req_duration{api:groups}': ['p(95)<800'],
    'http_req_failed{api:groups}': ['rate<0.01'],
    'checks{api:groups}': ['rate>0.99'],
  },
};

// login once per k6 run
export function setup() {
  const loginPayload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    turnstileToken: TURNSTILE_BYPASS_TOKEN || '',
  });

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    loginPayload,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      tags: { api: 'login_setup' },
      timeout: '10s',
    }
  );

  if (loginRes.status !== 200) {
    throw new Error(
      `Local test login failed: HTTP ${loginRes.status}`
    );
  }

  const accessCookies = loginRes.cookies['access_token'] || [];
  const accessCookie = accessCookies.find(
    (cookie) => cookie.value
  );

  if (!accessCookie) {
    throw new Error(
      'Login succeeded but access_token cookie was not returned'
    );
  }

  // send token to VUs without printing token to log
  return {
    accessToken: accessCookie.value,
  };
}

export default function (data) {
  const response = http.get(
    `${BASE_URL}/api/groups`,
    {
      headers: {
        Accept: 'application/json',
      },

      // ส่ง HttpOnly Cookie ไปกับ API Request
      cookies: {
        access_token: data.accessToken,
      },

      tags: {
        api: 'groups',
        name: 'GET /api/groups',
      },

      timeout: '10s',
    }
  );

  let validJson = false;

  try {
    response.json();
    validJson = true;
  } catch (_) {
    validJson = false;
  }

  check(
    response,
    {
      'GET /api/groups returns 200': (r) => r.status === 200,
      'response is valid JSON': () => validJson,
    },
    { api: 'groups' }
  );

  // simulate the pause between api calls of users
  sleep(1);
}
