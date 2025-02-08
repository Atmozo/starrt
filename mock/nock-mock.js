const nock = require("nock");
const axios = require("axios");

// Mock the API response
nock("https://api.example.com")
  .get("/data")
  .reply(200, { message: "Mocked API response 🚀" });

async function fetchData() {
  const response = await axios.get("https://api.example.com/data");
  return response.data;
}

// Test the mock
fetchData().then(console.log); // { message: "Mocked API response 🚀" }
const nock = require("nock");
const axios = require("axios");

// Mock the API response
nock("https://api.example.com")
  .get("/data")
  .reply(200, { message: "Mocked API response 🚀" });

async function fetchData() {
  const response = await axios.get("https://api.example.com/data");
  return response.data;
}

// Test the mock
fetchData().then(console.log); // { message: "Mocked API response 🚀" }
