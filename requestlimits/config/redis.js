const { createClient } = require('redis');

// Create and configure Redis client
const RedisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

RedisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

RedisClient.connect();

module.exports = RedisClient;
