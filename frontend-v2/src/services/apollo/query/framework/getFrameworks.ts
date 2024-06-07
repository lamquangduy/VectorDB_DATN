import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_FRAMEWORKS = gql`
  query getFrameworks($filter: FrameworkFilterInput!) {
    getFrameworks(filter: $filter) {
      status_code
      message
      data {
        frameworks {
          id
          framework_name
        }
        total
        page
        limit
      }
      error
    }
  }
`;

const fetchGetFrameWorks = async () => {
  const result = await client.query({
    query: GET_FRAMEWORKS,
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
  const { getFrameworks } = data;
  const frameworks: IFramework[] = getFrameworks.data.frameworks?.map(
    (item: any) => {
      const framework: IFramework = {
        id: item.id || "",
        framework_name: item.framework_name || "",
      };
      return framework;
    }
  );
  return frameworks;
};

export default fetchGetFrameWorks;
