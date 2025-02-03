import { useSuspenseQuery } from "@tanstack/react-query";
import { PostType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetPostsQuery = () => {
  const { data: postsQuery } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await API.get<PostType[]>(`/api/post/`);
    },
    staleTime: Infinity,
  });

  return { postsQuery };
};
