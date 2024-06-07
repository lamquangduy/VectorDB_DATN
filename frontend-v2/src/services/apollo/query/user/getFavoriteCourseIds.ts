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
      }
    }
  }
`;

const fetchGetFavoriteCourseIds = async (parms: {
  email: string;
  page: number;
  limit: number;
}) => {
  const result = await client.query({
    query: GQL,
    variables: {
      email: parms.email,
      pagination: {
        page: parms.page,
        limit: parms.limit,
      },
    },
    fetchPolicy: "no-cache",
  });
  const { data } = result;
  const { getFavoriteCourses } = data;
  if (!getFavoriteCourses?.data) {
    return undefined;
  }
  const results: string[] = [];
  getFavoriteCourses?.data?.courses?.forEach((element: any) => {
    results.push(element.id);
  });

  return results;
};

export default fetchGetFavoriteCourseIds;
