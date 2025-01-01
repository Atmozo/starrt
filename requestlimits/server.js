require('dotenv').config();
const express = require('express');
const rateLimiter = require('./middlewares/rateLimiter');

const app = express();

// Apply rate limiter to all routes
app.use(rateLimiter);

app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Rate Limiting Example!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
