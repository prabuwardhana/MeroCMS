import { createCounterStore } from "@/store/counterStore";
import { PageContext } from "vike/types";

export function onBeforeRenderClient(pageContext: PageContext) {
  // "storeInitialState" that was set at onAfterRenderHtml must be passed to client.
  // +config.ts => passToClient: ["storeInitialState"],
  pageContext.counterStore = createCounterStore(pageContext.counterStoreInitialState);
}
