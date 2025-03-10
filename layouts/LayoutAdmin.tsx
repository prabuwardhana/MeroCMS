import "./tailwind.admin.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { useMediaQuery } from "@/core/hooks/useMediaQuery";
import { useClickOutside } from "@/core/hooks/useClickOutside";
import { ThemeProvider } from "@/core/theme/themeProvider";
import { cn } from "@/core/lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { Sidebar, Header } from "@/components/Layout";

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

  const start = useMemo(() => containerControls.start, [containerControls.start]);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useEffect(() => {
    if (isDesktopDevice && !collapsed) {
      start("open");
    } else {
      start("close");
    }
  }, [isDesktopDevice, collapsed, containerControls]);

  useClickOutside(
    [sidebarRef],
    useCallback(() => {
      if (!isDesktopDevice && !collapsed) {
        setCollapsed(true);
      }
    }, []),
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-accent">
        {/* The sidebar's opaque background in mobile view */}
        <div
          className={cn(
            "pointer-events-none fixed inset-0 -z-10 bg-foreground opacity-0 transition-opacity duration-1000 ease-in-out",
            !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
          )}
        />
        <Sidebar ref={sidebarRef} collapsed={collapsed} isDesktopDevice={isDesktopDevice} />
        <motion.div variants={containerVariants} animate={containerControls} initial="close" className="min-h-screen">
          <Header collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="px-6 pt-6 flex justify-center">{children}</div>
        </motion.div>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </ThemeProvider>
  );
}
