import gql from "graphql-tag";
import client from "../../client";

const IMPORT_DATA_FROM_TASK = gql`
  mutation importDataFromTask($task_id: String!) {
    importDataFromTask(task_id: $task_id) {
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

const importDataFromTask = async (task_id: String) => {
  const result = await client.mutate({
    mutation: IMPORT_DATA_FROM_TASK,
    variables: { task_id: task_id },
  });
  const { data } = result;
  const { importDataFromTask } = data;
  return importDataFromTask;
};

export default importDataFromTask;
