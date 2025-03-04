// commands/updateUser.js

const { updateUser } = require('../data');

function updateUserCommand(id, name, email) {
  const updatedUser = { name, email };
  updateUser(id, updatedUser);
  return updatedUser;
}

module.exports = updateUserCommand;

