import client from "@apolloClient/client";
import gql from "graphql-tag";

const SEARCH_COURSE = gql`
  query searchCourses($filter: CourseFilterInput!) {
    searchCourses(filter: $filter) {
      status_code
      message
      data {
        courses {
          id
          course_name
          course_time
          course_fee
          course_link
          course_rating
          course_enroll
          matched_data
        }
        total
        page
        limit
      }
    }
  }
`;

const fetchSearchCourses = async (props: ISearchCourses) => {
  const {
    course_name,
    pageIndex,
    limit,
    website,
    course_time_from,
    course_time_to,
    course_fee_from,
    course_fee_to,
    course_rating_from,
    course_rating_to,
    platform,
    programming_language,
    tool,
    framework,
    knowledge,
    career,
  } = props;

  const result = await client.query({
    query: SEARCH_COURSE,
    variables: {
      filter: {
        course_name: course_name,
        website: website || "all",
        course_time_from: course_time_from || 0,
        course_time_to: course_time_to || 999999,
        course_fee_from: course_fee_from || 0,
        course_fee_to: course_fee_to || 999999,
        course_rating_from: course_rating_from || 0,
        course_rating_to: course_rating_to || 5,
        platform_related: platform || [],
        programming_language_related: programming_language || [],
        tool_related: tool || [],
        framework_related: framework || [],
        knowledge_related: knowledge || [],
        career_related: career || "",
        pagination: { page: pageIndex, limit: limit },
      },
    },
  });

  const { data } = result;
  const { searchCourses } = data;

  const courses: Course[] = searchCourses.data.courses.map((item: any) => {
    const course: Course = {
      id: item.id || "",
      name: item.course_name || "",
      enroll: item.course_enroll || 0,
      fee: item.course_fee || 0,
      link: item.course_link || "",
      rating: item.course_rating || 0,
      time: item.course_time || 0,
      matched_data: item.matched_data || [],
    };
    return course;
  });

  return {
    courses: courses,
    total: searchCourses?.data?.total,
    page: searchCourses?.data?.page,
    limit: searchCourses?.data?.limit,
  };
};

export default fetchSearchCourses;
