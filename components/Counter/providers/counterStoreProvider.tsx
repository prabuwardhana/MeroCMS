import React, { type ReactNode } from "react";
import { CounterStoreApi, CounterStoreContext } from "./useCounterStore";

interface CounterStoreProviderProps {
  children: ReactNode;
  store: CounterStoreApi;
}

export const CounterStoreProvider = ({ store, children }: CounterStoreProviderProps) => {
  return <CounterStoreContext.Provider value={store}>{children}</CounterStoreContext.Provider>;
};
