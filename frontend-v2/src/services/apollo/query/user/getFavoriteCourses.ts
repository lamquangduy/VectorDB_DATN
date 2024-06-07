import gql from "graphql-tag";
import client from "../../client";

const GQL = gql`
  query getFavoriteCourses($email: String!, $pagination: Pagination!) {
    getFavoriteCourses(email: $email, pagination: $pagination) {
      status_code
      message
      error
      data {
        courses {
          id
          course_name
          course_time
          course_fee
          course_link
          course_rating
          course_enroll
        }
        total
        page
        limit
      }
    }
  }
`;

const fetchGetFavoriteCourses = async (params: {
  email: string;
  page: number;
  limit: number;
}) => {
  const result = await client.query({
    query: GQL,
    variables: {
      email: params.email,
      pagination: {
        page: params.page,
        limit: params.limit,
      },
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getFavoriteCourses } = data;
  if (!getFavoriteCourses?.data) {
    return undefined;
  }
  const results: Course[] = [];
  getFavoriteCourses?.data?.courses?.forEach((element: any) => {
    results.push({
      id: element.id,
      link: element.course_link,
      fee: element.course_fee,
      enroll: element.course_enroll,
      name: element.course_name,
      rating: element.course_rating,
      time: element.course_time,
    });
  });

  return {
    courses: results,
    total: getFavoriteCourses?.data?.total,
    page: getFavoriteCourses?.data?.page,
    limit: getFavoriteCourses?.data?.limit,
  };
};

export default fetchGetFavoriteCourses;
