import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoryType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetSingleCategoryQuery = (id: string) => {
  const { data: categoryQuery } = useSuspenseQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<CategoryType>(`/api/category/${id}`) : null;
    },
    staleTime: Infinity,
  });

  return { categoryQuery };
};
