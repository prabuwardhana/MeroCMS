import { create } from "zustand";
import { createFileSlice } from "./fileSlice";
import { Store } from "./types";

export const useAppStore = create<Store>()((...a) => ({
  ...createFileSlice(...a),
}));
