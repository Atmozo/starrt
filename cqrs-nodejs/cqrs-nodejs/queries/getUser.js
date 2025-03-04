// queries/getUser.js

const { getUser } = require('../data');

function getUserQuery(id) {
  return getUser(id);
}

module.exports = getUserQuery;

