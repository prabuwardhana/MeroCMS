import React, { type ReactNode, useRef } from "react";
import { CounterStoreContext } from "@/providers/constants/counterStoreContext";
import { CounterStoreApi } from "./types/counterStoreApi";

interface CounterStoreProviderProps {
  children: ReactNode;
  store: CounterStoreApi;
}

export const CounterStoreProvider = ({ store, children }: CounterStoreProviderProps) => {
  const storeRef = useRef<CounterStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <CounterStoreContext.Provider value={storeRef.current}>{children}</CounterStoreContext.Provider>;
};
