import { useSuspenseQuery } from "@tanstack/react-query";
import { PostType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetSinglePostQuery = (id: string) => {
  const { data: postQuery } = useSuspenseQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PostType>(`/api/post/edit/${id}`) : null;
    },
    staleTime: 60 * 1000,
  });

  return { postQuery };
};
