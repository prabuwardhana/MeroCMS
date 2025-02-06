import React, { Dispatch, SetStateAction } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { navigate } from "vike/client/router";

import { Bell, ChevronsLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import API from "@/config/apiClient";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
  const queryClient = useQueryClient();

  const mutation = useAuthLogOutMutation();

  return (
    <header className="transition-color relative z-10 flex h-[60px] items-center justify-between bg-background px-4 shadow-md">
      <div className="flex items-center gap-x-3">
        <button className="btn-ghost size-10" onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft className={cn(collapsed && "rotate-180")} />
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        <button className="btn-ghost size-10">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-10 overflow-hidden rounded-full">
              <Avatar>
                <AvatarImage src="/assets/logo.svg" />
                <AvatarFallback className="text-black">BT</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => mutation.mutate()}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
