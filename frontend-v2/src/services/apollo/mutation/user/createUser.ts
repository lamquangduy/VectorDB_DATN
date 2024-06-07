import gql from "graphql-tag";
import client from "../../client";

const CREATE_USER = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      status_code
      message
      data {
        username
        email
        first_name
        last_name
      }
      error
    }
  }
`;

const fetchCreateUser = async (
  username: string,
  email: string,
  firstName: string,
  lastName: string
) => {
  const result = await client.mutate({
    mutation: CREATE_USER,
    variables: {
      data: {
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });
  const { data } = result;
  const { createUser } = data;
  if (!createUser?.data) {
    return undefined;
  }
  const user: IUser = {
    email: createUser?.data?.email || "",
    userName: createUser?.data?.username || "",
    first_name: createUser?.data?.first_name || "",
    last_name: createUser?.data?.last_name || "",
  };
  return user;
};

export default fetchCreateUser;
