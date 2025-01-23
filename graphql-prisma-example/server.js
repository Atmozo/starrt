const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define GraphQL schema
const schema = buildSchema(`
  type Post {
    id: Int
    title: String
    content: String
    published: Boolean
  }

  type Query {
    posts: [Post]
    post(id: Int!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    updatePost(id: Int!, published: Boolean!): Post
    deletePost(id: Int!): Post
  }
`);

// Define resolvers
const root = {
  posts: async () => {
    return await prisma.post.findMany();
  },
  post: async ({ id }) => {
    return await prisma.post.findUnique({ where: { id } });
  },
  createPost: async ({ title, content }) => {
    return await prisma.post.create({
      data: { title, content },
    });
  },
  updatePost: async ({ id, published }) => {
    return await prisma.post.update({
      where: { id },
      data: { published },
    });
  },
  deletePost: async ({ id }) => {
    return await prisma.post.delete({
      where: { id },
    });
  },
};

// Set up Express server
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // Enables GraphiQL for testing queries/mutations
  })
);

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000/graphql');
});
