const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const { userLoader } = require('./dataLoader');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  context: { loaders: { userLoader } }  // Pass the DataLoader instance
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});

