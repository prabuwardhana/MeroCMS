import { createCounterStore } from "@/store/counterStore";
import { PageContext } from "vike/types";
import { TokenRefreshClient } from "@/config/apiClient";

export async function onBeforeRenderClient(pageContext: PageContext) {
  const { user, isValidToken } = pageContext;

  // A logged in user has an expired token.
  if (user && !isValidToken) {
    // refresh the token
    await TokenRefreshClient.get("/api/auth/refresh");
  }

  // "storeInitialState" that was set at onAfterRenderHtml must be passed to client.
  // +config.ts => passToClient: ["storeInitialState"],
  pageContext.counterStore = createCounterStore(pageContext.counterStoreInitialState);
}
