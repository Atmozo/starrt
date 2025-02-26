const express = require('express');
const { generateToken, verifyToken, revokeToken } = require('./auth');

const app = express();
app.use(express.json());

// Simulated user database
const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user', role: 'user' }
];

// Login route (issues JWT)
app.post('/login', (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token });
});

// Protected route (requires JWT)
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, User ${req.user.id}`, user: req.user });
});

// Logout (revokes JWT)
app.post('/logout', revokeToken);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

