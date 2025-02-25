import API from "@/config/apiClient";
import type { CategoryMutationResponseType, CategoryType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCategories = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: categoryQuery } = useSuspenseQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<CategoryType>(`/api/category/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: categoriesQuery } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await API.get<CategoryType[]>(`/api/category/`);
    },
    staleTime: Infinity,
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: CategoryType) => {
      return API.post<CategoryMutationResponseType>("/api/category/upsert", { ...data });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["category", id] });
        toast(`Category: "${response.data.category.name}" has been updated succesfully.`);
      } else {
        toast(`Category: "${response.data.category.name}" has been created succesfully.`);
      }
    },
    onError: (error) => {
      toast(`Category: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete("/api/category/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { categoryQuery, categoriesQuery, upsertMutation, deleteMutation };
};
