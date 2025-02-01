import http from 'k6/http';
import { check } from 'k6';

export default function () {
  let res = http.post('https://www.saucedemo.com/', {
    username: 'standard_user',
    password: 'secret_sauce',
  });

  console.log(`Login response: ${res.status}, Body: ${res.body}`);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}
