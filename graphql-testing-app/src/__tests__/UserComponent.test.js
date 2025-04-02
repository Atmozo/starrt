import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { GET_USER } from "../graphql/queries";
import UserComponent from "../components/UserComponent";

const mocks = [
  {
    request: { query: GET_USER, variables: { id: "1" } },
    result: {
      data: { user: { id: "1", name: "John Doe", email: "john@example.com" } },
    },
  },
];

test("displays user data", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UserComponent userId="1" />
    </MockedProvider>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
  expect(screen.getByText("john@example.com")).toBeInTheDocument();
});

