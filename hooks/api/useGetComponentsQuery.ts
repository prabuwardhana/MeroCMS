import { useSuspenseQuery } from "@tanstack/react-query";
import { PageComponentType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetComponentQuery = () => {
  const { data: componentsQuery } = useSuspenseQuery({
    queryKey: ["components"],
    queryFn: async () => {
      return await API.get<PageComponentType[]>(`/api/component/`);
    },
    staleTime: Infinity,
  });

  return { componentsQuery };
};
