const express = require('express');
const redis = require('redis');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const redisClient = redis.createClient({
  socket: {
    port: process.env.REDIS_PORT || 6379,
  },
});

redisClient.connect().catch(console.error);

// Middleware for parsing JSON
app.use(express.json());

// Helper function to fetch data
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// Route to fetch and cache data
app.get('/data', async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ message: 'Key query parameter is required' });
  }

  try {
    // Check if data exists in cache
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log('Cache hit');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Cache miss');
    // Fetch new data
    const url = `https://jsonplaceholder.typicode.com/posts/${key}`;
    const data = await fetchData(url);

    // Store data in Redis cache
    await redisClient.setEx(key, 3600, JSON.stringify(data)); // Cache for 1 hour

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Clear cache
app.delete('/cache', async (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ message: 'Key query parameter is required' });
  }

  try {
    await redisClient.del(key);
    res.json({ message: `Cache for key "${key}" cleared` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
