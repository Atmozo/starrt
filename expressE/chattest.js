"use strict";

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100, // 10 virtual users
  duration: '60s', // Test duration
};

const messages = [
  "Hello, this is a test message!",
  "How's everyone doing?",
  "Testing chat functionality.",
  "Automated user simulation in progress.",
  "Hope this works smoothly!",
  "K6 load testing is amazing!",
  "Live chat stress test underway.",
  "Sending multiple requests to simulate users.",
  "Testing different message patterns.",
  "Ensuring robust communication via chat API."
];

export default function () {
  const url = 'https://livechat.runasp.net';
  const payload = JSON.stringify({
    user: `User_${__VU}`,
    message: messages[Math.floor(Math.random() * messages.length)],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let attempts = 3;
  let res;
  while (attempts > 0) {
    res = http.post(url, payload, params);
    if (res.status === 200) break;
    attempts--;
    sleep(1);
  }

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}

