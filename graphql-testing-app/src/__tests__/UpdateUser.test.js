import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { UPDATE_USER } from "../graphql/mutations";
import UpdateUser from "../components/UpdateUser";

const mocks = [
  {
    request: { query: UPDATE_USER, variables: { id: "1", name: "Jane Doe" } },
    result: { data: { updateUser: { id: "1", name: "Jane Doe" } } },
  },
];

test("updates user", async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <UpdateUser userId="1" />
    </MockedProvider>
  );

  fireEvent.change(screen.getByPlaceholderText("Enter new name"), {
    target: { value: "Jane Doe" },
  });
  fireEvent.click(screen.getByText("Update"));

  await waitFor(() => expect(screen.getByPlaceholderText("Enter new name").value).toBe("Jane Doe"));
});

