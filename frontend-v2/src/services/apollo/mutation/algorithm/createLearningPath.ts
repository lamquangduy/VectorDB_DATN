import gql from "graphql-tag";
import client from "../../client";

const CREATE_LEARNING_PATHS = gql`
  mutation createLearningPaths(
    $email: String!
    $learning_type: Int!
    $algorithm: AlgorithmType!
  ) {
    createLearningPaths(
      email: $email
      learning_type: $learning_type
      algorithm: $algorithm
    ) {
      data {
        task_id
        status
      }
    }
  }
`;

const createLearningPaths = async (email: string, learning_type: number) => {
  const algorithm = "PAGE_RANK";

  const result = await client.mutate({
    mutation: CREATE_LEARNING_PATHS,
    variables: {
      email: email,
      learning_type: learning_type,
      algorithm: algorithm,
    },
  });
  const { data } = result;
  const { createLearningPaths } = data;
  return createLearningPaths;
};

export default createLearningPaths;
