import gql from "graphql-tag";
import client from "../../client";

const GET_KNOWN_OBJECTS = gql`
  query getKnownObjects($email: String!) {
    getKnownObjects(email: $email) {
      status_code
      message
      data {
        tools {
          id
          tool_name
        }
        frameworks {
          id
          framework_name
        }
        programming_languages {
          id
          programming_language_name
        }
        platforms {
          id
          platform_name
        }
        knowledge {
          id
          knowledge_name
        }
        learning_courses {
          id
          course_name
        }
        completed_courses {
          id
          course_name
        }
        hope_careers {
          id
          career_title
        }
        achieved_careers {
          id
          career_title
        }
      }
      error
    }
  }
`;

const getUserKnownObjects = async (email: string) => {
  const result = await client.query({
    query: GET_KNOWN_OBJECTS,
    variables: {
      email: email,
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getKnownObjects } = data;

  return getKnownObjects.data;
};

export default getUserKnownObjects;
