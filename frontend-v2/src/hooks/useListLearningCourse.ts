import fetchGetLearningCourse from "@apolloClient/query/user/getKnownObject";
import { useQuery } from "react-query";

export default function useListLearningCourse(params: { email: string }) {
  const { email } = params;
  const getLearningCourseQuery = useQuery(
    ["getLearningCourseQuery", email],
    () => fetchGetLearningCourse({ email: email }),
    {
      enabled: email != "",
      staleTime: 0,
      cacheTime: 0,
    }
  );

  return getLearningCourseQuery;
}
