import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.ORANGEHRM_BASE_URL || 'https://opensource-demo.orangehrmlive.com';

export const options = {
  vus: Number(__ENV.K6_VUS || 5),
  duration: __ENV.K6_DURATION || '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const response = http.get(`${baseUrl}/web/index.php/auth/login`);

  check(response, {
    'login page returns HTTP 200': (result) => result.status === 200,
    'login page responds within 3 seconds': (result) => result.timings.duration < 3000,
  });

  sleep(1);
}
