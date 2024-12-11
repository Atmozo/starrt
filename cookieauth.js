const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: '1q2w3e4r', // Secret key for signing session ID cookies
    resave: false, // Avoid resaving session if no changes are made
    saveUninitialized: false, // Avoid saving uninitialized sessions
    cookie: { maxAge: 60000 }, // Set cookie expiration (in milliseconds)
  })
);

// Dummy user data
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// **1. Login Route**
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate user
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Store user info in session
  req.session.user = { id: user.id, username: user.username };
  res.status(200).json({ message: 'Login successful', user: req.session.user });
});

// **2. Protected Route**
app.get('/protected', (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: 'Access denied. Please log in first.' });
  }

  res.status(200).json({
    message: 'Access granted to protected resource',
    user: req.session.user,
  });
});

// **3. Logout Route**
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }

    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
