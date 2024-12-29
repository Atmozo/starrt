const express = require('express');
const validateUser = require('./validateUser');

const app = express();
app.use(express.json());

// User Registration Route
app.post('/register', validateUser, (req, res) => {
  const { username, email, password } = req.body;
  res.json({
    message: 'User registered successfully',
    user: { username, email }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
