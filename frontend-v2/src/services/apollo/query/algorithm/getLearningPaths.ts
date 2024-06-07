import gql from "graphql-tag";
import client from "../../client";

// import learningMockData from "@views/user/learningPathMock";

const GET_LEARNING_PATHS = gql`
  query getLearningPaths($data: GetLearningPathsInput!) {
    getLearningPaths(data: $data) {
      status_code
      message
      data {
        task_id
        status
        result {
          career_id
          skills_need
          skills_known
          total
          execution_time
          learning_paths {
            free_courses {
              id
              course_name
              course_time
              course_fee
              course_link
              course_rating
              course_enroll
              knowledge {
                id
                knowledge_name
              }
              platform {
                id
                platform_name
              }
              programming_language {
                id
                programming_language_name
              }
              tool {
                id
                tool_name
              }
              framework {
                id
                framework_name
              }
            }
            path_courses {
              id
              course_name
              course_time
              course_fee
              course_link
              course_rating
              course_enroll
              knowledge {
                id
                knowledge_name
              }
              platform {
                id
                platform_name
              }
              programming_language {
                id
                programming_language_name
              }
              tool {
                id
                tool_name
              }
              framework {
                id
                framework_name
              }
            }
            info {
              f_point
              cost
              time
              total_PR
              nCourses
              redundant_LO
              overlap_LO
              overlap_Level
            }
          }
        }
      }
      error
    }
  }
`;

const getLearningPaths = async (
  email: string,
  task_id: string | null = null
) => {
  // return learningMockData;
  const result = await client.query({
    query: GET_LEARNING_PATHS,
    variables: {
      data: {
        email: email,
        task_id: task_id,
      },
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getLearningPaths } = data;
  return getLearningPaths;
};

export default getLearningPaths;
