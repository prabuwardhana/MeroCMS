export { guard };

import type { GuardAsync } from "vike/types";
import { render } from "vike/abort";
import { FORBIDDEN } from "@/server/constants/http";
import Role from "@/server/constants/role";

// environment: server
const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const { user } = pageContext;

  if (!user) {
    // Redirect non authenticated user to login page.
    throw render("/auth/login");
  }

  // Non admin user is not allowed to access Admin page.
  if (user && !user?.role?.includes(Role.Admin)) throw render(FORBIDDEN, "Only Admin can access this page");
};
