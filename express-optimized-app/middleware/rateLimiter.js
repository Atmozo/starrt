const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 10 * 1000, // Allow requests every 10 seconds
  max: 100, // ✅ Allow 100 requests per 10 seconds
  message: "Too many requests, please try again later.",
});

module.exports = rateLimiter;

