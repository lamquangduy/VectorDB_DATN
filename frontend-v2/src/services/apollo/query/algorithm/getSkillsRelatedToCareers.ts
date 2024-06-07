import gql from "graphql-tag";
import client from "../../client";

// import learningMockData from "@views/user/learningPathMock";

const GET_SKILLS_RELATED_TO_CAREERS = gql`
  query getSkillsRelatedToCareers($input: RelatedCareers) {
    getSkillsRelatedToCareers(input: $input) {
      status_code
      message
      data {
        required_skills {
          knowledge {
            id
            knowledge_name
          }
          platforms {
            id
            platform_name
          }
          languages {
            id
            programming_language_name
          }
          tools {
            id
            tool_name
          }
          frameworks {
            id
            framework_name
          }
        }
        acquired_skills {
          knowledge {
            id
            knowledge_name
          }
          platforms {
            id
            platform_name
          }
          languages {
            id
            programming_language_name
          }
          tools {
            id
            tool_name
          }
          frameworks {
            id
            framework_name
          }
        }
      }
      error
    }
  }
`;

const getSkillsRelatedToCareers = async (
  current_careers: number[],
  goal_careers: number[]
) => {
  // return learningMockData;
  const result = await client.query({
    query: GET_SKILLS_RELATED_TO_CAREERS,
    variables: {
      input: {
        current_careers: current_careers,
        goal_careers: goal_careers,
      },
    },
  });
  const { data } = result;
  const { getSkillsRelatedToCareers } = data;
  return getSkillsRelatedToCareers;
};

export default getSkillsRelatedToCareers;
