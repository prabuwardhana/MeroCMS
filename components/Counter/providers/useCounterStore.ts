import { createContext, useContext } from "react";
import { useStore } from "zustand";

import { CounterStore, createCounterStore } from "@/store/counterStore";

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export const useCounterStore = <T>(selector: (store: CounterStore) => T): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
