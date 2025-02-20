import API from "@/config/apiClient";
import { User, UserMutationResponseType } from "@/lib/types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Types } from "mongoose";
import { toast } from "sonner";
import { navigate } from "vike/client/router";

export const useUsers = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: userQuery } = useSuspenseQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<User>(`/api/user/${id}`) : null;
    },
    staleTime: Infinity,
  });

  const { data: usersQuery } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await API.get<User[]>("/api/user/");
    },
    staleTime: Infinity,
  });

  const upsertMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: async (id: Types.ObjectId | undefined) => {
      return API.delete("/api/user/", { data: { id } });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { userQuery, usersQuery, upsertMutation, deleteMutation };
};
