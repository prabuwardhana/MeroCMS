import { CounterStoreProvider } from "@/providers/counterStoreProvider";
import React from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const { counterStore: store } = usePageContext();
  return <CounterStoreProvider store={store}>{children}</CounterStoreProvider>;
}
