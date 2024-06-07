import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_CAREERS = gql`
  query getCareers($filter: CareerFilterInput!) {
    getCareers(filter: $filter) {
      data {
        careers {
          id
          career_title
        }
        total
        page
        limit
      }
    }
  }
`;

const fetchCareers = async () => {
  const result = await client.query({
    query: GET_CAREERS,
    variables: {
      filter: {
        pagination: {
          page: 0,
          limit: 999,
        },
      },
    },
  });
  const { data } = result;
  const { getCareers } = data;
  const careers: Career[] = getCareers.data.careers?.map((item: any) => {
    const career: Career = {
      id: item.id || "",
      title: item.career_title || "",
    };
    return career;
  });
  return careers;
};

export default fetchCareers;
