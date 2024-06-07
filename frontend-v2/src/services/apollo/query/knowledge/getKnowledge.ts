import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_LIST_KNOWLEDGE = gql`
  query getListKnowledge($filter: KnowledgeFilterInput!) {
    getListKnowledge(filter: $filter) {
      status_code
      message
      data {
        list_knowledge {
          id
          knowledge_name
        }
        total
        page
        limit
      }
      error
    }
  }
`;

const fetchGetListKnowledge = async () => {
  const result = await client.query({
    query: GET_LIST_KNOWLEDGE,
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
  const { getListKnowledge } = data;
  const list_knowledge: IKnowledge[] =
    getListKnowledge.data.list_knowledge?.map((item: any) => {
      const knowledge: IKnowledge = {
        id: item.id || "",
        knowledge_name: item.knowledge_name || "",
      };
      return knowledge;
    });
  return list_knowledge;
};

export default fetchGetListKnowledge;
