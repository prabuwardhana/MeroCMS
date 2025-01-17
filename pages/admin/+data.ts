export { data };

import { PageContextClient } from "vike/types";
import { render } from "vike/abort";

import { FORBIDDEN } from "@/server/constants/http";
import Role from "@/server/constants/role";
import API from "@/config/apiClient";

// environment: client
const data = async (pageContext: PageContextClient) => {
  const { user } = pageContext;
  console.log("user", user);

  // if user is null (no access token) or undefined (access token expired)
  if (!user) {
    // The token is expired, need to retrieve the new one.
    // This is possible because we configure data() hook to run on the client side.
    // The cookie will be sent to the server along with the request.
    await API.get("/api/auth/refresh");
  }

  // when the access token is expired, user is undefined.
  // don't proceed until new access token is retrieved.
  if (user && !user.role.includes(Role.Admin)) throw render(FORBIDDEN, "Only Admin can access this page");
};
