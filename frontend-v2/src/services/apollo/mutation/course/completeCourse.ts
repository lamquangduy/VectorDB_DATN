import gql from "graphql-tag";
import client from "../../client";

const GQL_STATEMENT = gql`
  mutation completeCourse($email: String!, $course_id: String!) {
    completeCourse(data: { email: $email, course_id: $course_id }) {
      status_code
      message
      data {
        status
        message
      }
      error
    }
  }
`;

const completeCourse = async (email: string, course_id: string) => {
  const result = await client.mutate({
    mutation: GQL_STATEMENT,
    variables: { email: email, course_id: course_id },
  });
  const { data } = result;
  const { completeCourse } = data;
  return completeCourse;
};

export default completeCourse;
