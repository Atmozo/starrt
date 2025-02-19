const { ApolloServer } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

//  type definitions including the federation directives
const typeDefs = gql`
  extend type Query {
    products: [Product]
  }

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
  }
`;

// resolvers for your schema
const resolvers = {
  Query: {
    products: () => [
      { id: '1', name: 'Laptop', price: 999.99 },
      { id: '2', name: 'Smartphone', price: 599.99 },
    ],
  },
  Product: {
    
    __resolveReference(reference) {
      const products = [
        { id: '1', name: 'Laptop', price: 999.99 },
        { id: '2', name: 'Smartphone', price: 599.99 },
      ];
      return products.find(product => product.id === reference.id);
    },
  },
};

// Build the federated schema
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

// Start the subgraph service
server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Products subgraph ready at ${url}`);
});
