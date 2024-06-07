import gql from "graphql-tag";
import client from "../../client";

// import learningMockData from "@views/user/learningPathMock";

const GET_DASHBOARD_DATA = gql`
  query getDashboardData {
    getDashboardData {
      data {
        total_users
        total_tools
        total_frameworks
        total_programming_languages
        total_platforms
        total_knowledge
        total_courses
        current_processing_workers
        total_courses_crawled
        courses_by_domain {
          udemy
          coursera
          edx
        }
        setting {
          color
          worker_nodes
          crawl_threshold
        }
      }
    }
  }
`;

const getDashboardData = async () => {
  const result = await client.query({
    query: GET_DASHBOARD_DATA,
  });
  const { data } = result;
  const { getDashboardData } = data;
  return getDashboardData;
};

export default getDashboardData;
