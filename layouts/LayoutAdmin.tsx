import "./tailwind.admin.css";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ThemeProvider } from "@/theme/themeProvider";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

import "@fontsource/poppins";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  const sidebarRef = useRef<HTMLElement>(null);

  const containerVariants = {
    close: {
      marginLeft: isDesktopDevice ? "60px" : "0px",
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.3,
      },
    },
    open: {
      marginLeft: "240px",
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.3,
      },
    },
  };

  const containerControls = useAnimationControls();

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useEffect(() => {
    if (isDesktopDevice && !collapsed) {
      containerControls.start("open");
    } else {
      containerControls.start("close");
    }
  }, [isDesktopDevice, collapsed, containerControls]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }
  });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-muted">
        {/* The sidebar's opaque background in mobile view */}
        <div
          className={cn(
            "pointer-events-none fixed inset-0 -z-10 bg-foreground opacity-0 transition-opacity duration-1000 ease-in-out",
            !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
          )}
        />
        <Sidebar ref={sidebarRef} collapsed={collapsed} isDesktopDevice={isDesktopDevice} />
        <motion.div variants={containerVariants} animate={containerControls} initial="close">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="px-6 pt-6 bg-accent">{children}</div>
        </motion.div>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </ThemeProvider>
  );
}
