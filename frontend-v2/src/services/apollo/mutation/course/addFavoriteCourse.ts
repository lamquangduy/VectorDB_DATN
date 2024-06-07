import gql from "graphql-tag";
import client from "../../client";

const ADD_FAVORITE_COURSE = gql`
  mutation addFavoriteCourse($data: learnCourseInput) {
    addFavoriteCourse(data: $data) {
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

const fetchAddFavoriteCourse = async (params: {
  email: string;
  course_id: string;
}) => {
  const result = await client.mutate({
    mutation: ADD_FAVORITE_COURSE,
    variables: { data: { email: params.email, course_id: params.course_id } },
  });
  const { data } = result;
  const { addFavoriteCourse } = data;
  return addFavoriteCourse;
};

export default fetchAddFavoriteCourse;
