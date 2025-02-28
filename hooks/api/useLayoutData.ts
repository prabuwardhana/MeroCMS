import API from "@/config/apiClient";
import type { NavMenuType } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLayoutData = () => {
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
