// data.js

let users = [];

function addUser(user) {
  users.push(user);
}

function updateUser(id, updatedUser) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
  }
}

function getUser(id) {
  return users.find((user) => user.id === id);
}

function getAllUsers() {
  return users;
}

module.exports = { addUser, updateUser, getUser, getAllUsers };

