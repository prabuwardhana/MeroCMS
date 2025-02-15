import { useSuspenseQuery } from "@tanstack/react-query";
import { PageType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetPagesQuery = () => {
  const { data: pagesQuery } = useSuspenseQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      return await API.get<PageType[]>(`/api/page/`);
    },
    staleTime: Infinity,
  });

  return { pagesQuery };
};
