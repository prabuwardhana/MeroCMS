import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";
import { PageMutationResponseType, PageType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";

export const useCreateUpdatePageMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PageType) => {
      return API.post<PageMutationResponseType>("/api/page/upsert", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["pages"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["page", id] });
        toast(`Page: "${response.data.page.title}" has been updated succesfully.`);
      } else {
        toast(`Page: "${response.data.page.title}" has been created succesfully.`);
        navigate(`/admin/pages/${response.data.page._id}/edit`);
      }
    },
  });
};
