import React, { forwardRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

import { containerVariants, opacityVariants } from "@/constants/framerMotion";
import { SIDENAV_ITEMS } from "@/constants/navLink";
import { cn } from "@/lib/utils";

import NavItem from "@/components/admin/NavItem";

import { Rocket } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  isDesktopDevice: boolean;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ collapsed, isDesktopDevice }: SidebarProps, ref) => {
  const containerControls = useAnimationControls();

  useEffect(() => {
    if (!collapsed) {
      containerControls.start("open");
    } else {
      containerControls.start("close");
    }
  }, [collapsed, containerControls]);

  return (
    <motion.aside
      ref={ref}
      variants={containerVariants}
      animate={containerControls}
      initial="open"
      className={cn(
        "fixed z-40 flex h-full flex-col overflow-x-hidden border-r border-secondary-foreground/10 bg-background",
        collapsed ? "md:items-center" : "",
        collapsed ? "max-md:-left-full" : "max-md:left-0",
        !isDesktopDevice ? "transition-[left] duration-1000 ease-in-out" : "",
      )}
    >
      <div className="flex h-[60px] w-full items-center gap-x-3 overflow-x-hidden pl-3 text-2xl font-medium text-primary">
        <Rocket size={30} className="flex-shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div key={`${collapsed}`} variants={opacityVariants} initial="initial" animate="animate" exit="exit">
              <span className="whitespace-nowrap">RocketCMS</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex h-full w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3">
        {SIDENAV_ITEMS.map((item, idx) => {
          return <NavItem key={idx} item={item} isCollapsed={collapsed} />;
        })}
      </nav>
    </motion.aside>
  );
});

Sidebar.displayName = "Sidebar";
