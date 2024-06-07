import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_RECOMMENDED_COURSES = gql`
  query getRecommendedCourses($email: String!, $pagination: Pagination!) {
    getRecommendedCourses(email: $email, pagination: $pagination) {
      status_code
      message
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
      error
    }
  }
`;

const getRecommendedCourses = async (
  email: string,
  page: number = 1,
  limit: number = 50
) => {
  const result = await client.query({
    query: GET_RECOMMENDED_COURSES,
    variables: {
      email: email,
      pagination: {
        page: page,
        limit: limit,
      },
    },
  });
  const { data } = result;
  const { getRecommendedCourses } = data;
  const courses: Course[] = getRecommendedCourses.data.courses.map(
    (item: any) => {
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
    }
  );
  return {
    courses: courses,
    total: getRecommendedCourses?.data?.total,
    page: getRecommendedCourses?.data?.page,
    limit: getRecommendedCourses?.data?.limit,
  };
};

export default getRecommendedCourses;
