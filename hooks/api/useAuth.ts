import API from "@/config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const logOutMutation = useMutation({
    mutationFn: async () => API.get("/api/auth/logout"),
    onSettled: () => {
      queryClient.clear();
      navigate("/auth/login");
    },
  });

  return { logOutMutation };
};
