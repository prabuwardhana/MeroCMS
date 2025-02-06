import { PageContext } from "vike/types";

export function onAfterRenderHtml(pageContext: PageContext) {
  const { count } = pageContext.counterStore.getState();
  // Retrieve the store's initial sate.
  // This will ensure that the store's initial state is exactly the same between
  // the client and server side to avoid hydration mismatch.
  pageContext.counterStoreInitialState = { count };
}
