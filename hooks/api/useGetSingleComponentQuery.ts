import { useSuspenseQuery } from "@tanstack/react-query";
import { PageComponentType } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetSingleComponentQuery = (id: string | undefined) => {
  const { data: componentQuery } = useSuspenseQuery({
    queryKey: ["component", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageComponentType>(`/api/component/${id}`) : null;
    },
    staleTime: Infinity,
  });

  return { componentQuery };
};
