import API from "@/config/apiClient";
import { PageMutationResponseType, PageType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const usePages = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: pageQuery } = useSuspenseQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageType>(`/api/page/${id}`) : null;
    },
    staleTime: 60 * 1000,
  });

  const { data: pagesQuery } = useSuspenseQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      return await API.get<PageType[]>(`/api/page/`);
    },
    staleTime: Infinity,
  });

  const upsertMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: async (id: Types.ObjectId | null) => {
      return API.delete("/api/page/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  return { pageQuery, pagesQuery, upsertMutation, deleteMutation };
};
