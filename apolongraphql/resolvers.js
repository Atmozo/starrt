
const users = []; 

const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!',
    getUser: (_, { id }) => users.find((user) => user.id === id),
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const newUser = { id: `${users.length + 1}`, name, email };
      users.push(newUser);
      return newUser;
    },
  },
};

module.exports = resolvers;
