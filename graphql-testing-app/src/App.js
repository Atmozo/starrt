import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import UserComponent from "./components/UserComponent";
import UpdateUser from "./components/UpdateUser";

const client = new ApolloClient({
  uri: "https://mock-api.com/graphql", // Replace with real GraphQL endpoint
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <h1>GraphQL Testing App</h1>
      <UserComponent userId="1" />
      <UpdateUser userId="1" />
    </ApolloProvider>
  );
};

export default App;

