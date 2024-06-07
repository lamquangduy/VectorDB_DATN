import gql from "graphql-tag";
import client from "../../client";

const LEARN_COURSE = gql`
  mutation removeCourse($email: String!, $course_id: String!) {
    removeCourse(data: { email: $email, course_id: $course_id }) {
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

const stopLearning = async (email: string, course_id: string) => {
  const result = await client.mutate({
    mutation: LEARN_COURSE,
    variables: { email: email, course_id: course_id },
  });
  const { data } = result;
  const { removeCourse } = data;
  return removeCourse;
};

export default stopLearning;
