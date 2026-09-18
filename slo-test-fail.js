import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,

  // PASS test = default 1m
  // Chaos test = DURATION=2m гэж override хийнэ
  duration: __ENV.DURATION || '1m',

  summaryTrendStats: [
    'avg',
    'med',
    'p(90)',
    'p(95)',
    'p(99)',
    'max',
  ],

  thresholds: {
    // Performance SLO
    'http_req_duration{name:cart}': [
      'p(95)<10',
    ],

    // Reliability SLO
    'http_req_failed{name:pay}': [
      'rate<0.08',
    ],

    // Availability SLO
    checks: [
      'rate>0.90',
    ],

    // Additional report performance SLO
    'http_req_duration{name:report}': [
      'p(95)<100',
    ],
  },
};

export default function () {
  const base = 'http://localhost:3000';

  const cart = http.post(
    `${base}/cart/add`,
    null,
    {
      tags: {
        name: 'cart',
      },
    }
  );

  const report = http.get(
    `${base}/report`,
    {
      tags: {
        name: 'report',
      },
    }
  );

  const pay = http.post(
    `${base}/pay`,
    null,
    {
      tags: {
        name: 'pay',
      },
    }
  );

  check(cart, {
    'cart 200': (r) => r.status === 200,
  });

  check(report, {
    'report 200': (r) => r.status === 200,
  });

  check(pay, {
    'pay 200': (r) => r.status === 200,
  });

  sleep(1);
}