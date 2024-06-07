import gql from "graphql-tag";
import client from "../../client";

const GET_USERS = gql`
  query getUser($email: String!) {
    getUser(email: $email) {
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

const fetchGetUser = async (email: string) => {
  const result = await client.query({
    query: GET_USERS,
    variables: {
      email: email,
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getUser } = data;
  if (!getUser?.data) {
    return undefined;
  }
  const user: IUser = {
    email: getUser?.data?.email || "",
    userName: getUser?.data?.username || "",
    first_name: getUser?.data?.first_name || "",
    last_name: getUser?.data?.last_name || "",
  };
  return user;
};

export default fetchGetUser;
