const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Max 10 requests per minute
  message: "Too many requests, please try again later.",
});

module.exports = rateLimiter;
