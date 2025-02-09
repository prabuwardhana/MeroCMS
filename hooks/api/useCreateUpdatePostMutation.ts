import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";
import { PostMutationResponseType, PostType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";

export const useCreateUpdatePostMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PostType) => {
      return API.post<PostMutationResponseType>("/api/post/upsert", { ...data, _id: id });
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
};
