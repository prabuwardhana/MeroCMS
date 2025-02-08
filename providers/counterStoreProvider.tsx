import React, { type ReactNode } from "react";
import { CounterStoreContext } from "@/providers/constants/counterStoreContext";
import { CounterStoreApi } from "./types/counterStoreApi";

interface CounterStoreProviderProps {
  children: ReactNode;
  store: CounterStoreApi;
}

export const CounterStoreProvider = ({ store, children }: CounterStoreProviderProps) => {
  return <CounterStoreContext.Provider value={store}>{children}</CounterStoreContext.Provider>;
};
