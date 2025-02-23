import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { navigate } from "vike/client/router";
import { toast } from "sonner";
import type { PostDtoType, PostMutationResponseType, PostType } from "@/lib/types";
import API from "@/config/apiClient";

export const usePosts = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: postQuery } = useSuspenseQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<PostType>(`/api/post/${id}`) : null;
    },
    staleTime: 60 * 1000,
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
        toast(`Post: "${response.data.post.title}" has been updated succesfully.`);
      } else {
        toast(`Post: "${response.data.post.title}" has been created succesfully.`);
        navigate(`/admin/posts/${response.data.post._id}/edit`);
      }
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

  return { postQuery, postsQuery, postPreviewQuery, upsertMutation, deleteMutation };
};
