import gql from "graphql-tag";
import client from "../../client";

const GQL_STATEMENT = gql`
  query getKnownObjects($email: String!) {
    getKnownObjects(email: $email) {
      status_code
      error
      message
      data {
        learning_courses {
          id
          course_name
          course_time
          course_fee
          course_link
          course_rating
          course_enroll
        }
        completed_courses {
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

const getUserCourses = async (params: { email: string }) => {
  const result = await client.query({
    query: GQL_STATEMENT,
    variables: {
      email: params.email,
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getKnownObjects } = data;
  if (!getKnownObjects?.data) {
    return undefined;
  }
  const learningCourses: Course[] = [];
  getKnownObjects?.data?.learning_courses?.forEach((element: any) => {
    learningCourses.push({
      id: element.id,
      link: element.course_link,
      fee: element.course_fee,
      enroll: element.course_enroll,
      name: element.course_name,
      rating: element.course_rating,
      time: element.course_time,
    });
  });
  const completedCourses: Course[] = [];
  getKnownObjects?.data?.completed_courses?.forEach((element: any) => {
    completedCourses.push({
      id: element.id,
      link: element.course_link,
      fee: element.course_fee,
      enroll: element.course_enroll,
      name: element.course_name,
      rating: element.course_rating,
      time: element.course_time,
    });
  });

  return {
    learningCourses: learningCourses,
    completedCourses: completedCourses,
  };
};

export default getUserCourses;
