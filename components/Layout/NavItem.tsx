import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { usePageContext } from "vike-react/usePageContext";
import { ChevronDown } from "lucide-react";

import type { SideNavItem } from "@/src/constants/navLink";
import { cn } from "@/src/lib/utils";

interface NavItemProps {
  item: SideNavItem;
  isCollapsed: boolean;
}

const chevronVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
} as const;

const opacityVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
} as const;

const NavItem = ({ item, isCollapsed }: NavItemProps) => {
  const { urlPathname } = usePageContext();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const chevronControls = useAnimationControls();

  const urlPathSplit = urlPathname.split("/");
  const itemPathSplit = item.path.split("/");
  const isSubPathActive = itemPathSplit.filter((item) => urlPathSplit.includes(item)).length > 2;

  // open and close the submenu
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  useEffect(() => {
    // Close all the sub menus when the sidebar is collapsed
    if (isCollapsed) {
      setSubMenuOpen(false);
    }
    // Open the active menu when the sidebar is opened
    if (urlPathname.includes(item.path)) {
      setSubMenuOpen(true);
    }
  }, [isCollapsed, urlPathname, item]);

  useEffect(() => {
    // Only animate the sub-menu when the sidebar is opened
    if (!isCollapsed) {
      if (!subMenuOpen) {
        chevronControls.start("close");
      } else {
        chevronControls.start("open");
      }
    }
  }, [isCollapsed, subMenuOpen, chevronControls]);

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className="flex w-full flex-row items-center justify-between rounded-lg hover:bg-secondary"
          >
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                // When the sidebar is opened, turn the nav item into a normal div
                <div className="flex flex-row items-center space-x-4 rounded-lg p-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary">
                  {item.icon && (
                    <item.icon size={20} className={cn("flex-shrink-0", isSubPathActive && "font-bold text-primary")} />
                  )}
                  <motion.div
                    key={`${isCollapsed}`}
                    variants={opacityVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <span className={cn("whitespace-nowrap", isSubPathActive && "font-bold text-primary")}>
                      {item.title}
                    </span>
                  </motion.div>
                </div>
              ) : (
                // When the sidebar is closed, turn the nav item into a nav link
                <motion.div key={`${isCollapsed}`}>
                  <a href={item.path} className={cn("sidebar-item", urlPathname.includes(item.path) && "active")}>
                    {item.icon && <item.icon size={20} className="flex-shrink-0" />}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {!isCollapsed && (
              <motion.div
                variants={chevronVariants}
                animate={chevronControls}
                transition={{
                  duration: 0.3,
                  ease: "linear",
                }}
                className="p-2"
              >
                <ChevronDown size={20} />
              </motion.div>
            )}
          </button>

          <AnimatePresence>
            {!isCollapsed && subMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3, ease: "linear" }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-10 mt-3 flex flex-col gap-2"
              >
                {item.subMenuItems?.map((subItem, idx) => {
                  return (
                    <a
                      key={idx}
                      href={subItem.path}
                      className={cn("sidebar-item", urlPathname === subItem.path && "active")}
                    >
                      {!isCollapsed && <span className="whitespace-nowrap">{subItem.title}</span>}
                    </a>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* When the nav item has no sub-menu item */
        <a href={item.path} className={cn("sidebar-item", urlPathname === item.path && "active")}>
          {item.icon && <item.icon size={20} className="flex-shrink-0" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                variants={opacityVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="whitespace-nowrap"
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
        </a>
      )}
    </div>
  );
};

export default NavItem;
