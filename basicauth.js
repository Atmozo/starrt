const express = require('express');

const app = express();
const PORT = 3000;

// Dummy user credentials 
const USERNAME = 'admin';
const PASSWORD = 'password123';

//Basic Authentication Middleware**
const basicAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  // Decode the base64-encoded username:password
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');

  // Verify username and password
  if (username === USERNAME && password === PASSWORD) {
    return next(); // Proceed to the next middleware/route handler
  }

  res.status(401).json({ message: 'Invalid credentials' });
};

// **Protected Route**
app.get('/protected', basicAuth, (req, res) => {
  res.status(200).json({ message: 'You have access to the protected resource!' });
});

// Public Route
app.get('/', (req, res) => {
  res.send('Welcome to the public endpoint!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
