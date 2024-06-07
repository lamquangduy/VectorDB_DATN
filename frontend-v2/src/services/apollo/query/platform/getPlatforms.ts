import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_PLATFORMS = gql`
  query getPlatforms($filter: PlatformFilterInput!) {
    getPlatforms(filter: $filter) {
      status_code
      message
      data {
        platforms {
          id
          platform_name
        }
        total
        page
        limit
      }
      error
    }
  }
`;

const fetchGetPlatforms = async () => {
  const result = await client.query({
    query: GET_PLATFORMS,
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
  const { getPlatforms } = data;
  const platforms: IPlatform[] = getPlatforms.data.platforms?.map(
    (item: any) => {
      const platform: IPlatform = {
        id: item.id || "",
        platform_name: item.platform_name || "",
      };
      return platform;
    }
  );
  return platforms;
};

export default fetchGetPlatforms;
