import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageComponentMutationResponseType, PageComponentType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";

export const useCreateUpdateComponentMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PageComponentType) => {
      return API.post<PageComponentMutationResponseType>("/api/component/upsert", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["components"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["component", id] });
        toast(`Component: "${response.data.component.title}" has been updated succesfully.`);
      } else {
        toast(`Component: "${response.data.component.title}" has been created succesfully.`);
      }
    },
    onError: (error) => {
      toast(`Component: ${error.message}`);
    },
  });
};
