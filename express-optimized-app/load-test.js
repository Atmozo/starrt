import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp-up to 50 users over 10 seconds
    { duration: '30s', target: 50 }, // Stay at 50 users for 30 seconds
    { duration: '10s', target: 0 },  // Ramp-down to 0 users over 10 seconds
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/data');
  sleep(1); // Simulate user wait time
}
