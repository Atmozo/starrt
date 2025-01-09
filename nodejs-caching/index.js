const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const cache = new NodeCache(); // Initialize node-cache instance

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
    // Check if data exists in in-memory cache
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log('Cache hit (In-Memory)');
      return res.json(cachedData);
    }

    console.log('Cache miss (In-Memory)');
    // Fetch new data
    const url = `https://jsonplaceholder.typicode.com/posts/${key}`;
    const data = await fetchData(url);

    // Store data in in-memory cache with a 1-hour expiration
    cache.set(key, data, 3600); // 3600 seconds = 1 hour

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Clear cache
app.delete('/cache', (req, res) => {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ message: 'Key query parameter is required' });
  }

  try {
    const success = cache.del(key);

    if (success) {
      res.json({ message: `Cache for key "${key}" cleared` });
    } else {
      res.status(404).json({ message: `No cache found for key "${key}"` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to clear all cache
app.delete('/cache/all', (req, res) => {
  try {
    cache.flushAll(); // Clear all cached entries
    res.json({ message: 'All cache cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
