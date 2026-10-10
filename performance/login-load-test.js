import http from 'k6/http';
import { check, sleep } from 'k6';

//identify URL and Credentials (identify from Environment Variables or use default value)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TEST_EMAIL = __ENV.TEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD;
const TURNSTILE_BYPASS_TOKEN = __ENV.TURNSTILE_BYPASS_TOKEN;

export const options = {
  //identify User Login and Credentials (identify from Environment Variables or use default value)
  stages: [
    { duration: '10s', target: 20 }, // increase user from 0 to 20 in 10 minute
    { duration: '20s', target: 20 }, // keep at 20 people simultaneously for 20 seconds
    { duration: '10s', target: 0 },  // decrease user to 0 in 10 minute
  ],
  thresholds: {
    //95% of Request must respond faster than 800ms
    http_req_duration: ['p(95)<800'],
    // Error must be less than 1%
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const url = `${BASE_URL}/api/auth/login`;

  const payload = JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    // Bypass Token that was set in application.properties to pass Cloudflare
    turnstileToken: TURNSTILE_BYPASS_TOKEN,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    tags: { name: 'login_request' }
  };

  const res = http.post(url, payload, params);

  // Check if the result is as expected
  check(res, {
    'is status 200 (Login Success)': (r) => r.status === 200,
    'is NOT status 429 (Rate Limit)': (r) => r.status !== 429,
    'is NOT status 403 (Turnstile Failed)': (r) => r.status !== 403,
    'has access_token cookie': (r) => r.cookies['access_token'] !== undefined,
  });

  // Delay 1 second to simulate real user behavior and reduce Rate Limit
  sleep(1);
}
