import { createContext } from "react";
import { CounterStoreApi } from "@/providers/types/counterStoreApi";

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);
