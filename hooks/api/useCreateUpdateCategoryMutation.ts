import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryMutationResponseType, CategoryType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useCreateUpdateCategoryMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryType) => {
      return API.post<CategoryMutationResponseType>("/api/category/upsert", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["category", id] });
        toast(`Category: "${response.data.category.name}" has been updated succesfully.`);
      } else {
        toast(`Category: "${response.data.category.name}" has been created succesfully.`);
        navigate(`/admin/categories/${response.data.category._id}/edit`);
      }
    },
    onError: (error) => {
      toast(`Category: ${error.message}`);
    },
  });
};
