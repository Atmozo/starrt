const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next(); // Move to the next middleware or route handler
});


app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});


app.get('/about', (req, res) => {
  res.send('This is the About Page!');
});


app.get('/contact', (req, res) => {
  res.send('Contact us at contact@mozoo.com');
});


app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`You are viewing product with ID: ${productId}`);
});

// API route returning JSON data
app.get('/api/products', (req, res) => {
  res.json({ message: 'Here are the products', products: [1, 2, 3, 4] });
});

// 404 error route for undefined routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
