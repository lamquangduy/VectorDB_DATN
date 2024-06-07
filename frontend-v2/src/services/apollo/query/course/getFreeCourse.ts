import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_FREE_COURSES = gql`
  query getFreeCourses($filter: CourseFilterInput!) {
    getFreeCourses(filter: $filter) {
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

const fetchGetFreeCourses = async (website: string = "coursera") => {
  const result = await client.query({
    query: GET_FREE_COURSES,
    variables: {
      filter: { website: website, pagination: { page: 0, limit: 20 } },
    },
  });
  const { data } = result;
  const { getFreeCourses } = data;
  const courses: Course[] = getFreeCourses.data.courses.map((item: any) => {
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
  return {
    courses: courses,
    total: getFreeCourses?.data?.total,
    page: getFreeCourses?.data?.page,
    limit: getFreeCourses?.data?.limit,
  };
};

export default fetchGetFreeCourses;
