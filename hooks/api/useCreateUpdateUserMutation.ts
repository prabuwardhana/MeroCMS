import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserMutationResponseType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useCreateUpdateUserMutation = (id?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: User) => {
      return API.post<UserMutationResponseType>("/api/user", { ...data, _id: id });
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      if (id) {
        await queryClient.invalidateQueries({ queryKey: ["user", id] });
        toast(`User: "${response.data.user.profile.name}" has been updated succesfully.`);
      } else {
        toast(`User: "${response.data.user.profile.name}" has been created succesfully.`);
        navigate(`/admin/users/${response.data.user._id}/edit`);
      }
    },
    onError: (error) => {
      toast(`User: ${error.message}`);
    },
  });
};
