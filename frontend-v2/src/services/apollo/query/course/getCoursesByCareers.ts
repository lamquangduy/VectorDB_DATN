import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_COURSES_BY_CAREER = gql`
  query getCoursesByCareer($careerName: String!, $website: String) {
    getCoursesByCareer(career_name: $careerName, website: $website) {
      data {
        career {
          id
          career_title
        }
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
      status_code
      message
      error
    }
  }
`;

const fetchGetCoursesByCareer = async (
  careerName: string,
  webFilter: string
) => {
  const result = await client.query({
    query: GET_COURSES_BY_CAREER,
    variables: {
      careerName: careerName,
      website: webFilter,
    },
  });
  const { data } = result;
  const { getCoursesByCareer } = data;
  const courses: Course[] = getCoursesByCareer.data.courses.map((item: any) => {
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

export default fetchGetCoursesByCareer;
