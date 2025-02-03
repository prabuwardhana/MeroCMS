import API from "@/config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Types } from "mongoose";

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Types.ObjectId | null) => {
      return API.delete("/api/post/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
