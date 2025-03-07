import { Home, Settings, Users, LucideIcon, LetterText, NotebookText, HelpCircle, PanelsTopLeft } from "lucide-react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: LucideIcon;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export const SIDENAV_ITEMS = [
  {
    title: "Home",
    path: "/admin",
    icon: Home,
  },
  {
    title: "Posts",
    path: "/admin/posts",
    icon: LetterText,
    submenu: true,
    subMenuItems: [
      { title: "All Post", path: "/admin/posts" },
      { title: "Add New Post", path: "/admin/posts/create" },
      { title: "Categories", path: "/admin/posts/categories" },
      { title: "Comments", path: "/admin/posts/comments" },
    ],
  },
  {
    title: "Pages",
    path: "/admin/pages",
    icon: NotebookText,
    submenu: true,
    subMenuItems: [
      { title: "All Pages", path: "/admin/pages" },
      { title: "Add New Page", path: "/admin/pages/create" },
      { title: "Page Widgets", path: "/admin/pages/widgets" },
    ],
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: Users,
    submenu: true,
    subMenuItems: [
      { title: "All Users", path: "/admin/users" },
      { title: "Add New User", path: "/admin/users/create" },
    ],
  },
  {
    title: "Nav Menu Editor",
    path: "/admin/nav-menu",
    icon: PanelsTopLeft,
    submenu: true,
    subMenuItems: [
      { title: "All Nav Menus", path: "/admin/nav-menu" },
      { title: "Add New Nav Menu", path: "/admin/nav-menu/create" },
    ],
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
    submenu: true,
    subMenuItems: [
      { title: "Edit Profile", path: "/admin/settings/edit-profile" },
      { title: "Change Password", path: "/admin/settings/change-password" },
    ],
  },
  {
    title: "Help",
    path: "/admin/help",
    icon: HelpCircle,
  },
];
