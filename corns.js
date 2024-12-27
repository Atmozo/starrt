const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authorize = require('./middleware/authorize');
const generateToken = require('./utils/generateToken');

dotenv.config();
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Mock User Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Mock user authentication (replace with real authentication logic)
  if (username === 'admin' && password === 'password') {
    const token = generateToken({ id: 1, username: 'admin', role: 'admin' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// Protected Route
app.get('/protected', authorize, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});

// Role-Based Protected Route
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

app.get('/admin', authorize, authorizeRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});