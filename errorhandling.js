const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Example route that throws an error
app.get('/error', (req, res, next) => {
  // Simulate an error
  const error = new Error('Something went wrong!');
  error.status = 500;
  next(error); // Pass the error to the error handling middleware
});

// Example route without an error
app.get('/', (req, res) => {
  res.send('Welcome to the Express app!');
});

// **Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
