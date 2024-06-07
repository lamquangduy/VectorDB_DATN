import gql from "graphql-tag";
import client from "../../client";

const GQL_STATEMENT = gql`
  mutation removeFavoriteCourse($data: learnCourseInput) {
    removeFavoriteCourse(data: $data) {
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

const fetchRemoveFavoriteCourse = async (params: {
  email: string;
  course_id: string;
}) => {
  const result = await client.mutate({
    mutation: GQL_STATEMENT,
    variables: { data: { email: params.email, course_id: params.course_id } },
  });
  const { data } = result;
  const { removeFavoriteCourse } = data;
  return removeFavoriteCourse;
};

export default fetchRemoveFavoriteCourse;
