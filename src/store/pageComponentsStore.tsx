import type { PageWidgetType } from "@/src/lib/types";
import { create } from "zustand";

type PageWidgetsState = {
  pageWidgets: PageWidgetType[];
};

type PageWidgetsStateAction = {
  setPageWidgets: (value: PageWidgetType[]) => void;
};

export type PageWidgetsStore = PageWidgetsState & PageWidgetsStateAction;

const defaultInitState: PageWidgetsState = {
  pageWidgets: [],
};

export const usePageWidgetsStore = create<PageWidgetsStore>()((set) => ({
  ...defaultInitState,
  setPageWidgets: (pageWidget) => {
    set(() => ({ pageWidgets: [...pageWidget] }));
  },
}));
