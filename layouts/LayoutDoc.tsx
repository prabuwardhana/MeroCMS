import React from "react";
import { clientOnly } from "vike-react/clientOnly";

import { useSiteLayout } from "@/core/hooks/api/useSiteLayout";
import { Skeleton } from "@/components/ui/skeleton";

const NavItem = clientOnly(() => import("./SideNavItem"));

export default function LayoutDoc({ children }: { children: React.ReactNode }) {
  const { getNavMenuByTitle } = useSiteLayout();
  const guideMenu = getNavMenuByTitle("Guide Menu");

  return (
    <div className="mx-10 flex gap-10">
      <aside className="sticky top-[130px] z-30 w-[280px] h-screen overflow-y-auto">
        <nav className="py-8 pr-4">
          <ul className="space-y-1 text-slate-600">
            {guideMenu.navItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                fallback={<Skeleton className="h-6 w-[280px] rounded-xl bg-slate-200" />}
              />
            ))}
          </ul>
        </nav>
      </aside>
      <div id="page-content" className="flex-grow">
        {children}
      </div>
    </div>
  );
}
