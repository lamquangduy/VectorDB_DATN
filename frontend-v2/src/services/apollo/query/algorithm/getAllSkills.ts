import gql from "graphql-tag";
import client from "../../client";

// import learningMockData from "@views/user/learningPathMock";

const GET_ALL_SKILLS = gql`
  query getAllSkills {
    getAllSkills {
      status_code
      message
      data {
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
      error
    }
  }
`;

const getAllSkills = async () => {
  const result = await client.query({
    query: GET_ALL_SKILLS,
  });
  const { data } = result;
  const { getAllSkills } = data;
  return getAllSkills;
};

export default getAllSkills;
