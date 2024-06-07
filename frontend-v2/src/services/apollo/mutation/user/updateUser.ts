import gql from "graphql-tag";
import client from "../../client";

const UDATE_USER = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
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

const fetchUpdateUser = async (params: {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}) => {
  const result = await client.mutate({
    mutation: UDATE_USER,
    variables: {
      data: {
        username: params.username,
        email: params.email,
        first_name: params.firstName,
        last_name: params.lastName,
      },
    },
  });
  const { data } = result;
  const { updateUser } = data;
  if (!updateUser?.data) {
    return undefined;
  }
  const user: IUser = {
    email: updateUser?.data?.email || "",
    userName: updateUser?.data?.username || "",
    first_name: updateUser?.data?.first_name || "",
    last_name: updateUser?.data?.last_name || "",
  };
  return user;
};

export default fetchUpdateUser;
