import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";
import { PostMutationResponseType, PostType } from "@/lib/types";
import API from "@/config/apiClient";

export const useCreateUpdatePostMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostType) => {
      return API.post<PostMutationResponseType>("/api/post/upsert", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      // In create mode, navigate to edit post page after successful mutation
      if (!id) {
        const data = response.data;
        navigate(`/admin/posts/${data.post._id}/edit`);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["post", id] });
      }
    },
  });
};
