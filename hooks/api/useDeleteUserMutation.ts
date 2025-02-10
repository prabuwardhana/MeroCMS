import API from "@/config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Types } from "mongoose";

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: Types.ObjectId | undefined) => {
      return API.delete("/api/user/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
