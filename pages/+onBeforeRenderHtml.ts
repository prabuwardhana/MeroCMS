import { createCounterStore } from "@/store/counterStore";
import { PageContext } from "vike/types";

export function onBeforeRenderHtml(pageContext: PageContext) {
  // Create the store on the server-side.
  pageContext.counterStore = createCounterStore();
}
