import API from "@/config/apiClient";
import type { PageComponentMutationResponseType, PageComponentType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import { toast } from "sonner";

export const usePageComponents = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: componentQuery } = useSuspenseQuery({
    queryKey: ["component", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageComponentType>(`/api/component/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: componentsQuery } = useSuspenseQuery({
    queryKey: ["components"],
    queryFn: async () => {
      return await API.get<PageComponentType[]>(`/api/component/`);
    },
    staleTime: Infinity,
  });

  const upsertMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: async (id: Types.ObjectId | null) => {
      return API.delete("/api/component/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["components"] });
    },
  });

  return { componentQuery, componentsQuery, upsertMutation, deleteMutation };
};
