const express = require('express');
const session = require('express-session');
const passport = require('./middleware/passportConfig');
const { addUser } = require('./models/userModel');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Passport Authentication!');
});

// Register route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = await addUser(username, password);
  res.json({ message: 'User registered', user });
});

// Login route
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login-failed',
  })
);

// Login failed route
app.get('/login-failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

// Dashboard route (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});

// Logout route
app.post('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
