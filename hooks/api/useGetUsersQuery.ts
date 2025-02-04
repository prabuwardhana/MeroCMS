import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetUsersQuery = () => {
  const { data: usersQuery } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await API.get<User[]>("/api/user/");
    },
    staleTime: Infinity,
  });

  return { usersQuery };
};
