import API from "@/config/apiClient";
import type { UserMutationResponseType, UserProfile } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfiles = () => {
  const queryClient = useQueryClient();

  const upsertMutation = useMutation({
    mutationFn: async (data: UserProfile) => {
      return API.post<UserMutationResponseType>("/api/user/profile", { ...data });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast("Your profile has been updated succesfully.");
    },
    onError: (error) => {
      toast(`Error while updating your profile: ${error.message}`);
    },
  });

  return { upsertMutation };
};
