import gql from "graphql-tag";
import client from "../../client";

// import learningMockData from "@views/user/learningPathMock";

const REMOVE_LEARNING_PATHS = gql`
  mutation removeLearningPaths($data: GetLearningPathsInput!) {
    removeLearningPaths(data: $data) {
      status_code
      message
      data {
        task_id
        status
      }
      error
    }
  }
`;

const removeLearningPaths = async (
  email: string,
  task_id: string | null = null
) => {
  // return learningMockData;
  const result = await client.mutate({
    mutation: REMOVE_LEARNING_PATHS,
    variables: {
      data: {
        email: email,
        task_id: task_id,
      },
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { removeLearningPaths } = data;
  return removeLearningPaths;
};

export default removeLearningPaths;
