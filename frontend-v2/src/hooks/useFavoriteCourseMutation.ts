import fetchAddFavoriteCourse from "@apolloClient/mutation/course/addFavoriteCourse";
import fetchRemoveFavoriteCourse from "@apolloClient/mutation/course/removeFavoriteCorse";
import { useMutation } from "react-query";

export default function useFavoriteCourseMutation() {
  const favoriteCourseMutation = useMutation(
    (params: { course_id: string; email: string; is_favorite: boolean }) => {
      if (params.is_favorite) {
        return fetchRemoveFavoriteCourse({
          email: params.email,
          course_id: params.course_id,
        });
      }
      return fetchAddFavoriteCourse({
        email: params.email,
        course_id: params.course_id,
      });
    }
  );

  return favoriteCourseMutation;
}
