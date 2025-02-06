import API from "@/config/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";

export const useAuthLogOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => API.get("/api/auth/logout"),
    onSettled: () => {
      queryClient.clear();
      navigate("/auth/login");
    },
  });
};
