const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./schema');
const graphqlRateLimiter = require('./rateLimiter');

const app = express();


app.use('/graphql', graphqlRateLimiter);

//  GraphQL endpoint.
app.use(
  '/graphql',
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL for testing
    context: { req },
  }))
);

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`GraphQL server running on http://localhost:${PORT}/graphql`)
);
