import React from "react";
import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/api/useAuth";

import { Button } from "@/components/ui/button";

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
