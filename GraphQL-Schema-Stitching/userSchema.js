const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => [{ id: '1', name: 'Alice' }],
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });

