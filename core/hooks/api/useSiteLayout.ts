import type { NavMenuType } from "@/core/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSiteLayout = () => {
  const getNavMenuByTitle = (title: string) => {
    const { data: navMenuQuery } = useSuspenseQuery({
      queryKey: ["nav-menu", title],
      queryFn: async () => {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}/api/site/nav/${title}`,
        );
        return (await response.json()) as NavMenuType;
      },
      staleTime: Infinity,
    });

    return navMenuQuery;
  };

  return { getNavMenuByTitle };
};
