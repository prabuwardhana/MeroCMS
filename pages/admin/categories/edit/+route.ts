export { route };

import { resolveRoute } from "vike/routing";
import { RouteSync } from "vike/types";

const route: RouteSync = (pageContext): ReturnType<RouteSync> => {
  return resolveRoute("/admin/categories/@id/edit", pageContext.urlPathname);
};
