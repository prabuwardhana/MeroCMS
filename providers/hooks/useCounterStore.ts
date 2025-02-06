import { useContext } from "react";
import { useStore } from "zustand";

import { CounterStoreContext } from "@/providers/constants/counterStoreContext";
import { CounterStore } from "@/store/counterStore";

export const useCounterStore = <T>(selector: (store: CounterStore) => T): T => {
  const counterStoreContext = useContext(CounterStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
