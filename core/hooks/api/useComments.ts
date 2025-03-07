import API from "@/core/config/apiClient";
import type { CommentMutationResponseType, CommentType } from "@/core/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Provide the id in edit mode.
export const useComments = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: commentQuery } = useSuspenseQuery({
    queryKey: ["comment", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<CommentType>(`/api/comment/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: commentsQuery } = useSuspenseQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      return await API.get<CommentType[]>(`/api/comment/`);
    },
    staleTime: Infinity,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CommentType) => {
      return API.post<CommentMutationResponseType>(`/api/comment/post/${data.post.slug}`, { ...data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast("Your comment has been submitted succesfully.");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: CommentType) => {
      return API.patch<CommentMutationResponseType>(`/api/comment/${data._id}`, { ...data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast("The comment has been edited succesfully.");
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.patch<CommentMutationResponseType>(`/api/comment/approve/${id}`);
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast(`The comment has been ${response.data.comment.approved ? "approved" : "unapproved"} succesfully.`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | null) => {
      return API.delete(`/api/comment/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast("The comment has been deleted succesfully.");
    },
  });

  return { commentQuery, commentsQuery, createMutation, editMutation, approveMutation, deleteMutation };
};
