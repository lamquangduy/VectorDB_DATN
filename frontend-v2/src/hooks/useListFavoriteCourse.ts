import fetchGetFavoriteCourseIds from "@apolloClient/query/user/getFavoriteCourseIds";
import { useQuery } from "react-query";

export default function useListFavoriteCourse(params: {
  email: string;
  page: number;
  limit: number;
}) {
  const { email, page, limit } = params;
  const getFavoriteCourseQuery = useQuery(
    ["getFavoriteCourseQuery", email, page, limit],
    () => fetchGetFavoriteCourseIds({ email: email, page: page, limit: limit }),
    {
      enabled: email != "",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return getFavoriteCourseQuery;
}
