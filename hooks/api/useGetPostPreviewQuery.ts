import { useSuspenseQuery } from "@tanstack/react-query";
import { PostDtoType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetPostPreviewQuery = (id: string) => {
  const { data: postPreviewQuery } = useSuspenseQuery({
    queryKey: ["postPreview", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PostDtoType>(`/api/post/preview/${id}`) : null;
    },
  });

  return { postPreviewQuery };
};
