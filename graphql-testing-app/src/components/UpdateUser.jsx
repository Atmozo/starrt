import { useMutation } from "@apollo/client";
import { useState } from "react";
import { UPDATE_USER } from "../graphql/mutations";

const UpdateUser = ({ userId }) => {
  const [name, setName] = useState("");
  const [updateUser] = useMutation(UPDATE_USER);

  const handleUpdate = async () => {
    await updateUser({ variables: { id: userId, name } });
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter new name"
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdateUser;

