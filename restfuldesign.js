const express = require('express');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample data to simulate a database
let users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

// **1. GET /api/users - Get all users**
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// **2. GET /api/users/:id - Get a single user by ID**
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

// **3. POST /api/users - Create a new user**
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ message: 'Name and age are required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    age,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// **4. PUT /api/users/:id - Update a user by ID**
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!name || !age) {
    return res.status(400).json({ message: 'Name and age are required' });
  }

  users[userIndex] = { id: userId, name, age };
  res.status(200).json(users[userIndex]);
});

// **5. DELETE /api/users/:id - Delete a user by ID**
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
