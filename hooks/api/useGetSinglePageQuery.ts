import { useSuspenseQuery } from "@tanstack/react-query";
import { PageType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetSinglePageQuery = (id: string) => {
  const { data: pageQuery } = useSuspenseQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageType>(`/api/page/${id}`) : null;
    },
    staleTime: 60 * 1000,
  });

  return { pageQuery };
};
