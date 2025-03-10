import React, { useState } from "react";
import { cn } from "@/core/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "@/components/Link";
import { Item } from "@/components/NestableList/libs/types";
import { Button } from "@/components/ui/button";

const NavItem = ({ item }: { item: Item }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return item.children && item.children.length ? (
    <li key={item.id} className="cursor-pointer space-y-1">
      <div className="flex justify-between p-1 rounded-md transition-all ease-in-out duration-500 hover:bg-violet-200">
        <div className="text-sm font-medium leading-none flex items-center">
          {item.url ? (
            <Link href={item.url} className="text-violet-500">
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </div>
        <Button
          onClick={toggleSubMenu}
          className="h-4 w-4 p-3 rounded-sm text-slate-500 hover:text-white bg-transparent hover:bg-violet-500"
        >
          <ChevronDown
            size={16}
            className={cn(" transition-all transform duration-500", subMenuOpen ? "rotate-180" : "rotate-0")}
          />
        </Button>
      </div>

      <AnimatePresence>
        {subMenuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3, ease: "linear" }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-1 border-l ml-2"
          >
            {(item.children as Item[]).map((childItem) => {
              return (
                <li
                  key={childItem.id}
                  className="ml-2 cursor-pointer hover:text-slate-500 p-2 rounded-md transition-all ease-in-out duration-500 hover:bg-violet-200"
                >
                  <Link href={childItem.url} className="text-violet-500">
                    <div className="text-sm font-medium leading-none">{childItem.name}</div>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  ) : (
    <li
      key={item.id}
      className="cursor-pointer px-1 py-2 rounded-md transition-all ease-in-out duration-500 hover:bg-violet-200"
    >
      <div className="text-sm font-medium leading-none flex items-center">
        <Link href={item.url} className="text-violet-500">
          {item.name}
        </Link>
      </div>
    </li>
  );
};

export default NavItem;
