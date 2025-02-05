import { useSuspenseQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import API from "@/config/apiClient";

export const useGetSingleUserQuery = (id: string) => {
  const { data: userQuery } = useSuspenseQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      // useSuspenseQuery and enabled v5
      // https://github.com/TanStack/query/discussions/6206
      return id ? await API.get<User>(`/api/user/${id}`) : null;
    },
    staleTime: Infinity,
  });

  return { userQuery };
};
