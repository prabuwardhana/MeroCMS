import { render } from "vike/abort";
import { PageContext } from "vike/types";

import Role from "@/server/constants/role";

export const guard = (pageContext: PageContext) => {
  const { user } = pageContext;
  if (!user) {
    // Render the login page while preserving the URL.
    throw render("/auth/login");
  } else {
    if (!user.role.includes(Role.Admin)) {
      // Render the error page and show message to the user
      throw render(403, "Only admins are allowed to access this page.");
    }
  }
};
