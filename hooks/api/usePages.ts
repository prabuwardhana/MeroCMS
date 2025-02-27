import API from "@/config/apiClient";
import type { PageMutationResponseType, PageType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const usePages = (
  id?: string,
  setIsPublishing?: (value: boolean) => void,
  setIsUpdating?: (value: boolean) => void,
) => {
  const queryClient = useQueryClient();

  const { data: pageQuery } = useSuspenseQuery({
    queryKey: ["page", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PageType & { pageFieldsJson: string }>(`/api/page/${id}`) : null;
    },
    staleTime: Infinity,
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
      return API.post<PageMutationResponseType>("/api/page/upsert", { ...data });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["pages"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["page", id] });
        if (setIsUpdating) setIsUpdating(false);
        toast(`Page: "${response.data.page.title}" has been updated succesfully.`);
      } else {
        toast(`Page: "${response.data.page.title}" has been created succesfully.`);
        navigate(`/admin/pages/${response.data.page._id}/edit`);
      }
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.patch<PageMutationResponseType>(`/api/page/publish/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["pages"] });
      await queryClient.invalidateQueries({ queryKey: ["page", id] });
      if (setIsPublishing) setIsPublishing(false);
      toast(`The page has been ${response.data.page.published ? "published" : "unpublished"} succesfully.`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete("/api/page/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  return { pageQuery, pagesQuery, upsertMutation, publishMutation, deleteMutation };
};
