import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuEditorContentType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useCreateUpdateNavMenuMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MenuEditorContentType) => {
      console.log(data);
      return API.post("/api/navmenu/upsert", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      console.log(response.data);
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["navmenu", id] });
        toast(`navmenu: "${response.data.navMenu.title}" has been updated succesfully.`);
        navigate("/admin/nav-menu");
      } else {
        await queryClient.invalidateQueries({ queryKey: ["navmenus"] });
        toast(`navmenu: "${response.data.navMenu.title}" has been created succesfully.`);
        navigate(`/admin/nav-menu/${response.data.navMenu._id}/edit`);
      }
    },
    onError: (error) => {
      toast(`navmenu: ${error.message}`);
    },
  });
};
