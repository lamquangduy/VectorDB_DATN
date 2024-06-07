import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_TOOLS = gql`
  query getTools($filter: ToolFilterInput!) {
    getTools(filter: $filter) {
      status_code
      message
      data {
        tools {
          id
          tool_name
        }
        total
        page
        limit
      }
      error
    }
  }
`;

const fetchGetTools = async () => {
  const result = await client.query({
    query: GET_TOOLS,
    variables: {
      filter: {
        pagination: {
          page: 1,
          limit: 999,
        },
      },
    },
  });
  const { data } = result;
  const { getTools } = data;
  const tools: ITool[] = getTools.data.tools?.map((item: any) => {
    const tool: ITool = {
      id: item.id || "",
      tool_name: item.tool_name || "",
    };
    return tool;
  });
  return tools;
};

export default fetchGetTools;
