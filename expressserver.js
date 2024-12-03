const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.send('Welcome to the Home Page!'));
app.get('/about', (req, res) => res.send('This is the About Page.'));
app.get('/contact', (req, res) => res.send('Contact us at contact@example.com.'));
app.get('/api/data', (req, res) => res.json({ message: 'Here is your data', data: [1, 2, 3] }));

// POST route
app.post('/submit', (req, res) => {
  const data = req.body;
  res.send(`Data received: ${JSON.stringify(data)}`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
