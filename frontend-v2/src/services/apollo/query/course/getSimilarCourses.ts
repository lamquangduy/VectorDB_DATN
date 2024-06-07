import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_SIMILAR_COURSES = gql`
  query getSimilarCourses($courseId: String!, $pagination: Pagination!) {
    getSimilarCourses(course_id: $courseId, pagination: $pagination) {
      data {
        courses {
          id
          course_name
          course_time
          course_fee
          course_link
          course_rating
          course_enroll
        }
        total
        page
        limit
      }
      status_code
      message
      error
    }
  }
`;

const fetchSimilarCourses = async (
  courseId: string,
  page: number = 1,
  limit: number = 999
) => {
  const result = await client.query({
    query: GET_SIMILAR_COURSES,
    variables: {
      courseId: courseId,
      pagination: {
        page: page,
        limit: limit,
      },
    },
  });
  const { data } = result;
  const { getSimilarCourses } = data;
  const courses: Course[] = getSimilarCourses.data.courses.map((item: any) => {
    const course: Course = {
      id: item.id || "",
      name: item.course_name || "",
      enroll: item.course_enroll || 0,
      fee: item.course_fee || 0,
      link: item.course_link || "",
      rating: item.course_rating || 0,
      time: item.course_time || 0,
    };
    return course;
  });
  return courses;
};

export default fetchSimilarCourses;
