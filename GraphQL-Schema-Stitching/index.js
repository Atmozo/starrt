const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const gatewaySchema = require('./stitchSchemas');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: gatewaySchema,
  graphiql: true,
}));

app.listen(4000, () => {
  console.log('Gateway running at http://localhost:4000/graphql');
});

