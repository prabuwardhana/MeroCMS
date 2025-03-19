import React, { useState } from "react";

import { cn } from "@/core/lib/utils";

import { Item } from "@/components/NestableList/libs/types";
import { useSiteLayout } from "@/core/hooks/api/useSiteLayout";
import SocialIcon from "@/components/SocialIcon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Link } from "@/components/Link";
import { Logo } from "@/components/Logo";

import "@fontsource/poppins";
import "./style.css";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { getNavMenuByTitle } = useSiteLayout();
  const headerMenu = getNavMenuByTitle("Header Menu");
  const footerMenu = getNavMenuByTitle("Footer Menu");
  const socialLinks = getNavMenuByTitle("Social Links");
  const communityLinks = getNavMenuByTitle("Community Link");

  const headerMenuItems = (className?: string) =>
    headerMenu.navItems.map((menu) => {
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
        <li key={menu.id} className={cn("cursor-pointer", navigationMenuTriggerStyle(), className)}>
          <Link href={menu.url} className="text-violet-800">
            <div className="font-medium leading-none">{menu.name}</div>
          </Link>
        </li>
      );
    });

  return (
    <>
      <header className="sticky top-0 h-[72px] w-full transition-color z-50 bg-background px-4 xl:px-24 py-4 shadow-md">
        <section className="flex justify-between items-center">
          <div className="basis-1/4">
            <Logo />
          </div>
          <NavigationMenu className="basis-1/2 text-slate-600 hidden md:flex">
            <NavigationMenuList>{headerMenuItems()}</NavigationMenuList>
          </NavigationMenu>
          <div className="hidden md:flex justify-end items-center gap-4 text-slate-600 basis-1/4">
            {communityLinks.navItems.map((item) => {
              return (
                <a key={item.id} href={item.url}>
                  <SocialIcon name={item.name} size="36" />
                </a>
              );
            })}
          </div>
          <button
            className={cn("text-3xl md:hidden cursor-pointer relative w-8 h-8", isMenuOpen && "toggle-btn")}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className="absolute top-4 -mt-0.5 h-1 w-8 rounded bg-slate-600 transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-3 before:rounded before:bg-slate-600 before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-3 after:rounded after:bg-slate-600 after:transition-all after:duration-500 after:content-['']"></div>
          </button>
        </section>
        <section
          className={cn(
            "top-[72px] left-0 justify-center absolute w-full flex-col bg-white",
            isMenuOpen && "flex",
            !isMenuOpen && "hidden",
          )}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <nav className="min-h-screen items-center py-8 origin-top animate-open-menu" aria-label="mobile">
            <ul className="flex flex-col justify-center items-center space-y-4">{headerMenuItems("text-3xl")}</ul>
          </nav>
        </section>
      </header>
      <div
        id="sticky-banner"
        tabIndex={-1}
        className="sticky top-[72px] start-0 z-40 p-4 h-[78px] md:h-[58px] flex justify-between w-full bg-rose-500"
      >
        <div className="flex items-center mx-auto">
          <p className="flex items-center text-xs font-normal text-destructive-foreground">
            <span className="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center shrink-0">
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
              </svg>
              <span className="sr-only">Light bulb</span>
            </span>
            <span className="tex-xs">
              MeroCMS is not yet officially released and currently limited only for internal use (e.g. This website).
              But, you can check out our source code on{" "}
              <a href="https://github.com/prabuwardhana/MeroCMS" className="underline hover:text-slate-100">
                Github
              </a>
            </span>
          </p>
        </div>
      </div>
      <div id="page-container" className="w-full">
        <Content>{children}</Content>
      </div>
      <footer className="w-full flex flex-col pt-20 px-4 xl:px-24 bg-slate-50 text-slate-600">
        <div className="flex flex-col md:flex-row gap-8 justify-between w-full pb-6 border-b">
          <div className="space-y-4">
            <Logo />
            <div className="text-xs text-slate-500">{"Build Faster. Deploy Smarter. Stay in Control."}</div>
          </div>
          <nav>
            <ul className="flex flex-col md:flex-row gap-8 xl:gap-20">
              {footerMenu.navItems.map((menu) => {
                return menu.children && menu.children.length ? (
                  <li key={menu.id} className="cursor-pointer space-y-4">
                    <div className="text-xs font-medium leading-none text-violet-800">{menu.name}</div>
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
        <div className="flex justify-end gap-4 py-4 text-slate-600">
          {socialLinks.navItems.map((item) => {
            return (
              <a key={item.id} href={item.url}>
                <SocialIcon name={item.name} size="18" />
              </a>
            );
          })}
        </div>
      </footer>
    </>
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
  return <div>{children}</div>;
}
