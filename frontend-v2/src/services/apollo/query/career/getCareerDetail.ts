import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_CAREER_DETAIL = gql`
  query getCareerDetail($career_name: String!) {
    getCareerDetail(career_name: $career_name) {
      data {
        id
        career_title
        knowledge {
          id
          knowledge_name
        }
        programming_language {
          id
          programming_language_name
        }
        platform {
          id
          platform_name
        }
        platform {
          id
          platform_name
        }
        tool {
          id
          tool_name
        }
        framework {
          id
          framework_name
        }
        community {
          id
          community_name
        }
      }
      status_code
      message
      error
    }
  }
`;

const fetchCareerDetail = async (career_name: string = "") => {
  const result = await client.query({
    query: GET_CAREER_DETAIL,
    variables: {
      career_name,
    },
  });
  const { data } = result;
  const { getCareerDetail } = data;
  const career: ICareerDetail = getCareerDetail.data;
  return career;
};

export default fetchCareerDetail;
