
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

(async () => {
  const app = express();

  // Init Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  
  server.applyMiddleware({ app });

  const PORT = 4000;

  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
})();
