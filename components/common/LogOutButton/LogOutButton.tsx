import React from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/api/useAuth";

import { LogOut } from "lucide-react";

const LogOutButton = () => {
  const { logOutMutation } = useAuth();

  return (
    <Button onClick={() => logOutMutation.mutate()} size={"sm"} className="w-full flex justify-start gap-4">
      <LogOut />
      Log Out
    </Button>
  );
};

export default LogOutButton;
