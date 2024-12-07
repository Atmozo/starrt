const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Secret key for signing JWT
const SECRET_KEY = '1q2w3';

// Middleware to parse JSON
app.use(bodyParser.json());

// Dummy user data (replace with database in production)
const users = [
  { id: 1, username: 'who', password: 'who123' },
  { id: 2, username: 'what', password: 'what123' },
];

// **1. Login Route - Issue JWT**
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: '1h' } // Token valid for 1 hour
  );

  res.status(200).json({ token });
});

// **2. Middleware to Verify JWT**
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Save user info in request object
    next();
  });
};

// **3. Protected Route**
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
