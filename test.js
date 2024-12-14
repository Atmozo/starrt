// test.js
const fs = require('fs').promises;
const fetch = require('node-fetch');
const { readFile, fetchDataFromAPI } = require('./app'); // Assuming functions are exported in app.js

test('readFile reads the file correctly', async () => {
  const data = await readFile();
  expect(data).toBe('Hello, this is a test file for Node.js!\n');
});

test('fetchDataFromAPI fetches data correctly', async () => {
  const data = await fetchDataFromAPI('https://jsonplaceholder.typicode.com/todos/1');
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('title');
});
