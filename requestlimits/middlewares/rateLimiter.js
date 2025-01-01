const rateLimit = require('express-rate-limit');
const Redis = require('redis');
const RedisStore = require('rate-limit-redis');

// Create Redis client
const redisClient = Redis.createClient({
  url: 'redis://localhost:6380'
});

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

// Error handling
redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Rate limiter configuration
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // Limit each IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;