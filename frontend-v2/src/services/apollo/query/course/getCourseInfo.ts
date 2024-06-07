import client from "@apolloClient/client";
import gql from "graphql-tag";

const GET_COURSE_INFO = gql`
  query getCourseInfo($courseId: Int!) {
    getCourseInfo(course_id: $courseId) {
      data {
        id
        course_name
        course_time
        course_fee
        course_link
        course_rating
        course_enroll
        community {
          id
          community_name
        }
        knowledge {
          id
          knowledge_name
        }
        platform {
          id
          platform_name
        }
        programming_language {
          id
          programming_language_name
        }
        tool {
          id
          tool_name
        }
        framework {
          id
          framework_name
        }
        program {
          id
          program_name
        }
      }
      status_code
      message
      error
    }
  }
`;

const fetchCourseInfo = async (courseId: number) => {
  const result = await client.query({
    query: GET_COURSE_INFO,
    variables: {
      courseId: courseId,
    },
  });
  const { data } = result;
  const { getCourseInfo } = data;
  const course: ICourseInfo = getCourseInfo.data;

  return course;
};

export default fetchCourseInfo;
