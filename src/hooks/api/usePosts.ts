import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { navigate } from "vike/client/router";
import { toast } from "sonner";
import type { PostDtoType, PostMutationResponseType, PostType } from "@/src/lib/types";
import API from "@/src/config/apiClient";

export const usePosts = (
  id?: string,
  setIsPublishing?: (value: boolean) => void,
  setIsUpdating?: (value: boolean) => void,
) => {
  const queryClient = useQueryClient();

  const { data: postQuery } = useSuspenseQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PostType>(`/api/post/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: postsQuery } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await API.get<PostType[]>(`/api/post/`);
    },
    staleTime: Infinity,
  });

  const { data: postPreviewQuery } = useSuspenseQuery({
    queryKey: ["postPreview", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PostDtoType>(`/api/post/preview/${id}`) : null;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (data: PostType) => {
      return API.post<PostMutationResponseType>("/api/post/upsert", { ...data });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["post", id] });
        if (setIsUpdating) setIsUpdating(false);
      } else {
        toast(`Post: "${response.data.post.title}" has been created succesfully.`);
        navigate(`/admin/posts/${response.data.post._id}/edit`);
      }
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.patch<PostMutationResponseType>(`/api/post/publish/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["post", id] });
      if (setIsPublishing) setIsPublishing(false);
      toast(`The post has been ${response.data.post.published ? "published" : "unpublished"} succesfully.`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete("/api/post/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return { postQuery, postsQuery, postPreviewQuery, upsertMutation, publishMutation, deleteMutation };
};
