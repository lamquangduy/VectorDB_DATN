import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_COURSES_BY_POPULAR_SKILLS = gql`
  query getPopularCoursesBySkills {
    getPopularCoursesBySkills {
      status_code
      data {
        languages {
          id
          programming_language_name
          courses {
            id
            course_name
          }
        }
        frameworks {
          id
          framework_name
          courses {
            id
            course_name
          }
        }
        platforms {
          id
          platform_name
          courses {
            id
            course_name
          }
        }
        knowledge {
          id
          knowledge_name
          courses {
            id
            course_name
          }
        }
        tools {
          id
          tool_name
          courses {
            id
            course_name
          }
        }
      }
    }
  }
`;

const getPopularCoursesBySkills = async () => {
  const result = await client.query({
    query: GET_COURSES_BY_POPULAR_SKILLS,
  });
  const { data } = result;
  const { getPopularCoursesBySkills } = data;

  return getPopularCoursesBySkills;
};

export default getPopularCoursesBySkills;
