const bcrypt = require('bcrypt');

const users = []; // Replace with database in production

// Function to find user by username
const findUserByUsername = (username) => users.find(user => user.username === username);

// Function to find user by ID
const findUserById = (id) => users.find(user => user.id === id);

const addUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = { id: Date.now().toString(), username, password: hashedPassword };
  users.push(user);
  return user;
};

module.exports = { users, findUserByUsername, findUserById, addUser };
