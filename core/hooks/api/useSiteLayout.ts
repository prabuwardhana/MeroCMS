import type { NavMenuType } from "@/core/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";

const baseURL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_APP_BASE_URL}:${import.meta.env.VITE_PORT}`
    : `${import.meta.env.VITE_APP_BASE_URL}`;

export const useSiteLayout = () => {
  const getNavMenuByTitle = (title: string) => {
    const { data: navMenuQuery } = useSuspenseQuery({
      queryKey: ["nav-menu", title],
      queryFn: async () => {
        const response = await fetch(`${baseURL}/api/site/nav/${title}`);
        return (await response.json()) as NavMenuType;
      },
      staleTime: Infinity,
    });

    return navMenuQuery;
  };

  return { getNavMenuByTitle };
};
