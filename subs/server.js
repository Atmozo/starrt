const { ApolloServer } = require('apollo-server');
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');

// Redis setup
const pubsub = new RedisPubSub({
  publisher: new Redis(),
  subscriber: new Redis()
});

// Mock database
let messages = [];

// Schema definition
const typeDefs = `
  type Message {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(content: String!, author: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage: (_, { content, author }) => {
      const newMessage = { id: String(Date.now()), content, author };
      messages.push(newMessage);
      pubsub.publish('MESSAGE_ADDED', { messageAdded: newMessage });
      return newMessage;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(['MESSAGE_ADDED'])
    }
  }
};

// Create server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/subscriptions'
  }
});

// Start server
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at  http://localhost:4003/ `);
});
