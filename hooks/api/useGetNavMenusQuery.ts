import { useSuspenseQuery } from "@tanstack/react-query";
import API from "@/config/apiClient";
import { NavMenuType } from "@/lib/types";

export const useGetNavMenusQuery = () => {
  const { data: navMenusQuery } = useSuspenseQuery({
    queryKey: ["navmenus"],
    queryFn: async () => {
      return await API.get<NavMenuType[]>("/api/navmenu");
    },
    staleTime: Infinity,
  });

  return { navMenusQuery };
};
