import gql from "graphql-tag";
import client from "../../client";

const UPDATE_CAREERS = gql`
  mutation updateCareers($data: UpdateCareersInput!) {
    updateCareers(data: $data) {
      status_code
      data {
        status
        message
      }
      error
    }
  }
`;

const updateCareers = async (params: {
  email: string;
  achieved_careers?: number[];
  goal_career_id?: number;
}) => {
  const result = await client.mutate({
    mutation: UPDATE_CAREERS,
    variables: {
      data: {
        email: params.email,
        achieved_careers: params.achieved_careers,
        goal_career_id: params.goal_career_id,
      },
    },
  });
  const { data } = result;
  const { updateCareers } = data;

  return updateCareers;
};

export default updateCareers;
