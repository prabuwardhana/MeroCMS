import API from "@/config/apiClient";
import { CloudinaryResponseType } from "@/lib/types";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useGetImagesQuery = (nextCursor: string | null) => {
  const {
    data: { pages },
    fetchNextPage,
  } = useSuspenseInfiniteQuery({
    queryKey: ["resources"],
    queryFn: async ({ pageParam }) => {
      return await API.get<CloudinaryResponseType>(`/api/media/resources/${pageParam}`);
    },
    initialPageParam: null,
    getNextPageParam: () => {
      return nextCursor;
    },
    staleTime: 60 * 60 * 1000,
  });

  return { pages, fetchNextPage };
};
