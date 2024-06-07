import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_COURSES_BY_POPULAR_PROGRAM = gql`
  query getCoursesByPopularProgram {
    getCoursesByPopularProgram {
      status_code
      data {
        program_id
        program_name
        courses {
          id
          course_name
          course_time
          course_fee
          course_link
          course_rating
          course_enroll
        }
      }
    }
  }
`;

const fetchCoursesByPopularProgram = async () => {
  const result = await client.query({
    query: GET_COURSES_BY_POPULAR_PROGRAM,
  });
  const { data } = result;
  const { getCoursesByPopularProgram } = data;

  return getCoursesByPopularProgram;
};

export default fetchCoursesByPopularProgram;
