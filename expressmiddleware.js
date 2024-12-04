const express = require('express');
const morgan = require('morgan');
const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json());

// Morgan logging middleware
app.use(morgan('dev'));

// Custom middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} request made to ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send('Something went wrong!');
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
