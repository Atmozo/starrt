const Redis = require("ioredis");
const express = require("express");

const app = express();

// Connect to Redis
const redis = new Redis({
    host: "127.0.0.1", // Redis server host
    port: 6379,        // Default Redis port
});
const rateLimiter = async (req, res, next) => {
  const ip = req.ip; // Use client IP as identifier
  const limit = 3; // Max requests allowed
  const window = 60; // Time window in seconds

  try {
      // Increment the request count in Redis
      const currentRequests = await redis.incr(ip);

      // If this is the first request, s expiration time for the key
      if (currentRequests === 1) {
          await redis.expire(ip, window);
      }

      // Block if the request count exceeds the limit
      if (currentRequests > limit) {
          res.status(429).json({
              message: "Too many requests. Please try again later.",
          });
          return;
      }

      next(); // Allow the request
  } catch (error) {
      console.error("Redis error:", error);
      res.status(500).json({
          message: "Internal server error",
      });
  }
};
// Apply the rate limiter to all routes
app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("Welcome! You are not rate-limited.");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
