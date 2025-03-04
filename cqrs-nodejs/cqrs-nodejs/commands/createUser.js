// commands/createUser.js

const User = require('../models/user');
const { addUser } = require('../data');

function createUser(id, name, email) {
  const newUser = new User(id, name, email);
  addUser(newUser);
  return newUser;
}

module.exports = createUser;

