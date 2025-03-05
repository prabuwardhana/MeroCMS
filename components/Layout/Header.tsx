import React, { Dispatch, SetStateAction } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Bell, ChevronsLeft, LogOut, UserPen } from "lucide-react";

import { useAuth } from "@/hooks/api/useAuth";
import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const Header = ({ collapsed, setCollapsed }: HeaderProps) => {
  const { user } = usePageContext();

  const { logOutMutation } = useAuth();

  return (
    <header className="sticky top-0 transition-color z-10 flex h-[60px] items-center justify-between bg-background px-4 shadow-md">
      <div className="flex items-center gap-x-3">
        <button className="btn-ghost size-10" onClick={() => setCollapsed(!collapsed)}>
          <ChevronsLeft className={cn(collapsed && "rotate-180")} />
        </button>
      </div>
      <div className="flex items-center gap-x-3">
        <ModeToggle />
        <button className="btn-ghost size-10">
          <Bell size={18} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-10 overflow-hidden rounded-full">
              <Avatar>
                <AvatarImage src={user.profile.avatarUrl} className="object-cover" />
                <AvatarFallback className="text-black">BT</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <span>&#x1F44B; Hello, {user.profile.username}!</span>
            </DropdownMenuLabel>
            <Separator />
            <DropdownMenuItem className="cursor-pointer">
              <UserPen />
              <a href="/admin/settings/edit-profile">Edit Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logOutMutation.mutate()} className="cursor-pointer">
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
