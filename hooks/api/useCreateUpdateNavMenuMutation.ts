import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavMenuResponseType, NavMenuType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useCreateUpdateNavMenuMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NavMenuType) => {
      return API.post<NavMenuResponseType>("/api/navmenu/upsert", { ...data, _id: id });
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
};
