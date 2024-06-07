import gql from "graphql-tag";
import client from "../../client";

const LEARN_OBJECT = gql`
  mutation learnObjects($data: learnObjectsInput) {
    learnObjects(data: $data) {
      status_code
      message
      data {
        status
        message
      }
      error
    }
  }
`;

const fetchLearnObject = async (
  email: string,
  tool_ids: string[],
  framework_ids: string[],
  platform_ids: string[],
  programming_language_ids: string[],
  knowledge_ids: string[]
) => {
  const result = await client.mutate({
    mutation: LEARN_OBJECT,
    variables: {
      data: {
        email: email,
        tool_ids: tool_ids,
        framework_ids: framework_ids,
        platform_ids: platform_ids,
        programming_language_ids: programming_language_ids,
        knowledge_ids: knowledge_ids,
      },
    },
  });
  const { data } = result;
  const { learnObjects } = data;
  return learnObjects;
};

export default fetchLearnObject;
