const { ApolloClient, InMemoryCache, HttpLink, split } = require('@apollo/client');
const { WebSocketLink } = require('@apollo/client/link/ws');
const { getMainDefinition } = require('@apollo/client/utilities');
const { print } = require('graphql');

// Set up HTTP and WebSocket links
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: { reconnect: true }
});

// Split links based on operation type
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// Test subscription
const SUBSCRIPTION = `
  subscription {
    messageAdded {
      id
      content
      author
    }
  }
`;

client.subscribe({ query: SUBSCRIPTION }).subscribe({
  next: (data) => console.log('New message:', data.data.messageAdded),
  error: (err) => console.error('Subscription error:', err)
});

// Test mutation after 2 seconds
setTimeout(() => {
  const MUTATION = `
    mutation SendMessage($content: String!, $author: String!) {
      sendMessage(content: $content, author: $author) {
        id
        content
        author
      }
    }
  `;

  client.mutate({
    mutation: MUTATION,
    variables: { content: "Hello Redis!", author: "Test User" }
  }).then(result => console.log('Message sent:', result.data.sendMessage));
}, 2000);
