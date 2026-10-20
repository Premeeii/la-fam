// performance/brute-force-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    brute_force_attack: {
      executor: 'constant-arrival-rate',
      rate: 60, // ยิง 60 ครั้งต่อนาที (1 req/sec)
      timeUnit: '1m',
      duration: '1m',
      preAllocatedVUs: 5,
    },
  },
};

export default function () {
  const res = http.post('http://localhost:8080/api/auth/login', JSON.stringify({
    email: 'victim@lafam.app',
    password: 'wrongpassword123',
    turnstileToken: 'test-bypass-token'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'Allowed (200/401)': (r) => r.status === 401 || r.status === 200,
    'Blocked (429 Too Many Requests)': (r) => r.status === 429,
  });
}
