const { ApolloServer, gql } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');

// Initialize PubSub for subscriptions
const pubsub = new PubSub();
const COUNTER_UPDATED = 'COUNTER_UPDATED';

// Type Definitions
const typeDefs = gql`
  type Query {
    currentCount: Int
  }

  type Subscription {
    counterUpdated: Int
  }

  type Mutation {
    incrementCounter: Int
  }
`;

// Resolvers
let counter = 0;

const resolvers = {
  Query: {
    currentCount: () => counter,
  },
  Mutation: {
    incrementCounter: () => {
      counter++;
      pubsub.publish(COUNTER_UPDATED, { counterUpdated: counter });
      return counter;
    },
  },
  Subscription: {
    counterUpdated: {
      subscribe: () => pubsub.asyncIterator(COUNTER_UPDATED),
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    path: '/subscriptions',
  },
});

// Start Server
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
