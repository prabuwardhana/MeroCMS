import { useSuspenseQuery } from "@tanstack/react-query";
import API from "@/config/apiClient";
import { NavMenuType } from "@/lib/types";

export const useGetSingleNavMenuQuery = (id: string) => {
  const { data: navMenuQuery } = useSuspenseQuery({
    queryKey: ["navmenu", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<NavMenuType>(`/api/navmenu/${id}`) : null;
    },
    staleTime: Infinity,
  });

  return { navMenuQuery };
};
