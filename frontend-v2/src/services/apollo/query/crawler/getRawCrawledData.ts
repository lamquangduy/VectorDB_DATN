import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_RAW_CRAWLED_DATA = gql`
  query getRawCrawledData {
    getRawCrawledData {
      status_code
      message
      data {
        name
        link
        instructor
        enroll
        description
        relative
        rate
        level
        time
        fee
        image
        program {
          skill
          confidence
        }
        knowledge {
          skill
          confidence
        }
        programming_language {
          skill
          confidence
        }
        tool {
          skill
          confidence
        }
        platform {
          skill
          confidence
        }
        framework {
          skill
          confidence
        }
        knowledge_p {
          skill
          confidence
        }
        programming_language_p {
          skill
          confidence
        }
        tool_p {
          skill
          confidence
        }
        platform_p {
          skill
          confidence
        }
        framework_p {
          skill
          confidence
        }
        unknown_skill {
          skill
          confidence
        }
        has_confirmed
      }
    }
  }
`;

const fetchRawCrawledData = async () => {
  const result = await client.query({
    query: GET_RAW_CRAWLED_DATA,
  });
  const { data } = result;
  const { getRawCrawledData } = data;

  return getRawCrawledData;
};

export default fetchRawCrawledData;
