import React from "react";

import { Button } from "@/components/ui/button";

import { useAuthLogOutMutation } from "@/hooks/api/useAuthLogOutMutation";

const LogOutButton = () => {
  const mutation = useAuthLogOutMutation();

  return <Button onClick={() => mutation.mutate()}>Log Out</Button>;
};

export default LogOutButton;
