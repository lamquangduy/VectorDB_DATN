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
        }
        completed_courses {
          id
          course_name
        }
      }
    }
  }
`;

const fetchGetLearningCourse = async (params: { email: string }) => {
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

  const learningCourses: string[] = [];
  getKnownObjects?.data?.learning_courses?.forEach((element: any) => {
    learningCourses.push(element.id);
  });
  const completedCourses: string[] = [];
  getKnownObjects?.data?.completed_courses?.forEach((element: any) => {
    completedCourses.push(element.id);
  });

  return {
    learningCourses,
    completedCourses,
  };
};

export default fetchGetLearningCourse;
