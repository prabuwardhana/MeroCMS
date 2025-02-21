import React from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/api/useAuth";

const LogOutButton = () => {
  const { logOutMutation } = useAuth();

  return <Button onClick={() => logOutMutation.mutate()}>Log Out</Button>;
};

export default LogOutButton;
