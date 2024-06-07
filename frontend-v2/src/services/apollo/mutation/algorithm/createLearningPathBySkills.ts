import gql from "graphql-tag";
import client from "../../client";

const CREATE_SB_LEARNING_PATHS = gql`
  mutation createLearningPathBySkills($data: CreateLearningPathBySkillsInput!) {
    createLearningPathBySkills(data: $data) {
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

const createLearningPathBySkills = async (
  career_id: number,
  skills_need: number[],
  skills_known: number[]
) => {
  const result = await client.mutate({
    mutation: CREATE_SB_LEARNING_PATHS,
    variables: {
      data: {
        career_id: career_id,
        skills_need: skills_need,
        skills_known: skills_known,
      },
    },
  });
  const { data } = result;
  const { createLearningPathBySkills } = data;
  return createLearningPathBySkills;
};

export default createLearningPathBySkills;
