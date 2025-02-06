import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserProfile, UserProfileMutationResponseType } from "@/lib/types";
import API from "@/config/apiClient";
import { toast } from "sonner";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserProfile) => {
      return API.post<UserProfileMutationResponseType>("/api/user/profile", { ...data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["Users"] });
      toast("Your profile has been updated succesfully.");
    },
    onError: (error) => {
      toast(`Error while updating your profile: ${error.message}`);
    },
  });
};
