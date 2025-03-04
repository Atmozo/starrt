// server.js

const express = require('express');
const createUser = require('./commands/createUser');
const updateUserCommand = require('./commands/updateUser');
const getUserQuery = require('./queries/getUser');
const getAllUsersQuery = require('./queries/getAllUsers');

const app = express();
app.use(express.json());

// Command - Create User
app.post('/users', (req, res) => {
  const { id, name, email } = req.body;
  const user = createUser(id, name, email);
  res.status(201).json(user);
});

// Command - Update User
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const updatedUser = updateUserCommand(req.params.id, name, email);
  res.status(200).json(updatedUser);
});

// Query - Get User by ID
app.get('/users/:id', (req, res) => {
  const user = getUserQuery(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Query - Get All Users
app.get('/users', (req, res) => {
  const users = getAllUsersQuery();
  res.status(200).json(users);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


