import gql from "graphql-tag";
import client from "../../client";

const LEARN_COURSE = gql`
  mutation learnCourse($email: String!, $course_id: String!) {
    learnCourse(data: { email: $email, course_id: $course_id }) {
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

const learnCourse = async (email: string, course_id: string) => {
  const result = await client.mutate({
    mutation: LEARN_COURSE,
    variables: { email: email, course_id: course_id },
  });
  const { data } = result;
  const { learnCourse } = data;
  return learnCourse;
};

export default learnCourse;
