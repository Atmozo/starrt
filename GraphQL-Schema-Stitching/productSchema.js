const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = `
  type Product {
    id: ID!
    name: String!
  }

  type Query {
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    products: () => [{ id: '1', name: 'Laptop' }],
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });

