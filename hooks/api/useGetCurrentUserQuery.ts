import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetCurrentUserQuery = () => {
  const { data: currentUserQuery } = useSuspenseQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await API.get<User>("/api/user/whoami");
    },
    staleTime: Infinity,
  });

  return { currentUserQuery };
};
