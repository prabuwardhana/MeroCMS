import React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePageContext } from "vike-react/usePageContext";
import { UserPen } from "lucide-react";

import { cn } from "@/core/lib/utils";

import { Item } from "@/components/NestableList/libs/types";
import { useSiteLayout } from "@/core/hooks/api/useSiteLayout";
import SocialIcon from "@/components/SocialIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

import LogOutButton from "@/components/LogOutButton";
import { Link } from "@/components/Link";
import { Logo } from "@/components/Logo";

import "@fontsource/poppins";
import "./style.css";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  const { user } = usePageContext();
  const { getNavMenuByTitle } = useSiteLayout();
  const headerMenu = getNavMenuByTitle("Header Menu");
  const footerMenu = getNavMenuByTitle("Footer Menu");
  const socialLinks = getNavMenuByTitle("Social Links");

  return (
    <>
      <Header className="flex justify-between items-center transition-color z-50 bg-background px-24 py-4 shadow-md">
        <div className="basis-1/4">
          <Logo />
        </div>
        <NavigationMenu className="basis-1/2">
          <NavigationMenuList>
            {headerMenu.navItems.map((menu) => {
              return menu.children && menu.children.length ? (
                <NavigationMenuItem key={menu.id}>
                  <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {(menu.children as Item[]).map((item) => {
                        return (
                          <ListItem key={item.id} title={item.name} href={item.url}>
                            {item.description}
                          </ListItem>
                        );
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <li key={menu.id} className={cn("cursor-pointer", navigationMenuTriggerStyle())}>
                  <NavigationMenuLink asChild>
                    <a href={menu.url}>
                      <div className="text-sm font-medium leading-none">{menu.name}</div>
                    </a>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {user ? (
          <div className="basis-1/4 flex justify-end">
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
                <LogOutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="basis-1/4 flex justify-end gap-4">
            <Link href="/auth/login">
              <Button variant={"outline"} size={"sm"}>
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant={"default"} size={"sm"}>
                Register
              </Button>
            </Link>
          </div>
        )}
      </Header>
      <div className="flex justify-center">
        <div className="flex">
          {/* <Sidebar>
            <Logo />
            <Link href="/">Welcome</Link>
            <Link href="/todo">Todo</Link>
            <Link href="/star-wars">Data Fetching</Link>
            {user ? (
              <LogOutButton />
            ) : (
              <>
                <Link href="/auth/login">Log In</Link>
                <Link href="/auth/register">Register</Link>
              </>
            )}
            {""}
          </Sidebar> */}
          <Content>{children}</Content>
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </div>
      <Footer className="flex flex-col pt-20 px-24">
        <div className="flex w-full pb-6 border-b">
          <Logo />
          <nav>
            <ul className="flex gap-32">
              {footerMenu.navItems.map((menu) => {
                return menu.children && menu.children.length ? (
                  <li key={menu.id} className="cursor-pointer space-y-4">
                    <div className="text-xs font-medium leading-none text-primary">{menu.name}</div>
                    <ul className="space-y-3">
                      {(menu.children as Item[]).map((item) => {
                        return (
                          <li key={item.id} className="cursor-pointer hover:text-slate-500">
                            <a href={item.url}>
                              <div className="text-sm font-medium leading-none">{item.name}</div>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ) : (
                  <li key={menu.id} className={cn("cursor-pointer", navigationMenuTriggerStyle())}>
                    <a href={menu.url}>
                      <div className="text-sm font-medium leading-none">{menu.name}</div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className="flex justify-end gap-4 py-4">
          {socialLinks.navItems.map((item) => {
            return (
              <a key={item.id} href={item.url}>
                <SocialIcon name={item.name} size="18" />
              </a>
            );
          })}
        </div>
      </Footer>
    </>
  );
}

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div id="header" className={cn("sticky top-0 w-full", className)}>
      {children}
    </div>
  );
}

function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div id="footer" className={cn("w-full", className)}>
      {children}
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content">{children}</div>
    </div>
  );
}
