import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '30s',

  summaryTrendStats: [
    'avg',
    'med',
    'p(90)',
    'p(95)',
    'p(99)',
    'max',
  ],
};

export default function () {
  const res = http.post(
    'http://localhost:3000/cart/add',
    null,
    {
      tags: {
        name: 'cart',
      },
    }
  );

  check(res, {
    'cart 200': (r) => r.status === 200,
  });

  sleep(1);
}