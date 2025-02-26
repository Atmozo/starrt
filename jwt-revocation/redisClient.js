const redis = require('redis');

const client = redis.createClient({
  socket: { host: '127.0.0.1', port: process.env.REDIS_PORT || 6379 },
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

module.exports = client;

