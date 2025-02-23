import API from "@/config/apiClient";
import type { NavMenuResponseType, NavMenuType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useNavMenus = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: navMenuQuery } = useSuspenseQuery({
    queryKey: ["navmenu", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<NavMenuType>(`/api/navmenu/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: navMenusQuery } = useSuspenseQuery({
    queryKey: ["navmenus"],
    queryFn: async () => {
      return await API.get<NavMenuType[]>("/api/navmenu");
    },
    staleTime: Infinity,
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: NavMenuType) => {
      return API.post<NavMenuResponseType>("/api/navmenu/upsert", { ...data });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["navmenus"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["navmenu", id] });
        toast(`Nav Menu: "${response.data.navMenu.title}" has been updated succesfully.`);
      } else {
        toast(`Nav Menu: "${response.data.navMenu.title}" has been created succesfully.`);
        navigate(`/admin/nav-menu/${response.data.navMenu._id}/edit`);
      }
    },
    onError: (error) => {
      toast(`Nav Menu: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete("/api/navmenu/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["navmenus"] });
    },
  });

  return { navMenuQuery, navMenusQuery, upsertMutation, deleteMutation };
};
