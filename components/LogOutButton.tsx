import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";

import { Button } from "@/components/ui/button";

import API from "@/config/apiClient";

const LogOutButton = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => API.get("/api/auth/logout"),
    onSettled: () => {
      queryClient.clear();
      navigate("/auth/login");
    },
  });

  return <Button onClick={() => mutation.mutate()}>Log Out</Button>;
};

export default LogOutButton;
