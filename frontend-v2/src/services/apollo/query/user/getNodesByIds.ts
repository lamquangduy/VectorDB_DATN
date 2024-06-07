import gql from "graphql-tag";
import client from "../../client";

const GET_NODE_BY_ID = gql`
  query getNodesByIds($ids: [Int]) {
    getNodesByIds(ids: $ids) {
      data {
        career {
          id
          career_title
        }
        course {
          id
          course_name
        }
        framework {
          id
          framework_name
        }
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
      }
    }
  }
`;

const getNodesByIds = async (ids: Number[]) => {
  const result = await client.query({
    query: GET_NODE_BY_ID,
    variables: {
      ids: ids,
    },
  });
  const { data } = result;
  const { getNodesByIds } = data;

  return getNodesByIds;
};

export default getNodesByIds;
