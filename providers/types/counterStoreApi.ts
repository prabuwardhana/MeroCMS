import { createCounterStore } from "@/store/counterStore";

export type CounterStoreApi = ReturnType<typeof createCounterStore>;
