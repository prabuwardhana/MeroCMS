import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoryType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetCategoriesQuery = () => {
  const { data: categoryQuery } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await API.get<CategoryType[]>(`/api/category/`);
    },
    staleTime: Infinity,
  });

  return { categoryQuery };
};
