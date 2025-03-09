const users = [
  { id: "1", name: "ashely", age: 18 },
  { id: "2", name: "who", age: 30 },
  { id: "3", name: "what", age: 35 }
];

const getUsersByIds = async (ids) => {
  console.log("Fetching users from DB:", ids); // This simulates DB batching
  return ids.map(id => users.find(user => user.id === id));
};

module.exports = { getUsersByIds };

