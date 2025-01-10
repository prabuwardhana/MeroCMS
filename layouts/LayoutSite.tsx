import React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePageContext } from "vike-react/usePageContext";

import LogOutButton from "@/components/LogOutButton";
import { Link } from "@/components/Link.js";
import logoUrl from "@/assets/logo.svg";

import "./style.css";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  const { user } = usePageContext();

  return (
    <div className={"flex max-w-5xl"}>
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/todo">Todo</Link>
        <Link href="/star-wars">External Data Fetching</Link>
        <Link href="/users">Internal Data Fetching</Link>
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Link href="/auth/login">Log In</Link>
            <Link href="/auth/register">Register</Link>
          </>
        )}
        {""}
      </Sidebar>
      <Content>{children}</Content>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div id="sidebar" className={"p-5 flex flex-col shrink-0 border-r-2 border-r-gray-200"}>
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className={"p-5 mb-2"}>
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
