import API from "@/core/config/apiClient";
import type { NavMenuType } from "@/core/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSiteLayout = () => {
  const getNavMenuByTitle = (title: string) => {
    const { data: navMenuQuery } = useSuspenseQuery({
      queryKey: ["nav-menu", title],
      queryFn: async () => {
        return await API.get<NavMenuType>(`/api/site/nav/${title}`);
      },
      staleTime: Infinity,
    });

    return navMenuQuery?.data;
  };

  return { getNavMenuByTitle };
};
